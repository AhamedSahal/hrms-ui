import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Helmet } from 'react-helmet';
import { itemRender } from "../../paginationfunction";
import { getTitle } from '../../utility';
import {  getRecognitionList } from '../RecognitionMain/service';
import EmployeeListColumn from '../Employee/employeeListColumn'; 
import { getReadableDate} from '../../utility';
export default class RecognitionMainList extends Component{
    constructor(props) {
        super(props);
    
        this.state = { 
          employeeId: 0,
          data: [],
          q: "",
          page: 0,
          size: 10,
          sort: "id,desc",
          totalPages: 0,
          totalRecords: 0,
          currentPage: 1
        };
      }
      componentDidMount() {
        this.fetchList();
      }
      fetchList = () => {
         getRecognitionList(this.state.q, this.state.page, this.state.size, this.state.sort,0,0).then(res => {
   
          if (res.status == "OK") { 
            this.setState({ 
              data: res.data.list,
              totalPages: res.data.totalPages,
              totalRecords: res.data.totalRecords,
              currentPage: res.data.currentPage + 1
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
       
      pageSizeChange = (currentPage, pageSize) => {
        this.setState({
          size: pageSize,
          page: 0
        }, () => {
          this.fetchList();
    
        })
    
      }
        
    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
          endRange = totalRecords;
        }
        const columns = [
          {
            title: 'Awardee', 
            sorter: true, 
            render: (text, record) => {
              return <EmployeeListColumn id={text.awardee?.id} name={text.awardee?.name} employeeId={text.awardee?.employeeId} ></EmployeeListColumn>
            }
 
          }, 
          {
            title: 'Recognition Category', 
            sorter: true,
            render: (text, record) => {
              return <>
                <div>{record.recognitionSetup?.name} </div>
              </>
            } 
          }, 
          {
            title: 'Reason for Recognition',
            sorter: true,
            render: (text, record) => {
              return <>
                <div>{record.reccommentss} </div>
              </>
            }
          },
          {
            title: 'Recognized By', 
            sorter: true,
            render: (text, record) => {
              return <>
                 <div>{record.recognizer?.name} </div>
               </>
            }
          }, 
           {
            title: 'Recognized Created On', 
            sorter: true,
            render: (text, record) => {
              return <>
                 <div>{getReadableDate(text.createdOn)}</div>
               </>
            }
          }, 
            {
              title: 'Action',
              className: "text-center",
            },
          ]
          return ( 
            <div className='row'>    
                 
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
                          pageSizeOptions: [10, 20, 50, 100],
                          current: currentPage,
                          defaultCurrent: 1,
                        }}
                        style={{ overflowX: 'auto' }}
                        columns={columns}
                        // bordered
                        dataSource={[...data]}
                        rowKey={record => record.id}
                        onChange={this.onTableDataChange}
                      />
      
                    </div>
                  </div>
                  
      
               
            </div>
          );
    }
}