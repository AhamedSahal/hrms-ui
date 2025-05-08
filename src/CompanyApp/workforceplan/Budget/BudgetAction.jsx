import { name } from 'file-loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateStatus } from './service';


export default class BudgetAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,
            budget: props.budget || {
                id: 0,
                departmentId: 0,
                department: {
                    id: 0
                },
                name: "",
                persons: 0,
                appnoofresources: 0,
            },
            status: props.status || "APPROVED",
        }
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.budget && nextProps.budget != prevState.budget) {
            return ({ budget: nextProps.budget })
        } else if (!nextProps.budget) {
            return ({
                budget: {
                    id: 0,
                    departmentId: 0,
                    department: {
                        id: 0
                    },
                    name: "",
                    persons: 0

                },
                status: this.props.status || "APPROVED"
            })
        }

        return null;
    }
    updateStatus = (id) => {
        updateStatus(id, this.state.appnoofresources, this.state.status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    render() {
        const { budget } = this.state;
        budget.departmentId = budget.department?.id;
        return (
            <div>
                {budget &&
                    <div>
                        <div className="row">
                            <div className="col-md-4">
                                <FormGroup>
                                    <label>Department</label>
                                    <input name="departmentname" className="form-control" value={budget.department?.name} />
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup>
                                    <label>Job Title</label>
                                    <input name="name" className="form-control" value={budget.name} />
                                </FormGroup>
                            </div>

                            <div className="col-md-4">
                                <FormGroup>
                                    <label>No of Resources</label>
                                    <input name="persons" className="form-control" value={budget.persons} />
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Approved no of resources
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input name="appnoofresources" type="number" className="form-control" defaultValue={budget.appnoofresources}
                                        onChange={(e) => {
                                            this.setState({
                                                appnoofresources: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Status
                                        <span style={{ color: "red" }}>*</span>
                                    </label><br />
                                    <div className="form-control">
                                        <label className='mr-2'> <input name="status" type="radio" value="1" checked /> Approve</label>
                                        <label> <input name="status" type="radio" value="2" onChange={(e) => {
                                            this.setState({
                                                status: e.target.checked ? "REJECTED" : "APPROVED",
                                                appnoofresources: e.target.checked ? 0 : this.state.appnoofresources
                                            });
                                        }} /> Reject</label>

                                    </div>
                                </FormGroup>
                            </div>

                        </div>
                        <hr />
                        <Anchor onClick={() => {
                            this.updateStatus(budget.id);
                        }} className="btn btn-primary">Submit</Anchor>
                    </div>}
            </div>
        )
    }
}
