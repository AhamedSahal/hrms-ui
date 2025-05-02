import { Empty, Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility';
import OnboardMSchecklistForm from './checklistForm';
const { Header, Body } = Modal;

const tasks = [
    {
        id: 1,
        name: "Welcome Orientation",
        description: "Introduction to the company, team, and workplace policies.",
        active: true,
        applicableFor: "Everyone",
    },
    {
        id: 2,
        name: "IT Setup",
        description: "Setting up email, workstations, and required software tools.",
        active: true,
        applicableFor: "India",
    },
    {
        id: 3,
        name: "Meet the Team",
        description: "Schedule introductions with team members and key stakeholders.",
        active: false,
        applicableFor: "HR Department",
    },
];


export default class OnboardingMSCheckList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: tasks || [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            expandedRows: {},
            taskListdata: [],
        };
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        // getOnboardMSCheckList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
        //     if (res.status == "OK") {
        //       this.setState({
        //         data: res.data.list,
        //         totalPages: res.data.totalPages,
        //         totalRecords: res.data.totalRecords,
        //         currentPage: res.data.currentPage + 1
        //       })
        //     }
        //   })
    }

    
    updateList = (checklist) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id === checklist.id);
        if (index > -1)
            data[index] = checklist;
        else {
            data = [checklist, ...data];
        }
        this.setState({ data }, () => {
            this.hideForm();
        });
    }

    

    hideForm = () => {
        this.setState({
            showForm: false,
            checklist: undefined
        });
    }

    getStyle(text) {
        if (text) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (!text) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'black';
    }

    reduceString = (str, length) => {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size, expandedRows } = this.state;
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * size) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        return (
            <div >
                {/* Page Header */}
                <div className='onboardPageHead ' >
                    <div className=''>
                        <div style={{ height: '80px' }} className="goalHeader-container">
                            <div className="onboardTaskHead-section">
                                <div>
                                    <h3 className='mt-2 mb-0'>Checklist</h3>
                                </div>
                                <div className="mt-2 float-right col-auto ml-auto">
                                    {verifyOrgLevelEditPermission("Module Setup Onboard") && <button onClick={() => {
                                        this.setState({
                                            showForm: true
                                        })
                                    }} className="add-goals-btn"><i className="fa fa-plus" /> Add Checklist</button>}
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="Goals_table-container">
                        <table className="goals-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Applicable To</th>
                                    <th  style={{textAlign: 'center'}}>Status</th>
                                    <th style={{textAlign: 'center'}}>Action</th>
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
                                      return (
                                        <>
                                            <tr className='Goals_table_row' key={item.id}>
                                               
                                                <td style={{ width: '380px' }} className='GoalName_tab'>
                                                    <div onClick={() => this.props.openChecklistView(item, 'taskView')}>
                                                        <Tooltip title={item.name}>
                                                            <div className="goal-title">{this.reduceString(item.name, 45)}</div>
                                                        </Tooltip>
                                                        <div className="goal-details">
                                                            2 Task
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.description}</td>
                                                <td>{item.applicableFor}</td>
                                                <td style={{textAlign: 'center'}} >
                                                    <span
                                                        className={item.active
                                                            ? "badge bg-inverse-info"
                                                            : "badge bg-inverse-secondary"
                                                        }
                                                    >
                                                        {item.active ? (
                                                            <i className="pr-2 fa fa-circle text-info"></i>
                                                        ) : (
                                                            <i className="pr-2 fa fa-remove text-secondary"></i>
                                                        )}
                                                        {item.active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </td>
                                                <td style={{textAlign: 'center'}}>
                                                    <div className="">
                                                        <i onClick={() => this.setState({showForm: true , checklist: item})} className="menuIconFa fa fa-pencil-square-o" aria-hidden="true"></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm}>
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.checklist ? 'Edit' : 'Add'} Checklist</h5>
                    </Header>
                    <Body>
                        <OnboardMSchecklistForm updateList={this.updateList} checklist={this.state.checklist} >
                        </OnboardMSchecklistForm>
                    </Body>
                </Modal>
            </div>
        );
    }
}