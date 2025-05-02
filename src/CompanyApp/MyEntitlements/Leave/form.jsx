import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType,verifyApprovalPermission } from '../../../utility';
import { saveLeave, saveOpeningBalance } from './service';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class LeaveEntitlementForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveOpeningBalance: props.leaveOpeningBalance || {
                openingBalance: props.currentOpeningBalance,
                employeeId: props.employeeId,
                leaveTypeId: props.leaveTypeId,
                year: props.year
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.leaveOpeningBalance && nextProps.leaveOpeningBalance != prevState.leaveOpeningBalance) {
            return ({ leaveOpeningBalance: nextProps.leaveOpeningBalance })
        } else if (!nextProps.leaveOpeningBalance) {
            return prevState.leaveOpeningBalance || ({
                leaveOpeningBalance: {
                    openingBalance: nextProps.currentOpeningBalance,
                    employeeId: nextProps.employeeId,
                    leaveTypeId: nextProps.leaveTypeId,
                    year: nextProps.year
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveOpeningBalance(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving opening balance");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.leaveOpeningBalance}
                    onSubmit={this.save}
                // validationSchema={TimeInLieuSchema}
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
                            {verifyApprovalPermission("LEAVE BALANCE") && <>
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>
                                                Opening Balance
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="openingBalance" type="number" required className="form-control"></Field>

                                        </FormGroup>
                                    </div>
                                </div>
                                <input type="submit" className="btn btn-primary" value="Update"/>
                            </>}
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
