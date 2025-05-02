import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePoliciesDocument } from './service';
import { RecognitionSetupSchema } from './validation';


export default class PoliciesDocumentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            policiesdocument: props.policiesdocument || {
                id: 0,
                policiesName: "",
                fileName: "",
                file: null
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.policiesdocument && nextProps.policiesdocument != prevState.policiesdocument) {
            return ({ policiesdocument: nextProps.policiesdocument })
        } else if (!nextProps.policiesdocument) {

            return prevState.policiesdocument || ({
                policiesdocument: {
                    id: 0,
                    policiesName: "",
                    fileName: "",
                    file: null

                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        savePoliciesDocument(data).then(res => {
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
        let { policiesdocument } = this.state;
        policiesdocument.file = "";
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.policiesdocument}
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
                                <label>Policy/Document Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="policiesName" className="form-control"></Field>
                                <ErrorMessage name="policiesName">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>


                            <FormGroup>
                                <label>Upload Policy/Document
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input name="file" type="file" className="form-control" onChange={e => {
                                    setFieldValue('file', e.target.files[0]);
                                }}></input>
                                <ErrorMessage name="file">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.policiesdocument.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
