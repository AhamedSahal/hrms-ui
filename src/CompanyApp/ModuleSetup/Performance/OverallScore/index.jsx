import { Table } from 'antd';
import React, { Component } from 'react';
import { FormGroup, Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../../paginationfunction";
import OverallScoreForm from './form';
import { deleteOverallScore, getOverallScoreList } from './service';
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import PotentialRatingScore from './potentialRating';
const { Header, Body, Footer, Dialog } = Modal;
export default class OverallScore extends Component {
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
      currentPage: 1,
      scalesPage: '0',
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyOrgLevelViewPermission("Module Setup Performance")) {
      getOverallScoreList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (objectivegroup) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == objectivegroup.id);
    if (index > -1)
      data[index] = objectivegroup;
    else {
      data = [objectivegroup, ...data];
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
      overallscore: undefined
    })
  }
  delete = (overallscore) => {
    confirmAlert({
      title: `Delete Overall Score ${overallscore.name}`,
      message: 'Are you sure, you want to delete this Rating Scale?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteOverallScore(overallscore.id).then(res => {
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
    const { data, totalPages, totalRecords, currentPage, size, scalesPage } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Rating',
        dataIndex: 'rating',
        sorter: true,
      },
      {
        title: 'Rating Description',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Score From',
        dataIndex: 'scoreFrom',
        sorter: true,
      },
      {
        title: 'Score To',
        dataIndex: 'scoreTo',
        sorter: true,
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            {verifyOrgLevelEditPermission("Module Setup Performance") && <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#" onClick={() => {
                  this.setState({ overallscore: text, showForm: true })
                }} >
                  <i className="fa fa-pencil m-r-5"></i> Edit</a>
                <a className="dropdown-item" href="#" onClick={() => {
                  this.delete(text);
                }}>
                  <i className="fa fa-trash-o m-r-5"></i> Delete</a>

              </div></>}
          </div>
        ),
      },
    ]
    return (
      <div className="page-container content container-fluid">
        {/* Page Header */}
        <div className="tablePage-header">
          <div className="row pageTitle-section">
            <div className="col">
              <h3 className="tablePage-title">Rating Scales</h3>
            </div>

            <div className="mt-2 float-right col-md-4 col-auto ml-auto">
              <FormGroup className=''>
                <select onChange={(e) => { this.setState({ scalesPage: e.target.value })}} name='status' className="form-control" >
                  <option value="">Select Rating..</option>
                  <option value="1">Performance rating</option>
                  <option value="2">Potential rating</option>
                </select>
              </FormGroup>
            </div>

          </div>
        </div>

        {/* /Page Header */}
        {scalesPage === '0' && <div className="p-3 alert alert-warning alert-dismissible fade show" role="alert">
          <span>Please select Rating Scale.</span>
        </div>}
        {scalesPage === '2' && <PotentialRatingScore></PotentialRatingScore>}

        {scalesPage === '1' && <div className="row">
          <h3 className='mt-2 col-md-4'>Performance Rating</h3>
          <div className="mt-2 float-right col-auto ml-auto">
            {verifyOrgLevelEditPermission("Module Setup Performance") && <a href="#" className="btn apply-button btn-primary" onClick={() => {
              this.setState({
                showForm: true
              })

            }}><i className="fa fa-plus" /> Add</a>}
          </div>
          <div className="col-md-12">
            <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Performance") &&
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
                />}
              {!verifyOrgLevelViewPermission("Module Setup Performance") && <AccessDenied></AccessDenied>}
            </div>
          </div>
        </div>}




        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >

          <Header closeButton>
            <h5 className="modal-title">{this.state.overallscore ? 'Edit' : 'Add'} Rating Scale</h5>

          </Header>
          <Body>
            <OverallScoreForm updateList={this.updateList} overallscore={this.state.overallscore}>
            </OverallScoreForm>
          </Body>


        </Modal>
      </div>
    );
  }
}
