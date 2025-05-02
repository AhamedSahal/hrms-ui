import React, { Component } from 'react';
import { FormGroup, Modal } from 'react-bootstrap';
import { Tooltip, styled } from '@mui/material';


export default class OrgPerformNineBox extends Component {
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


        const candidates = [{ id: 19, name: 'John Rose', potential: 1, performance: 1 },
        { id: 23, name: 'Arun', potential: 1, performance: 2 },
        { id: 29, name: 'Will Smith', potential: 1, performance: 3 },
        { id: 26, name: 'Richard Mike', potential: 3, performance: 1 },
        { id: 25, name: 'Ajay Kumar', potential: 5, performance: 3 },
        { id: 24, name: 'Danial George', potential: 4, performance: 2 }]

        const name = ['Arun', 'Danial', 'Kive George', 'Will Smith', 'Kareem', 'Danial Krinakumar Krinakumar']



        return (
            <div className="">
                <div className='orgPerform_nineBoxBody'>
                    <span style={{ fontSize: '15px' }} className='OrgXSideHead'>Potential</span>
                    <span style={{ fontSize: '15px' }} className='ySide'>Performance</span>
                    <div className='perform_xBoxText'>
                        <span>Low</span>
                        <span className='xMedium'>Medium</span>
                        <span>High</span>
                    </div>
                    <div className='perform_yBoxText'>
                        <span>Low</span>
                        <span className='orgPerform_yMedium'>Medium</span>
                        <span>High</span>
                    </div>
                    <div className="orgNine-box-container">

                        <div className="orgBox-1">
                            <div>
                                <span className='perform9boxHead'>Rough Diamond</span>
                            </div>
                            <span style={{fontSize: '18px'}}>7%</span>
                            <div style={{ color: '#c18e02' , fontSize: '11px'}} className='p-0 performEmpCountText'>
                                <span>Low performance / High potential</span>
                            </div>
                        </div>
                        <div className="orgBox-2">
                            <div>
                                <span className='perform9boxHead'>Future Star</span>
                            </div>
                            <span style={{fontSize: '18px'}}>7%</span>
                            <div style={{ color: '#1fa951', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                <span>Medium Performance / High Potential</span>
                            </div>

                        </div>
                        <div className="orgBox-3">
                            <div>
                                <span className='perform9boxHead'>Consistent Star</span>
                            </div>
                            <span style={{fontSize: '18px'}}>16%</span>
                            <div  style={{ color: '#01703b', fontSize: '11px'}}  className='p-0 performEmpCountText'>
                                <span>High Performance / High Potential</span>
                            </div>
                        </div>
                        {/* testing part */}
                        <div className="orgBox-4">
                            <div>
                                <span className='perform9boxHead'>Inconsistend Player</span>
                            </div>
                            <span style={{fontSize: '18px'}}>15%</span>
                            <div style={{ color: '#b73436', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                <span>Low Performance / Medium Potential</span>
                            </div>
                        </div>
                        <div className="orgBox-5">
                            <div>
                                <span className='perform9boxHead'>Key Player</span>
                            </div>
                            <span style={{fontSize: '18px'}}>7%</span>
                            <div style={{ color: '#c18e02', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                <span>Medium Performance / Medium Potential</span>
                            </div>
                            </div>
                            <div className="orgBox-6">
                                <div>
                                    <span className='perform9boxHead'>Current Star</span>
                                </div>
                                <span style={{fontSize: '18px'}}>20%</span>
                                <div style={{ color: '#1fa951', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                    <span>High Performance / Medium Potential</span>
                                </div>
                            </div>
                            <div className="orgBox-7">
                                <div>
                                    <span className='perform9boxHead'>Talent Risk</span>
                                </div>
                                <span style={{fontSize: '18px'}}>16%</span>
                                <div style={{ color: '#850000', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                    <span>Low Performance / Low Potential</span>
                                </div>
                            </div>
                            <div className="orgBox-8">
                                <div>
                                    <span className='perform9boxHead'>Solid Professional</span>
                                </div>
                                <span style={{fontSize: '18px'}}>9%</span>
                                <div style={{ color: '#b73436', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                    <span>Medium Performance / Low Potential</span>
                                </div>
                            </div>
                            <div className="orgBox-9">
                                <div>
                                    <span className='perform9boxHead'>High Professional</span>
                                </div>
                                <span style={{fontSize: '18px'}}>7%</span>
                                <div style={{ color: '#c18e02', fontSize: '11px'}} className='p-0 performEmpCountText'>
                                    <span>High Performance / Low Potential</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                )
    }
}