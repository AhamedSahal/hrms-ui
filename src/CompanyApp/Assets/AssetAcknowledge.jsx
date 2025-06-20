import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { BsSliders } from "react-icons/bs";
import { itemRender } from "../../paginationfunction";
import AssetForm from './form';
import AssetViewer from './view';
import EmployeeListColumn from '../Employee/employeeListColumn';
import AssetAction from './AssetAction';
import AssetHistory from './AssetHistory';
import AssetActive from './AssetActive';
import AssetPending from './AssetPending';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import { getReadableDate,getCustomizedDate,getTitle,getUserType,verifyViewPermission, getUserData, getEmployeeId,verifyEditPermission } from '../../utility';
import {  getAssetList,updateStatus } from './service';  
import TableDropDown from '../../MainPage/tableDropDown';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';

export default class AssetAcknowledge extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
            Assets: props.Assets || 0,
          data: [],
          q: "",
          page: 0,
          size: 10,
          sort: "id,desc",
          AssetView: true,
          totalPages: 0,
          totalRecords: 0,
          currentPage: 1,
          self: isCompanyAdmin ? 0 : 1,
          showForm: false,
          showFilter: false,
          assetAcknowledgeStatusId:3,
         
        };
      }
      componentDidMount() {
        this.fetchList();
      }
      fetchList = () => {
       { verifyViewPermission("Manage Assets") &&   getAssetList(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.assetAcknowledgeStatusId,this.state.self,0,0).then(res => {
       
          if (res.status == "OK") {
            
            this.setState({
              data: res.data.list,
              totalPages: res.data.totalPages,
              totalRecords: res.data.totalRecords,
              currentPage: res.data.currentPage + 1
            })
           
          }
        })  }
      }
      onTableDataChange = (d, filter, sorter) => {
        this.setState({
          page: d.current - 1,
          size: d.pageSize,
          sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
          this.fetchList();
        })
      }
      updateList = (Assets) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == Assets.id);
        if (index > -1)
          data[index] = Assets;
        else {
          data=[Assets,...data];
        }
        this.setState({ data },
          () => {
            this.hideAssetView(); 
            this.hideForm(); 
            this.hideAssetAction();
            this.hideAssetActive();
          });
      }
      pageSizeChange = (currentPage, pageSize) => {
        this.setState({
          size: pageSize,
          page: 0
        }, () => {
          this.fetchList();
    
        })
    
      }
      hideForm = () => {
        this.setState({
          showForm: false,
          Assets: undefined
        })
      }
      hideAssetView = () => {
        this.setState({
          showAssetView: false,
          showAssetAction: false,
          AssetView: undefined
        })
      } 
      hideAssetAction = () => {
        this.setState({
          showAssetAction: false,
          showAssetView: false,
          AssetsAction: undefined
        })
      }
      hideAssetHistory = () => {
        this.setState({
          showAssetAction: false,
          showAssetView: false,
          showAssetHistory: false,
          
          AssetsHistory: undefined
        })
      } 
      hideAssetActive = () => {
        this.setState({
          showAssetAction: false,
          showAssetView: false,
          showAssetHistory: false,
          
          AssetsActive: undefined
        })
      }    
    updateStatus = (id, status) => {
      updateStatus(id, status).then(res => {
          if (res.status == "OK") {
              toast.success(res.message);
              
          } else {
              toast.error(res.message);
          }

      }).catch(err => { 
          toast.error("Error while updating status");
      })
  }
    render() {
        const { data, totalPages, totalRecords, currentPage, size,AssetView,AssetsAction,AssetsHistory,AssetsActive,showForm} = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size));
        if (endRange > totalRecords) {
          endRange = totalRecords;
        }

        const menuItems = (text, record) => {
       
          const items = [];
          items.push(
            <div>
              <a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ AssetView: record, showAssetView: true, showForm: false })
              }} >
                <i className="fa fa-eye m-r-5" /><b>View</b></a>
            </div>
          );
  
          if (!isEmployee) {
            items.push(
              <div >  <a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ AssetsHistory: record, showAssetHistory: true, showForm: false })
              }} >
                <i className="fa fa-history m-r-5" /><b>History</b></a>
              </div>
            );
          }
         
          if (text.isStatus == "PENDING") {
            items.push(<div >  <a className="muiMenu_item" href="#"
              onClick={() => {
                this.setState({ AssetsAction: record, showAssetAction: true, showForm: false })
              }} >
                  {text && text.pendingStatus == "RETURN" && !isCompanyAdmin ?  <span>
              <i className="las la-times m-r-5" /><b>Cancel</b>
            </span>:<span >
                    <i className="las la-check-double m-r-5" /><b>Acknowledge</b>
            </span> 
           
           }
             </a>
            </div>
            );
          }
          
  
          return items;
        };

      const columns = [
        {
          title: 'Name',

          width: 50,
          render: (text, record) => {
            return <>
              <span>{text && text.assets?.name != "" ? text.assets?.name : "-"}</span>
            </>
          }
        },
        {
          title: 'Category',

          width: 50,
          render: (text, record) => {
            return <>
              <span>{text && text.category?.name != "" ? text.category?.name : "-"}</span>
            </>
          }
        },
        {
          title: 'Serial Number',

          width: 50,
          render: (text, record) => {
            return <>
              <span>{text && text.serialno != "" ? text.serialno : "-"}</span>
            </>
          }
        },
        {
          title: 'Brand Name',

          width: 50,
          render: (text, record) => {
            return <>
              <span>{text && text.brandName != "" ? text.brandName : "-"}</span>
            </>
          }
        },
       
        {
          title: 'Assigned On',
          width: 50,
          render: (text, record) => {
            return <>
              <div>{record.assignDate != null ? getReadableDate(record.assignDate) : "-"}</div>
            </>
          }
        },
        {
          title: 'Assigned To',
          key: 'employee',
          width: 50,
          render: (text, record) => {
            return <> {text.employee?.id != null ? <EmployeeListColumn
              id={text.employee?.id} name={text.employee?.name}></EmployeeListColumn> : "-"}</>
          }
        },
        {
          title: 'Status',

          width: 50,
          render: (text, record) => {
            return <>
            {text && text.pendingStatus == "ALLOCATE" ? <span className='p-1 badge bg-inverse-success'>
              <i className="pr-2 fa fa-user-plus text-success"></i>Assign Request
            </span> : <span className='p-1 badge bg-inverse-danger'>
              <i className="pr-2 fa fa-undo  text-danger"></i>Return Request
            </span>}
            </>
          }
        },
        {
          title: 'Action',
          width: 50,
          render: (text, record) => (
            <div className="">
               <TableDropDown menuItems={menuItems(text, record)} />
            </div>
          ),
        },
       
      ]
        return(
        <> 
          <div className="content container-fluid">

            <div id='page-head' > 
                  <div className="float-right col-md-5 btn-group btn-group-sm" style={{paddingRight:"30px"}}>
                    
                     

                    {isCompanyAdmin && !showForm && <> 
                  <button className="apply-button btn-primary mr-2" onClick={() => {
                  this.setState({
                    showForm: true
                  })
                  }}>
                    <i className="fa fa-plus" /> New Asset</button></>
                }
                 {verifyViewPermission("Manage Assets") && <BsSliders className='filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />}
                </div>
            </div> 
            {this.state.showFilter && <div className='mt-4 filterCard p-3'>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group form-focus">
                  <input onChange={e => {
                    this.setState({
                      q: e.target.value
                    })
                  }} type="text" className="form-control floating" />
                  <label className="focus-label">Search by Name / Category / Serial Number / Employee Name </label>
                </div>
              </div>
              <div className="col-md-3">
                <a href="#" onClick={() => {
                  this.fetchList();
                }} className="btn btn-success btn-block"> Search </a>
              </div>
            </div>
          </div>}
            {/* /Page Header */}
      
            { verifyViewPermission("Manage Assets") && 
            
            <div className='Table-card'>
            <div className="tableCard-body">
            <div className=" p-12 m-0">
                <div className="row " >
                  <div className="mt-3 col">
                    <h3 className="page-titleText">Assets</h3>
                  </div>
                </div>
              </div> 
            <div className="tableCard-container row">
                <div className="col-md-12">
                  <div className="table-responsive">
                <Table id='Table-style' className="table-striped "
                  pagination={{
                    total: totalRecords,
                    showTotal: (total, range) => {
                      return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                    },
                    showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                    itemRender: itemRender, 
                    defaultCurrent: 1,
                  }}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  dataSource={[...data]}
                  onChange={this.onTableDataChange}
                  rowKey="id"
                />
                </div>
                </div>
              </div>
            </div>
            </div>}
            {!verifyViewPermission("Manage Assets") && <AccessDenied></AccessDenied>} 
            </div>

        <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">New Asset</h5>
          </Header>
          <Body>
            <AssetForm updateList={this.updateList} Assets={this.state.Assets}>
            </AssetForm>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"xl"} show={this.state.showAssetView} onHide={this.hideAssetView} >
 
        <Header closeButton>
          {isCompanyAdmin && <><h5 className="modal-title">Asset Details</h5></>}
          {!isCompanyAdmin && <><h5 className="modal-title">My Asset Details</h5></>} 
        </Header>
        <Body>
            {AssetView && <AssetViewer AssetView={AssetView} />}
        </Body>


      </Modal>
      
        <Modal enforceFocus={false} size={"xl"} show={this.state.showAssetHistory} onHide={this.hideAssetHistory} >
          <Header closeButton>
            <h5 className="modal-title">Asset History</h5>
          </Header>
          <Body>
            <AssetHistory updateList={this.updateList} AssetsHistory={this.state.AssetsHistory}>
            </AssetHistory>
          </Body>
        </Modal>
        
        <Modal enforceFocus={false} size={"md"} show={this.state.showAssetAction} onHide={this.hideAssetAction} >
          <Header closeButton>
            <h5 className="modal-title">Asset Acknowledge</h5>
          </Header>
          <Body>
            <AssetPending updateList={this.updateList} AssetsAction={this.state.AssetsAction}>
            </AssetPending>
          </Body>
        </Modal>
        </>
       );
    }
}