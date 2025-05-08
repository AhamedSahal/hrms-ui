import { name } from 'file-loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
 import { updateStatus } from './service';
 import { saveHInternalApplicantForms, saveHExternalApplicantForms} from '../../Hire/hApplicants/service';
// import { ForecastSchema } from './validation';

export default class CandidateInfoApproval extends Component {
    constructor(props) {
        super(props)

        this.state = {
            CandidateInfoForm : props.CandidateInfoForm || {
                id: 0,
                candidateId: 0,
                offerletterId: 0,
                candidatePosition: "",
                dob: "",
                personalemailid: "",
                fathername: "",
                firstname: "",
                gender: "MALE", 
                lastname: "",
                middlename: "",
                fileName: "",
                phone: "" ,
                officialEmail: "",
                comments: props.comments || "", 
                password: props.password || "", 
                docVerify:  props.docVerify || ""
            },
            status:"APPROVED",
            password: "",
            docVerify: "",
            officialEmail: ""
        }
    }
    hideForm = () => {
        this.setState({
          showForm: false
        })
      }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.CandidateInfoForm && nextProps.CandidateInfoForm != prevState.CandidateInfoForm) {
            return ({ CandidateInfoForm: nextProps.CandidateInfoForm })
        } else if (!nextProps.CandidateInfoForm) {
            return ({
                CandidateInfoForm :  {
                    id: 0,
                    candidateId: 0,
                    offerletterId: 0,
                    candidatePosition: "",
                    dob: "",
                    personalemailid: "",
                    fathername: "",
                    firstname: "",
                    gender: "MALE", 
                    lastname: "",
                    middlename: "",
                    fileName: "",
                    phone: "" ,
                    officialEmail: "",
                    comments: nextProps.comments || "", 
                    password: nextProps.password || "", 
                    docVerify: nextProps.docVerify || ""
                },
                status:"APPROVED" 
            })
        }

        return null;
    }

    handleStatusUpdate = (id, message, status) => {

        let dataParameters = {
          id: id,
          status: status
        }
        if (message == "internalApplicant") {
          saveHInternalApplicantForms(dataParameters)
            .then((res) => {
              if (res.status == "OK") {
                // toast.success(res.message);
              } else {
                toast.error(res.message);
              }
              if (res.status == "OK") {
                window.location.reload();
              }
            })
            .catch((err) => {
              toast.error("Error while Update Job");
            });
    
        }
        if (message == "externalApplicant") {
    
          saveHExternalApplicantForms(dataParameters)
            .then((res) => {
              if (res.status == "OK") {
                // toast.success(res.message);
              } else {
                toast.error(res.message);
              }
              if(res.status == "OK"){
                window.location.reload();
            }
            
            })
            .catch((err) => {
              toast.error("Error while Update Job");
            });
    
        }
    
      }


    updateStatus = (id, status ) => {  
         
         if(this.state.officialEmail == "" || this.state.password == "" || this.state.docVerify == "" || !/\S+@\S+\.\S+/.test(this.state.officialEmail)){
            toast.error("Please Fill The Mandatory Field")
         }else{
            updateStatus(id, status,this.state.password,this.state.comments,this.state.docVerify,this.state.officialEmail).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    //this.props.updateList(res.data);
                } else {
                   toast.error(res.message)
                  
                }
                if (res.status == "OK" && this.state.CandidateInfoForm.applicantId > 0) {
                    let internal = this.state.CandidateInfoForm.internal?"internalApplicant":"externalApplicant"
                     this.handleStatusUpdate(this.state.CandidateInfoForm.applicantId,internal,"HIRED" )
                  }else{
                    if(res.status == "OK"){
                        window.location.reload();
                    }
                  }
    
            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })

         }
       
    }
    render() {
        const { CandidateInfoForm } = this.state; 
        return (
            <div>
                {CandidateInfoForm && <> <table className="table">
                    <tbody>
                    <tr>
                        <th>Candidate Id</th>
                        <td>{CandidateInfoForm.candidateId}</td>
                    </tr>
                    <tr>
                        <th>Offer Letter Id</th>
                        <td>{CandidateInfoForm.offerletterId}</td>
                    </tr>
                    <tr>
                        <th>Candidate Position</th>
                        <td>{CandidateInfoForm.candidatePosition}</td>
                    </tr>
                    <tr>
                        <th>First Name</th>
                        <td>{CandidateInfoForm.firstname}</td>
                    </tr>
                    <tr>
                        <th>Middle Name</th>
                        <td>{CandidateInfoForm.middlename}</td>
                    </tr>
                    <tr>
                        <th>Last Name</th>
                        <td>{CandidateInfoForm.lastname}</td>
                    </tr>
                    <tr>
                        <th>Personal Email</th>
                        <td>{CandidateInfoForm.personalemailid}</td>
                    </tr>
                    <tr>
                        <th>Father Name</th>
                        <td>{CandidateInfoForm.fathername}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>{CandidateInfoForm.phone}</td>
                    </tr>
                    <tr>
                        <th>Gender</th>
                        <td>{CandidateInfoForm.gender}</td>
                    </tr>
                    <tr>
                        <th>Official Email <span style={{ color: "red" }}>*</span></th>
                        <td>
                            <input type="email" className="form-control"  autoComplete='off' onChange={(e) => {
                                this.setState({
                                    officialEmail: e.target.value
                                });
                                }}/>
                        </td>
                    </tr>
                    <tr>
                    <th>Did you verify all attached documents? <span style={{ color: "red" }}>*</span></th>
                    <td>
                        <FormGroup >
                        <label className='mr-2'> <input name="docVerify" type="radio" value="Yes" 
                        onChange={(e) => {
                            this.setState({
                                docVerify: e.target.checked?"Yes":"No"
                            }); }}
                        /> Yes</label>
                        <label> <input name="docVerify" type="radio" value="No" onChange={(e) => {
                        this.setState({
                            docVerify: e.target.checked?"No":"Yes"
                        });
                        }}/> No</label>
                        </FormGroup>
                        </td> 
                    </tr>
                    <tr>
                    <th>One Time Password <p style={{fontSize:"10px",fontFamily:"Arial"}}>(For new employee to login.)</p> <span style={{ color: "red" }}>*</span></th>
                    <td>
                        <FormGroup >
                            <input name="password" type="text" className="form-control" autoComplete='off' required
                            onChange={(e) => {
                                this.setState({
                                    password: e.target.value
                                });
                                }}/>
                        </FormGroup>
                        </td> 
                    </tr>
                    <tr>
                    <th>Comments <p style={{fontSize:"10px",fontFamily:"Arial"}}>(Use this field to enter any comments<br/> about why the item was rejected.)</p></th>
                    <td>
                        <FormGroup>
                            <input name="comments" type="text" className="form-control"  autoComplete='off'
                              onChange={(e) => {
                                this.setState({
                                    comments: e.target.value
                                });
                                }}/>
                        </FormGroup>
                        </td> 
                    </tr>
                    </tbody>
                    </table>

                    <hr />
                    <Anchor onClick={() => {
                        this.updateStatus(CandidateInfoForm.id, "APPROVED");
                    }} className="btn btn-primary">Generate Employee Id</Anchor>
                    &nbsp;
                    <Anchor onClick={() => {
                    this.updateStatus(CandidateInfoForm.id, "REJECTED");
                    }} className="btn btn-warning">Reject</Anchor>  
                </>}

            </div>
        )
    }
}
