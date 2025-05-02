import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import { Helmet } from "react-helmet"; 
import { getUserType } from '../../../../utility'; 
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { saveFF } from "./service"; 


const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class FinalSettlementForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        FinalSettlement: props.FinalSettlement || { 
          id: 0,
          employeeId: props.employeeId ,  
          lwdbasedon: "", 
      },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.FinalSettlement && nextProps.FinalSettlement != prevState.FinalSettlement) {
      return { FinalSettlement: nextProps.FinalSettlement };
    } else if (!nextProps.FinalSettlement) {
      return (
        prevState.FinalSettlement || {
            FinalSettlement: nextProps.FinalSettlement || { 
              id: 0,
              employeeId: nextProps.employeeId,  
              lwdbasedon: "", 
          },
        }
      );
    }
    return null;
  }
  save = (data, action) => {   
   data["resignationDate"] = new Date(`${data["resignationDate"]} GMT`);
   data["lwd"] = new Date(`${data["lwd"]} GMT`); 
    action.setSubmitting(true); 
    saveFF(data).then(res => {
        if (res.status == "OK") {
            toast.success(res.message);  
            window.location.reload();
        } else {
            toast.error(res.message);
        }
        action.setSubmitting(false);
    }).catch(err => {  
        toast.error("Error while saving Final Settlement");
        action.setSubmitting(false);
    })
}
 render() { 
    return (
        <div>
            <Formik
                enableReinitialize={true}
                initialValues={FinalSettlementForm}
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
                      <div className="row">
                        <div className="col-md-6"> 
                        {isCompanyAdmin &&
                            <FormGroup>
                                <label>Employee
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="employeeId"  defaultValue={values.employee?.id} render={field => {
                                    return <EmployeeDropdown   onChange={e => {
                                        setFieldValue("employeeId", e.target.value);
                                        setFieldValue("employee", { id: e.target.value });
                                    }}></EmployeeDropdown>
                                }}></Field>
                            </FormGroup>}
                            <ErrorMessage name="employeeId">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </div> 
                        <div className="col-md-6">
                            <FormGroup>
                                <label>Resignation/Termination Date
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="resignationDate" type="date" className="form-control"></Field>
                                <ErrorMessage name="resignationDate">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                              <FormGroup>
                                  <label>Last Working Date
                                    <span style={{ color: "red" }}>*</span>
                                  </label>
                                  <Field name="lwd" type="date"   className="form-control"></Field>
                                  <ErrorMessage name="lwd">
                                      {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                  </ErrorMessage>
                              </FormGroup>
                        </div>
                      </div>
                      <input type="submit" className="btn btn-success" value="F&F Settlement Start" /> 
                    </Form>
                )
                }
            </Formik>
        </div>
    )
}
}
