import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../../utility';
import { DatePicker } from 'antd';
const { Header, Body, Footer, Dialog } = Modal;


export default class PayHubReport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            q: "",
            revenueId: "",
            industryId: "",
            regionId: "",
            subRegionId: "",
            startYear: '',
            endYear: '',
            payComponent: '',
            targetPercentail: '',
        };
    }

    // componentDidMount() {
    //     this.fetchList();
    // }
    // fetchList = () => {

    //     getPayHubReport(this.state.revenueId, this.state.industryId, this.state.regionId, this.state.q, this.state.subRegionId, this.state.startYear, this.state.endYear).then(response => {
    //         let data = response.data;
    //         this.setState({
    //             data
    //         }, () => {
    //             this.setAllChecked(true);
    //         })
    //     })

    // }



    render() {

        let selectedData = [];

        return (
            <div className="insidePageDiv">
                <Helmet>
                    <title>Payhub Report | {getTitle()}</title>
                    <meta name="description" content="Login page" />
                </Helmet>
                {/* Page Content */}
                <div className="page-containerDocList content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Pay Hub Report</h3>
                                <ul hidden className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                    <li className="breadcrumb-item">Report</li>
                                    <li className="breadcrumb-item active">Pay Hub Report</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="card p-2">
                        <div className="row">
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <DatePicker className="form-control" onChange={(date, dateString) => {
                                        this.setState({
                                            startYear: dateString
                                        })
                                    }} picker="year" />
                                    <label className="focus-label">From Year</label>
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <DatePicker className="form-control" onChange={(date, dateString) => {
                                        this.setState({
                                            endYear: dateString
                                        })
                                    }} picker="year" />
                                    <label className="focus-label">To Year</label>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <select onChange={e => {
                                        this.setState({
                                            industryId: e.target.value
                                        })
                                    }}  className="form-control" >
                                        <option value="">Select Region</option>
                                        <option value="1">Saudi Arabia</option>
                                        <option value="2" >Qatar</option>
                                        <option value="3" >UAE</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <select onChange={e => {
                                        this.setState({
                                            industryId: e.target.value
                                        })
                                    }}  className="form-control" >
                                        <option value="">Select Sub-Region</option>
                                        <option value="1">Dubai</option>
                                        <option value="2" >Ajman</option>
                                        <option value="3" >Abudhabi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <select onChange={e => {
                                        this.setState({
                                            industryId: e.target.value
                                        })
                                    }}  className="form-control" >
                                        <option value="">Select Industry</option>
                                        <option value="1">Oil & Gas</option>
                                        <option value="2" >Finance Management</option>
                                        <option value="3" >Software</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <select onChange={e => {
                                        this.setState({
                                            industryId: e.target.value
                                        })
                                    }}  className="form-control" >
                                        <option value="">Select Revenue</option>
                                        <option value="1">Oil & Gas</option>
                                        <option value="2" >Finance Management</option>
                                        <option value="3" >Software</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <select onChange={e => {
                                        this.setState({
                                            payComponent: e.target.value
                                        })
                                    }} className="form-control" >
                                        <option value="">Select Pay Component</option>
                                        <option value="1">Basic Salary </option>
                                        <option value="2" >Total Fixed Cash</option>
                                        <option value="3" >Total Earnings</option>
                                        <option value="4" >Total Package</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-sm-6 col-md-4">
                                <div className="form-group form-focus">
                                    <select onChange={e => {
                                        this.setState({
                                            targetPercentail: e.target.value
                                        })
                                    }}  className="form-control" >
                                        <option value="">Select Target Percentail</option>
                                        <option value="1">P-25</option>
                                        <option value="2" >P-50</option>
                                        <option value="3" >P-75</option>
                                        <option value="4" >P-90</option>
                                    </select>
                                </div>
                            </div>



                            <div className="col-md-2">
                                <a href="#" onClick={() => {
                                    this.fetchList();
                                }} className="btn btn-success btn-block"> Search </a>
                            </div>

                        </div>
                        <div className='mt-3'>
                            {selectedData && selectedData.length == 0 &&
                                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                    <span>No Data Found</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}
