import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import RoleDropdown from '../ModuleSetup/Dropdown/RoleDropdown';
import { assignRoleToEmployee } from './service';


export default class EmployeeRoleForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            employee: props.employee || {
                id: 0,
                email: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.employee && nextProps.employee != prevState.employee) {
            return ({ employee: nextProps.employee })
        } else if (!nextProps.employee) {
            return ({
                employee: {
                    id: 0,
                    email: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        if (!data.roleId) {
            toast.error("Please Select Role");
            action.setSubmitting(false);
            return;
        }    
        action.setSubmitting(true);
        assignRoleToEmployee(data.id, data.roleId).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({err})
            toast.error("Error while assigning Role");
            action.setSubmitting(false);
        })
    }
    render() {
        let { employee } = this.state;
        console.log(employee)
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        id: employee.id,
                        roleId: "",
                    }}
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
                        <Form>
                            <FormGroup>
                                <label>Role
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="roleId" render={field => {
                                    return <RoleDropdown required defaultValue={this.state.employee.role?.id} onChange={e => {
                                        setFieldValue("roleId", e.target.value);
                                        setFieldValue("roleEntity", { id: e.target.value });
                                    }}></RoleDropdown>
                                }}></Field>
                            </FormGroup>
                            <Field name="id" type="hidden"></Field>
                            <input type="submit" className="btn btn-primary" value={"Assign Role"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
