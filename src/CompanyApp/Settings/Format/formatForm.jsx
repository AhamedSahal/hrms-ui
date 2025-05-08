import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Button, Modal, Anchor } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getTitle,toLocalCalendarTime,toUTCCalendarTime, verifyOrgLevelViewPermission } from '../../../utility';
import WeekDaysDropdown from '../../ModuleSetup/Dropdown/WeekDaysDropdown';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { BsFillInfoCircleFill} from "react-icons/bs";
import { getFormat, updateFormat } from './service';
import { FormatSchema } from './validation';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

const { Header, Body, Footer, Dialog } = Modal;

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      width: "150px",
      height: "auto",
      padding: "5px",
      border: "1px solid black"
    },
  }));

export default class FormatForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            format: {}
        }
    }


    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Settings System")) {
            getFormat().then(res => {
                if (res.status == "OK") {
                    if (res.data.shiftEnd) {
                        res.data.shiftEnd = toLocalCalendarTime(res.data.shiftEnd)
                    }
                    if (res.data.shiftStart) {
                        res.data.shiftStart = toLocalCalendarTime(res.data.shiftStart)
                    }
                    this.setState({ format: res.data })                   
                }
            })
        }
    }

    save = (data, action) => {
        let { minimumCharacters, maximumCharacters, minSpecialCharacters, minNumericCharacters, minUppercaseCharacters, minLowercaseCharacters,format } = this.state;
        data["shiftStart"] = toUTCCalendarTime(data["shiftStart"]);
        data["shiftEnd"] = toUTCCalendarTime(data["shiftEnd"]);
        data.minimumCharacters = minimumCharacters?minimumCharacters:format.minimumCharacters;
        data.maximumCharacters = maximumCharacters?maximumCharacters:format.maximumCharacters;
        data.minSpecialCharacters = minSpecialCharacters?minSpecialCharacters:format.minSpecialCharacters;
        data.minNumericCharacters = minNumericCharacters?minNumericCharacters:format.minNumericCharacters;
        data.minUppercaseCharacters = minUppercaseCharacters?minUppercaseCharacters:format.minUppercaseCharacters;
        data.minLowercaseCharacters = minLowercaseCharacters?minLowercaseCharacters:format.minLowercaseCharacters;
        action.setSubmitting(true);
        updateFormat(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                data["shiftStart"] = toLocalCalendarTime(data["shiftStart"]);
                data["shiftEnd"] = toLocalCalendarTime(data["shiftEnd"]);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving format");
            action.setSubmitting(false);
        })
    }

    generateRegex = () => {
        // Generate Regex from state data of minimumCharacters,maximumCharacters,minSpecialCharacters,minNumericCharacters,minUppercaseCharacters,minLowercaseCharacters
        let regex = "";
        let { minimumCharacters, maximumCharacters, minSpecialCharacters, minNumericCharacters, minUppercaseCharacters, minLowercaseCharacters, format } = this.state;

        if (minSpecialCharacters || format.minSpecialCharacters > 0) {
            regex += `(?=(?:.*[!@#$%^&*()_+\\-=\[\\]{};':"\\|,.<>\\/?].*){${minSpecialCharacters?minSpecialCharacters:format.minSpecialCharacters},})`;
        }
        if (minNumericCharacters || format.minNumericCharacters > 0) {
            regex += `(?=(?:.*[0-9].*){${minNumericCharacters?minNumericCharacters:format.minNumericCharacters},})`;
        }
        if (minUppercaseCharacters || format.minUppercaseCharacters > 0) {
            regex += `(?=(?:.*[A-Z].*){${minUppercaseCharacters?minUppercaseCharacters:format.minUppercaseCharacters},})`;
        }
        if (minLowercaseCharacters || format.minLowercaseCharacters > 0) {
            regex += `(?=(?:.*[a-z].*){${minLowercaseCharacters?minLowercaseCharacters:format.minLowercaseCharacters},})`;
        }
        if (minimumCharacters || format.maximumCharacters > 0 || format.minimumCharacters > 0) {
            regex += `.{${minimumCharacters?minimumCharacters:format.minimumCharacters},${maximumCharacters?maximumCharacters:format.maximumCharacters > 0?format.maximumCharacters:"" || ""}}`;
        }

        format.passwordPolicy = '^'+regex+"$";//encodeURI(regex);
        this.setState({ format: format, showRegexForm: false }, console.log(this.state.format));

    }
    render() {
        let {format} = this.state;
        return (
            <div className="insidePageDiv">
              
                <div className="mt-4 content container-fluid">
                    <div className="row">

                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Format</h5>
                                </div>
                                <div className="card-body">
                                {verifyOrgLevelViewPermission("Settings System") && 
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.format}
                                        onSubmit={this.save}
                                        validationSchema={FormatSchema}
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
                                            <Form autoComplete='off'>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Currency Symbol
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="currencySymbol" className="form-control"></Field>
                                                            <ErrorMessage name="currencySymbol">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Employee ID Format
                                                                <span style={{ color: "red" }}>*</span>
                                                                <span style={{paddingLeft: "5px"}}>
                                                                <>
                                                                 <LightTooltip title="This field only accepts the following Special Characters # \ _ ( ) & , " placement="top" style={{ margin: "-10px" }}>
                                                                 <IconButton>
                                                                 <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                                 </IconButton>
                                                                 </LightTooltip>
                                                                 </>
                                                                </span>
                                                            </label>
                                                            <Field name="employeeIdFormat" className="form-control"></Field>
                                                            <ErrorMessage name="employeeIdFormat">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Date Format
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="dateFormat" className="form-control"></Field>
                                                            <ErrorMessage name="dateFormat">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Date Time Format
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="dateTimeFormat" className="form-control"></Field>
                                                            <ErrorMessage name="dateTimeFormat">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Shift Start Time
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field type="time" name="shiftStart" className="form-control"></Field>
                                                            <ErrorMessage name="shiftStart">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Shift End Time
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field type="time" name="shiftEnd" className="form-control"></Field>
                                                            <ErrorMessage name="shiftEnd">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Weekly off
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="weeklyOff" render={field => {
                                                                return <WeekDaysDropdown id="weeklyOff" isMultiple={true} defaultValue={values.weeklyOffs} onChange={e => {
                                                                    setFieldValue("weeklyOffs", Array.from(e.target.selectedOptions, option => option.value).join(","));
                                                                    console.log(Array.from(e.target.selectedOptions, option => option.value).join(","));
                                                                }}></WeekDaysDropdown>
                                                            }}></Field>
                                                            <ErrorMessage name="weeklyOff">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Break Time (In Minutes)
                                                                <span style={{ color: "red" }}>*</span>
                                                                <span style={{paddingLeft: "5px"}}>
                                                                <>
                                                                 <LightTooltip title="Mention the standed Break time applicable to employees" placement="top" style={{ margin: "-10px" }}>
                                                                 <IconButton>
                                                                 <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                                                                 </IconButton>
                                                                 </LightTooltip>
                                                                 </>
                                                                </span>
                                                            </label>
                                                            <Field name="breakTime" className="form-control" placeholder="Break Time(In Minutes)"></Field>
                                                            <ErrorMessage name="breakTime">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <label>Password Regex Policy
                                                                <span style={{ color: "red" }}>*</span>

                                                            </label>
                                                            <Field name="passwordPolicy" defaultValue={values.passwordPolicy} readOnly={true} className="form-control"></Field>
                                                            <ErrorMessage name="passwordRegexPolicy">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                            <Anchor onClick={e => {
                                                                this.setState({
                                                                    showRegexForm: true
                                                                })
                                                            }}>
                                                                <i>Generate Regex</i>
                                                            </Anchor>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Password Validation Message
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="passwordValidationMessage" className="form-control"></Field>
                                                            {/* <ErrorMessage name="passwordValidationMessage">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage> */}
                                                        </FormGroup>
                                                    </div>
                                                </div>

                                                <input type="submit" className="btn btn-primary" value="Save" />
                                                <br/>
                                                 <small className='text-warning'>Note: Change in settings will be applied after next login</small>
                                            </Form>
                                        )
                                        }
                                    </Formik>}
                                    {!verifyOrgLevelViewPermission("Settings System") && <AccessDenied></AccessDenied>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal enforceFocus={false} size={"xl"} show={this.state.showRegexForm} onHide={() => {
                    this.setState({
                        showRegexForm: false
                    })

                }} >


                    <Header closeButton>
                        <h5 className="modal-title">Generate Password Regex</h5>

                    </Header>
                    <Body>
                        <div className="card-body row border">
                            <div className='col-md-4'>
                                <FormGroup>
                                    <label>Minimum Password Length</label>
                                    <input name="minimumCharacters" defaultValue={format.minimumCharacters} onChange={e => {
                                        this.setState({
                                            minimumCharacters: e.target.value
                                        })
                                    }} className="form-control" />
                                </FormGroup>
                            </div>
                            <div className='col-md-4'>
                                <FormGroup>
                                    <label>Maximum Password Length</label>
                                    <input name="maximumCharacters" defaultValue={format.maximumCharacters} onChange={e => {
                                        this.setState({
                                            maximumCharacters: e.target.value
                                        })
                                    }} className="form-control" />
                                </FormGroup>
                            </div>
                            <div className='col-md-4'>
                                <FormGroup>
                                    <label>Min number of Special Characters</label>
                                    <input name="minSpecialCharacters" defaultValue={format.minSpecialCharacters} onChange={e => {
                                        this.setState({
                                            minSpecialCharacters: e.target.value
                                        })
                                    }} className="form-control" />
                                </FormGroup>
                            </div>
                            <div className='col-md-4'>
                                <FormGroup>
                                    <label>Min number of Numeric Characters</label>
                                    <input name="minNumericCharacters" defaultValue={format.minNumericCharacters} onChange={e => {
                                        this.setState({
                                            minNumericCharacters: e.target.value
                                        })
                                    }} className="form-control" />
                                </FormGroup>
                            </div>
                            <div className='col-md-4'>
                                <FormGroup>
                                    <label>Min number of Uppercase Characters</label>
                                    <input name="minUppercaseCharacters" defaultValue={format.minUppercaseCharacters} onChange={e => {
                                        this.setState({
                                            minUppercaseCharacters: e.target.value
                                        })
                                    }} className="form-control" />
                                </FormGroup>
                            </div>
                            <div className='col-md-4'>
                                <FormGroup>
                                    <label>Min number of Lowercase Characters</label>
                                    <input name="minLowercaseCharacters" defaultValue={format.minLowercaseCharacters} onChange={e => {
                                        this.setState({
                                            minLowercaseCharacters: e.target.value
                                        })
                                    }} className="form-control" />
                                </FormGroup>
                            </div>
                            <div className='col-md-12'>
                                <Button onClick={this.generateRegex}>Generate Regex</Button>
                            </div>
                        </div>
                    </Body>


                </Modal>

            </div>

        )
    }
}
