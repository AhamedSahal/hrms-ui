import React, { Component } from 'react';
import { FormGroup, Modal } from 'react-bootstrap';
import { Tooltip, styled } from '@mui/material';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';


export default class PotentialDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAll: false,
        };
    }

    hideForm = () => {
        this.setState({
            showForm: false,
            branch: undefined
        })
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


        const candidates = [{id: 19, name:'John Rose',potential: 1, performance: 1},
         {id: 23,name:'Arun',potential: 1, performance: 2},
        {id: 29,name:'Will Smith',potential: 1, performance: 3},
        {id: 26,name:'Richard Mike',potential: 3, performance: 1},
        {id: 25, name:'Ajay Kumar',potential: 5, performance: 3},
        {id: 24,name:'Danial George',potential: 4, performance: 2}]

        const name = ['Arun', 'Danial', 'Kive George', 'Will Smith', 'Kareem', 'Danial Krinakumar Krinakumar']
      


        return (
            <div className="">
                <div className='nineBoxBody'>
                    <span style={{ fontSize: '15px' }} className='xSide'>Potential Rating</span>
                    <span style={{ fontSize: '15px' }} className='ySide'>Overall Performance Rating</span>
                    <div className='xBoxText'>
                        <span>Low</span>
                        <span className='xMedium'>Medium</span>
                        <span>High</span>
                    </div>
                    <div className='yBoxText'>
                        <span>Low</span>
                        <span className='yMedium'>Medium</span>
                        <span>High</span>
                    </div>
                    <div className="nine-box-container">

                        <div className="quadrant-1">
                            <span className='boxHeader'>Potential Gem</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {candidates.slice(0, 0).map((item, index) => (
                                    <MeetingDashboardTooltip key={index} title={
                                        <div>
                                            <div className='pt-2 pb-2'>
                                                <div className='float-left'>
                                                    <EmployeeProfilePhoto className='poolImg' id={item.id}></EmployeeProfilePhoto>
                                                </div>
                                                <div className='ml-2 float-left'>
                                                    <span className='font-weight-bold'>{item.name}</span> <br />
                                                    <span>Finance Manager</span>
                                                </div>
                                            </div> <br />
                                            <div className='ratingBody'>
                                                <span className='font-weight-bold'>Overal Performance Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 3 - Meet all expectation</span><br />
                                                    <span>initial Rating 4 - Exceed expectation</span><br />
                                                </div>
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
                                                </div>
                                            </div>
                                        </div>
                                    }>
                                        <div className='m-1 col-md-5 nineBoxCandidates'>
                                            <span><EmployeeProfilePhoto className='candidateImg' id={item.id}></EmployeeProfilePhoto></span>
                                            <span>{item.name}</span>
                                        </div>
                                    </MeetingDashboardTooltip>
                                ))}
                            </div>
                        </div>
                        <div className="quadrant-2">
                            <span className='boxHeader'>High Potential</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {name.slice(1, 3).map(item => (
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
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
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
                        <div className="quadrant-3">
                            <span className='boxHeader'>Star</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {name.slice(3, 4).map(item => (
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
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
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
                        {/* testing part */}
                        <div className="quadrant-4">
                            <span className='boxHeader'>Inconsistent Player</span>
                            <div>
                                <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                    {name.slice(0, 0).map((item, index) => (
                                        <div key={index} className='m-1 col-md-5 nineBoxCandidates'>
                                            <span><EmployeeProfilePhoto className='candidateImg' id={19} /></span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                                {name.length > 6 && (
                                    <p className='seeMoreBtn' onClick={() => {
                                        this.setState({ showForm: true })
                                    }}>See More</p>
                                )}

                                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm}>

                                    <Modal.Body>
                                        <div className='d-flex flex-wrap'>
                                            {name.map((item, index) => (
                                                <div key={index} className='m-1 col-md-5 nineBoxCandidates'>
                                                    <span><EmployeeProfilePhoto className='candidateImg' id={19} /></span>
                                                    <span>{item}</span>
                                                </div>
                                            ))}
                                        </div></Modal.Body>

                                </Modal>

                            </div>

                        </div>
                        <div className="quadrant-5">
                            <span className='boxHeader'>Core Player</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {name.slice(0, 0).map(item => (
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
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
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
                        <div className="quadrant-6">
                            <span className='boxHeader'>High Performer</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {name.slice(5, 6).map(item => (
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
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
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
                        <div className="quadrant-7">
                            <span className='boxHeader'>Risk</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {name.slice(0, 0).map(item => (
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
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
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
                        <div className="quadrant-8">
                            <span className='boxHeader'>Average Performer</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {name.slice(4, 5).map(item => (
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
                                                <span className='font-weight-bold'>Potential Rating :</span> <br />
                                                <div className='ratingContent'>
                                                    <span>Current Rating 2 - Very Good</span><br />
                                                    <span>initial Rating 2 - Very Good</span>
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
                        <div className="quadrant-9">
                            <span className='boxHeader'>Solid Performer</span>
                            <div style={{ padding: '4px 0px 6px 27px' }} className='d-flex flex-wrap'>
                                {/* {name.slice(0, 3).map(item => (
                                    <div className='m-1 col-md-5 nineBoxCandidates'>
                                        <span><EmployeeProfilePhoto className='candidateImg' id={19}></EmployeeProfilePhoto></span>
                                        <span>{item}</span>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}