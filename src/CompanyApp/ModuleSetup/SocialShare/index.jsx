import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import MediaComponent from '../../../MainPage/MediaComponent';
import { itemRender } from '../../../paginationfunction';
import { getTitle, verifyOrgLevelViewPermission } from '../../../utility';
import { getSocialShareList } from './service';
import SocialShareAction from './socialShareAction';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

const { Header, Body, Footer, Dialog } = Modal;

export default class SocialShareApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    if(verifyOrgLevelViewPermission("Engage Social Share")){
    getSocialShareList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  updateList = (socialShare) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == socialShare.id);
    if (index > -1)
      data[index] = socialShare;
    else {
      data.push(socialShare);
    }
    this.setState({ data },
      () => {
        this.hideSocialShareAction();
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
  hideSocialShareAction = () => {
    this.setState({
      showSocialShareAction: false,
      socialShare: undefined
    })
  }

  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }

  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => [
      <div key="1"><a className="muiMenu_item" href="#" onClick={() => {
        let { socialShare } = this.state;
        socialShare = text;
        this.setState({ socialShare, showSocialShareAction: true })
      }} >
        <i className="las la-check-double m-r-5"></i> Social Share Action</a></div>
    ]

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: true,
        className: 'pre-wrap',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        sorter: false,
        className: 'pre-wrap',
        render: (text, record) => {
          return <div style={{ maxWidth: "400px" }}>
            {record.description}</div>;
        }

      },
      {
        title: 'Date',
        dataIndex: 'createdOn',
        render: (createdOn) => {
          const formattedDate = new Date(createdOn).toISOString().split('T')[0];
          return formattedDate; 
        },
        sorter: true,
        className: 'pre-wrap',
      },
      {
        title: 'Name',
        dataIndex: 'createdBy',
        render: (createdBy) => createdBy?.name,
        sorter: true,
        className: 'pre-wrap',
      },
      {
        title: 'File',
        sorter: true,
        render: (text, record) => {
          return <MediaComponent mediaPath={record.mediaPath} mediaType={record.mediaType} height={"auto"} width={"100px"} autoplay={false}></MediaComponent>
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: true,
        render: (text, record) => {
          return <> <div>{this.getStyle(text)}</div>
          </>
        }
      },
      {
        title: 'Active/Inactive',
        render: (text, record) => {
          return <> 
          <div className={text.active ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text.active ? 'Active' : 'Inactive'
            }</div>
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
    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>Social Share  | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Social Share</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">SocialShare</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Engage Social Share") &&
                <Table id='Table-style' className="table-striped"
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
                />}
                {!verifyOrgLevelViewPermission("Engage Social Share") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>

        {/* /Page Content */}

        <Modal enforceFocus={false} size={"md"} show={this.state.showSocialShareAction} onHide={this.hideSocialShareAction} >


          <Header closeButton>
            <h5 className="modal-title">Social Share Action</h5>
          </Header>
          <Body>
            <SocialShareAction updateList={this.updateList} socialShare={this.state.socialShare}>
            </SocialShareAction>
          </Body>


        </Modal>

      </div>
    );
  }
}
