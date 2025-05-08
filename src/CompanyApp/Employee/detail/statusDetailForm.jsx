import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { PERMISSION_LEVEL, STATUS } from '../../../Constant/enum';
import { getPermission, getRoleId, getUserType, verifyEditPermission } from '../../../utility';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import { getStatusInformation, updateStatusInformation } from './service';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
export default class StatusDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,
            id: props.employeeId || 0,
            status: {
                id: 0
            },
        }
    }

    componentDidMount() {
        this.fetchList();
    }
    fetchList = () =>{  
        getStatusInformation(this.state.id).then(res => {
            let status = res.data;
            if (res.status == "OK" && status.lwd && status.lwd.length > 0) {
                status.lwd = status.lwd.substr(0, 10);
            }
            this.setState({ status })
        })
    }
    save = (data, action) => {
        if (data["lwd"] && data["lwd"].length > 0)
            data["lwd"] = new Date(data["lwd"]);
        action.setSubmitting(true);
        updateStatusInformation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving status Detail");

            action.setSubmitting(false);
        })
    }
    render() {
        let { editable ,status} = this.state;
        const isEditAllowed = getPermission("PEOPLE", "EDIT") == PERMISSION_LEVEL.ORGANIZATION ;
        if (editable && !isEditAllowed) {
            editable = false;
        }
        return (
            <div className="col-md-6 d-flex">
                <div className="card profile-box flex-fill">
                    <div className="card-body">
                        <h3 className="card-title">Status {!editable && getPermission("PEOPLE", "EDIT") == PERMISSION_LEVEL.ORGANIZATION && status.status != "INACTIVE"&&<Anchor style={{ borderRadius: "50%" }} className="btn btn-success btn-sm" onClick={() => {
                            this.setState({ editable: true })
                        }}><i className="fa fa-edit"></i></Anchor>}</h3>

                        {!editable && <> <ul className="personal-info">
                            <li>
                                <div className="title">Status</div>
                                <div className="text">{this.state.status.status}</div>
                            </li>
                        </ul>
                        </>}
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.status}
                            onSubmit={this.save}
                        // validationSchema={EmployeeSchema}
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
                                <Form autoComplete='off'>
                                    <div className="row">
                                        {editable && <><div className="col-md-4">
                                            <FormGroup>
                                                <label>Status
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="status" className="form-control"
                                                    render={field => {
                                                        return <EnumDropdown readOnly={!editable} enumObj={STATUS} disabledValues={[STATUS.PENDING, STATUS.INACTIVE]} defaultValue={values?.status} onChange={e => {
                                                            setFieldValue("status", e.target.value)

                                                        }}>
                                                        </EnumDropdown>
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="status">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div></>}
                                        {values.status != STATUS.ACTIVE && <>
                                            <div className="col-md-4">
                                                <FormGroup>
                                                    <label>Last working date
                                                    </label>
                                                    <Field readOnly={!editable} name="lwd" type="date" required className="form-control"></Field>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-4">
                                                <FormGroup>
                                                    <label>Comment
                                                    </label>
                                                    <Field readOnly={!editable} name="statusComment" className="form-control"></Field>
                                                    <ErrorMessage name="statusComment">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div></>}
                                    </div>

                                    {editable && <> <input type="submit" className="btn btn-primary" value="Update" />
                                        &nbsp;
                                        <Anchor onClick={() => {
                                            this.setState({ editable: false })
                                        }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor></>}

                                </Form>
                            )
                            }
                        </Formik>
                    </div>
                </div>
            </div>

        )
    }
}
