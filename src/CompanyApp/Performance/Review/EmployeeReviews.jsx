import React, { Component } from 'react';
import { Empty, Popover, Progress, Slider, Tooltip } from 'antd';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';
import { FcHighPriority, FcLowPriority, FcMediumPriority } from 'react-icons/fc';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getReadableDate, convertToUserTimeZone } from '../../../utility';
import { formatDistanceToNow, parse } from "date-fns";
import { getReviewsByEmpId, getReviewsByEmpIdAndDate } from './service';
import PerformanceReviewDetailsForm from './detailsForm';
import PerformanceReviewReportDetailsForm from '../Report/detailsForm';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const { Header, Body, Footer, Dialog } = Modal;

export default class EmployeesReviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            reviewData: [],
            filteredData: 'all',
            hasMore: true,
            totalLength: 0,
            size: 0,
            page: 0,
            sort: "id,desc",
            visiblePopover: {},
            expandedRows: {},
            lastUpdatedTime: "2025-06-25",
            addReviewId: null,

            showReviewForm: false,
            reviewId: null
        };
    }

    componentDidMount() {
    
        if (this.props.reviewData) {
            this.setState({
                employeeId: this.props.reviewData?.item?.id,
                employeeName: this.props.reviewData?.item?.name
            });
        }
        this.fetchList();
    }

    fetchList = () =>{

        getReviewsByEmpId(this.props.reviewData?.item?.id).then((res) => {
         
            this.setState({
                data: res.data
            })
        }
        ).catch((err) => {
            console.error("Error fetching reviews data:", err);
        });
    }

    hideReviewForm = () => {
        this.setState({
            showReviewForm: false,
            reviewId: null
        });
    };

    showAlert = (status) => {
        if (status === 'submit') {
            console.log('Review submitted successfully');
            // Add any alert logic you need
        }
    };

    openReviewDetails = (item) => {
        this.setState({
            showReviewForm: true,
            reviewId: item.id
        });
    };

    handleFilteredData = (filteredData) => {
        return null;
    }

    RelativeTime = (timestamp) => {
        if (timestamp != null && timestamp != "") {
            let date = getReadableDate(timestamp);
            let time = convertToUserTimeZone(timestamp);
            let dateAndTime = date + "-" + time;
            let parsedDate = parse(dateAndTime, "dd-MM-yyyy-hh:mm a", new Date());
            const formattedTime = formatDistanceToNow(new Date(parsedDate), {
                addSuffix: true,
            });
            this.setState({ lastUpdatedTime: formattedTime });
        }
    };

    render() {
        const { data, filteredData, hasMore, dashboard, lastUpdatedTime } = this.state;

        return (
            <div className="p-0 content container-fluid">
                <div className='goalPageHead' id='page-head'>
                    <div className='goalHeader-container'>
                        <div className="goalHeaderInnerContent-section d-flex column">
                            <div style={{ display: 'flex', justifySelf: 'right' }}>
                                <p onClick={() => this.props.onBack()} className="goalsViewHeaderBtn">
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
                                </p>
                            </div>
                        </div>
                        <div className="checklistTaskHeader-left">
                            <EmployeeProfilePhoto className="checklistTaskProf" id={this.props.reviewData?.item?.name} />
                            <div className="checklistTaskHeader-details">
                                <span className="checklistTaskHeader-name">{this.props.reviewData?.item.fullName}</span>
                                <span className="checklistTaskHeader-title">{this.props.reviewData?.item.employeeId}</span>
                            </div>
                        </div>
                    </div>
                    <InfiniteScroll
                        dataLength={this.state.size}
                        next={this.fetchList}
                        hasMore={hasMore}
                        loader={<h4 style={{ marginTop: '11px', textAlign: 'center' }}></h4>}
                        endMessage={
                            null
                        }
                    >
                        <div className="Goals_table-container">
                            <table className="goals-table">
                                <thead>
                                    <tr>
                                        <th>Cycle Name</th>
                                        <th>Cycle Period</th>
                                        <th>Instance Name</th>
                                        <th>Instance Start</th>
                                        <th>Instance End</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 ? null : (
                                        <tr>
                                            <td colSpan="6">
                                                <Empty />
                                            </td>
                                        </tr>
                                    )}
                                    {data?.map((item) => {
                                        
                                        const isExpanded = this.state.expandedRows[item.id];
                                        return (
                                            <>
                                                <tr className='Goals_table_row' key={item.id}>
                                                    <td>{item.reviewCycleName?item.reviewCycleName:"Review Cycle W/O"}</td>
                                                    <td>{`${getReadableDate(item.totalRangeFromDate)} - ${getReadableDate(item.totalRangeToDate)}`}</td>
                                                    <td>{item.reviewCycleInstanceName?item.reviewCycleInstanceName:"Review Cycle W/O"}</td>
                                                    <td>{getReadableDate(item.fromDate)}</td>
                                                    <td>{getReadableDate(item.toDate)}</td>
                                                    <td>{!item.submitedByEmployee?"Draft":item.submitedByReviewer?"Complete":"Review Pending"}</td>
                                                    {/* <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => item.status === "complete"
                                                                                ? this.openReviewReportDetails(item)
                                                                                : this.openReviewDetails(item)}
                                                            title="View Review Details"
                                                        >
                                                            <i className="fa fa-eye"></i> {item.status === "complete" ? "Report" : "View"}
                                                        </button>
                                                    </td> */}

                                                <td>
                                                <Link
                                                    to={
                                                    (item.submitedByEmployee && item.submitedByReviewer)
                                                        ? {
                                                            pathname: '/app/company-app/performance/report/details/' + item.id,
                                                            state: { empId: this.props.reviewData?.item?.id },
                                                        }
                                                        : "#"
                                                    }
                                                    onClick={(e) => {
                                                    if  (!(item.submitedByEmployee && item.submitedByReviewer)) {
                                                        e.preventDefault();
                                                        this.openReviewDetails(item); 
                                                    }
                                                    }}
                                                    className="btn btn-sm btn-primary"
                                                    title={(item.submitedByEmployee && item.submitedByReviewer) ? "View Review Details" : "View Report"}
                                                >
                                                    <i className="fa fa-eye"></i> {(item.submitedByEmployee && item.submitedByReviewer) ? "Report" : "View"}
                                                </Link>
                                                </td>

                                                </tr>
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </InfiniteScroll>
                </div>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showReviewForm} onHide={this.hideReviewForm} >
                    <Header closeButton>
                        <h5 className="modal-title"> Performance Review</h5>
                    </Header>
                    <Body>
                        <PerformanceReviewDetailsForm showAlert={this.showAlert} hideReviewForm={this.hideReviewForm} reviewId={this.state.reviewId}>
                        </PerformanceReviewDetailsForm>
                    </Body>
                </Modal>

              
                
            </div>
        );
    }
}