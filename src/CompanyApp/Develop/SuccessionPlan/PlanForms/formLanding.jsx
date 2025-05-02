import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import PlanInfo from './planInfo/form.jsx';
import AddOwner from './addOwner/index.jsx';
import AddCandidates from './addCandidates/index.jsx';


export default class SuccessionPlanFormLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            candidates: false,
            ownerForm: false,
            poolShowForm: false,
            screenNum: 0,



        };
    }
    getStyle(text) {
        if (text === true) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === false) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'null';
    }

    nextForm = (value) => {

        if (value === 1) {
            this.setState({ candidates: true })
        } else if (value === 2) {
            this.setState({ ownerForm: true })
        }
    }



    render() {
        const { candidates, ownerForm, screenNum } = this.state
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const infoId = this.props.location?.state?.isPlan

        return (
            <div  className='planNewForm page-container content container-fluid' >
                <div >
                    <div className='addPlanForm' >
                        <div style={{
                            borderBottom: ' 1px solid #c7c7c7',
                            marginBottom: '11px'
                        }} className='profileFormHeadContent'>
                            <h3 className='dvlp-left-align'>Plan Info</h3>
                        </div>

                        <div className=''>
                            <PlanInfo planInfo={this.props.location.state} nextForm={this.nextForm} ></PlanInfo>
                        </div>



                    </div>
                </div>
                {candidates || infoId ?
                    <>
                        <AddCandidates nextForm={this.nextForm} ></AddCandidates>
                    </>
                    :
                    <div >
                        <div className='successionPlanFromDisable'>
                            <h3 style={{color: 'grey'}} className='dvlp-left-align'>Candidates</h3>
                        </div>
                    </div>
                }
                {ownerForm || infoId ?
                    <>
                        <AddOwner nextForm={this.nextForm}></AddOwner>
                    </>

                    :
                    <div >
                        <div className='successionPlanFromDisable'>
                            <h3 style={{color: 'grey'}} className='dvlp-left-align'>Owners</h3>

                        </div>
                    </div>
                }
            </div>
        )
    }
}