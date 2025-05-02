import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import AddOwnerForm from './form';
import EmployeeListColumn from '../../../../Employee/employeeListColumn';
import TableDropDown from '../../../../../MainPage/tableDropDown';
import { onShowSizeChange } from '../../../../../MainPage/paginationfunction';
import { itemRender } from '../../../../../paginationfunction';
import { toast } from 'react-toastify';
import { deleteAddOwner } from './service';
const { Header, Body, Footer, Dialog } = Modal;
const data =
    [
        { employee: { id: '25', name: 'Jacki' }, status: true, ownerType: '1' },
        { employee: { id: '19', name: 'Ajith' }, status: false, ownerType: '2' },
        { employee: { id: '21', name: 'Roshan' }, status: true, ownerType: '3' },
    ]

export default class AddOwner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: data,
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1
        };
    }
    getStyle(text) {
        if (text === true) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === false) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'null';
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            owners: undefined
        })
    }


    delete = (owner) => {
        confirmAlert({
          title: `Delete Owner ${owner.name}`,
          message: 'Are you sure, you want to delete this Owner?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => deleteAddOwner(owner.id).then(res => {
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

    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => [
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ owners: text, showForm: true })
            }}
            ><i className="fa fa-pencil m-r-5" /><b>Edit</b></a></div>,
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.delete(text);
            }}
            ><i className="fa fa-trash-o m-r-5" /><b>Delete</b></a></div>
        ]
        const columns = [
            {
                title: 'Owner Name',
                sorter: true,
                render: (text, record) => {
                    return <EmployeeListColumn
                        id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            },
            {
                title: 'Owner Type',
                dataIndex: 'ownerType',
                sorter: true,
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (text, record) => {
                    return <><div >{this.getStyle(text)}</div>
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
                 <div  >
                    <div className={`${'addPlanForm'}`} >
                        <div className='successionPlanHead'>
                            <h3 className='dvlp-left-align'>Owners</h3>
                            <div className='dvlp-right-align'>
                                {<a onClick={() => {
                                    this.setState({
                                        showForm: true,
                                    });
                                }} style={{ textAlignLast: 'center' }} href="#" className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add </a>}
                                
                            </div>
                        </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mt-3 mb-3 table-responsive">
                                        <Table id='Table-style' className="table-striped "
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
                </div>

                <Modal
                    enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm}
                >
                    <Header closeButton>
                        <h5 className="modal-title">Add Owner</h5>
                    </Header>
                    <Body>
                        <AddOwnerForm owners={this.state.owners} ></AddOwnerForm>
                    </Body>
                </Modal>

            </>
        );
    }
}
