import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveAssetsCategory } from './service'; 

export default class AssetsCategoryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Assetscategory: props.Assetscategory || {
                id: 0,
                name: "",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.Assetscategory && nextProps.Assetscategory != prevState.Assetscategory) {
            return ({ Assetscategory: nextProps.Assetscategory })
        } else if (!nextProps.Assetscategory ) { 
            return prevState.Assetscategory || ({
                Assetscategory: {
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
        saveAssetsCategory(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Assets Category");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.Assetscategory}
                    onSubmit={this.save} 
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
                                <Field name="name" className="form-control" required></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { Assetscategory } = this.state;
                                    Assetscategory.active = !Assetscategory.active;
                                    setFieldValue("active", Assetscategory.active);
                                    this.setState({
                                        Assetscategory
                                    });
                                }} >
                                    <label>Is Active</label><span style={{ color: "red" }}>*</span><br />
                                    <i className={`fa fa-2x ${this.state.Assetscategory
                                        && this.state.Assetscategory.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.Assetscategory.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
