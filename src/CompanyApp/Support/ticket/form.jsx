import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { PRIORITY } from '../../../Constant/enum';
import { getUserType } from '../../../utility';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import { saveTicket } from './service';
import { TicketSchema } from './validation';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class TicketForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ticket: props.ticket || {
                id: 0,
                employeeId: props.employeeId,
                employee: { id: props.employeeId },
                priority: '', 
                subject: '',
                description: '', 
                endDate: '' 
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.ticket && nextProps.ticket != prevState.ticket) {
            return ({ ticket: nextProps.ticket })
        } else if (!nextProps.ticket) {
            return ({
                ticket: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    employee: { id: nextProps.employeeId },
                    priority: '', // Default value for priority
                    subject: '', // Default value for subject
                    description: '', // Default value for description
                    endDate: '' // Default value for endDate
                }
            })
        }

        return null;
    }
    save = (data, action) => {
        data["endDate"] = new Date(`${data["endDate"]} GMT`);
        action.setSubmitting(true);
        saveTicket(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving ticket");

            action.setSubmitting(false);
        })
    }
    render() {
        const { ticket } = this.state;
        ticket.status = "OPEN";
        console.log({ ticket })
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={ticket}
                    onSubmit={this.save}
                    validationSchema={TicketSchema}
                >
                    {({
                        values,
                        errors,
                        setFieldValue
                        /* Removed unused variables */
                    }) => {
                        console.log('Formik Errors:', errors); // Debugging validation errors
                        return (
                            <Form>

                                <FormGroup>
                                    <label>Priority
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="priority" className="form-control"
                                        render={() => {
                                            return <EnumDropdown label={"Priority"} enumObj={PRIORITY} defaultValue={values.priority} onChange={e => {
                                                setFieldValue("priority", e.target.value)
                                            }}>
                                            </EnumDropdown>
                                        }}
                                    ></Field>
                                    <ErrorMessage name="priority">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <FormGroup>
                                    <label>Subject
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="subject" defaultValue={values.subject} className="form-control"></Field>
                                    <ErrorMessage name="subject">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup>
                                    <label>End Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="endDate" type="date" defaultValue={values.endDate} className="form-control"></Field>
                                    <ErrorMessage name="endDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <FormGroup>
                                    <label>Description
                                       
                                    </label>
                                    <Field name="description"
                                        component="textarea" rows="4"
                                        className="form-control"
                                        placeholder="Description"
                                    >
                                    </Field>
                                    
                                </FormGroup>
                                <input type="submit" className="btn btn-primary" value={this.state.ticket.id > 0 ? "Update" : "Save"} />

                            </Form>
                        )
                    }}
                </Formik>
            </div>
        )
    }
}
