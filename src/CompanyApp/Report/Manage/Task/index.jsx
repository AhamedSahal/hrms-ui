import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import TaskReport from './CustomReport';
import TaskStatusReport from './StatusReport';
import TaskSummaryReport from './SummaryReport';
const { Header, Body, Footer, Dialog } = Modal;


export default class TaskReportLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            taskReport: 0,
            q: "",
        };
    }

    componentDidMount() {
        // this.fetchList();
    }

    render() {
        let {taskReport} = this.state;

        return (
            <div className="reportInsidePageDiv">
            <div className="page-containerDocList content container-fluid" style={{marginTop: "20px"}}>
                <div className="row" style={{padding: "20px 50px 20px 50px"}}>
                <div className="col-sm-4 col-md-8"></div>
                <div className="col-sm-4 col-md-4" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                    <label htmlFor="" style={{padding: "10px",fontSize: "large"}}>Report: </label>
                    <select className="form-control" defaultValue={this.state.closeYear}
                        onChange={e => {
                            this.setState({ taskReport: e.target.value })
                        }}>
                        <option value="0">Select Report</option>
                        <option value="1">Summary Report</option>
                        <option value="2">Status Report</option>
                        <option value="3">Custom Report</option>
                    </select>
                </div>
                <div>
                <div className='mt-3'>
                  {taskReport == 0 && 
                     <div className="alert alert-warning alert-dismissible fade show" role="alert">
                          <span>Please select report...</span>                    
                    </div>
                  }
              </div>
                </div>
                </div>

                {taskReport == 1 && <TaskSummaryReport></TaskSummaryReport>}
                {taskReport == 2 && <TaskStatusReport></TaskStatusReport>} 
                {taskReport == 3 && <TaskReport></TaskReport>}
            </div>
            </div>
        );
    }
}
