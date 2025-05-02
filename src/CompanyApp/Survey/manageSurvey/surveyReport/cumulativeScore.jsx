import React from "react";
import { Component } from "react";

class CumulativeScore extends Component {
  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div className="page-wrapper-cumulative">
      <div className="cumulative-score">
        <p>Questions: {data.questions}</p>
        <p>Send To: {data.sendTo}</p>
        <p>Completed By: {data.completedBy}</p>
        <p>Cumulative Score: {data.cumulativeScore}%</p>
        </div>
      </div>
    );
  }
}

export default CumulativeScore;
