import React, { Component } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Tooltip, styled } from '@mui/material';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';




export default class Competencies extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render() {
        const MeetingDashboardTooltip = styled(({ className, ...props }) => (
            <Tooltip {...props} componentsProps={{ tooltip: { className: className } }} />
        ))(`
              color: black;
              background-color: #ededed;
              font-size: 1em;
              width: 19em;
              box-shadow: 0px 0px 2px 0px;
          `);

        const name = ['Arun', 'Danial', ' George', 'Will Smith', 'Kareem', 'Danial Krinakumar Krinakumar']

        return (
            <div className="">


                <div className='threeBoxBody'>
                    <span style={{ fontSize: '18px', fontWeight: 700 }} className='ySide'>Competencies Rating</span>

                    <div style={{ height: '1em' }} className="nine-box-container">
                        <div style={{background: '#8EFED4'}} className="threeBox quadrant-1"> <span className='boxHeader'>Low</span>
                            <div className='d-flex flex-wrap'>
                                {name.slice(3,6).map(item => (
                                    <>
                                        <MeetingDashboardTooltip title={
                                            <div>
                                                <div className='pt-2 pb-2'>
                                                    <div className='float-left'>
                                                        <EmployeeProfilePhoto className='poolImg' id={20}></EmployeeProfilePhoto>
                                                    </div>
                                                    <div className='ml-2 float-left'>
                                                        <span className='font-weight-bold'>Danial George</span> <br />
                                                        <span>Finance Manager</span>
                                                    </div>
                                                </div> <br />
                                                <div className='ratingBody'>
                                                    <span className='font-weight-bold'>Overal competencies Rating :</span> <br />
                                                    <div className='ratingContent'>
                                                        <span>Current Rating 3 - Meet all expectation</span><br />
                                                        <span>initial Rating 4 - Exceed expectation</span><br />
                                                    </div>
                                                </div>
                                            </div>
                                        }>

                                            <div className='m-1 col-md-5 threeBoxCandidates'>
                                                <span><EmployeeProfilePhoto className='candidateImg' id={20}></EmployeeProfilePhoto></span>
                                                <span>{item}</span>
                                            </div>
                                        </MeetingDashboardTooltip>
                                    </>
                                ))}
                            </div>
                        </div>
                        <div style={{background: '#32CF94'}} className="threeBox quadrant-2">
                            <span className='boxHeader'>Medium</span>
                            <div className='d-flex flex-wrap'>
                                {name.slice(1,2).map(item => (
                                    <MeetingDashboardTooltip title={
                                        <div>
                                            <div className='pt-2 pb-2'>
                                                <div className='float-left'>
                                                    <EmployeeProfilePhoto className='poolImg' id={20}></EmployeeProfilePhoto>
                                                </div>
                                                <div className='ml-2 float-left'>
                                                    <span className='font-weight-bold'>Danial George</span> <br />
                                                    <span>Finance Manager</span>
                                                </div>
                                            </div> <br />
                                            <div className='ratingBody'>
                                                <span className='font-weight-bold'>Overal Performance Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 3 - Meet all expectation</span><br />
                                                    <span>initial Rating 4 - Exceed expectation</span><br />
                                                </div>
                                            </div>
                                        </div>
                                    }>
                                        <div className='m-1 col-md-5 nineBoxCandidates'>
                                            <span><EmployeeProfilePhoto className='candidateImg' id={19}></EmployeeProfilePhoto></span>
                                            <span>{item}</span>
                                        </div>
                                    </MeetingDashboardTooltip>
                                ))}
                            </div>
                        </div>
                        <div style={{background: '#188C60'}} className="threeBox quadrant-3"> <span className='boxHeader'>High</span>
                            <div className='d-flex flex-wrap'>
                                {name.slice(0,0).map(item => (
                                    <MeetingDashboardTooltip title={
                                        <div>
                                            <div className='pt-2 pb-2'>
                                                <div className='float-left'>
                                                    <EmployeeProfilePhoto className='poolImg' id={20}></EmployeeProfilePhoto>
                                                </div>
                                                <div className='ml-2 float-left'>
                                                    <span className='font-weight-bold'>Danial George</span> <br />
                                                    <span>Finance Manager</span>
                                                </div>
                                            </div> <br />
                                            <div className='ratingBody'>
                                                <span className='font-weight-bold'>Overal Performance Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 3 - Meet all expectation</span><br />
                                                    <span>initial Rating 4 - Exceed expectation</span><br />
                                                </div>
                                            </div>
                                        </div>
                                    }>
                                        <div className='m-1 col-md-5 nineBoxCandidates'>
                                            <span><EmployeeProfilePhoto className='candidateImg' id={19}></EmployeeProfilePhoto></span>
                                            <span>{item}</span>
                                        </div>
                                    </MeetingDashboardTooltip>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
}