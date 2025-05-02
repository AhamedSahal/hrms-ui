import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import PotentialDashboard from './potential';
import RiskofLoss from './riskofLoss';
import ImpactofLoss from './impactofLoss';
import { getReviewDashboardList } from './service';
import Competencies from './competencies';




export default class NineBoxDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ratingTypes: '1',
            meetingId: '',
            dashboardEmp: '',
        };
    }

    getCandidateReviewByMeeting = (meetId) => {
        this.setState({ meetingId: meetId })
        // this.fetchList();
    }
    fetchList = () => {
        const { meetingId } = this.state
        getReviewDashboardList(meetingId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    dashboardEmp: res.data.list,
                })
            }
        })
    }

    render() {
        const { ratingTypes } = this.state
        const name = ['Arun', 'Danial', ' George', 'Will Smith', 'Kareem', 'Danial Krinakumar Krinakumar']

        return (
            <div className="">
                <div className='d-flex' style={{ padding: '20px', marginBottom: '30px', justifyContent: 'right' }}>
                    {/* Dropdown need to be bind from review meeting master page */}
                    <FormGroup className='col-md-4'>
                        <select onChange={e => {
                            this.getCandidateReviewByMeeting(e.target.value)
                        }} name='status' className="form-control" >
                            <option value="">Select Review meeting..</option>
                            <option value="1">AU Organization 2024 Talent review meeting</option>
                            <option value="2">Brown Organization 2023 Talent review meeting</option>
                            <option value="3">HR Manager 2024 Talent review meeting</option>

                        </select>
                    </FormGroup>
                    <FormGroup className='col-md-4'>
                        <select onChange={(e) => { this.setState({ ratingTypes: e.target.value }) }} name='status' className="form-control" >
                            <option value="1">Performance Vs Potential</option>
                            <option value="2">Impact of Loss</option>
                            <option value="3">Competencies</option>
                            <option value="4">Risk of Loss</option>
                        </select>
                    </FormGroup>
                </div>
                <>
                    {ratingTypes === '1' && <PotentialDashboard></PotentialDashboard>}
                    {ratingTypes === '3' && <Competencies></Competencies>}
                    {ratingTypes === '4' && <RiskofLoss></RiskofLoss>}
                    {ratingTypes === '2' && <ImpactofLoss></ImpactofLoss>}
                </>
            </div>
        )
    }
}