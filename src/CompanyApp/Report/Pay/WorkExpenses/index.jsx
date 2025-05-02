import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import WorkExpensesReport from './Custom';
import WorkExpensesStatusReport from './StatusReport';
import WorkExpensesDetailReport from './DetailReport';
const { Header, Body, Footer, Dialog } = Modal;


export default class WorkExpensesReportLanding extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            workExpenses: 0,
            q: "",
        };
    }

    componentDidMount() {
        // this.fetchList();
    }

    render() {
        let {workExpenses} = this.state;

        return (
            <div className="reportInsidePageDiv">
            <div className="page-containerDocList content container-fluid" style={{marginTop: "20px"}}>
                <div className="row" style={{padding: "20px 50px 20px 50px"}}>
                <div className="col-sm-4 col-md-8"></div>
                <div className="col-sm-4 col-md-4" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>

                    <label htmlFor="" style={{padding: "10px",fontSize: "large"}}>Report: </label>
                    <select className="form-control" defaultValue={this.state.closeYear}
                        onChange={e => {
                            this.setState({ workExpenses: e.target.value })
                        }}>
                        <option value="0">Select Report</option>
                        <option value="1">Detail Report</option>
                        <option value="2">Status Report</option>
                        <option value="3">Custom Report</option>
                    </select>
                </div>
                <div>
                <div className='mt-3'>
                  {workExpenses == 0 && 
                     <div className="alert alert-warning alert-dismissible fade show" role="alert">
                          <span>Please select report...</span>                    
                    </div>
                  }
              </div>
                </div>
                </div>

                 {workExpenses == 1 && <WorkExpensesDetailReport></WorkExpensesDetailReport>}
                 {workExpenses == 2 && <WorkExpensesStatusReport></WorkExpensesStatusReport>} 
                {workExpenses == 3 && <WorkExpensesReport></WorkExpensesReport>}
            </div>
            </div>
        );
    }
}
