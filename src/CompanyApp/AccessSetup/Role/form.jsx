import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveRole } from './service';
import { RoleSchema } from './validation';
import RoleDropdown from '../../ModuleSetup/Dropdown/RoleDropdown';

export default class RoleForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            role: props.role || {
                id: 0,
                name: "",
                cloneRole:'',
                roleId:'',
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.role && nextProps.role != prevState.role) {
            return ({ role: nextProps.role })
        } else if (!nextProps.role ) { 
            return prevState.role || ({
                role: {
                    id: 0,
                    name: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveRole(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving role");

            action.setSubmitting(false);
        })
    }
    render() {
        console.log(this.state.role.id);
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.role}
                    onSubmit={this.save}
                    validationSchema={RoleSchema}
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
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            {this.state.role.id != 0 || this.state.role.id == '' &&<>
                            <FormGroup>
                                <div type="cloneRole" name="active" onClick={e => {
                                    let { role } = this.state;
                                    role.cloneRole = !role.cloneRole;
                                    setFieldValue("cloneRole", role.cloneRole);
                                    this.setState({
                                        role
                                    });
                                }} >
                                    <label>Clone Role</label><br />
                                    <i className={`fa fa-2x ${this.state.role && this.state.role.cloneRole ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            {this.state.role.cloneRole &&<>
                                <FormGroup>
                                <label>Role
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="roleId" render={field => {
                                    return <RoleDropdown required defaultValue={this.state.role.roleId?.id} onChange={e => {
                                        setFieldValue("roleId", e.target.value);
                                    }}></RoleDropdown>
                                }}></Field>
                            </FormGroup>
                            </>}
                        </>}
                            <input type="submit" className="btn btn-primary" value={this.state.role.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
