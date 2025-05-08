import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fileDownload } from '../../../HttpRequest';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import CandidateInfoForm from './form';
import CandidateInfoAction from './candidateInfoApproval'; 
import { getReadableDate,getTitle,getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import {  getcandidateinfoList } from './service'; 
import JobResponse from '../../Hire/hApplicants/hApplicantForm/JobResponse';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class CandidateInfo extends Component{
    constructor(props) {
        super(props);
    
        this.state = {
          candidateId: props.candidateId || 0,
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
        if(verifyOrgLevelViewPermission("Onboard Candidate Info")){
         getcandidateinfoList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
    
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
      updateList = (CandidateInfoForm) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == CandidateInfoForm.id);
        if (index > -1)
          data[index] = CandidateInfoForm;
        else {
          data=[CandidateInfoForm,...data];
        }
        this.setState({ data },
          () => {
            this.hideForecastAction(); 
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
          CandidateInfoForm: undefined
        })
      }
      hideForecastAction = () => {
        this.setState({
          showForecastAction: false
          
        })
      }   
      delete = (CandidateInfoForm) => {
        confirmAlert({
          title: `Delete Candidate Info ${CandidateInfoForm.name}`,
          message: 'Are you sure, you want to delete this candidate info?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => { 
            }},
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

      const menuItems = (CandidateInfoForm, record) => {
        const items = [];
          items.push(
            <div >
              <a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ CandidateInfoForm, showForecastAction: true, showForm: false })
              }} >
                <i className="las la-check-double m-r-5"></i> Approval Action</a>
            </div>
          );
        return items;
      };

        const columns = [
            {
            title: 'Candidate ID', 
            sorter: true,
            width: 50,
            render: (text, record) => {
              return <>
                  <span>{text && text ? text.candidateId : "-" }</span>
              </>
            }
            },  
            {
              title: 'Offer Letter ID', 
              sorter: true,
              width: 50,
              render: (text, record) => {
                return <>
                    <span>{text && text ? text.offerletterId : "-" }</span>
                </>
              }
            },
            {
                title: 'First Name', 
                sorter: true,
                width: 50,
                dataIndex: 'firstname',
            },  
            {
              title: 'Last Name', 
              sorter: true,
              width: 50,
              dataIndex: 'lastname',
            },
            {
              title: 'Email ID', 
              sorter: true,
              width: 50,
              dataIndex: 'personalemailid',
            },
            {
              title: 'Signed Offer Letter ',
              sorter: true,
              width: 50,
              render: (text, record) => {
                return <Anchor onClick={() => {
                  fileDownload(text.id, text.id, "CANDIDATE_INFO", text.fileName); 
                }}title={text.fileName}>
                <i className='fa fa-download'></i> Download
                </Anchor>
              }
            },
            {
              title: 'Login Credentials', 
              width: 50, 
              render: (CandidateInfoForm, record) => {
                return <span>
                  {CandidateInfoForm.status == "APPROVED" ? "Created" : "Not Created"}</span>
              }
            }, 
            {
              title: 'Action',
              width: 50,
              render: (CandidateInfoForm, record) => (
                <div className=""> 
                 {CandidateInfoForm.status == "PENDING"? <TableDropDown menuItems={menuItems(CandidateInfoForm, record)} />:null}
                </div>
              ),
            }, 
            
          ]
        return(
          <div className="insidePageDiv">
         <Helmet>
          <title>Candidate Info  | {getTitle()}</title>
          <meta name="description" content="Candidate Info page" />
        </Helmet>
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              
              <div className="col">
                <h3 className="tablePage-title">Candidate Info</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Candidate Info</li>
                </ul>
              </div>
             
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Onboard Candidate Info") && 
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
              {!verifyOrgLevelViewPermission("Onboard Candidate Info") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>

        <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >

          <Body>
            <CandidateInfoForm updateList={this.updateList} CandidateInfoForm={this.state.CandidateInfoForm}>
            </CandidateInfoForm>
          </Body>


        </Modal>
        <Modal enforceFocus={false} size={"md"} show={this.state.showForecastAction && isCompanyAdmin} onHide={this.hideForecastAction} >
 
        <Header closeButton>
          <h5 className="modal-title">Candidate Info Action</h5>
        </Header>
        <Body>
          <CandidateInfoAction updateList={this.updateList} CandidateInfoForm={this.state.CandidateInfoForm} >
          </CandidateInfoAction>         
        </Body>


      </Modal>
      </div>);
    }
}