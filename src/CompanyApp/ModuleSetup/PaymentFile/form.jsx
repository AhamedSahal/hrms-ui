import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePaymentFile } from './service';
import { PaymentFileSchema } from './validation';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission,getCompanyName } from '../../../utility'; 
import { getEntityList } from '../../Organisationchart/Entity/service';
import EntityDropdown from '../../ModuleSetup/Dropdown/EntityDropdown';
import { getOrgSettings } from '../OrgSetup/service';
export default class PaymentFileForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEntity : false,
             orgsetup: false,
            PaymentFile: props.PaymentFile || {
                id: 0,
                name: getCompanyName(),
                entityId: 0,
                 entity: {
                    id: 0,
                },
                formatTemplate: "Universal",
                employerUniqueId: "",
                employerMOLId: "",
                bankName: "",
                bankRoutingCode: "",
                agentCode: ""

            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.PaymentFile && nextProps.PaymentFile != prevState.PaymentFile) {
            return ({ PaymentFile: nextProps.PaymentFile })
        } else if (!nextProps.PaymentFile ) { 
            return prevState.PaymentFile || ({
                PaymentFile: {
                    id: 0,
                    name:  getCompanyName(),
                    entityId: 0,
                    entity: {
                        id: 0,
                    },
                    formatTemplate: "Universal",
                    employerUniqueId: "",
                    employerMOLId: "",
                    bankName: "",
                    bankRoutingCode: "",
                    agentCode: ""
                }
            })
        }
        return null;
    }

    componentDidMount () { 
        // entity is present validation
                getOrgSettings().then(res => {
                    if (res.status == "OK") {
                    this.setState({ orgsetup: res.data.entity })
                    this.fetchList();
                    }
                });
            
    
    }

fetchList = () =>{
 if(verifyOrgLevelViewPermission("Organize Org Setup")){
      getEntityList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
  
        if (res.status == "OK") {
          this.setState({ 
            isEntity : true
          })
        }
      })
      }

}
    save = (data, action) => { 
        action.setSubmitting(true); 
        
        savePaymentFile(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                window.location.reload(1000);
            } else {
                toast.error(res.message);
            }
            
             
        }).catch(err => {
            toast.error("Error while saving payment file");
            action.setSubmitting(false);
        })
    }
     
    render() {
         const { isEntity, orgsetup } = this.state; 
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.PaymentFile}
                    onSubmit={this.save}
                      validationSchema={PaymentFileSchema}
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
                             <div className="row">
                            {(!orgsetup )&& <FormGroup className="col-md-6">
                                <label>Company Name
                                    <span style={{ color: "red" }}>*</span>
                                </label><br/>
                                <label style={{ fontWeight: 'bold' }}>{  this.state.PaymentFile.name} </label>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>} 
                               {(this.state.isEntity &&  this.state.orgsetup ) &&  <FormGroup className="col-md-6">
                                    <label>Entity<span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field  name="entityId"  render={field => {
                                        return <EntityDropdown required  defaultValue={values.entity?.id} onChange={e => {
                                            setFieldValue("entityId", e.target.value);
                                            setFieldValue("entity", { id: e.target.value });
                                        }}></EntityDropdown>
                                    }}></Field>
                                </FormGroup> }
                            <FormGroup className="col-md-6">
                                <label>Format Template <span style={{ color: "red" }}>*</span>
                                </label> 
                                <select name='formatTemplate' data-toggle="dropdown" defaultValue={values.formatTemplate} className='form-control '
                                onChange={(e) => setFieldValue("formatTemplate", e.target.value)}
                                 >
                                <option value="Universal">Universal</option>
                                <option value="AlAnsari_UAE">Al Ansari Exchange - UAE</option>
                                <option value="lulu_UAE">Lulu Exchange - UAE</option>

                                </select>  
                            </FormGroup> 
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-6">
                                <label>Employer Unique ID
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="employerUniqueId" className="form-control" ></Field>
                                <ErrorMessage name="employerUniqueId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <label>Employer MOL ID
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="employerMOLId" className="form-control" ></Field>
                                <ErrorMessage name="employerMOLId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                        </div>
                        <div className="row">
                            <FormGroup className="col-md-4">
                                <label>Bank Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="bankName" className="form-control" type="text" ></Field>
                                <ErrorMessage name="bankName">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <label>Bank Routing Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="bankRoutingCode" className="form-control"></Field>
                                <ErrorMessage name="bankRoutingCode">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-4">
                                <label>Agent Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="agentCode" className="form-control" ></Field>
                                <ErrorMessage name="agentCode">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                        </div>
                            <input type="submit" className="btn btn-primary" value={this.state.PaymentFile.id > 0 ? "update":"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
