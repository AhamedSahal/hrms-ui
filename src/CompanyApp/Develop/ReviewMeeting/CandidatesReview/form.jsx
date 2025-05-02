import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import { saveTalentCandidateReview } from "./service";


const data =
    [
        {
            id: 0, planName: 'Marketing Director',
            candidates: [{ name: 'Danial George', id: 21 }, { name: "Richard Mike", id: 22 }, { name: "Jason Roy", id: 23 }],
            planType: { id: 1, name: 'Position' },
            date: '20-10-2024', members: '5', status: 'Active',
            description: 'Define the key people in finance organization',
            isPlan: true
        },

    ]

export default class CandidateReview extends Component {
    constructor(props) {
        super(props);
        const initialReviews = data[0].candidates.map(candidate => ({
            id: candidate.id,
            employeeId: candidate.id,
            name: candidate.name,
            perfomanceRating: '',
            potentialRating: '',
            impactofLoss: '',
            goalRating: '',
            competenciesRating: '',
            riskofLoss: '',
            reviewMeetingId: this.props.reviewMeetingData || 0
        }));
        this.state = {
            data: [],
            candidates: [],
            reviews: initialReviews,
            candidateReview: props.candidateReview || {
                id: 0,

            },
        };
    }

    // componentDidMount() {
    //     this.fetchList();
    //   }
    //   fetchList = () => {
    // const planId = this.props.successionId
    //     getSuccessionPlanList(planId).then(res => {
    //       if (res.status == "OK") {
    //         this.setState({
    //           data: res.data,
    //         })
    //       }
    //     })
    //   }



    handleFieldChange = (employeeId, field, value) => {
        const { reviews } = this.state;
        const updatedReviews = reviews.map(review => {
            if (review.employeeId === employeeId) {
                return { ...review, [field]: value };
            }
            return review;
        });

        this.setState({ reviews: updatedReviews });
    };



    handleSaveReviews = (action) => {
        const { reviews } = this.state
        // saveTalentCandidateReview(review).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     if (res.status == "OK") {
        //         setTimeout(function () {
        //             window.location.reload()
        //         }, 6000)
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     toast.error("Error while saving Candidate review");

        //     action.setSubmitting(false);
        // })
    };


    render() {
        const { reviews } = this.state;


        return (



            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.candidateReview}
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
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Perfomance Rating</th>
                                            <th scope="col">Potential Rating</th>
                                            <th scope="col">Risk of Loss</th>
                                            <th scope="col">Impact of Loss</th>
                                            <th scope="col">Goals Rating</th>
                                            <th scope="col">Competencies Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.map(item => (
                                            <tr key={item.employeeId}>
                                                <th>{item.name}</th>
                                                <td>
                                                    <select
                                                        className="form-control"
                                                        onChange={(e) => this.handleFieldChange(item.employeeId, 'perfomanceRating', e.target.value)}
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="1">5 Point</option>
                                                        <option value="2">4 Point</option>
                                                        <option value="3">3 Point</option>
                                                        <option value="4">2 Point</option>
                                                        <option value="5">1 Point</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        onChange={(e) => this.handleFieldChange(item.employeeId, 'potentialRating', e.target.value)}
                                                        className="form-control"
                                                    >
                                                        <option>Select...</option>
                                                        <option value="1">High</option>
                                                        <option value="2">Mid</option>
                                                        <option value="3">Low</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        onChange={(e) => this.handleFieldChange(item.employeeId, 'riskofLoss', e.target.value)}
                                                        className="form-control"
                                                    >
                                                        <option>Select...</option>
                                                        <option value="1">High</option>
                                                        <option value="2">Mid</option>
                                                        <option value="3">Low</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        onChange={(e) => this.handleFieldChange(item.employeeId, 'impactofLoss', e.target.value)}
                                                        className="form-control"
                                                    >
                                                        <option>Select...</option>
                                                        <option value="1">High</option>
                                                        <option value="2">Mid</option>
                                                        <option value="3">Low</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        onChange={(e) => this.handleFieldChange(item.employeeId, 'goalRating', e.target.value)}
                                                        impactofLoss_
                                                        className="form-control"
                                                    >
                                                        <option>Select...</option>
                                                        <option value="1">5 Point</option>
                                                        <option value="2">4 Point</option>
                                                        <option value="3">3 Point</option>
                                                        <option value="4">2 Point</option>
                                                        <option value="5">1 Point</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        onChange={(e) => this.handleFieldChange(item.employeeId, 'competenciesRating', e.target.value)}
                                                        className="form-control"
                                                    >
                                                        <option>Select...</option>
                                                        <option value="1">5 Point</option>
                                                        <option value="2">4 Point</option>
                                                        <option value="3">3 Point</option>
                                                        <option value="4">2 Point</option>
                                                        <option value="5">1 Point</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <input onClick={this.handleSaveReviews} type="submit" className="btn btn-success" value="Save" />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
