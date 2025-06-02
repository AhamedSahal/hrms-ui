import { Empty, Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility';
import OnboardMSchecklistForm from './checklistForm';
import { getBranchLists, getDepartmentLists } from '../../../Performance/ReviewCycle/CycleForms/service';
import { getOnboardMSCheckList,getJobTitles,updateOnboardCompanySetting } from './service';
import { getFormat } from '../../../Settings/Format/service';
const { Header, Body } = Modal;




export default class OnboardingMSCheckList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:  [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            jobtitle: [],
            department: [],
            branches: [],
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            expandedRows: {},
            taskListdata: [],
            onboardStatus: false,
        };
    }

    componentDidMount() {
        // this.fetchList();
        this.fetchData();
    }

    fetchData = () => {
         getFormat().then(res => {
                        if (res.status == "OK") {
                            this.setState({ onboardStatus: res.data.onboardEnable })
                        }
                    })
        getBranchLists().then(res => {
                    if (res.status === "OK") {
                        this.setState({
                            branches: res.data,
                        });
                    }
                });
                getDepartmentLists().then(res => {
                    if (res.status === "OK") {
                        this.setState({
                            department: res.data,
                        });
                    }
                });
        
                getJobTitles().then(res => {
                    if (res.status == "OK") {
                        this.setState({
                            jobtitle: res.data,
                        })
                    }
                })
                setTimeout(() => {this.fetchList()},1000) 
                
    }

    fetchList = () => {
        getOnboardMSCheckList().then(res => {
            if (res.status == "OK") {
            if(res.data.length > 0){
                let data = res.data.map((res) => {
                    if(res.applicableId == 0){
                        return {...res,applicableFor : "Everyone"}
                    }
                    if(res.applicableId == 1 &&  this.state.department.length > 0){
                        let department =  this.state.department.filter((dept) => res.departments?.split(',').map(Number).includes(dept.id))
                        let arrname = department.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}
                    }

                    if(res.applicableId == 2 &&  this.state.branches.length > 0){
                        let branches =  this.state.branches.filter((dept) => res.branches?.split(',').map(Number).includes(dept.id))
                        let arrname = branches.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}
                    }
                    if(res.applicableId == 3 &&  this.state.jobtitle.length > 0){
                        let jobtitle =  this.state.jobtitle.filter((dept) => res.jobtitle?.split(',').map(Number).includes(dept.id))
                        let arrname = jobtitle.map(dept => dept.name);
                        let applicableFor = arrname.join(", ");
                        return {...res,applicableFor : applicableFor}
                    }
                })
                this.setState({data : data})
            }else {
                this.setState({data : []})
            }
            }
          })
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
            this.fetchList();
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

    handleMasterRecordUpdate = () => {

        this.setState({onboardStatus: !this.state.onboardStatus},() => {
            updateOnboardCompanySetting(this.state.onboardStatus).then((res) => {
                if (res.status == "OK") {
                  toast.success(res.message);
                  this.fetchList();
                } else {
                  toast.error(res.message);
                }
              })

        })

         
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
                 {/* head */}
                 <div style={{ height: '80px' }} className="onboardPageHead ">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h3 className='mt-2 mb-0'>Onboard</h3>
                                           
                                        </div>
                                        {/* body */}
                                        <div className="card-body">
                                            {/* onboard  active inactive */}
                                            <div className="mt-2 float-left col-auto ml-auto">
                                                <label htmlFor="">Enable Onboard</label>
                                                <div type="checkbox" name="onboardStatus"  >

                                                    <i className={`fa fa-2x ${this.state.onboardStatus
                                                        ? 'fa-toggle-on text-success' :
                                                        'fa fa-toggle-off text-danger'}`} onClick={
                                                    this.handleMasterRecordUpdate
                                                }></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                          {/* head */}
                {/* Page Header */}
              {this.state.onboardStatus &&  <div className='onboardPageHead ' style={{marginTop: "113px"}}>
                    <div className=''>
                       

                        <div style={{ height: '80px' }} className="goalHeader-container">
                            <div className="onboardTaskHead-section">
                                <div className='mt-8 mb-0'>
                                    <h3 className='mt-2 mb-0'>Checklist</h3>
                                </div>
                                 
                                <div className='mt-8 mb-0'>

                                    {verifyOrgLevelEditPermission("Module Setup Onboard") && <button onClick={() => {
                                        this.setState({
                                            showForm: true
                                        })
                                    }} className="add-goals-btn" ><i className="fa fa-plus" /> Add Checklist</button>}
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
                                                            {item.taskCount} {item.taskCount > 1 ?"Tasks":"Task"} 
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
                                                        <i onClick={() => this.setState({showForm: true , checklist: {...item,assign:item.applicableId.toString() }})} className="menuIconFa fa fa-pencil-square-o" aria-hidden="true"></i>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>}
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