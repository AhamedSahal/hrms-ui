import React, { Component } from "react";
import { getQuestionLevelReport } from "../service";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default class SurveyGraphReport extends Component {
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


    fetchList = () => {
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

        const MAX_COLORS = 10;
        const COLORS = [
            "#0088FE",
            "#00C49F",
            "#FFBB28",
            "#FF8042",
            "#FF5733",
            "#33FF77",
            "#FF33CC",
            "#33FFFF",
            "#FFDD33",
            "#AABBCC",
        ];

        return (
            <>
                <div className="page-wrapper" style={{ paddingTop: 0 }}>
                    {data.length > 0 && (
                        <div className="pie-chart-container">
                            {data.map((item, index) => {
                                if (item.answerType === "SUBJECTIVE") {
                                    return null;
                                }
                                const adjustedIndex = index - data.slice(0, index).filter(item => item.answerType === "SUBJECTIVE").length;

                                const pieChartData = item.answers.map((answer, ansIndex) => ({
                                    name: answer.answer,
                                    value: answer.average,
                                    countOfPeople: answer.countOfPeople,
                                    fill: COLORS[ansIndex % MAX_COLORS],
                                }));
                                return (
                                    <div key={`pie-chart-${index}`} className="pie-chart">
                                           <h3>Question {adjustedIndex + 1}: {item.question}</h3>
                                        <div
                                            style={{
                                                display: "flex",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "50%",
                                                    float: "left",
                                                }}
                                            >
                                                <PieChart width={400} height={300}>
                                                    <Pie
                                                        dataKey="countOfPeople"
                                                        isAnimationActive={false}
                                                        data={pieChartData}
                                                        cx={200}
                                                        cy={150}
                                                        outerRadius={80}
                                                        label
                                                    >
                                                        {pieChartData.map((entry, entryIndex) => (
                                                            <Cell key={`cell-${entryIndex}`} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </div>
                                            <div
                                                style={{
                                                    width: "50%",
                                                    float: "right",
                                                    display: 'flex',
                                                    marginLeft: '25%',
                                                    flexDirection:'column',
                                                    justifyContent:'center',
                                                    alignItems:'baseline'
                                                }}
                                            >
                                                {pieChartData.map((entry, entryIndex) => (
                                                    <div key={`legend-${entryIndex}`} className="legend-entry">
                                                        <span
                                                            className="legend-color"
                                                            style={{ backgroundColor: entry.fill }}
                                                        ></span>
                                                        <span
                                                            className="legend-color-square"
                                                            style={{ backgroundColor: entry.fill }}
                                                        ></span>
                                                        <span className="legend-label">
                                                            {entry.name} ({entry.countOfPeople})
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="clearfix"></div>
                                    </div>
                    );
                            })}
                </div>
                    )}
            </div >
            </>
        );
    }
}
