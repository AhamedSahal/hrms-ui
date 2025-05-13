import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import Select from "react-select";
import { PensionSchema } from './validation';
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import { getAllwoanceTypeList } from '../../Allowance/service';
import { confirmAlert } from 'react-confirm-alert';



export default class PensionSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pension: this.props.pensionData?.[0] || {}, // Dynamically use pensionData from props

            allowances: [],
            selectedAllowances: this.props.pensionData[0]?.allowanceId || []
        }
    }
    componentDidMount() {
        if (verifyOrgLevelViewPermission("Module Setup Pay")) {
            getAllwoanceTypeList().then((res) => {
                if (res.status === 'OK') {
                    const allowances = res.data.list.map((item) => ({
                        value: item.id,
                        label: item.name
                    }));
                    allowances.unshift({ value: 0, label: "Basic Salary" });

                    this.setState({ allowances });
                }
            });
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pensionData !== this.props.pensionData) {
            this.setState({
                pension: this.props.pensionData?.[0] || {},
                selectedAllowances: this.props.pensionData?.[0]?.allowanceId || []
            });
        }
    }
    handleAllowanceChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        this.setState({ selectedAllowances: selectedIds });
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            pensionType: undefined
        })
    }
    save = (data, action) => {
        const payload = {
            ...data,
            branchId: this.props.pensionData[0]?.branchId,
            id: 0 
        };
        action.setSubmitting(true);
        confirmAlert({
            message: `Are you sure you want to Save?`,
            buttons: [
                {
                    label: 'Cancel',
                    onClick: () => { }
                },
                {
                    label: "I'm Sure",
                    className: "confirm-alert",
                    onClick: () => {
                        console.log('Saving payload:', payload);
                        // savePensionType(payload).then(res => {
                        //     if (res.status == "OK") {
                        //         toast.success(res.message);
                        //     } else {
                        //         toast.error(res.message);
                        //     }
                        //     action.setSubmitting(false)
                        // }).catch(err => {
                        //     console.log({ err });
                        //     toast.error("Error while saving pension");
                        //     action.setSubmitting(false);
                        // })
                    },
                }
            ]
        });

    }
    render() {
        const { allowances, pension, selectedAllowances } = this.state;

        return (
            <>
                <div className='endofService-form'>
                    <div className="row ">
                        <div className="col">
                            <p className="endofService-title">Pension</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                {verifyOrgLevelViewPermission("Module Setup Pay") && <Formik
                                    enableReinitialize={true}
                                    initialValues={{
                                        pensionName: pension.pensionName || '',
                                        pensionComponent: selectedAllowances || [], // Ensure pensionComponent is initialized with selectedAllowances
                                        employeeContribution: pension.employeeContribution || '',
                                        employerContribution: pension.employerContribution || '',
                                        governmentContribution: pension.governmentContribution || ''
                                    }}
                                    onSubmit={this.save}
                                    validationSchema={PensionSchema}
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
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>Name of Pension Scheme
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field name="pensionName" className="form-control"></Field>
                                                        <ErrorMessage name="pensionName">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>Pension Component
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Select
                                                            isMulti
                                                            options={allowances}
                                                            value={allowances.filter(option => selectedAllowances.includes(option.value))}
                                                            onChange={(selectedOptions) => {
                                                                this.handleAllowanceChange(selectedOptions);
                                                                setFieldValue("pensionComponent", selectedOptions.map(option => option.value));
                                                            }}
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"
                                                        />
                                                        <ErrorMessage name="pensionComponent">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Employee Contribution
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <div className="input-group">
                                                            <Field name="employeeContribution" className="form-control" type="number" max="100"></Field>
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">%</span>
                                                            </div>
                                                        </div>
                                                        <ErrorMessage name="employeeContribution">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Employer Contribution
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <div className="input-group">
                                                            <Field name="employerContribution" className="form-control" type="number" max="100"></Field>
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">%</span>
                                                            </div>
                                                        </div>
                                                        <ErrorMessage name="employerContribution">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Government Contribution

                                                        </label>
                                                        <div className="input-group">
                                                            <Field name="governmentContribution" className="form-control" type="number" max="100"></Field>
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">%</span>
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                </div>
                                            </div>
                                            {verifyOrgLevelEditPermission("Module Setup Pay") && <input type="submit" style={{ color: 'white', background: '#102746' }} className="btn" value="Save" />}
                                        </Form>
                                    )
                                    }
                                </Formik>}
                                {!verifyOrgLevelViewPermission("Module Setup Pay") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
