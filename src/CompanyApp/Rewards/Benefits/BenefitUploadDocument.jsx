import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
// import LeaveTypeDropdown from '../../ModuleSetup/Dropdown/LeaveTypeDropdown';
import { updateDocument } from './service';
// import { LeaveSchema } from './validation';


export default class BenefitUploadDocument extends Component {
    constructor(props) {
        super(props)

        this.state = {
            requestClaimedAmount: 0,
            DocUpdate: props.DocUpdate || {
                id: 0,
                employeeId: props.employeeId,
                fileName: "",
                file: null
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.DocUpdate && nextProps.DocUpdate != prevState.DocUpdate) {
            return ({ DocUpdate: nextProps.DocUpdate })
        } else if (!nextProps.DocUpdate) {
            return ({
                DocUpdate: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    fileName: "",
                    file: null
                }
            })
        }

        return null;
    }

    updateDocument = () => {
        if(this.state.requestClaimedAmount > 0 && this.state.file != null){
        updateDocument(this.state.DocUpdate.id, this.state.file,this.state.requestClaimedAmount).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);

            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                setTimeout(function () {
                    window.location.reload()
                  }, 6000)
            }
        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }else{
        toast.error("Please Fill The Required Field");
    }
    }

    render() {
        const { DocUpdate } = this.state;
        return (
            <div>

                {DocUpdate && <> <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <th>Grades</th>
                            <th>Benefit Name</th>
                            <th>Max Benefit Limit</th>
                        </tr>
                        <tr>
                            <td>{DocUpdate.grades1Id?.name}</td>
                            <td>{DocUpdate.name}</td>
                            <td> {DocUpdate.maxemployee}</td>
                        </tr>
                        <tr>
                            <th>Upload Claim Document <span style={{ color: "red" }}>*</span></th>
                            <td>
                                <FormGroup>
                                    <input name="file" type="file" className="form-control" onChange={e => {
                                        if (e.currentTarget.files.length > 0)
                                            this.setState({
                                                file: e.target.files[0]
                                            });
                                    }}></input>

                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <th>Requested Claim Amount <span style={{ color: "red" }}>*</span></th>
                            <td>
                            <FormGroup>
                                <input type="number" className="form-control"  onChange={(e) => this.setState({requestClaimedAmount: e.target.value})}/>
                            </FormGroup>
                            </td>
                        </tr>
                    </tbody>
                </table>
                    <hr />

                    <Anchor onClick={() => {
                        this.updateDocument();
                    }} className="btn btn-primary">Submit</Anchor>

                    {/*   <SafeAnchor onClick={() => {
                        this.updateStatus(leave.id, "REJECTED");
                    }} className="btn btn-warning">Reject</SafeAnchor>  */}
                </>}

            </div>
        )
    }
}
