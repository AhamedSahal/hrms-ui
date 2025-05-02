import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveEntity } from './service';




export default class EntityForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            entity: props.entity || {
                id: 0,
                name: "",
                active: true,
                logoFile: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.entity && nextProps.entity != prevState.entity) {
            return ({ entity: nextProps.entity })
        } else if (!nextProps.entity ) { 
            return prevState.entity || ({
                entity: {
                    id: 0,
                    name: "",
                    active: true,
                    logoFile: ""
                }
            })
        }
        return null;
    }

       save = (data, action) => {
        data.logoFile = data.fileName;
            action.setSubmitting(true); 
            saveEntity(data).then(res => {
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
                    initialValues={this.state.entity}
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
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control" required></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <div className="row">

                            <FormGroup className="col-md-6">
                                <label>Logo
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input name="file" type="file"  accept="image/png" className="form-control" required onChange={e => {
                                    setFieldValue('file', e.target.files[0]);
                                }}></input>
                                 <ErrorMessage name="file">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                <span className="form-text text-muted">Recommended image size is 100px x 50px</span>
                            </FormGroup>
                            
                            <FormGroup className="col-md-4">
                            <div type="checkbox" name="active" onClick={e => {
                                    let { entity } = this.state;
                                    entity.active = !entity.active;
                                    setFieldValue("active", entity.active);
                                    this.setState({
                                        entity
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.entity
                                        && this.state.entity.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                            </div>
                            <input type="submit" className="btn btn-primary" value={this.state.entity.id > 0 ?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
