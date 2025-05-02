import React, { Component } from "react";
import { getCumulativeScore } from "./service";
import SurveyReportLevel from "./reportLevel";
import CumulativeScore from "./cumulativeScore";

export default class SurveyReport extends Component {
  constructor(props) {
    super(props);
    let survey = props.location.state;
    this.state = {
      report: {
        id: "",
        surveyId: survey.id,
        questions: "",
        sendTo: "",
        completedBy: "",
        cumulativeScore: "",
      },
      data: [],
      survey: survey,
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    getCumulativeScore(this.state.report.surveyId).then((res) => {
      if (res.status === "OK") {
        this.setState({
          data: res.data,
        });
      }
    });
  };

  render() {
    const { data, survey } = this.state;
    return (
      <>
         {data && <CumulativeScore data={data} />}
            <SurveyReportLevel survey={survey} cumulativeReport={data}></SurveyReportLevel>
        </>);
    }
}
