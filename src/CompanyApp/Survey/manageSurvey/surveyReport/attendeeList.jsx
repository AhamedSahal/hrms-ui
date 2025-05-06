import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { getSurveyAttendee } from "./service";
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { itemRender } from '../../../../paginationfunction';


const { Header, Body, Footer, Dialog } = Modal;
export default class SurveyAttendeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        survey: props.survey,
        data:[],
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

  pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();
    })
  }

  fetchList = () => {
    getSurveyAttendee(this.state.q, this.state.page, this.state.size, this.state.sort, this.props.survey.id).then((res) => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }
    });
  };

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

    const { data, totalPages, totalRecords, currentPage, size } = this.state
    console.log(data.isConfidential);
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: (text, record, index) => {
          if (data[0].isConfidential) {
            const participantNumber = (this.state.page * this.state.size) + index + 1;
            return <div>Participant {participantNumber}</div>;
          }
          return text;
        },
      },
      {
        title: 'Score',
        dataIndex: 'score'
      },
      {
        title: 'Score',
        dataIndex: 'score'
      },
      {
        title: 'Status',
        render: (text, record) => {
          return <>
            <div>COMPLETED</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record, index) => {
          if (data[0].isConfidential) {
            const participantNumber = (this.state.page * this.state.size) + index + 1;
            const confidentialRecord = {
              name: `Participant ${participantNumber}`,
              email: '',
              id: record.id,
              isConfidential: record.isConfidential,
              languageId: record.languageId,
              participantId: record.participantId,
              score: record.score,
              surveyId: record.surveyId,
              surveyName: record.surveyName,
            };
    
            return (
              <div className="dropdow">
                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="las la-bars"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <Link
                    className="dropdown-item"
                    to="/app/company-app/survey/report/view-response"
                      state={confidentialRecord}
                    
                  >
                    <i className="fa fa-pencil m-r-5"></i> View Response
                  </Link>
                </div>
              </div>
            );
          } else {
            return (
              <div className="dropdow">
                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="las la-bars"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right">
                  <Link
                    className="dropdown-item"
                    to="/app/company-app/survey/report/view-response"
                      state={record}
                  >
                    <i className="fa fa-pencil m-r-5"></i> View Response
                  </Link>
                </div>
              </div>
            );
          }
        },
      },
    ]
    
    return (
      <>
        <div className="page-wrapper">
          <Helmet>
            <title>Survey Attendees </title>
            <meta name="description" content="Attendance" />
          </Helmet>
          <div className="mt-4 content container-fluid">

          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">

                <Table className="table-striped table-border"
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
            
          </div>
        </div>
      </>
    );
  }
}
