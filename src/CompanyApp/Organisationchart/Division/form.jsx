import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveDivision } from './service';
import { DivisionSchema } from './validation'; 

export default class DivisionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            division: props.division || {
                id: 0,
                name: "",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.division && nextProps.division != prevState.division) {
            return ({ division: nextProps.division })
        } else if (!nextProps.division ) { 
            return prevState.division || ({
                division: {
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
        saveDivision(data).then(res => {
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
                    initialValues={this.state.division}
                    onSubmit={this.save}
                     validationSchema={DivisionSchema} 
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
                                <label>Division
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { division } = this.state;
                                    division.active = !division.active;
                                    setFieldValue("active", division.active);
                                    this.setState({
                                        division
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.division
                                        && this.state.division.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.division.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
