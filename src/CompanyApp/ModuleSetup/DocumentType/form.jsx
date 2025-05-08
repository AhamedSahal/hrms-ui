import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveDocumentType } from './service';
import { DocumentTypeSchema } from './validation';
import { Tooltip } from 'antd';

export default class DocumentTypeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            documentType: props.documentType || {
                id: 0,
                name: "",
                required: true,
                active:true,
                edit: false
            }
        }
    }
    componentDidMount() {
        console.log(this.state.documentType);
      }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.documentType && nextProps.documentType != prevState.documentType) {
            return ({ documentType: nextProps.documentType })
        } else if (!nextProps.documentType ) {
            
            return prevState.documentType || ({
                documentType: {
                    id: 0,
                    name: "",
                    required: true,
                    active:true,
                    edit: false
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveDocumentType(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Document Type");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.documentType}
                    onSubmit={this.save}
                    validationSchema={DocumentTypeSchema}
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
                        <Form className="row" autoComplete='off'>
                            
                            <FormGroup className="col-md-12">
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                           

                            <FormGroup className="col-md-4">
                                <div type="checkbox" name="required"  >
                                    <label>Required</label><br />
                                    <i className={`fa fa-2x ${this.state.documentType
                                        && this.state.documentType.required
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`} onClick={e => {
                                            let { documentType } = this.state;
                                            documentType.required = !documentType.required;
                                            setFieldValue("required", documentType.required);
                                            this.setState({
                                                documentType
                                            });
                                        }}></i>
                                </div>
                            </FormGroup> 
                            <FormGroup  className="col-md-4">
                                <div type="checkbox" name="active"  >
                                    <label>Active</label><br />
                                    <i className={`fa fa-2x ${this.state.documentType
                                        && this.state.documentType.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`} onClick={e => {
                                            let { documentType } = this.state;
                                            documentType.active = !documentType.active;
                                            setFieldValue("active", documentType.active);
                                            this.setState({
                                                documentType
                                            });
                                        }}></i>
                                </div>
                            </FormGroup> 
                            <div className="col-md-4">
                            <FormGroup >
                                <div type="checkbox" name="edit"  >
                                    <label>Edit
                                        <span style={{ paddingLeft: "5px" }}>
                                            <>
                                                <Tooltip title="Employee can't able to edit the document.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '4px', cursor: 'pointer' }}></i>
                                                </Tooltip><br />
                                            </></span></label><br />
                                    <i className={`fa fa-2x ${this.state.documentType
                                        && this.state.documentType.edit
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`} onClick={e => {
                                            let { documentType } = this.state;
                                            documentType.edit = !documentType.edit;
                                            setFieldValue("edit", documentType.edit);
                                            this.setState({
                                                documentType
                                            });
                                        }}></i>
                                </div>
                            </FormGroup> 
                            </div>
                            
                            <input type="submit" className="ml-2 btn btn-primary" value={this.state.documentType.id>0?"Update":"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
