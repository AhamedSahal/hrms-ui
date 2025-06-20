import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { getCustomizedWidgetDate, getTitle, getUserType } from '../../../utility';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getPerformanceById, getOverallScoreList } from './service';
import { PerformanceReviewSchema } from './validation';
import { Card, CardContent, Typography } from '@mui/material';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';
import { Anchor } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useParams, useLocation } from 'react-router-dom';

const PerformanceReviewReportDetailsForm = () => {
    const { id } = useParams();
    const location = useLocation();
    const [employeeId, setEmployeeId] = useState(location.state?.empId);
    const [performanceReview, setPerformanceReview] = useState({});
    const [overallScores, setOverallScores] = useState([]);
    const [openTableIndex, setOpenTableIndex] = useState(null);
    const [openTable, setOpenTable] = useState(0);
console.log("cell performanceReview", location , id);
    const colorGrade = ['#57E32C', '#b7dd29', '#ffe234', '#ffa534', '#ff4545'];

    useEffect(() => {
        getData(id);
        getOverallScoreData();
    }, [id]);

    const getOverallScoreData = () => {
        getOverallScoreList().then(res => {
            if (res.status === "OK") {
                setOverallScores(res.data.list);
            } else {
                toast.error(res.message);
            }
        });
    };

    const getScoreTotal = (objectiveGroup) => {
        let total = 0;
        objectiveGroup.employeePerformanceObjectiveEntity.forEach(objective => {
            objective.employeePerformanceObjectiveTaskEntity.forEach(task => {
                total += task.score;
            });
        });
        return total;
    };

    const isScoreMatch = (score, objectiveGroups) => {
        let scoreTotal = getOverallScore(objectiveGroups);
        let status = scoreTotal >= score.scoreFrom && scoreTotal <= score.scoreTo;
        console.log(scoreTotal, score.scoreFrom, score.scoreTo, status);
        return !status;
    };

    const getHow = (index) => {
        if (performanceReview?.employeePerformanceImprovementList?.length > (index + 1)) {
            return performanceReview.employeePerformanceImprovementList.filter(improvement => improvement.indexId === index)[0]?.how;
        }
    };

    const getCompetency = (index) => {
        if (performanceReview?.employeePerformanceImprovementList?.length > (index + 1)) {
            return performanceReview.employeePerformanceImprovementList.filter(improvement => improvement.indexId === index)[0]?.competency;
        }
    };

    const getArea = (index) => {
        if (performanceReview?.employeePerformanceImprovementList?.length > (index + 1)) {
            return performanceReview.employeePerformanceImprovementList.filter(improvement => improvement.indexId === index)[0]?.area;
        }
    };

    const getContribution = (objectiveGroup) => {
        let total = getScoreTotal(objectiveGroup);
        return total * objectiveGroup.weightage / 100;
    };

    const getOverallScore = (objectiveGroups) => {
        let total = 0;
        objectiveGroups?.forEach(objectiveGroup => {
            let tmpTotal = getScoreTotal(objectiveGroup);
            total += (tmpTotal * objectiveGroup.weightage / 100);
        });
        return total;
    };

    const getData = (id) => {
        getPerformanceById(id).then((res) => {
            if (res.status === "OK") {
                setPerformanceReview(res.data.performanceReview);
                setEmployeeId(res.data.performanceReview.employee.id);
            } else {
                toast.error(res.message);
            }
        });
    };

    const toggleDevTable = (index) => {
        setOpenTable(prevOpenTable => (prevOpenTable === index ? 0 : index));
    };

    const toggleTable = (index) => {
        setOpenTableIndex(prevOpenTableIndex => (prevOpenTableIndex === index ? null : index));
    };

    const generatePDF = () => {
        const input = document.getElementById('card');
        html2canvas(input).then(function (canvas) {
            canvas.getContext('2d');
            var imgWidth = canvas.width;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var top_left_margin = 15;
            var PDF_Width = imgWidth + (top_left_margin * 2);
            var PDF_Height = (PDF_Width * 2) + (top_left_margin * 2);
            var totalPDFPages = Math.ceil(imgHeight / PDF_Height) - 1;
            var imgData = canvas.toDataURL("image/png", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin, imgWidth, imgHeight);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage([PDF_Width, PDF_Height], 'p');
                pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), imgWidth, imgHeight);
            }

            pdf.save("Performance Review" + Date().toLocaleString() + ".pdf");
        });
    };

    return (
        <div>
            <div style={{ marginTop: '105px', marginRight: '40px', marginLeft: '40px' }} className="">
                <Helmet>
                    <title>Performance Report Details  | {getTitle()}</title>
                    <meta name="description" content="Performance Review Details" />
                </Helmet>
                <div className="performanceReport-body content container-fluid">
                    <div className="tablePage-header">
                        <div className="mb-4 row pageTitle-section">
                            <div style={{ justifyContent: 'space-between' }} className="d-flex col">
                                <div>
                                    <h3  className="tablePage-title">Performance Review</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                        <li className="breadcrumb-item active">Performance Review</li>
                                    </ul>
                                </div>
                                <div style={{ alignContent: 'center' }}>
                                    <Anchor className='performDownloadIcon' onClick={generatePDF} >
                                        <i className='fa fa-download'></i> Download
                                    </Anchor>
                                </div>
                            </div>

                        </div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={performanceReview}
                            validationSchema={PerformanceReviewSchema}
                        >
                            {() => (

                                <Form>
                                    <div className="perform_con">
                                        <div id="card">
                                            <h4 style={{ textAlign: 'center', paddingTop: '20px' }}>EMPLOYEE - ANNUAL PERFORMANCE EVALUATION </h4>
                                            <section className="review-section professional-excellence mt-2" >
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="mt-3 perform-general-info-card">
                                                            <div className="row">
                                                                <div className="col-3">
                                                                    <div className='m-2 perfom_profile_img'>
                                                                        <EmployeeProfilePhoto className="mt-2 payProPic" id={employeeId} />
                                                                        <CardContent className='p-1'>
                                                                            <Typography gutterBottom variant="h6" component="div">
                                                                                {performanceReview?.employee?.name}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {performanceReview?.employeesId}
                                                                            </Typography>
                                                                        </CardContent>
                                                                    </div>
                                                                </div>
                                                                <div style={{ alignContent: 'center' }} className="col-3">
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Employee’s Position</span>
                                                                        {performanceReview?.employeeDesignation || '-'}
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Department/ Section</span>
                                                                        <span className="gnInfovalue">{performanceReview?.employeeDepartment || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Date of Joining</span>
                                                                        <span className="gnInfovalue">{getCustomizedWidgetDate(performanceReview?.doj?.substring(0, 10)) || '-'}</span>
                                                                    </div>

                                                                </div>
                                                                <div style={{ alignContent: 'center' }} className="col-3">
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Date in Current Role</span>
                                                                        <span className="gnInfovalue">{getCustomizedWidgetDate(performanceReview?.dateOfCurrentRole?.substring(0, 10)) || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Reports to (Name)</span>
                                                                        <span className="gnInfovalue">{performanceReview?.reportingManagerName || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Reports to (Job Title)</span>
                                                                        <span className="gnInfovalue">{performanceReview?.reportingManagerDesignation || '-'}</span>
                                                                    </div>

                                                                </div>
                                                                <div style={{ alignContent: 'center' }} className="col-3">
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Review Period From</span>
                                                                        <span className="gnInfovalue">{getCustomizedWidgetDate(performanceReview?.fromDate) || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Review Period To</span>
                                                                        <span className="gnInfovalue">{getCustomizedWidgetDate(performanceReview?.toDate) || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span style={{color: 'white'}} className="gnInfolabel">Grade</span>
                                                                        <span style={{color: 'white'}} className="gnInfovalue"> -</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>
                                            </section>

                                            <section className="review-section professional-excellence mt-2">
                                                <div className="row">
                                                    <h4 style={{ width: '98%', marginLeft: '11px' }} className='performTableHead'>Appraisal Rating</h4>
                                                    <div className="col-md-10">

                                                        <div className="table-responsive">
                                                            <table className="table table-bordered review-table mb-0 table-p-5">
                                                                <thead>
                                                                    <tr style={{ background: '#c4c4c4' }}>
                                                                        <th>Rating</th>
                                                                        <th>Description</th>
                                                                        <th>Explanation</th>
                                                                        <th style={{ textAlign: 'center' }}>Overall Score</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {overallScores &&
                                                                        overallScores.slice().reverse().map((score, index) => {
                                                                            const isHighlighted = isScoreMatch(
                                                                                score,
                                                                                performanceReview?.employeePerformanceObjectiveGropList
                                                                            );
                                                                            
                                                                            return (
                                                                                <tr
                                                                                    key={index}
                                                                                    className={isHighlighted ? 'highlight-row' : ''}
                                                                                    style={{ background: isHighlighted ? '' : '#b9d7ed' }}
                                                                                >
                                                                                    <td
                                                                                        className="performReviewTable"
                                                                                        style={{ background: index === 0 ? '#57E32C' : index === 1 ? '#b7dd29' : index === 2 ? '#ffe234' : index === 3 ? '#ffa534' : '#ff4545' }}
                                                                                    >
                                                                                        {5 - index}
                                                                                    </td>
                                                                                    <td>{index === 0 ? 'Significantly Exceeds Expectations' : index === 1 ? 'Exceeds Expectations' : index === 2 ? 'Meets All Expectations' : index === 3 ? 'Meets Most Expectations' : 'Needs Improvement'}</td>
                                                                                    <td>
                                                                                        {index === 0
                                                                                            ? 'Performance significantly exceeds all expectations'
                                                                                            : index === 1
                                                                                                ? 'Performance exceeds many expectations'
                                                                                                : index === 2
                                                                                                    ? 'Performance satisfactorily meets all expectations'
                                                                                                    : index === 3
                                                                                                        ? 'Performance meets most but not all expectations'
                                                                                                        : 'Performance falls short of several expectations'}
                                                                                    </td>
                                                                                    <td style={{ textAlign: 'center' }}>
                                                                                        {score ? `${score.scoreFrom} - ${score.scoreTo}` : 'N/A'}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                </tbody>
                                                            </table>

                                                        </div>
                                                    </div>
                                                    <div className="performGradeDiv col-md-2">
                                                        <h4 className='mb-3'>Final Rating</h4>
                                                        {overallScores &&
                                                            overallScores.slice().reverse().map((score, index) => {
                                                                const isHighlighted = isScoreMatch(
                                                                    score,
                                                                    performanceReview?.employeePerformanceObjectiveGropList
                                                                );
                                                                const descendingIndex = overallScores.length - index - 1;
                                                                return !isHighlighted ? (
                                                                    <span
                                                                        key={index}
                                                                        className="perform-gradestyle gnInfovalue"
                                                                        style={{ backgroundColor: colorGrade[index] }}
                                                                    >
                                                                        {descendingIndex + 1}
                                                                    </span>
                                                                ) : null;
                                                            })}
                                                    </div>
                                                </div>
                                            </section>

                                        </div>


                                        {/* Performance Management Table */}
                                        <h4 className='performTableHead'>Detailed Report</h4>
                                        {performanceReview?.employeePerformanceObjectiveGropList?.sort((a, b) => b.weightage - a.weightage).map((objectiveGroup, index) => {
                                            const isOpen = openTableIndex === index;
                                            return (
                                                <section className="perform_table_mng_hd review-section professional-excellence mt-2" key={index}>
                                                    {/* Clickable header */}
                                                    <div className="p-2  perform_hdr text-center col-12" onClick={() => toggleTable(index)} style={{
                                                        borderBottom: isOpen ? '1px solid #dee2e6' : '',
                                                        cursor: 'pointer'
                                                    }}>
                                                        <div className="row">
                                                            <h3 className="mb-0 perform_table_mng review-title col-8">
                                                                Performance Appraisal for "{objectiveGroup.name}"
                                                            </h3>
                                                            <div className="form-group col-4 mb-0">
                                                                <div className="input-group">
                                                                    <div className="input-group-prepend">
                                                                        <span className="input-group-text">Group Weightage %</span>
                                                                    </div>
                                                                    <input readOnly tabIndex="-1" defaultValue={objectiveGroup.weightage} className="form-control" />
                                                                    <div className='perform-UpDownIcon'>
                                                                        <i className={`mt-0 ml-3 comparisonIcon fa ${isOpen ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Conditionally render the table based on whether it's open */}
                                                    {isOpen && (
                                                        <div className="p-3 row">
                                                            <div className="col-md-12">
                                                                <div className="table-responsive">
                                                                    <table className="table table-bordered review-table mb-0">
                                                                        <thead>
                                                                            <tr style={{ background: '#c4c4c4' }}>
                                                                                <th style={{ width: '50px' }}>#</th>
                                                                                <th>Objectives</th>
                                                                                <th>Achievements</th>
                                                                                <th style={{ width: '100px' }}>Weightage %</th>
                                                                                <th style={{ width: '100px' }}>Employee Rating</th>
                                                                                <th style={{ width: '100px' }}>Manager Rating</th>
                                                                                <th style={{ width: '100px' }}>Score</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {objectiveGroup.employeePerformanceObjectiveEntity.map((objective, objIndex) => {
                                                                                return (
                                                                                    <tr key={objIndex}>
                                                                                        <td>{objIndex + 1}</td>
                                                                                        <td className='pre-wrap'>{objective.name}</td>
                                                                                        {objective.employeePerformanceObjectiveTaskEntity.map((task, taskIndex) => {
                                                                                            return (
                                                                                                <React.Fragment key={taskIndex}>
                                                                                                    <td className='pre-wrap'>
                                                                                                        <span>{task.name}</span>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input tabIndex="-1" type="number" defaultValue={task.weightage} className="form-control" readOnly />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input type="number" tabIndex="-1" readOnly defaultValue={task.selfRating} className="form-control" />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input type="number" defaultValue={task.managerRating} readOnly className="form-control" />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input type="number" defaultValue={task.score} readOnly className="form-control" />
                                                                                                    </td>
                                                                                                </React.Fragment>
                                                                                            );
                                                                                        })}
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                            <tr style={{ fontWeight: 'bold' }}>
                                                                                <td colSpan={6} className='text-right'>Total Score</td>
                                                                                <td>{getScoreTotal(objectiveGroup)}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </section>
                                            );
                                        })}


                                        <section className="perform_table_mng_hd review-section professional-excellence mt-2" >
                                            {/* Clickable header */}
                                            <div className="p-2  perform_hdr text-center col-12" onClick={() => toggleDevTable(5)} style={{
                                                borderBottom: openTable === 5 ? '1px solid #dee2e6' : '',
                                                cursor: 'pointer'
                                            }}>
                                                <div className="row">
                                                    <h4 className="mb-0 perform_table_mng review-title col-8">
                                                        Combined Appraisal
                                                    </h4>
                                                    <div className="form-group col-4 mb-0">
                                                        <div className='perform-UpDownIcon'>
                                                            <i className={`mt-0 ml-3 comparisonIcon fa ${openTable === 5 ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {openTable === 5 &&
                                                <div className="p-3 row">
                                                    <div className="col-md-12">
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered review-table mb-0">
                                                                <thead>
                                                                    <tr style={{ background: '#c4c4c4' }}>
                                                                        <td>Performance Factors</td>
                                                                        <td>Score</td>
                                                                        <td>Weightage (%)</td>
                                                                        <td>Contribution</td>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {performanceReview?.employeePerformanceObjectiveGropList?.map((objectiveGroup, index) => {
                                                                        return <tr key={index}>
                                                                            <td>{objectiveGroup.name}</td>
                                                                            <td>{getScoreTotal(objectiveGroup)}</td>
                                                                            <td>{objectiveGroup.weightage}</td>
                                                                            <td>{getContribution(objectiveGroup)}</td>
                                                                        </tr>
                                                                    })}
                                                                    <tr style={{ fontWeight: 'bold' }}>
                                                                        <td className='text-right' colSpan={3}>Overall Score</td>
                                                                        <td>{getOverallScore(performanceReview?.employeePerformanceObjectiveGropList)}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>}

                                        </section>

                                        {/*  Reviewer profile */}

                                        <section className="perform_table_mng_hd review-section professional-excellence mt-2" >
                                            <div className="p-2  perform_hdr text-center col-12" onClick={() => toggleDevTable(7)} style={{
                                                borderBottom: openTable === 7 ? '1px solid #dee2e6' : '',
                                                cursor: 'pointer'
                                            }}>
                                                <div className="row">
                                                    <h4 className="mb-0 perform_table_mng review-title col-8">
                                                        Appraisal Comments
                                                    </h4>
                                                    <div className="form-group col-4 mb-0">
                                                        <div className='perform-UpDownIcon'>
                                                            <i className={`mt-0 ml-3 comparisonIcon fa ${openTable === 7 ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {openTable === 7 && <div className="p-3 row">
                                                <div className="col-md-6">
                                                    <span className='reviewerHead'>Employee Comment</span>
                                                    <div className="perform-general-info-card">
                                                        <div className="row">
                                                            <div className='col'>
                                                                <div style={{ placeContent: 'space-between', marginRight: '15em' }} className='d-flex'>


                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Date</span>
                                                                        <span className="gnInfovalue"> {getCustomizedWidgetDate(performanceReview?.submitedByEmployeeOn?.substring(0, 10)) || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Signature</span>
                                                                        <span className="gnInfovalue">-</span>
                                                                    </div>
                                                                </div>
                                                                <div className="gnInfodetail">
                                                                    <span className="gnInfolabel">Comment</span>
                                                                    <span className="gnInfovalue">{performanceReview?.employeeComment || '-'}</span>
                                                                </div>
                                                            </div>



                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <span className='reviewerHead'>Manager Comment</span>
                                                    <div className="perform-general-info-card">
                                                        <div className="row">
                                                            <div className='col'>
                                                                <div style={{ placeContent: 'space-between' }} className='d-flex'>
                                                                    <div style={{ placeContent: 'space-between', marginRight: '15em' }} className='d-flex'>


                                                                        <div className="gnInfodetail">
                                                                            <span className="gnInfolabel">Date</span>
                                                                            <span className="gnInfovalue"> {getCustomizedWidgetDate(performanceReview?.submitedByEmployeeOn?.substring(0, 10)) || '-'}</span>
                                                                        </div>
                                                                        <div className="gnInfodetail">
                                                                            <span className="gnInfolabel">Signature</span>
                                                                            <span className="gnInfovalue">-</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Comment</span>
                                                                        <span className="gnInfovalue">{performanceReview?.employeeComment || '-'}</span>
                                                                    </div>
                                                                </div>



                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <span className='reviewerHead'>Manager Comment</span>
                                                    <div className="perform-general-info-card">
                                                        <div className="row">
                                                            <div className='col'>
                                                                <div style={{ placeContent: 'space-between' }} className='d-flex'>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Name</span>
                                                                        {performanceReview?.reportingManagerName || '-'}
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Job Title</span>
                                                                        {performanceReview?.reportingManagerDesignation || '-'}
                                                                    </div>
                                                                    <div className="gnInfolabel">
                                                                        <span className="gnInfolabel">Date</span>
                                                                        <span className="gnInfovalue">{getCustomizedWidgetDate(performanceReview?.submitedByReviewerOn?.substring(0, 10)) || '-'}</span>
                                                                    </div>
                                                                    <div className="gnInfodetail">
                                                                        <span className="gnInfolabel">Signature</span>
                                                                        <span className="gnInfovalue">-</span>
                                                                    </div>
                                                                </div>
                                                                <div className="gnInfodetail">
                                                                    <span className="gnInfolabel">Comment</span>
                                                                    <span className="gnInfovalue">{performanceReview?.reviewerComment || '-'}</span>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                        </section>
                                        {/* Development Plan */}
                                        <section className="perform_table_mng_hd review-section professional-excellence mt-2" >

                                            <div className="p-2  perform_hdr text-center col-12" onClick={() => toggleDevTable(6)} style={{
                                                borderBottom: openTable === 6 ? '1px solid #dee2e6' : '',
                                                cursor: 'pointer'
                                            }}>
                                                <div className="row">
                                                    <h4 className="mb-0 perform_table_mng review-title col-8">
                                                        Development Plan
                                                    </h4>
                                                    <div className="form-group col-4 mb-0">
                                                        <div className='perform-UpDownIcon'>
                                                            <i className={`mt-0 ml-3 comparisonIcon fa ${openTable === 6 ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {openTable === 6 &&
                                                <div className="p-3 row">
                                                    <div className="col-md-12">
                                                        <div className='pre-wrap p-2'>A more detailed Personal Development Plan should come out of this section to outline more on the “How”, “By When”, “Success Factors”, etc.  The Training Department will need to work closely with the Line Manager to meet these requirements</div>
                                                        <div className="table-responsive">
                                                            <table className="table table-bordered review-table mb-0">

                                                                <thead>
                                                                    <tr style={{ background: '#c4c4c4' }}>
                                                                        <th>Area that Needs Improvement</th>
                                                                        <th>Specific Competency (Knowledge, Skill, Ability)</th>
                                                                        <th>How *</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody id='tabl'>
                                                                    <tr>
                                                                        <td><input title={getArea(0)} defaultValue={getArea(0)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getCompetency(0)} defaultValue={getCompetency(0)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getHow(0)} defaultValue={getHow(0)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><input title={getArea(1)} defaultValue={getArea(1)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getCompetency(1)} defaultValue={getCompetency(1)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getHow(1)} defaultValue={getHow(1)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><input title={getArea(2)} defaultValue={getArea(2)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getCompetency(2)} defaultValue={getCompetency(2)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getHow(2)} defaultValue={getHow(2)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><input title={getArea(3)} defaultValue={getArea(3)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getCompetency(3)} defaultValue={getCompetency(3)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getHow(3)} defaultValue={getHow(3)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><input title={getArea(4)} defaultValue={getArea(4)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getCompetency(4)} defaultValue={getCompetency(4)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                        <td><input title={getHow(4)} defaultValue={getHow(4)} disabled={true} type="text" maxLength={250} className='form-control' /></td>
                                                                    </tr>
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <td colSpan={3} className='pre-wrap'>* HOW: Training & Development can include aswaaq Training courses, external training courses, e-learning, development workshops, on-the-job training, coaching and mentoring, job rotation, special assignments, secondment, etc.</td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                        </section>



                                    </div>
                                </Form>
                            )}
                        </Formik>

                    </div >
                </div >
            </div >
        </div>
    )
}

export default PerformanceReviewReportDetailsForm;
