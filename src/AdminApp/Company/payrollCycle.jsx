import { Row } from 'antd';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { getChatbotIsEnabled, updatePayrollCycle } from './service';
import { toast } from 'react-toastify';
import EnumDropdown from '../../CompanyApp/ModuleSetup/Dropdown/EnumDropdown';
import { PayrollType } from '../../Constant/enum';



export default class PayrollCycle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            company: props.company || {
                id: props.company? props.company.id :'',
            },
            companyId: this.props.company && this.props.company.id ? this.props.company.id : '',
            startDate: this.props.company && this.props.company.startDate? this.props.company.startDate:'',
            endDate:this. props.company && this.props.company.startDate? this.props.company.startDate - 1:'',
            payrollType:this.props.company && this.props.company.payrollType? this.props.company.payrollType : '',
            allowSanwitchLeave :this.props.company && this.props.company.allowSanwitchLeave? this.props.company.allowSanwitchLeave : '',
        }
    }
    componentDidMount = () => {
        this.fetchList();
    }
    save = () =>{
        const {startDate} = this.state.company;
        const {companyId,allowSanwitchLeave,payrollType}= this.state
        const settingsObject = {
            startDate: startDate,
            companyId: companyId,
            allowSanwitchLeave: allowSanwitchLeave,
            payrollType:payrollType == "GLOBAL" ? "NORMAL" : payrollType == "UAE" ? "UAE" : "UAE02",
        };
    
        updatePayrollCycle(settingsObject).then(res => {
            if (res.status === "OK") {
                toast.success(res.message);
                this.fetchList();
            }
        }).catch(err => {
            toast.error("Error while saving company setting");
        });
    }
    handleFromDateChange = (event) => {
        const startDateValue = event.target.value;
        const endDateValue = parseInt(startDateValue, 10) - 1;

        this.setState({
            startDate: startDateValue,
            endDate: endDateValue,
        });
    };
    fetchList = () => {
        getChatbotIsEnabled(this.state.companyId).then(res => {
            if (res.status === 'OK') {
                this.setState({
                    startDate: res.data.payrollCycleStartDay,
                    endDate: res.data.payrollCycleStartDay - 1,
                    payrollType: res.data.payrollType,
                    allowSanwitchLeave:  res.data.allowSandWitchLeave,
                })
                console.log(res.data)
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    }
    render() {
        let { company,startDate } = this.state;
        company.planId = company.plainId;
        return (
            <div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
                <div className="tablePage-header">
                    <div className="row pageTitle-section">
                        <div className="col-md-10">
                            <h3 className="tablePage-title">Company Payroll Setting </h3>
                        </div>
                    </div>
                </div>

                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        ...this.state.company,
                        startDate: this.state.startDate,
                        payrollType: this.state.payrollType
                    }}
                    onSubmit={this.save}
                //validationSchema={}
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
                        /* and other goodies */
                    }) => (
                        <Form>
                            {startDate != 1 &&(
                            <div>
                                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <span>
                                        Changing Payroll Setting may impact existing payroll data.
                                    </span>
                                </div>
                            </div>
                            )}
                            <Row>
                                <FormGroup className='col-md-4'>
                                    <label>Payroll Cycle Start Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="startDate" type="number" className="form-control" onChange={(e) => {
                                        const { company } = this.state;
                                        const startDateValue = parseInt(e.target.value, 10);
                                        company.startDate = startDateValue;
                                        this.setState({ company });

                                        setFieldValue("startDate", startDateValue);
                                        const endDateValue = startDateValue > 1 ? startDateValue - 1 : startDateValue;
                                        setFieldValue("endDate", endDateValue);
                                        this.setState({endDate: endDateValue });
                                    }}/>
                                    <ErrorMessage name="startDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <FormGroup className='col-md-4'>
                                    <label>Payroll Cycle End Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="endDate" type="number" isEdit={false} disabled value={values.endDate?values.endDate:this.state.endDate} className="form-control"></Field>
                                    <ErrorMessage name="endDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>

                                </FormGroup>
                            </Row>
                            <FormGroup className="col-md-4">
                                <label>Payroll Type
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="payrollType" className="form-control"
                                    render={field => {
                                        return <EnumDropdown label={"Payroll Type"} enumObj={PayrollType} defaultValue={values.payrollType == "NORMAL" ? "GLOBAL" : values.payrollType == "UAE02" ? "API" : values.payrollType == "UAE" ?  "UAE": " " } onChange={e => {
                                            let { payrollType } = this.state;
                                            setFieldValue("payrollType", e.target.value);
                                            this.setState({
                                                payrollType:e.target.value,
                                            });
                                        }}>
                                        </EnumDropdown>
                                    }}
                                ></Field>
                                <ErrorMessage name="payrollType">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <div type="checkbox" name="active" >
                                    <label>Allow Sandwich Leave</label><br />
                                        <i className={`fa fa-2x ${this.state.allowSanwitchLeave ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                        onClick={e => {
                                            let { allowSanwitchLeave } = this.state;
                                            allowSanwitchLeave = !allowSanwitchLeave;
                                            setFieldValue("allowSanwitchLeave", allowSanwitchLeave);
                                            this.setState({
                                                allowSanwitchLeave
                                            });
                                        }}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" style={{ marginBottom: "10px" }} value={this.state.company.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )

    }
}