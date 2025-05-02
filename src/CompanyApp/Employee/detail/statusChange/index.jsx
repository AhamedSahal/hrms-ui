import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import moment from 'moment';
import { toast } from 'react-toastify';
import { itemRender } from '../../../../paginationfunction';
import { verifyEditPermission,getReadableDate, getPermission } from '../../../../utility';
import EmployeeStatusChangeForm from './form';
import { getChangeStatusDetails } from './service';
import { getPersonalInformation } from '../service';
import { data } from 'jquery';
import { PERMISSION_LEVEL } from '../../../../Constant/enum';
const { Header, Body, Footer, Dialog } = Modal;
export default class ChangeStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeId: props.employeeId || 0,
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            id: props.employeeId,
            lastDate: '',
            employee: props.employee || {
                id: 0,
                name: "",
                active: true
            },

        };
    }
    componentDidMount(){
        this.fetchList();
    }
    fetchList = () => {
        getPersonalInformation(this.state.id).then(res => {
            let employee = res.data;
            if (res.status == "OK") {
                employee.dob = employee?.dob?.substr(0, 10);
                this.setState({ employee })
            }
           
        })
        getChangeStatusDetails(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.id).then((res) => {
            
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1
                  })
                  
                  let len = (res.data.list).length;
                  if(len>0){
                  let date = res.data.list[0].effectiveDate;
                  this.setState({ lastDate: date})
                  }
            }

        })
    }

    
    onTableDataChange = (d, filter, sorter) => {
        this.setState(
          {
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}` : this.state.sort,
          },
          () => {
            this.fetchList();
          }
        );
      };

    pageSizeChange = (currentPage, pageSize) => {
        this.setState(
          {
            size: pageSize,
            page: 0,
          },
          () => {
            this.fetchList();
          }
        );
      };
 
    closeForm = (data) => {
        this.hideForm()
        
    }
    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }

 

    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const isEditAllowed =getPermission("PEOPLE", "EDIT") == PERMISSION_LEVEL.ORGANIZATION;// verifyEditPermission("EMPLOYEE");
        const columns = [
            {
                title: 'Effective Date',
                render: (text, record) => {
                    return <span>{text && text.effectiveDate != 0?getReadableDate(record.effectiveDate) : "-"}</span>
                  },
                
            },
            {
                title: 'Reason For Change',
                render: (text, record) => {
                 return <span>{text && text ? (record.reasonForChange === 1?"Promotion":record.reasonForChange === 2?"Title Change":record.reasonForChange === 3?"Transfer":record.reasonForChange === 4?"Adjustment":record.reasonForChange === 5?"Increment":"-") : "-"}</span>  
                  },
            },
            {
                title: 'Job Title',
                render: (text, record) => {
                    return <span>{text && text ? record.newJobTitles?.name : "-"}</span>
                  },
            },
            {
                title: 'Division',
                render: (text, record) => {
                    return <span>{text && text ? record.newdivision?.name : "-"}</span>
                  },
            },
            {
                title: 'Grade',
                render: (text, record) => {
                    return <span>{text && text ? record.newgrades?.name : "-"}</span>
                  },
            },
            {
                title: 'Basic Salary',
                render: (text, record) => {
                    return <span>{record.updatedbasicSalary != null? record.updatedbasicSalary : "-"}</span>

                  },
            },
             {
                title: 'Allowances',
                dataIndex: 'updatedTotalAllowance',
                sorter: true,
            },
            {
                title: 'Total Salary',
                dataIndex: 'updateTotalSalary',
                sorter: true,
            },
        ]
        return (
            <>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header btn-group-sm text-right">
                                {isEditAllowed && <a href="#" className="btn btn-primary" onClick={() => {
                                    this.setState({
                                        showForm: true
                                    })

                                }}><i className="fa fa-plus" /></a>}
                            </div>
                            <div className="card-body p-0 ">
                                <div className="table-responsive">
                                    <Table id='Table-style' className="table-striped "
                                        pagination={{
                                            total: totalRecords,
                                            showTotal: (total, range) => {
                                                return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                            },
                                            showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                            itemRender: itemRender,
                                            pageSizeOptions: [10, 20, 50, 100],
                                            current: currentPage,
                                            defaultCurrent: 1,
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
                </div>

                <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Employee Change Status Form</h5>
                    </Header>
                    <Body>
                        <EmployeeStatusChangeForm closeForm={this.closeForm} employeeId={this.state.employeeId} lastDate={this.state.lastDate}>
                        </EmployeeStatusChangeForm>
                    </Body>
                </Modal>
            </>
        );
    }
}
