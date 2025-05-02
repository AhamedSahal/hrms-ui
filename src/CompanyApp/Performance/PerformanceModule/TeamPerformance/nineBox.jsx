import React, { Component } from 'react';
import { FormGroup, Modal, Anchor } from 'react-bootstrap';
import { Tooltip, styled } from '@mui/material';


export default class TeamPerformNineBox extends Component {
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
                <div className='teamPerform_nineBoxBody'>
                    <span style={{marginLeft: '-30px', fontSize: '18px', fontWeight: '600' }}>Nine box Metrix -Team</span>
                    <div style={{ alignContent: 'center', float: 'right' }}>
                        <Anchor className='performDownloadIcon' onClick={this.generatePDF} >
                            <i className='fa fa-download'></i> Download
                        </Anchor>
                    </div>
                    <span style={{ fontSize: '15px' }} className='performXSideHead'>Potential Assessment</span>
                    <span style={{ fontSize: '15px' }} className='ySide'>Performance Assessment</span>
                    <div className='teamPerform_xBoxText'>
                        <span>Low</span>
                        <span className='xMedium'>Medium</span>
                        <span>High</span>
                    </div>
                    <div className='perform_yBoxText'>
                        <span>Low</span>
                        <span className='teamPerform_yMedium'>Medium</span>
                        <span>High</span>
                    </div>
                    <div className="mt-3 nine-box_teamPerform">

                        <div className=" teamPerformBox-1">
                            <div>
                                <span className='perform9boxHead'>Rough Diamond</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#c18e02', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>Low performance / High potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#ffeebf' }} className='performEmpCountText'>
                                <span>4 Employee</span>
                            </div>
                        </div>
                        <div className="teamPerformBox-2">
                            <div>
                                <span className='perform9boxHead'>Future Star</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#1fa951', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>Medium Performance / High Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#b9dfc7' }} className='performEmpCountText'>
                                <span>5 Employee</span>
                            </div>

                        </div>
                        <div className="teamPerformBox-3">
                            <div>
                                <span className='perform9boxHead'>Consistent Star</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#01703b', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>High Performance / High Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#7ec5a3' }} className='performEmpCountText'>
                                <span>6 Employee</span>
                            </div>
                        </div>
                        {/* testing part */}
                        <div className="teamPerformBox-4">
                            <div>
                                <span className='perform9boxHead'>Inconsistend Player</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#b73436', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>Low Performance / Medium Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#edabab' }} className='performEmpCountText'>
                                <span>5 Employee</span>
                            </div>
                        </div>
                        <div className="teamPerformBox-5">
                            <div>
                                <span className='perform9boxHead'>Key Player</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#c18e02', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>Medium Performance / Medium Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#ffeebf' }} className='performEmpCountText'>
                                <span>9 Employee</span>
                            </div>
                        </div>
                        <div className="teamPerformBox-6">
                            <div>
                                <span className='perform9boxHead'>Current Star</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#1fa951', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>High Performance / Medium Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#b9dfc7' }} className='performEmpCountText'>
                                <span>2 Employee</span>
                            </div>
                        </div>
                        <div className="teamPerformBox-7">
                            <div>
                                <span className='perform9boxHead'>Talent Risk</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#850000', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>Low Performance / Low Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#df6c6c' }} className='performEmpCountText'>
                                <span>6 Employee</span>
                            </div>
                        </div>
                        <div className="teamPerformBox-8">
                            <div>
                                <span className='perform9boxHead'>Solid Professional</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#b73436', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>Medium Performance / Low Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#edabab' }} className='performEmpCountText'>
                                <span>5 Employee</span>
                            </div>
                        </div>
                        <div className="teamPerformBox-9">
                            <div>
                                <span className='perform9boxHead'>High Professional</span>
                            </div>
                            <div style={{ textAlign: '-webkit-center', color: '#c18e02', fontSize: '11px' }} className='p-0 performEmpCountText'>
                                <span>High Performance / Low Potential</span>
                            </div>
                            <div style={{ fontWeight: 600, backgroundColor: '#ffeebf' }} className='performEmpCountText'>
                                <span>3 Employee</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        )
    }
}