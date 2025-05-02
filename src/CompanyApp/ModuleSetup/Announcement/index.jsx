import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import AnnouncementForm from './form';
import { deleteAnnouncement, getAnnouncementList } from './service';
import { getReadableDate, getTitle,verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class Announcement extends Component {
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
    if(verifyOrgLevelViewPermission("Engage Announcement")){
    getAnnouncementList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (announcement) => {
    this.fetchList();
    let { data } = this.state;
    let index = data.findIndex(d => d.id == announcement.id);
    if (index > -1)
      data[index] = announcement;
    else {
      data = [announcement, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
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
      announcement: undefined
    })
  }
  delete = (announcement) => {
    confirmAlert({
      title: `Delete Announcement ${announcement.title}`,
      message: 'Are you sure, you want to delete this announcement?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteAnnouncement(announcement.id).then(res => {
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
    const currentDate = new Date().toISOString().split('T')[0];
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const showCreatedOnColumn = verifyOrgLevelEditPermission("EMPLOYEE");

    const menuItems = (text, record) => {
      const items = [];

      if (text.validTill >= currentDate) {
        items.push(
          <div>
            <a className="muiMenu_item" href="#" onClick={() => {
              let announcement = text;
              try {
                announcement.validFrom = announcement.validFrom.substr(0, 10);
                announcement.validTill = announcement.validTill.substr(0, 10);
              } catch (error) {
                console.error(error)
              }
              this.setState({ announcement: text, showForm: true })
            }} >
              <i className="fa fa-pencil m-r-5"></i> Edit</a>
          </div>
        );
      }
      items.push(<div>
        <a className="muiMenu_item" href="#" onClick={() => {
          this.delete(text);
        }}><i className="fa fa-trash-o m-r-5"></i> Delete</a>
      </div>
      );

      return items;
    };

    const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        sorter: true,
        className: 'pre-wrap'
      },
      {
        title: 'Description',
        dataIndex: 'description',
        sorter: true,
        className: 'pre-wrap'
      },
      {
        title: 'Valid From',
        dataIndex: 'validFrom',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.validFrom)}</div>
          </>
        }
      },
      {
        title: 'Valid Till',
        dataIndex: 'validTill',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{getReadableDate(record.validTill)}</div>
          </>
        }
      },
    ]
    if (showCreatedOnColumn) {
      columns.push({
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(text, record)} />
          </div>
        ),
      })
    }
    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>Announcement  | {getTitle()}</title>
          <meta name="description" content="Announcement page" />
        </Helmet>
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Announcement</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Announcement</li>
                </ul>
              </div>
          {verifyOrgLevelEditPermission("EMPLOYEE")&&
              <div className="mt-1 float-right col">
                {verifyOrgLevelEditPermission("Engage Announcement") && 
                <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Announcement</a>}

              </div>
          }
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Engage Announcement") && <Table id='Table-style' className="table-striped "
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
              {!verifyOrgLevelViewPermission("Engage Announcement") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>

          {/* /Page Content */}


          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


            <Header closeButton>
              <h5 className="modal-title">{this.state.announcement ? 'Edit' : 'Add'} Announcement</h5>

            </Header>
            <Body>
              <AnnouncementForm updateList={this.updateList} announcement={this.state.announcement}>
              </AnnouncementForm>
            </Body>


          </Modal>
        </div>
        );
  }
}
