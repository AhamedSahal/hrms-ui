import { name } from 'file-loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateStatus } from './service';
import { ForecastSchema } from './validation';


export default class ForecastAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            forecast: props.forecast || {
                id: 0,
                departmentId: 0,
                department: {
                    id: 0
                },
                name: "",
                persons: 0,
                appnoofresources: props.appnoofresources || 0,
            },
            status: props.status || "APPROVED"
        }
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.forecast && nextProps.forecast != prevState.forecast) {
            return ({ forecast: nextProps.forecast })
        } else if (!nextProps.forecast) {
            return ({
                forecast: {
                    id: 0,
                    departmentId: 0,
                    department: {
                        id: 0
                    },
                    name: "",
                    persons: 0,
                    appnoofresources: this.props.appnoofresources || 0,
                },
                status: this.props.status || "APPROVED"
            })
        }

        return null;
    }
    updateStatus = (id, status, budgetstatus) => {
        if((this.state.appnoofresources != null && this.state.appnoofresources > 0) || status == "REJECTED"){
         updateStatus(id, status, budgetstatus, budgetstatus == "REJECTED" ? 0 : this.state.appnoofresources).then(res => {
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
        toast.error("Please Enter No Of Resources");
    }
    }
    render() {
        const { forecast } = this.state; 
        return (
            <div>
                {forecast && <> <table className="table">
                    <tbody>
                     <tr>
                        <th>Department</th>
                        <td>{forecast.department?.name}</td>
                    </tr>
                    <tr>
                        <th>Job Title</th>
                        <td>{forecast.name}</td>
                    </tr>
                    <tr>
                        <th>Requested No of Resources</th>
                        <td>{forecast.persons}</td>
                    </tr>
                    <tr>
                        <th>Job Responsible</th>
                        <td>{forecast.jobresponsible ? forecast.jobresponsible : "-"}</td>
                    </tr>
                    <tr>
                        <th>Qualification/Experience</th>
                        <td>{forecast.qualification ? forecast.qualification : "-"}</td>
                    </tr>
                    <tr>
                        <th>Experience(In Years)</th>
                        <td>{forecast.experience}</td>
                    </tr>
                    <tr>
                    <th>Approved No of Resources</th>
                    <td>
                        <FormGroup>
                            <input name="appnoofresources" type="number" className="form-control" defaultvalue={forecast.appnoofresources}
                              onChange={(e) => {
                                this.setState({
                                    appnoofresources: e.target.value
                                });
                            }}/>
                        </FormGroup>
                        </td> 
                    </tr>
                    </tbody>
                </table>

                    <hr />
                    <Anchor onClick={() => {
                        this.updateStatus(forecast.id, "APPROVED", "APPROVED");
                    }} className="btn btn-primary">Approve Request</Anchor>
                    &nbsp;
                    <Anchor onClick={() => {
                        this.updateStatus(forecast.id, "REJECTED", "REJECTED");
                    }} className="btn btn-warning">Reject</Anchor>
                </>}

            </div>
        )
    }
}
