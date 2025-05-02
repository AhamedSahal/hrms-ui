import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import OfferletterForm from './form';
import OfferLetterViewer from './view';
import { getOfferLetterList,saveOfferLetterNotification } from './service';
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class Offerletter extends Component {
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
    if(verifyOrgLevelViewPermission("Onboard Offer Letter")){
    getOfferLetterList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
  updateList = (Offerletter) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == Offerletter.id);
    if (index > -1)
      data[index] = Offerletter;
    else {
      data = [Offerletter, ...data];
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
  handleOfferLetterNotification = (data) => {
    let Currenturl = window.location.href;
    let splitUrl = Currenturl.split("/app")
    let offer = `${splitUrl[0]}/externalofferlettercandidateinfo`;
    let offerData = {...data, url: offer.toString()};
    saveOfferLetterNotification(offerData).then(res => {
      if (res.status == "OK") {
          toast.success(res.message);
      } else {
          toast.error(res.message);
      }
  }).catch(err => {
      toast.error(err); 
  })
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      Offerletter: undefined
    })
  }
  hideOfferLetterView = () => {
    this.setState({
      showOfferLetterView: false,
      showForm: false,
      Offerletter: undefined
    })
  }

  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (Offerletter, record) => [
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        let { offerletter } = this.state;
        offerletter = Offerletter;
        this.setState({ offerletter, showOfferLetterView: true, showForm: false })
      }}  ><i className="fa fa-user m-r-5" /> View </a></div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        let { offerletter } = this.state;
        offerletter = Offerletter;
        // this.setState({ offerletter, showOfferLetterView: true, showForm: false })
        this.handleOfferLetterNotification(Offerletter);
      }}  ><i className="fa fa-envelope m-r-5" /> Send Offer letter </a></div>
    ]

    const columns = [
      {
        title: 'Candidate Name',
        dataIndex: 'candidatename',
        sorter: true,
      },
      {
        title: 'Candidate Email Id',
        dataIndex: 'candidateemailid',
        sorter: true,
      },
      {
        title: 'Candidate Position',
        dataIndex: 'candidateposition',
        sorter: true,
      },
      {
        title: 'Sent Status',
        sorter: true,
        width: 25,
        render: (text, record) => {
          return <> <div className={text.offerlettersend ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text.offerlettersend ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text.offerlettersend ? 'Yes' : 'No'
            }</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (Offerletter, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(Offerletter, record)} />
          </div>
        ),
      },
      
    ]
    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>Offer Letter  | {getTitle()}</title>
          <meta name="description" content="Offerletter page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Offer Letter</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Offer Letter</li>
                </ul>
              </div>

              <div className="mt-1 float-right col">
              {verifyOrgLevelEditPermission("Onboard Offer Letter") &&
                <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Create Offer Letter</a>}

              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Onboard Offer Letter") &&
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
                {!verifyOrgLevelViewPermission("Onboard Offer Letter") && <AccessDenied></AccessDenied>}  

              </div>
            </div>
          </div>
        </div>



        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.Offerletter ? 'Edit' : 'Create'} Offer Letter</h5>

          </Header>
          <Body>
            <OfferletterForm updateList={this.updateList} Offerletter={this.state.Offerletter}>
            </OfferletterForm>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"xl"} show={this.state.showOfferLetterView} onHide={this.hideOfferLetterView} >
        <Header closeButton>
             <h1 className="modal-title">View</h1>

          </Header>

          <Body>
            <OfferLetterViewer offerletter={this.state.offerletter} />
          </Body>
        </Modal>
      </div>
    );
  }
}
