import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCumulativeScore } from "./service";
import SurveyReportLevel from "./reportLevel";
import CumulativeScore from "./cumulativeScore";

const SurveyReport = () => {
  const location = useLocation();
  const survey = location.state;

  const [report, setReport] = useState({
    id: "",
    surveyId: survey?.id || "",
    questions: "",
    sendTo: "",
    completedBy: "",
    cumulativeScore: "",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    if (report.surveyId) {
      fetchList();
    }
  }, [report.surveyId]);

  const fetchList = async () => {
    try {
      const res = await getCumulativeScore(report.surveyId);
      if (res.status === "OK") {
        setData(res.data);
      }
    } catch (error) {
      console.error("Error fetching cumulative score:", error);
    }
  };

  return (
    <>
      {data && <CumulativeScore data={data} />}
      <SurveyReportLevel survey={survey} cumulativeReport={data} />
    </>
  );
};

export default SurveyReport;
