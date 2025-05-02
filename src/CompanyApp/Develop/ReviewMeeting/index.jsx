import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import TableDropDown from '../../../MainPage/tableDropDown';
import { onShowSizeChange } from '../../../MainPage/paginationfunction';
import { itemRender } from '../../../paginationfunction';
import ReviewMeetingForm from './form';
import { Link } from 'react-router-dom';
import CandidateReview from './CandidatesReview/form';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { deleteTalentReviewMeeting, updateReviewMeetingStatus } from './service';
import ReviewMeetingView from './view';
import { BsSliders } from 'react-icons/bs';
const { Header, Body, Footer, Dialog } = Modal;
const datas =
    [
        {
            id: 1,
            participants: [{
                email: "avinashr@candourootes.com",
                employeeId: "#EMP0000001",
                id: 18,
                name: "Nelson  Luzana",
                phone: "042947129"
            },
            {
                email: "jc@tahpi.net",
                employeeId: "#EMP0000004",
                id: 21,
                name: "Jeahdyn  Acharya",
                phone: "042947129"
            }],
            schedules: {
                startDate: "2024-03-11",
                startTime: "14:45",
                endDate: "2024-03-19",
                endTime: "14:48",
                startReminder: "2",
                endReminder: "1",
            },
            title: 'AU Organization 2024 Talent review meeting',
            topic: 'Sample1', date: '2023-03-21', meetingStatus: '1', successionId: 0,
            location: 'Dubai Branch', submissionDate: '2023-03-21', active: true,
            successionName: 'Marketing Director',
            description: 'Define the key people in finance organization'

        },
        {
            id: 2, title: 'Brown Organization 2023 Talent review meeting',
            participants: [{
                email: "avinashr@candourootes.com",
                employeeId: "#EMP0000001",
                id: 18,
                name: "Nelson  Luzana",
                phone: "042947129"
            },
            {
                email: "jc@tahpi.net",
                employeeId: "#EMP0000004",
                id: 21,
                name: "Jeahdyn  Acharya",
                phone: "042947129"
            }], topic: 'Sample3',
            schedules: {
                startDate: "2023-03-21",
                startTime: "14:45",
                endDate: "2024-03-10",
                endTime: "14:48",
                startReminder: "5",
                endReminder: "6",
            },
            date: '05-10-2024',
            meetingStatus: '2', successionId: 0,
            successionName: 'Marketing Director',
            location: 'Dubai Branch', submissionDate: '2024-03-21',
            active: false,
            description: 'Is simply dummy text of the printing.'
        },
        {
            id: 3, title: 'HR Manager 2024 Talent review meeting',
            participants: [{
                email: "avinashr@candourootes.com",
                employeeId: "#EMP0000001",
                id: 18,
                name: "Nelson  Luzana",
                phone: "042947129"
            },
            {
                email: "jc@tahpi.net",
                employeeId: "#EMP0000004",
                id: 21,
                name: "Jeahdyn  Acharya",
                phone: "042947129"
            }],
            schedules: {
                startDate: "2023-03-21",
                startTime: "14:45",
                endDate: "2024-03-10",
                endTime: "14:48",
                startReminder: "5",
                endReminder: "6",
            },
            topic: 'Sample2', date: '10-12-2024',
            successionName: 'Finacial Manager', successionId: 1, meetingStatus: '3', location: 'Dubai Branch', submissionDate: '2024-08-11', active: true, description: 'when an unknown printer '
        },
    ]

