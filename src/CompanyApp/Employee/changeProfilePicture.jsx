import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateProfilePicture } from './service';
import EmployeeProfilePhoto from './widgetEmployeePhoto';


export default class ChangeProfilePicture extends Component {
    constructor(props) {
        super(props)

        this.state = {
            employee: props.employee || {
                id: 0, 
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
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        updateProfilePicture(this.state.employee.id, data.file).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(this.state.employee.id,res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while updating profile picture");

            action.setSubmitting(false);
        })
    }
    render() {
        let { employee } = this.state;
        return (
            <div>

                <Formik
                    enableReinitialize={true} 
                    onSubmit={this.save} 
                    initialValues={{
                        file:""
                    }}
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
                        setSubmitting,
                        
                        /* and other goodies */
                    }) => (
                        <Form encType="multipart/form-data">

                            <div className='row'>
                            <div className="col-md-3" style={{height: "119px"}}>
                            <div style={{height:"50px", width:"50px"}}>
                            <div className="profile-img-wrap">
                                        <div className="profile-img">
                                            <a href="#"> <EmployeeProfilePhoto id={employee.id} alt={employee.name}></EmployeeProfilePhoto></a>
                                        </div>
                                        </div>
                            </div>
                            </div>

                            <div className="col-md-6" style={{alignContent: "center"}}>
                            <label>{employee.name}</label>
                           
                            </div>  
                          <div className="col-md-12" >
                            <FormGroup>
                                <label>File
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <input type="file" className="form-control" onChange={(event) => {
                                    if(event.currentTarget.files.length>0)
                                    setFieldValue('file', event.currentTarget.files[0]);
                                }}/>
                                {/* <ErrorMessage name="file">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage> */}
                            </FormGroup>
                            </div>
                            <div className="col-md-3">
                                <div className = "text-center">
                            <input type="submit" className="btn btn-primary" value={"Update"} />
                            </div>
                            </div>

                            </div>

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
