import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap'; 
import { saveRecognition } from './service';
import { RecognitionSetupSchema } from './validation';

export default class RecognitionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            recognition: props.recognition || {
                id: 0,
                categoryName: "",
                fileName: "",
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.recognition && nextProps.recognition != prevState.recognition) {
            return ({ recognition: nextProps.recognition })
        } else if (!nextProps.recognition) {

            return prevState.recognition || ({
                recognition: {
                    id: 0,
                    categoryName: "",
                    fileName: "",
                     
                }
            })
        }
        return null;
    }
    save = (data, action) => {

        saveRecognition(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else { 
                toast.error(res.message);
            }         
        }).catch(err => {
            toast.error(err); 
            toast.error("Error while saving Recognition");
            action.setSubmitting(false);
        })
    }
    render() {
        let {recognition} = this.state; 
        recognition.file = ""; 
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={recognition}
                    onSubmit={this.save}
                    validationSchema={RecognitionSetupSchema}
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
                                <label>Category Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="categoryName" className="form-control"></Field>
                                <ErrorMessage name="categoryName">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.recognition.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
