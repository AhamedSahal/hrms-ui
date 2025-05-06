import React, { Component } from "react";
import { Table } from "antd";
import { itemRender } from "../../../../paginationfunction"
import { getJobsList,saveHireForms } from "../service"
import moment from "moment";
import { Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import  HJobFormView from '../ViewPage/HJobFormView'
import TableDropDown from "../../../../MainPage/tableDropDown";
import { getReadableDate } from "../../../../utility";
import { verifyOrgLevelViewPermission } from "../../../../utility";
import AccessDenied from "../../../../MainPage/Main/Dashboard/AccessDenied";
const { Header, Body, Footer, Dialog } = Modal;


export default class JobActive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showForm: false,
      job: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    if(verifyOrgLevelViewPermission("Hire Job")){
    getJobsList(this.state.q, this.state.page, this.state.size, this.state.sort,0).then(res => {
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
    this.setState(
      {
        page: d.current - 1,
        size: d.pageSize,
        sort: sorter && sorter.field ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}`: this.state.sort,
      },
      () => {
        this.fetchList();
      }
    );
  };

  pageSizeChange = (currentPage, pageSize) => {
    this.setState(
      {
        size: pageSize,
        page: 0,
      },
      () => {
        this.fetchList();
      }
    );
  };

  // handle Draft and closed
  handleJobUpdates = (data,active) => {

    let draftData = {...data,
      department: data.department?data.department.id:0,
      division: data.division?data.division.id:0,
      branch: data.branch?data.branch.id:0,
      hiringManager: data.hiringManager?data.hiringManager.id:0,
      recruiter: data.recruiter?data.recruiter.id:0,
      isActive: active
    }
    // service callback
    saveHireForms(draftData)
    .then((res) => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      if (res.status == "OK") {
        setTimeout(function () {
          window.location.reload()
        }, 6000)
      }
    })
    .catch((err) => {
      toast.error("Error while saving Job");
    });
    

  }




  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => [
      <div ><a className="muiMenu_item" >
        <Link to={`/app/company-app/hire/viewForm/${text.id}`} state={{ text: text}} className="" style={{ color: "black" }}><i className="fa fa-eye" /> View </Link>
      </a></div>,
      <div > <a className="muiMenu_item" href="#"
        onClick={(e) => {
          this.handleJobUpdates(text, 1)
        }}
      ><i className='fa fa-sticky-note'></i> Draft</a></div>,
      <div ><a className="muiMenu_item" href="#"
        onClick={() => {
          this.handleJobUpdates(text, 2)
        }}
      ><i className="fa fa-close m-r-5" />
        Closed</a></div>,
    ]

    const columns = [
      {
        title: "Jobs",
        dataIndex: "jobTitle",
        sorter: true,
      },
      {
        title: "Openings",
        dataIndex: "noOfOpenings",
        sorter: true,
      },
      {
        title: "Opening Date",
        sorter: true,
        render: (text, record) => {
          return <span>{getReadableDate(text.openingDate)}</span>  
           },
      },
      {
        title: "Expiry Date",
        sorter: true,
        render: (text, record) => {
          return <span>{getReadableDate(text.expiryDate)}</span>  
           },
      },
      {
        title: "Employment Type",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.employmentType ? (record.workplaceType === 1?"Full Time":record.workplaceType === 2?"Probation":record.workplaceType === 3?"Intern":record.workplaceType === 4?"Contrac":record.workplaceType === 5?"Part Time":"-") : "-"}</span>  
           },
      },
      {
        title: "Department",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.department ? record.department.name : "-"}</span>  
           },
      },
      {
        title: "Location",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.branch ? record.branch.name : "-"}</span>  
           },
      },
      {
        title: "Workplace Type",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.workplaceType ? (record.workplaceType === 1?"Remote":record.workplaceType === 2?"OnSite":record.workplaceType === 3?"Hybrid":"-") : "-"}</span>  
           }
      },
      {
        title: "Recruiter Tagged",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.recruiter ? record.recruiter.name : "-"}</span>  
           },
      },
      {
        title: "Hiring Manager",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.hiringManager ? record.hiringManager.name : "-"}</span>  
           },
      },
      {
        title: "Job Type",
        sorter: true,
        render: (text, record) => {
          return <span>{text && text.jobType ? "External Job": "Internal Job"}</span>  
           },
      },
      {
        title: "Age (In Days)",
        sorter: true,
        render: (text, record) => {
         let startDate = new Date(text.openingDate);  
         let endDate = new Date(text.expiryDate);
        let time_difference = endDate.getTime() - startDate.getTime();
        let days_difference = time_difference / (1000 * 60 * 60 * 24);   
          return <span>{text && text.expiryDate && text.openingDate ? days_difference: "Internal Job"}</span>  
           },
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(text, record)} />
          </div>
        ),
      },
      
   
    ];
    return (
      <div className="page-container content container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="mt-3 mb-3 table-responsive">
          {verifyOrgLevelViewPermission("Hire Job") && <Table
              id="Table-style"
              className="table-striped "
              pagination={{
                total: totalRecords,
                showTotal: (total, range) => {
                  return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                },
                showSizeChanger: true,
                onShowSizeChange: this.pageSizeChange,
                itemRender: itemRender,
                pageSizeOptions: [10, 20, 50, 100],
                current: currentPage,
                defaultCurrent: 1,
              }}
              style={{ overflowX: "auto" }}
              columns={columns}
              // bordered
              dataSource={[...data]}
              rowKey={(record) => record.id}
              onChange={this.onTableDataChange}
            />}
            {!verifyOrgLevelViewPermission("Hire Job") && <AccessDenied></AccessDenied>}
          </div>
        </div>
      </div>

      {/* view form */}
          <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >
             <Body>
                     <HJobFormView view={this.state.view}></HJobFormView>
                    </Body>
             </Modal>

      </div>
    );
  }
}
