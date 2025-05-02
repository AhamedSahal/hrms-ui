import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import OvertimeReport from './customReport';
import OvertimeDetailReport from './DetailReport';
import OvertimeStatusReport from './StatusReport';
const { Header, Body, Footer, Dialog } = Modal;


export default class OvertimeReportLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            overtimeReport: 0,
            q: "",
        };
    }

    componentDidMount() {
        // this.fetchList();
    }

    render() {
        let {overtimeReport} = this.state;

        return (
            <div className="reportInsidePageDiv">
            <div className="page-containerDocList content container-fluid" style={{marginTop: "20px"}}>
                <div className="row" style={{padding: "20px 50px 20px 50px"}}>
                <div className="col-sm-4 col-md-8"></div>
                <div className="col-sm-4 col-md-4" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                    <label htmlFor="" style={{padding: "10px",fontSize: "large"}}>Report: </label>
                    <select className="form-control" defaultValue={this.state.closeYear}
                        onChange={e => {
                            this.setState({ overtimeReport: e.target.value })
                        }}>
                        <option value="0">Select Report</option>
                        <option value="1">Detail Report</option>
                        <option value="2">Status Report</option>
                        <option value="3">Custom Report</option>
                    </select>
                </div>
                <div>
                <div className='mt-3'>
                  {overtimeReport == 0 && 
                     <div className="alert alert-warning alert-dismissible fade show" role="alert">
                          <span>Please select report...</span>                    
                    </div>
                  }
              </div>
                </div>
                </div>

                 {overtimeReport == 1 && <OvertimeDetailReport></OvertimeDetailReport>}
                 {overtimeReport == 2 && <OvertimeStatusReport></OvertimeStatusReport>} 
                {overtimeReport == 3 && <OvertimeReport></OvertimeReport>}
            </div>
            </div>
        );
    }
}
