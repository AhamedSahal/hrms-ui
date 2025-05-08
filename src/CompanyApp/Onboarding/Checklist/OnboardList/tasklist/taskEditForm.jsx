import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { updateDueDate } from './service';

export default class TaskEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duedate: {}

        }
    }

     save = (data, action) => {
            action.setSubmitting(true);
            console.log("data",data)
            updateDueDate( this.props.historyId,this.props.historyStatus,data.dueDate,this.props.historyTaskId).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    window.location.reload();
                    // this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }
                action.setSubmitting(false)
            }).catch(err => {
                toast.error("Error while updating username");
    
                action.setSubmitting(false);
            })
        }

    render() {
        return (
             <div>
            
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state.duedate}
                                onSubmit={this.save}
                                // validationSchema={UpdateUsernameSchema}
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
                                        <FormGroup>
                                            <label>Due Date
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="dueDate" className="form-control" type="date" required></Field>
                                            
                                        </FormGroup>
            
                                        <input type="submit" className="btn btn-primary" value={"Update"} />
            
                                    </Form>
                                )
                                }
                            </Formik>
                        </div>
        )
    }

}