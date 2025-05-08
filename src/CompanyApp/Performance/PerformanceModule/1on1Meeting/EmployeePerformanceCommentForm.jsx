import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { createOneOnOneEvaluvationForm } from './service';
import { get1On1ViewList } from './service';

export default class EmployeePerformanceCommentForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            evaluvation: {
                id:  0,
                currentPerformancelevel: null,
                hiddenComments: '',
                reviewerComment: '',
                employeeComments: ''
                // rescheduleId: props.rescheduleId 
            },
            data: [],
            meetingType: 0,
            self: props.self || false,
            evaluvationId: 0


        }

    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        get1On1ViewList(this.props.meetingId).then(res => {
            if (res.status == "OK") {
                this.setState({ data: res.data[0], evaluvationId:res.data[0].evaluvationId})

            }

        });

    }


    save = (data, action) => {
        action.setSubmitting(true);
        console.log("datadata", this.state.evaluvationId)
        createOneOnOneEvaluvationForm(data,this.state.evaluvationId).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Review");

            action.setSubmitting(false);
        })
    }
    render() {
        let {data} = this.state;

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.evaluvation}
                    onSubmit={this.save}
                // validationSchema={PerformanceReviewSchema}
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
                    }) => (
                        <Form>



                            {/* employee */}
                            <div className="row">
                              <div className="row"> 
                            <div className="col-md-6">
                            <label>Current Performance Level</label>
                            <h4> {data.currentPerformanceLevel == 0 ? "Needs Improvement" : data.currentPerformanceLevel == 1 ? "Upto Par" : data.currentPerformanceLevel == 2 ? "OutStanding" : "-"}</h4>
                            </div>
                            <div className="col-md-6">
                            <label>Reviewer Comment</label>
                            <h4> {data.reviewerComment}</h4>
                            </div>
                            </div>
                                {/* Hidden Comments  */}
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>Employee Comments</label>
                                        <Field name={'description'} defaultValue={this.state.employeeComments}
                                            onChange={e => {
                                                setFieldValue("employeeComments", e.target.value)
                                                // this.setState({ hiddenComments: e.target.value })
                                            }}
                                            component="textarea" rows="4"
                                            className="form-control"
                                            placeholder="Description"
                                            maxLength="250"
                                        >
                                        </Field>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col">
                                    <input type="submit" className="btn btn-primary" value="Save" />
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
