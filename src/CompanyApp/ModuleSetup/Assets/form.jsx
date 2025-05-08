import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveAssetsSetup } from './service';
import AssetsCategoryDropDown from '../Dropdown/AssetsCategoryDropDown';
import { AssetCategorySchema } from './validation';

export default class AssetsSetupForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            AssetsSetup: props.AssetsSetup || {
                id: 0,
                name: "",
                active: true,
                assetCatId: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.AssetsSetup && nextProps.AssetsSetup != prevState.AssetsSetup) {
            return ({ AssetsSetup: nextProps.AssetsSetup })
        } else if (!nextProps.AssetsSetup ) { 
            return prevState.AssetsSetup || ({
                AssetsSetup: {
                    id: 0,
                    name: "",
                    active: true,
                    assetCatId: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveAssetsSetup(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Asset name");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.AssetsSetup}
                    onSubmit={this.save}
                    validationSchema={AssetCategorySchema}
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
                                <label>Asset Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control" required></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Asset Category
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <AssetsCategoryDropDown defaultValue={values.assetCategory?.id} onChange={e => {
                                    setFieldValue("assetCatId", e.currentTarget.value);
                                }}></AssetsCategoryDropDown>
                                <ErrorMessage name="assetCatId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { AssetsSetup } = this.state;
                                    AssetsSetup.active = !AssetsSetup.active;
                                    setFieldValue("active", AssetsSetup.active);
                                    this.setState({
                                        AssetsSetup
                                    });
                                }} >
                                    <label>Is Active</label><span style={{ color: "red" }}>*</span><br />
                                    <i className={`fa fa-2x ${this.state.AssetsSetup
                                        && this.state.AssetsSetup.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.AssetsSetup.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
