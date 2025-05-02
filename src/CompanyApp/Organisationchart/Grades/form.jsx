import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveGrades } from './service';
 import { GradesSchema } from './validation'; 


export default class GradesForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            grades: props.grades || {
                id: 0,
                name: "",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.grades && nextProps.grades != prevState.grades) {
            return ({ grades: nextProps.grades })
        } else if (!nextProps.grades ) { 
            return prevState.grades || ({
                grades: {
                    id: 0,
                    name: "",
                    active: true
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);  
        saveGrades(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error(err); 
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.grades}
                    onSubmit={this.save}
                    validationSchema={GradesSchema}  
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
                            <FormGroup>
                                <label>Grades
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { grades } = this.state;
                                    grades.active = !grades.active;
                                    setFieldValue("active", grades.active);
                                    this.setState({
                                        grades
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.grades
                                        && this.state.grades.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.grades.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