export default class ReviewMeeting extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: datas,
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            successionId: '',
            reviewMeetingData: true
        };
    }

    // componentDidMount() {
    //     this.fetchList();
    // }
    // fetchList = () => {
    //     getTalentReviewMeetingList(this.state.successionId , this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
    //         if (res.status == "OK") {
    //             this.setState({
    //                 data: res.data.list,
    //                 totalPages: res.data.totalPages,
    //                 totalRecords: res.data.totalRecords,
    //                 currentPage: res.data.currentPage + 1,
    //             })
    //         }
    //     })
    // }

    getStyle(text) {
        if (text) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (!text) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'black';
    }
    getTextStyle(text) {
        if (text === '1') {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>;
        }
        if (text === '2') {
            return <span className='p-1 badge bg-inverse-info'><i className="pr-2 fa fa-spinner text-info"></i>In-Progress</span>;
        }
        if (text === '3') {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
        }
        return 'black';
    }

    updateMtgStatus = (meetingId, status) => {
        updateReviewMeetingStatus(meetingId, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
        })
    }
    hideForm = () => {
        this.setState({
            showForm: false,
        })
        this.setState({ showReviewForm: false })
    }
    updateMeetingStatus = (status, text) => {
        const meetingId = text.id
        confirmAlert({
            title: `Update the Meeting Status as ${status}`,
            message: 'Are you sure, you want to update the meeting status?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.updateMtgStatus(meetingId, status);
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    delete = (meeting) => {
        confirmAlert({
            title: `Delete Talent Review Meeting ${meeting.name}`,
            message: 'Are you sure, you want to delete this Talent Review Meeting?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteTalentReviewMeeting(meeting.id).then(res => {
                        if (res.status == "OK") {
                            toast.success(res.message);
                            this.fetchList();
                        } else {
                            toast.error(res.message)
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    hideMeetingView = () => {
        this.setState({
            meetingView: false,
        })
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size, reviewMeetingData } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => {
            const items = [];
            items.push(
                <div ><Link className="muiMenu_item" to={{
                    pathname: `talentReviewMeeting`,
                    state: text
                }}> <i className="fa fa-pencil m-r-5"></i> Edit</Link></div>,
                <div ><a className="muiMenu_item" href="#"
                    onClick={() => {
                        this.setState({ reviewMeetingData: record, meetingView: true })
                    }}
                ><i className="fa fa-eye m-r-5" /><b>View</b></a></div>,
                <div ><a className="muiMenu_item" href="#" onClick={() => {
                    this.delete(text);
                }}
                ><i className="fa fa-trash-o m-r-5" /><b>Delete</b></a></div>,


            )
            if (text.meetingStatus === '2') {
                items.push(<div ><a className="muiMenu_item" href="#" onClick={() => {
                    this.updateMeetingStatus('Completed', text);
                }}
                ><i className="fa fa-check-circle m-r-5" /><b>Mark as completed</b></a></div>)
            }
            if (text.meetingStatus === '1') {
                items.push(<div ><a className="muiMenu_item" href="#" onClick={() => {
                    this.updateMeetingStatus('Scheduled', text);
                }}
                ><i className="fa fa-calendar-check-o m-r-5" /><b>Mark as In-Progress</b></a></div>)
            }
            if (text.meetingStatus === '1') {
                items.push(<div ><a className="muiMenu_item" href="#" onClick={() => {
                    this.setState({ showReviewForm: true,reviewMeetingData: record.id, succession: text.successionId })
                }}
                ><i class="fa fa-address-card m-r-5" ></i><b>Review</b></a></div>,)
            }
            return items;
        }

        const columns = [
            {
                title: 'Meeting Name',
                dataIndex: 'title',
                sorter: true,
            },
            {
                title: 'Meeting Start Date',
                dataIndex: 'date',
                sorter: false,

            },
            {
                title: 'Submission Deadline',
                dataIndex: 'submissionDate',
                sorter: true,
            },
            {
                title: 'Meeting Status',
                dataIndex: 'meetingStatus',
                render: (text, record) => {
                    return <><div >{this.getTextStyle(text)}</div>
                    </>
                }
            },

            {
                title: 'Action',
                width: 50,
                className: 'text-center',
                render: (text, record) => (
                    <div className="">
                        <TableDropDown menuItems={menuItems(text, record)} />
                    </div>
                ),
            },
        ]
        return (
            <>
                <div style={{ marginLeft: '96%', marginTop: '15px' }}>
                    <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
                </div>

                {
                    this.state.showFilter && <div className='mt-5 filterCard p-3'>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group form-focus">
                                <select name='successionId' onChange={(e) => {
                                        // setFieldValue("successionId", e.target.value);
                                    }} className="form-control" >
                                        <option value="">Select a Succession plan</option>
                                        <option value="">Marketing Manager</option>
                                        <option value="">Finance Manager</option>
                                    </select>
                                    <label className="focus-label">Succession Plan</label>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group form-focus">
                                    <input onChange={e => {
                                        this.setState({
                                            q: e.target.value
                                        })
                                    }} type="text" className="form-control floating" />
                                    <label className="focus-label">Search</label>
                                </div>
                            </div>

                            <div className="mt-2 ml-4 col-md-2">
                                <a href="#" onClick={() => {
                                    this.fetchList();
                                }} className="btn btn-success btn-block"> Search </a>
                            </div>
                        </div>
                    </div>
                }
                <div className="page-container content container-fluid">

                    {/* Page Header */}

                    <div className="mt-3 tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Review meeting</h3>
                            </div>
                            <div className="mt-2 float-right col-auto ml-auto">
                                <Link to={`talentReviewMeeting`} className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add Review Meeting</Link>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                <Table id='Table-style' className="table-striped"
                                    pagination={{
                                        total: data.length,
                                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                        showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                                    }}
                                    style={{ overflowX: 'auto' }}
                                    columns={columns}
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    onChange={this.onTableDataChange}
                                />

                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm}
                >
                    <Header closeButton>
                        <h5 className="modal-title">Review Meeting</h5>
                    </Header>
                    <Body>
                        <ReviewMeetingForm meetingData={data} talentPool={this.state.talentPool} ></ReviewMeetingForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showReviewForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title"> Candidates Review</h5>
                    </Header>
                    <Body>
                        <CandidateReview reviewMeetingData={reviewMeetingData} successionId={this.state.succession} />
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.meetingView} onHide={this.hideMeetingView} >
                    <Header closeButton>
                        <h5 className="modal-title">View Review Meeting</h5>
                    </Header>
                    <Body>
                        <ReviewMeetingView reviewMeetingData={reviewMeetingData} ></ReviewMeetingView>
                    </Body>
                </Modal>

            </>
        );
    }
}
