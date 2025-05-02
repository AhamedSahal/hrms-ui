import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, getEmployeeId,getPermission,verifyApprovalPermission } from '../../../utility';
import { saveCategory } from './service';
import { CategorySchema } from './validation';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class CategoryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: props.category || {
                id: 0,
                name: props.name,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.category && nextProps.category != prevState.category) {
            return ({ category: nextProps.category })
        } else if (!nextProps.category) {
            return ({
                category: {
                    id: 0,
                    name: nextProps.name,
                }
            })
        }

        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveCategory(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving category");

            action.setSubmitting(false);
        })
    }
    render() {
        const { category } = this.state;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={category}
                    onSubmit={this.save}
                    validationSchema={CategorySchema}
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
                                <Field name="name" defaultValue={values.name} className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.category.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
