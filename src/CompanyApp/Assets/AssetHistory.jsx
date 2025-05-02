import React, { Component } from 'react';
import jsPDF from 'jspdf';
import { Table } from 'antd'; 
import EmployeeListColumn from '../Employee/employeeListColumn';
import { itemRender } from "../../paginationfunction";
import { getCurrency, getLogo, getReadableDate } from '../../utility';
import { getAssetHistory } from './service'
export default class AssetsHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            no: 0,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1, 
            AssetsHistory: props.AssetsHistory || {}
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.AssetsHistory && nextProps.AssetsHistory != prevState.AssetsHistory) {
            return ({ AssetsHistory: nextProps.AssetsHistory })
        } else if (!nextProps.AssetsHistory) {
            return prevState.AssetsHistory || ({
                AssetsHistory: {
                    projid: 0
                }
            })
        }
        return null;
    }
    componentDidMount() {
        this.fetchList()
    }

    fetchList = () => { 
        getAssetHistory(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.AssetsHistory.category.id,this.state.AssetsHistory.assets.id,this.state.AssetsHistory.serialno,this.state.AssetsHistory.id).then(res => {
            if (res.status == "OK") { 
                this.setState({
                  data: res.data, 
                  totalRecords: res.data.length 
                })
            }
        })
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

    render() { 
        
        const { data, totalPages, totalRecords, currentPage, size,AssetsHistory } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        const columns = [
            {
                title: 'Name', 
                
                width: 50,
                render: (text, record) => {
                return <>
                <span>{text && text ? text.assetName : "-" }</span>
                </>
                }
                },  
                {
                title: 'Category', 
                
                width: 50,
                render: (text, record) => {
                return <>
                <span>{text && text ? text.assetCatName : "-" }</span>
                </>
                }
                },
                {
                  title: 'Serial Number', 
                  
                  width: 50,
                  render: (text, record) => {
                  return <>
                    <span>{text && text.serialno != "" ? text.serialno : "-" }</span>
                  </> }
                },  
                {
                  title: 'Brand Name', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.brandname != "" ? text.brandname : "-" }</span>
                  </>  }
                },
                {
                  title: 'Model Number', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.modelno != "" ? text.modelno : "-" }</span>
                  </> }
                },
                {
                  title: 'RAM',
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.ram != "" ? text.ram : "-" }</span>
                  </>  
                  }
                },
                {
                  title: 'Storage Capacity', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.storagecapacity != "" ? text.storagecapacity : "-" }</span>
                  </>}
                },  
                {
                  title: 'IMEI Number', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.imeino != "" ? text.imeino : "-" }</span>
                  </>} 
                },
                {
                  title: 'IP Address', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.ipaddress != "" ? text.ipaddress : "-" }</span>
                  </>}  
                },
                {
                  title: 'Previous State',
                  
                  width: 50, 
                  render: (text, record) => {
                    return <>
                      <span>{text && text.prevstate != "" ? text.prevstate : "-" }</span>
                  </>} 
                },
                {
                  title: 'Tag', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.tag != "" ? text.tag : "-" }</span>
                  </>}  
                },
                {
                  title: 'Current Location',
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.currentlocation != "" ? text.currentlocation : "-" }</span>
                  </>} 
                },
                {
                  title: 'Purchased From', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                      <span>{text && text.purchasefrom != "" ? text.purchasefrom : "-" }</span>
                  </>}  
                },  
                {
                  title: 'Purchased Date', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                    <div>{record.purchasedate != null ? getReadableDate( record.purchasedate)  : "-" }</div>
                    </>
                  }
                },
                {
                  title: 'Warranty Start Date', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                    <div>{record.wstartdate != null ? getReadableDate(record.wstartdate) : "-"}</div>
                    </>
                  }
                },
                {
                  title: 'Warranty End Date',
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                    <div>{record.wenddate != null ? getReadableDate(record.wenddate)  : "-"}</div>
                    </>
                  }
                },
                {
                  title: 'Status', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                         <span className={text.isstatus == "1" ?  "badge bg-inverse-success " : "badge bg-inverse-danger"}>
                            {text.isstatus == "1" ? <i className="pr-2 fa fa-lock text-success"></i> : <i className="pr-2 fa fa-check text-danger"></i>}{
                                text.isstatus == "1" ? 'Allocated' : 'Available'
                            }</span>  
                    </>
                }
                },  
                {
                  title: 'Assigned On', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <>
                    <div>{record.assignedon != null ? getReadableDate(record.assignedon) : "-"}</div>
                    </>
                  }
                },
                {
                  title: 'Assigned To', 
                  
                  width: 50,
                  render: (text, record) => {
                    return <> {text.employeeId != null ? <EmployeeListColumn
                      id={text.employeeId} name={text.employeeName}></EmployeeListColumn>: "-"}</>
                  }
                },
                {
                  title: 'Previous Owner',
                  
                  width: 50,
                  render: (text, record) => {
                    return <> {text.prevemployeeId != null ?  <EmployeeListColumn
                      id={text.prevemployeeId} name={text.prevemployeename}></EmployeeListColumn>: "-"}</>
                  }
                },
                {
                    title: 'Returned On', 
                    width: 50,
                    render: (text, record) => {
                      return <>
                        <div>{record.returndate != null ? getReadableDate(record.returndate) : "-"}</div>
                    </>}
                  },  
                  {
                    title: 'Confidentiality', 
                    width: 50,
                    render: (text, record) => {
                      return <>
                        <div>{text.confidentiality == "0" ? "High" : text.confidentiality == "1" ? "Medium" : text.confidentiality == "2" ? "Low"  : "-" } </div>
                      </>
                      }
                  },  
                  {
                    title: 'Integrity', 
                    width: 50,
                    render: (text, record) => {
                      return <>
                        <div>{text.integrity == "0" ? "High" : text.integrity == "1" ? "Medium" : text.integrity == "2" ? "Low"  : "-"} </div>
                      </>
                      }
                  },  
                  {
                    title: 'Availability', 
                    width: 50,
                    render: (text, record) => {
                      return <>
                        <div>{text.availability == "0" ? "High" : text.availability == "1" ? "Medium" : text.availability == "2" ? "Low"  : "-" } </div>
                      </>
                      }
                  },  
                  {
                    title: 'Remarks', 
                    width: 50,
                    render: (text, record) => {
                      return <>
                        <span>{text && text.remarks != null ? text.remarks : "-" }</span>
                    </>}
                  },

        ]
        return (
            <div className="row"> 
                <div className="col-md-12">
                    <div className="table-responsive">
                        <Table id='Table-style' className="table-striped "
                            style={{ overflowX: 'auto' }}
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
                            columns={columns}
                            // bordered
                            dataSource={[...data]}
                            rowKey={record => record.id}
                            onChange={this.onTableDataChange}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
