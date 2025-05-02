import React, { Component } from "react";

import { getQuestionLevelReport } from "../service";
import * as XLSX from 'xlsx';


export default class SurveyQuestionLevelReport extends Component {
    constructor(props) {
        super(props);
        let survey = this.props.survey;
        console.log(survey);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.fetchList();
    }





    exportToExcel = () => {
        const table = document.querySelector(".question-table");
        const data = [];

        for (let i = 0; i < table.rows.length; i++) {
            const row = table.rows[i];
            const rowData = {};

            for (let j = 0; j < row.cells.length; j++) {
                const cell = row.cells[j];
                const columnName = table.rows[0].cells[j].innerText;
                rowData[columnName] = cell.innerText;
            }
            data.push(rowData);
        }

        const { cumulativeReport } = this.props;
        const { sendTo, completedBy, cumulativeScore, questions } = cumulativeReport;

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);

        for (let i = 0; i < data.length; i++) {
            const rowData = data[i];
            ws['A' + (i + 1)] = { t: 's', v: rowData["S.No"] };
            ws['B' + (i + 1)] = { t: 's', v: rowData["Question And Answers"] };
            ws['C' + (i + 1)] = { t: 's', v: rowData["Percentage"] };
            ws['D' + (i + 1)] = { t: 's', v: rowData["Number of Participants"] };
        }

        ws['A' + (data.length + 1)] = { t: 's', v: "Questions" };
        ws['A' + (data.length + 2)] = { t: 's', v: questions };
        ws['B' + (data.length + 1)] = { t: 's', v: "Send To" };
        ws['B' + (data.length + 2)] = { t: 's', v: sendTo };
        ws['C' + (data.length + 1)] = { t: 's', v: "Completed By" };
        ws['C' + (data.length + 2)] = { t: 's', v: completedBy };
        ws['D' + (data.length + 1)] = { t: 's', v: "Cumulative Score" };
        ws['D' + (data.length + 2)] = { t: 's', v: cumulativeScore + "%" };

        ws['!ref'] = "A1:D" + (data.length + 5);

        XLSX.utils.book_append_sheet(wb, ws, "SurveyReport");

        XLSX.writeFile(wb, "SurveyReport.xlsx");
    };




    fetchList = () => {
        console.log("called");
        getQuestionLevelReport(
            this.props.survey.id,
        )
            .then((res) => {
                console.log(res);
                if (res.status === "OK") {
                    this.setState({
                        data: res.data
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const { data } = this.state;
        console.log("view-response page");
        console.log(data);
        return (
            <>
                <div className="page-wrapper" style={{ paddingTop: 0 }}>
                    <div className="d-flex justify-content-end mr-3">
                        <button className="btn btn-lg btn-success" onClick={this.exportToExcel}>
                            <span>Export To Excel </span>
                            <i class="fa fa-file-excel-o" aria-hidden="true"></i>
                        </button>
                    </div>
                    {data.length > 0 && (
                        <table className="question-table col-md-12">
                            <thead>
                                <tr className="each-question h3 mt-2">
                                    <th>S.No</th>
                                    <th>Question And Answers</th>
                                    <th>Percentage</th>
                                    <th>Number of Participants</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => {
                                    if (item.answerType === "SUBJECTIVE") {
                                        return null;
                                    }
                                    const adjustedIndex = index - data.slice(0, index).filter(item => item.answerType === "SUBJECTIVE").length;

                                    const questionRow = (
                                        <tr
                                            className="each-question h3"
                                            style={{
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                                borderRadius: "0px"
                                            }}
                                            key={`${item.id}-question`}
                                        >
                                            <td>Q{adjustedIndex + 1}</td>
                                            <td>{item.question}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    );

                                    const answerRows = item.answers.map((answer, ansIndex) => (
                                        <tr
                                            className=""
                                            style={{
                                                marginTop: "0px",
                                                marginBottom: "0px",
                                                borderRadius: "0px"
                                            }}
                                            key={`${item.id}-answer-${ansIndex}`}
                                        >
                                            <td></td>
                                            <td>
                                                {answer.image ? (
                                                    <img
                                                        className="square-image"
                                                        style={{ marginLeft: "25px", borderRadius: "5%" }}
                                                        src={answer.image}
                                                        alt={answer.answer}
                                                    />
                                                ) : (
                                                    <label className="survey-label2 h4">{answer.answer}</label>
                                                )}
                                            </td>
                                            <td>
                                                {answer.average > 0 ? (
                                                    <span className="question-level-average">
                                                        {answer.average.toFixed(2)}%
                                                    </span>
                                                ) : (
                                                    <span className="question-level-average">0%</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="question-level-count">
                                                    {answer.countOfPeople}
                                                </span>
                                            </td>
                                        </tr>
                                    ));

                                    return [questionRow, ...answerRows];
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

            </>
        );
    }
}

