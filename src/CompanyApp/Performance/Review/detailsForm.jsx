import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { CircularProgressbar, buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { BsFillInfoCircleFill, BsFillQuestionCircleFill } from "react-icons/bs";
import { getTitle } from '../../../utility';
import 'react-toastify/dist/ReactToastify.css';
import { saveRating, getPerformanceById } from './service';
import { Modal } from 'react-bootstrap';
import ObjectiveForm from './objectiveForm';
import { Button, styled, Tooltip, Typography } from '@mui/material';
import SuccessAlert from '../../../MainPage/successToast';
const { Header, Body, Footer, Dialog } = Modal;

const WtTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
))(`
      color: black;
      background-color: white;
      width: 12em;
      box-shadow: 0px 0px 2px 0px;
     text-align: -webkit-center;
  `);

export default class PerformanceReviewDetailsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.reviewId,
            performanceReview: {},
            isManager: false,
            isWeightageDefined: false,
            userRating: [],
            comment: '',
            improvements: [],
            display: false,
            openTable: false,

        }
        this.getData(this.state.id);
    }
    getData(id) {
        getPerformanceById(id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    performanceReview: res.data.performanceReview,
                    isManager: !res.data.isSelf,
                    isWeightageDefined: res.data.isWeightageDefined

                });
                let newImprovements = [];
                for (let i = 0; i < 5; i++) {
                    let improvement = { id: i, area: '', competency: '', how: '' }
                    newImprovements.push(improvement);
                }
                this.setState({
                    improvements: newImprovements
                });

            } else {
                toast.error(res.message);
            }
        })
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            performanceTemplate: undefined
        })
        this.getData(this.state.id);
    }
    getHow = (index) => {
        if (this.state.performanceReview && this.state.performanceReview.employeePerformanceImprovementList && this.state.performanceReview.employeePerformanceImprovementList.length > (index + 1)) {
            return this.state.performanceReview.employeePerformanceImprovementList.filter(improvement => improvement.indexId == index)[0].how;
        }
    }
    getCompetency = (index) => {
        if (this.state.performanceReview && this.state.performanceReview.employeePerformanceImprovementList && this.state.performanceReview.employeePerformanceImprovementList.length > (index + 1)) {
            return this.state.performanceReview.employeePerformanceImprovementList.filter(improvement => improvement.indexId == index)[0].competency;
        }
    }
    getArea = (index) => {
        if (this.state.performanceReview && this.state.performanceReview.employeePerformanceImprovementList && this.state.performanceReview.employeePerformanceImprovementList.length > (index + 1)) {
            return this.state.performanceReview.employeePerformanceImprovementList.filter(improvement => improvement.indexId == index)[0].area;
        }
    }
    setImprovementArea = (index, area) => {
        let improvements = this.state.improvements;
        improvements[index].area = area;
        this.setState({
            improvements: improvements
        });
    }
    setImprovementCompetency = (index, competency) => {
        let improvements = this.state.improvements;
        improvements[index].competency = competency;
        this.setState({
            improvements: improvements
        });
    }
    setImprovementHow = (index, how) => {
        let improvements = this.state.improvements;
        improvements[index].how = how;
        this.setState({
            improvements: improvements
        });
    }

    setComment = (e) => {
        this.setState({
            comment: e.target.value
        })
    }
    setRating = (e, groupId, objectId, taskId) => {
        let val = e.target.value;
        if (val == "") {
            return;
        }
        if (isNaN(Number(val))) {
            e.target.value = "";
            e.target.focus();
            toast.error("Please enter valid Rating");
            return;
        }
        if (val > 5 || val < 1) {
            e.target.value = "";
            e.target.focus();
            toast.error("Please enter valid Rating (Between 1 to 5)");
            return;
        }
        let performanceReview = this.state.performanceReview;
        performanceReview.employeePerformanceObjectiveGropList.map((objectiveGroup, index) => {
            if (objectiveGroup.id == groupId) {
                objectiveGroup.employeePerformanceObjectiveEntity.map((objective, index) => {
                    if (objectId == objective.id) {
                        objective.employeePerformanceObjectiveTaskEntity.map((task, index) => {
                            if (task.id == taskId) {
                                let userRating = this.state.userRating;
                                var index = userRating.findIndex(function (o) {
                                    return o.taskId === task.id;
                                })
                                var name = 0;
                                var weightage = 0;
                                if (index !== -1) {
                                    name = userRating[index].name;
                                    weightage = userRating[index].weightage;
                                    userRating.splice(index, 1);
                                }
                                userRating.push({ taskId: task.id, rating: val, name: name, weightage: weightage });
                                this.setState({ userRating: userRating });
                            }
                        })
                    }
                })
            }
        })
        this.setState({
            performanceReview: performanceReview
        })
        console.log(this.state.userRating);
    }
    setWeightage = (e, groupId, objectId, taskId) => {
        let val = e.target.value;
        if (val == "") {
            return;
        }
        if (isNaN(Number(val))) {
            e.target.value = "";
            e.target.focus();
            toast.error("Please enter valid Weightage ");
            return;
        }
        if (val > 100 || val < 1) {
            e.target.value = "";
            e.target.focus();
            toast.error("Please enter valid Weightage (Between 1 to 100)");
            return;
        }
        let performanceReview = this.state.performanceReview;
        performanceReview.employeePerformanceObjectiveGropList.map((objectiveGroup, index) => {
            if (objectiveGroup.id == groupId) {
                objectiveGroup.employeePerformanceObjectiveEntity.map((objective, index) => {
                    if (objectId == objective.id) {
                        objective.employeePerformanceObjectiveTaskEntity.map((task, index) => {
                            if (task.id == taskId) {
                                let userRating = this.state.userRating;
                                var index = userRating.findIndex(function (o) {
                                    return o.taskId === task.id;
                                })
                                var name = 0;
                                var rating = 0;
                                if (index !== -1) {
                                    name = userRating[index].name;
                                    rating = userRating[index].rating;
                                    userRating.splice(index, 1);
                                }
                                userRating.push({ taskId: task.id, rating: rating, name: name, weightage: val });
                                this.setState({ userRating: userRating });
                            }
                        })
                    }
                })
            }
        })
        this.setState({
            performanceReview: performanceReview
        })
        console.log(this.state.userRating);
    }
    setTask = (e, groupId, objectId, taskId) => {
        let val = e.target.value;
        if (val == "") {
            return;
        }
        let performanceReview = this.state.performanceReview;
        performanceReview.employeePerformanceObjectiveGropList.map((objectiveGroup, index) => {
            if (objectiveGroup.id == groupId) {
                objectiveGroup.employeePerformanceObjectiveEntity.map((objective, index) => {
                    if (objectId == objective.id) {
                        objective.employeePerformanceObjectiveTaskEntity.map((task, index) => {
                            if (task.id == taskId) {
                                task.name = val;
                                let userRating = this.state.userRating;
                                var index = userRating.findIndex(function (o) {
                                    return o.taskId === task.id;
                                })
                                var rating = 0;
                                var weightage = 0;
                                if (index !== -1) {
                                    rating = userRating[index].rating;
                                    weightage = userRating[index].weightage;
                                    userRating.splice(index, 1);
                                }
                                userRating.push({ taskId: task.id, rating: rating, name: val, weightage: weightage });
                                this.setState({ userRating: userRating });
                            }
                        })
                    }
                })
            }
        })
        this.setState({
            performanceReview: performanceReview
        })
        console.log(this.state.userRating);
    }


    save = (data, action) => {
        action.setSubmitting(true);
        let tmpData = {};
        tmpData.ratingData = this.state.userRating;
        tmpData.comment = this.state.comment;
        tmpData.improvementAreaData = this.state.improvements;
        saveRating(tmpData, this.state.performanceReview.id).then(res => {
            if (res.status == "OK") {
                this.getData(this.state.id);
                toast.success(res.message);
                this.props.showAlert('submit');
                this.props.hideReviewForm()
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Review");
            action.setSubmitting(false);
        })
    }
    render() {
        const { openTable } = this.state

        return (
            <div style={{ borderRadius: '5px', border: 'solid 1px #c9c4c4' }}>
                <Helmet>
                    <title>Performance Review Details  | {getTitle()}</title>
                    <meta name="description" content="Performance Review Details" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">
                        {/* <h3 className="col-11 page-title">Performance Review : {this.state.performanceReview?.employee?.name} {this.state.performanceReview?.employeesId}</h3> */}
                        <div className='mt-2 text-end' onMouseLeave={e => { this.setState({ display: false }) }}>
                            <Button variant="outlined" onMouseOver={e => {
                                this.setState({ display: true });
                            }}
                                size='sm' color="success" sx={{ textTransform: 'none' }} >Rating <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} /></Button>
                            {this.state.display == true && <div className='legend-btn'>
                                <Tooltip title={<>Description <br /> <p style={{ fontSize: '12px', color: '#505050' }}>Needs Improvement</p> Explanation <p style={{ fontSize: '12px', color: '#505050' }}>Performance falls short of several expectations</p></>}

                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'black',
                                                boxShadow: '0px 0px 4px 1px grey',
                                                bgcolor: 'white',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#f1f1f1',
                                                },
                                            },
                                        },
                                    }} arrow>
                                    <Typography className='mr-1 mt-3 legend-rating'>1</Typography>
                                </Tooltip>
                                <Tooltip title={<>Description <br /> <p style={{ fontSize: '12px', color: '#505050' }}>Meets Most Expectation</p> Explanation <p style={{ fontSize: '12px', color: '#505050' }}>Performance meets most but not all expectations.</p></>}

                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'black',
                                                boxShadow: '0px 0px 4px 1px grey',
                                                bgcolor: 'white',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#f1f1f1',
                                                },
                                            },
                                        },
                                    }} arrow>
                                    <Typography className='mr-1 mt-3 legend-rating'>2</Typography>
                                </Tooltip>
                                <Tooltip title={<>Description <br /> <p style={{ fontSize: '12px', color: '#505050' }}>Meets All Expectations</p> Explanation <p style={{ fontSize: '12px', color: '#505050' }}>Performance satisfactorily meets all expectations</p></>}

                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'black',
                                                boxShadow: '0px 0px 4px 1px grey',
                                                bgcolor: 'white',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#f1f1f1',
                                                },
                                            },
                                        },
                                    }} arrow>
                                    <Typography className='mr-1 mt-3 legend-rating'>3</Typography>
                                </Tooltip>
                                <Tooltip title={<>Description <br /> <p style={{ fontSize: '12px', color: '#505050' }}>Exceeds Expectations</p> Explanation <p style={{ fontSize: '12px', color: '#505050' }}>Performance Exceeds many expectations</p></>}

                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'black',
                                                boxShadow: '0px 0px 4px 1px grey',
                                                bgcolor: 'white',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#f1f1f1',
                                                },
                                            },
                                        },
                                    }} arrow>
                                    <Typography className='mr-1 mt-3 legend-rating'>4</Typography>
                                </Tooltip>
                                <Tooltip title={<>Description <br /> <p style={{ fontSize: '12px', color: '#505050' }}>SignifLicantly Exceeds Expectations</p> Explanation <p style={{ fontSize: '12px', color: '#505050' }}>Performance Significantly exceeds all expectations</p></>}

                                    componentsProps={{
                                        tooltip: {
                                            sx: {
                                                fontFamily: 'sans-serif',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'black',
                                                boxShadow: '0px 0px 4px 1px grey',
                                                bgcolor: 'white',
                                                '& .MuiTooltip-arrow': {
                                                    color: '#f1f1f1',
                                                },
                                            },
                                        },
                                    }} arrow>
                                    <Typography className='mt-3 legend-rating'>5</Typography>
                                </Tooltip>





                            </div>}
                        </div>


                    </div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={this.state.performanceReview}
                        onSubmit={this.save}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                            setSubmitting
                        }) => (

                            <Form>

                                {!this.state.isWeightageDefined && !this.state.isManager && <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <span>Please request Reviewer to set Weightage.</span> </div>}
                                {this.state.performanceReview?.employeePerformanceObjectiveGropList?.sort((a, b) => b.weightage - a.weightage).map((objectiveGroup, index) => {


                                    return <section className="review-section professional-excellence mt-2" key={index}>



                                        <div className="row">
                                            <div style={{ textAlign: 'right', padding: '8px 18px 14px 7px' }} >
                                                {this.state.isManager && objectiveGroup.userDefinedObjectives && !this.state.performanceReview?.submitedByEmployee &&
                                                    <div className='btn-group btn-group-sm'>
                                                        <a style={{ background: '#102746', color: 'white' }} className='btn btn-sm' onClick={() => {
                                                            this.setState({ selectedobjectiveGroup: objectiveGroup, showForm: true })
                                                        }} > Add <i className="fa fa-plus" /> </a></div>}

                                            </div>
                                            <div className="col-md-12">
                                                <div style={{ placeContent: 'space-between ' }} className='d-flex'>
                                                    <h4 className="review-title">{objectiveGroup.name}</h4>
                                                    <WtTooltip placement="top" title={
                                                        <div className='groupWeightageCard'>
                                                            <p>Group Weightage</p>
                                                            <div className='innerCardWe'>
                                                                <CircularProgressbarWithChildren
                                                                    value={objectiveGroup.weightage}
                                                                    styles={buildStyles({
                                                                        strokeLinecap: 'butt',
                                                                        pathTransitionDuration: 0.5,
                                                                        pathColor: `rgba(16, 39, 70, ${100})`,
                                                                        trailColor: '#d6d6d6',
                                                                        backgroundColor: '#3e98c7',

                                                                    })}

                                                                > <div style={{ fontSize: 10, marginTop: -5 }}>
                                                                        <strong>{objectiveGroup.weightage}%</strong>
                                                                    </div></CircularProgressbarWithChildren>
                                                            </div>

                                                        </div>
                                                    }
                                                        arrow>
                                                        <label className='wtgBtn'>Weightage <BsFillInfoCircleFill className='ml-2' size={16} style={{ color: "#1DA8D5" }} /></label>
                                                    </WtTooltip>

                                                </div>

                                                <div className="table-responsive">
                                                    <table className="table table-bordered review-table mb-0 table-p-5">
                                                        <thead>
                                                            <tr style={{ background: '#c4c4c4' }}>
                                                                <th style={{ width: '50px' }}>#</th>
                                                                <th >Objectives</th>
                                                                {(this.state.performanceReview?.submitedByEmployee || !this.state.isManager) && <th>Achievements</th>}
                                                                <th style={{ width: '100px' }}>Weightage %</th>
                                                                {(!this.state.isManager || this.state.performanceReview?.submitedByEmployee) && <th style={{ width: '100px' }}>Employee Rating</th>}
                                                                {this.state.isManager && this.state.performanceReview?.submitedByEmployee && <th style={{ width: '100px' }}>Reviewer Rating</th>}

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                objectiveGroup?.employeePerformanceObjectiveEntity?.map((objective, index) => {
                                                                    return <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td className='pre-wrap'>{objective.name}</td>
                                                                        {
                                                                            objective?.employeePerformanceObjectiveTaskEntity?.map((task, index) => {
                                                                                return <> {(this.state.performanceReview?.submitedByEmployee || !this.state.isManager) && <td className='pre-wrap'>
                                                                                    {!this.state.performanceReview?.submitedByEmployee && <input className="form-control" required={!this.state.isManager} type="text" defaultValue={task.name} onBlur={e => this.setTask(e, objectiveGroup.id, objective.id, task.id)} />}
                                                                                    {this.state.performanceReview?.submitedByEmployee && <span className='pre-wrap'>{task.name}</span>}
                                                                                </td>}

                                                                                    <td><input tabIndex={!task.weightage || task.weightage == 0 ? '0' : '-1'} type="number" defaultValue={task.weightage > 0 ? task.weightage : ''} className="form-control"
                                                                                        onBlur={e => this.setWeightage(e, objectiveGroup.id, objective.id, task.id)} disabled={!this.state.isManager || this.state.performanceReview?.submitedByEmployee} required={!task.weightage || task.weightage == 0} /></td>

                                                                                    {(!this.state.isManager || this.state.performanceReview?.submitedByEmployee) && <td><input type="number" tabIndex={(this.state.isManager || this.state.performanceReview?.submitedByEmployee) ? "-1" : "0"} disabled={this.state.isManager || this.state.performanceReview?.submitedByEmployee} required={(!this.state.isManager && !this.state.performanceReview?.submitedByEmployee)} defaultValue={task.selfRating > 0 ? task.selfRating : ''}
                                                                                        onBlur={e => this.setRating(e, objectiveGroup.id, objective.id, task.id)}
                                                                                        className="form-control" min={1} max={5} /></td>}

                                                                                    {this.state.isManager && this.state.performanceReview?.submitedByEmployee && <td><input required={this.state.isManager} type="number" defaultValue={task.managerRating > 0 ? task.managerRating : ''}
                                                                                        onBlur={e => this.setRating(e, objectiveGroup.id, objective.id, task.id)} disabled={this.state.performanceReview?.submitedByReviewer} className="form-control" min={1} max={5} /></td>}
                                                                                </>

                                                                            })
                                                                        }
                                                                    </tr>
                                                                })}
                                                        </tbody>

                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                    </section>
                                })}
                                <div className="row">
                                    {(!this.state.isManager || this.state.performanceReview?.submitedByEmployee) &&
                                        <div className="mb-2 col-md-6">
                                            <div className="form-group"><label style={{ color: 'black' }} className="col-form-label">Employee Comment</label>
                                                <textarea maxLength={500} onBlur={e => this.setComment(e)} className='form-control' rows="3" disabled={this.state.isManager || this.state.performanceReview?.submitedByEmployee} required={(!this.state.isManager && !this.state.performanceReview?.submitedByEmployee)} value={this.state.performanceReview?.employeeComment}></textarea>
                                            </div>
                                        </div>
                                    }


                                    {((!this.state.isManager && this.state.performanceReview?.submitedByReviewer) || (this.state.isManager && this.state.performanceReview?.submitedByEmployee)) &&
                                        <div className="col-md-6">
                                            <div className="form-group"><label className="col-form-label">Reviewer Comment</label>
                                                <textarea maxLength={500} onBlur={e => this.setComment(e)} required={this.state.isManager && this.state.performanceReview?.submitedByEmployee} disabled={!this.state.isManager || this.state.performanceReview?.submitedByReviewer} className='form-control' rows="3" value={this.state.performanceReview?.reviewerComment}></textarea>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {((!this.state.isManager && this.state.performanceReview?.submitedByReviewer) || (this.state.isManager && this.state.performanceReview?.submitedByEmployee)) &&
                                    <section className="perform_table_mng_hd review-section professional-excellence mt-2" >
                                        {/* Clickable header */}
                                        <div className="p-2  perform_hdr text-center col-12" onClick={() => this.setState({ openTable: !openTable })} style={{
                                            borderBottom: openTable ? '1px solid #dee2e6' : '',
                                            cursor: 'pointer'
                                        }}>
                                            <div className="row">
                                                <h4 className="mb-0 perform_table_mng review-title col-8">
                                                    Development Plan
                                                </h4>
                                                <div className="form-group col-4 mb-0">
                                                    <div className='perform-UpDownIcon'>
                                                        <i className={`mt-0 ml-3 comparisonIcon fa ${openTable ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'}`} aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {openTable &&
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
                                                                    <td><input title={this.getArea(0)} defaultValue={this.getArea(0)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementArea(0, e.target.value)} required type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getCompetency(0)} defaultValue={this.getCompetency(0)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementCompetency(0, e.target.value)} required type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getHow(0)} defaultValue={this.getHow(0)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementHow(0, e.target.value)} required type="text" maxLength={250} className='form-control' /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><input title={this.getArea(1)} defaultValue={this.getArea(1)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementArea(1, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getCompetency(1)} defaultValue={this.getCompetency(1)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementCompetency(1, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getHow(1)} defaultValue={this.getHow(1)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementHow(1, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><input title={this.getArea(2)} defaultValue={this.getArea(2)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementArea(2, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getCompetency(2)} defaultValue={this.getCompetency(2)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementCompetency(2, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getHow(2)} defaultValue={this.getHow(2)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementHow(2, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><input title={this.getArea(3)} defaultValue={this.getArea(3)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementArea(3, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getCompetency(3)} defaultValue={this.getCompetency(3)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementCompetency(3, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getHow(3)} defaultValue={this.getHow(3)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementHow(3, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><input title={this.getArea(4)} defaultValue={this.getArea(4)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementArea(4, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getCompetency(4)} defaultValue={this.getCompetency(4)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementCompetency(4, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
                                                                    <td><input title={this.getHow(4)} defaultValue={this.getHow(4)} disabled={this.state.performanceReview?.submitedByReviewer} onBlur={(e) => this.setImprovementHow(4, e.target.value)} type="text" maxLength={250} className='form-control' /></td>
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

                                    </section>}
                                {((!this.state.isManager && !this.state.performanceReview?.submitedByEmployee && this.state.isWeightageDefined) || (this.state.isManager && !this.state.performanceReview?.submitedByReviewer)) && <input style={{ float: 'right', marginTop: '11px', paddingBottom: '0px' }} type="submit" className="btn btn-primary" value="Save" />}
                            </Form>
                        )}
                    </Formik>

                </div>

                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title"> Performance Objectives - {this.state.selectedobjectiveGroup?.name} </h5>
                    </Header>
                    <Body>
                        <ObjectiveForm callBack={this.hideForm} objectiveGroup={this.state.selectedobjectiveGroup} reviewId={this.state.id}>
                        </ObjectiveForm>
                    </Body>
                </Modal>
            </div >
        )
    }
}
