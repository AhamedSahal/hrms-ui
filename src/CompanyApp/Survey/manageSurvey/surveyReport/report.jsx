import React, { Component } from "react";
import { getCumulativeScore } from "./service";
import SurveyReportLevel from "./reportLevel";
import CumulativeScore from "./cumulativeScore";

const SurveyReport = () => {
  const location = useLocation();
  const survey = location.state;

  const [report, setReport] = useState({
    id: "",
    surveyId: survey.id,
    questions: "",
    sendTo: "",
    completedBy: "",
    cumulativeScore: "",
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = () => {
    getCumulativeScore(report.surveyId).then((res) => {
      if (res.status === "OK") {
        setData(res.data);
      }
    });
  };

  return (
    <>
      {data && <CumulativeScore data={data} />}
      <SurveyReportLevel survey={survey} cumulativeReport={data}></SurveyReportLevel>
    </>
  );
};

export default SurveyReport;
