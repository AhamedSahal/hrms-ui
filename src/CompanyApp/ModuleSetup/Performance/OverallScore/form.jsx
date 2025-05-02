import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveOverallScore } from './service';
import { OverallScoreSchema } from './validation';


export default class OverallScoreForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            overallscore: props.overallscore || {
                id: 0,
                name: "",
                scoreFrom: "",
                scoreTo: "",
                rating:"",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.overallscore && nextProps.overallscore != prevState.overallscore) {
            return ({ overallscore: nextProps.overallscore })
        } else if (!nextProps.overallscore) {
            return prevState.overallscore || ({
                overallscore: {
                    id: 0,
                    name: "",
                    scoreFrom: "",
                    rating:"",
                    scoreTo: "",
                    active: true
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveOverallScore(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Rating Scales");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.overallscore}
                    onSubmit={this.save}
                    validationSchema={OverallScoreSchema}
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
                                <label>Performance Rating (1-5)
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="rating" className="form-control"></Field>
                                <ErrorMessage name="rating">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Rating Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Score From
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="scoreFrom" className="form-control"></Field>
                                        <ErrorMessage name="scoreFrom">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Score To
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="scoreTo" className="form-control"></Field>
                                        <ErrorMessage name="scoreTo">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>

                            <input type="submit" className="btn btn-primary" value={this.state.overallscore.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
