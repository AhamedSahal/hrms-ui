import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import PlanForm from './form';
import { getPlanList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class Plan extends Component {
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
    getPlanList().then(res => {

      if (res.status == "OK") {
        this.setState({
          data: res.data,

        })
      }
    })
  }
  updateList = (plan) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == plan.id);
    if (index > -1)
      data[index] = plan;
    else {
      data = [plan, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      plan: undefined
    })
  }

  render() {
    const { data } = this.state

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Duration',
        dataIndex: 'duration',
        sorter: true,
      },
      {
        title: 'Price',
        dataIndex: 'price',
        sorter: true,
      },
      {
        title: 'Max Employees',
        dataIndex: 'maxEmployees',
        sorter: true,
      },
      {
        title: 'Max Users',
        dataIndex: 'maxUsers',
        sorter: true,
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="dropdow">
            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#" onClick={() => {
                this.setState({ plan: text, showForm: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>

            </div>
          </div>
        ),
      },
    ]
    return (
      <div className="adminInsidePageDiv">
      
      < div className = "page-container content container-fluid" >
        <Helmet>
          <title>Plan Management - WorkPlus</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        < div className = "tablePage-header" >
          <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Plan</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Plan</li>
                </ul>
              </div>

            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">

              <Table id='Table-style' className="table-striped"
                  pagination={{
                    hideOnSinglePage: true,
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
        
        {/* /Page Content */}

        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.plan ? 'Edit' : 'Add'} Plan</h5>

          </Header>
          <Body>
            <PlanForm updateList={this.updateList} plan={this.state.plan}>
            </PlanForm>
          </Body>


        </Modal>
      </div>
      </div>
    );
  }
}
