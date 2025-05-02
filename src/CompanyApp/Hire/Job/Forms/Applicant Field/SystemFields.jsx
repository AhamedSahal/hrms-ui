import React, { Component } from "react";
import { Table } from "antd";
import Checkbox from "@mui/material/Checkbox";
import { itemRender } from "../../../../../paginationfunction";
import { BsPeople } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  getCustomFieldInfo,
  getSystemFieldInfo,
  getApplicantInfo,
  saveApplicantMasForm
} from "../../service";

export default class SystemFields extends Component {
  constructor(props) {
    super(props);
    this.state = props.SystemFields || {
      applicantField: [],
      hireJobId: 0,

      systemField: [],
      CustomField: [],
      flag:true,
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
    if(this.state.flag){
      this.fetchList();
    } 
  }

  fetchList = () => {
    getApplicantInfo().then((res) => {
      if (res.status == "OK") {
        this.setState({ applicantField: res.data });
      }
    });

    getSystemFieldInfo().then((res) => {
      if (res.status == "OK") {  
        this.setState({ systemField: res.data });
      }
    });
    getCustomFieldInfo().then((res) => {
      if (res.status == "OK") {
        this.setState({ CustomField: res.data });
      }
    });
  };


  handlePrevious = () => {
    this.props.previous();
  };


  // handleCustomFieldChecked
  handleCustomFieldChecked = (res) => {
    let { CustomField } = this.state;
    let newdata = CustomField.map((item) => {
      if (res.id === item.id) {
        return {
          ...item,
          active: !item.active,
        };
      }

      return item;
    });
    this.setState({ CustomField: newdata });
  };

  // handleCustomFieldRequired
  handleCustomFieldRequired = (res) => {
    let { CustomField } = this.state;
    let newdata = CustomField.map((item) => {
      if (res.id === item.id) {
        return { ...item, required: !item.required };
      }

      return item;
    });
    this.setState({ CustomField: newdata });
  };

  // handleSystemFieldChecked
  handleSystemFieldChecked = (res) => {
    let { systemField } = this.state;
    let newdata = systemField.map((item) => {
      if (res.id === item.id) {
        return {
          ...item,
          active: !item.active,
        };
      }

      return item;
    });
    this.setState({ systemField: newdata });
  };

  // handleAdditionalInfoCustomFieldRequired
  handleSystemFieldRequired = (res) => {
    let { systemField } = this.state;
    let newdata = systemField.map((item) => {
      if (res.id === item.id) {
        return { ...item, required: !item.required };
      }

      return item;
    });
    this.setState({ systemField: newdata });
  };

  // update
  handleUpdate = () => {
    const {CustomField,systemField,applicantField,flag } = this.state;
    //  systemField
    let systemFieldParam = systemField.length > 0?systemField.map((res) => {
            return {...res,systemFieldId: res.id}
    }):systemField;
    // custom
    let customFieldParam = CustomField.length > 0?CustomField.map((res) => {
      return {...res,customFieldId: res.id}
}):CustomField;

    this.setState({
      updateJobApplicant: [
        ...systemFieldParam,
        ...customFieldParam,
      ]}, this.handleJobApplicantUpdate)

  

  }

  //  api for handleJobApplicantUpdate
  handleJobApplicantUpdate = () => {
        // api
      this.state.updateJobApplicant.map((res, index) => {
          let parameterData = {
            id: res.jobApplicantId,
            name: res.name,
            applicantId: res.applicant.id,
            required: res.required,
            active: res.active,
            customFieldId: res.customFieldId ? res.customFieldId : 0,
            systemFieldId: res.systemFieldId ? res.systemFieldId : 0,
            jobId: this.state.hireJobId,
          };
          saveApplicantMasForm(parameterData)
            .then((res) => {
              if (res.status == "OK") {
               
              } else {
                toast.error(res.message);
              }
              if (res.status == "OK" && this.state.updateJobApplicant.length - 1 === index) {
                toast.success(res.message);
                // this.props.previousPage()
                window.location.href = "/app/company-app/hire/job"
              }
            })
            .catch((err) => {
              toast.error("Error while saving JobApplicantFied");
            });
        });

  }

  
  // cancel 
  handleCancel = () => {
    window.location.href = "/app/company-app/hire/job";
  }

  // save
  handleSave = () => {
    const {CustomField,systemField,applicantField,flag } = this.state;
    //  systemField
    let systemFieldParam = systemField.length > 0?systemField.map((res) => {
            return {...res,systemFieldId: res.id}
    }):systemField;
    // custom
    let customFieldParam = CustomField.length > 0?CustomField.map((res) => {
      return {...res,customFieldId: res.id}
}):CustomField;
    let datas = {
      id: "SystemFields",
      CustomField: customFieldParam,
      systemField: systemFieldParam,
      applicantField: applicantField,
      flag: false,
      hireJobId: 0
    };
    this.props.nextForm(datas);
  };

  // check systemfiled for else part
 
  render() {
    const { CustomField, systemField, applicantField } = this.state;
    let systemFieldBoolean = true;
    let CustomFieldBoolean = true

    return (
      <div style={{ padding: "15px", background: "white" }}>
        <h3>
          <BsPeople size={30} style={{ color: "#1DA8D5" }} /> Define Fields For
          Applicants
        </h3>
        <hr style={{ color: "#e3e3e3" }} />
        {/* applicant map */}
        {applicantField.length > 0
          ? applicantField.map((applicantFieldresponse) => (
              <div className="row">
                {systemFieldBoolean = true}
                {CustomFieldBoolean = true}
                <h3>{applicantFieldresponse.fieldName}</h3>
                <div className="col-md-12">
                  <div className="mt-3 mb-3 table-responsive">
                    <table className="systemfieldTable">
                      {/* System field head*/}
                      <tr>
                        <th style={{ textAlign: "left" }}>
                          <h4>System Fields</h4>
                        </th>
                        <th style={{ textAlign: "Right" }}>
                          <h4>Required</h4>
                        </th>
                      </tr>
                      {/* System field Body*/}
                      {systemField.length > 0
                        ? systemField.map((SystemFieldResponse,index) =>
                            SystemFieldResponse.applicant.id === applicantFieldresponse.id ?(
                              
                              <tr key={SystemFieldResponse.id}
                              style={
                                SystemFieldResponse.active && !SystemFieldResponse.defaults
                                  ? { background: "#add8e6", color: "#1976d2" }
                                  : { background: "#DCDCDC" }
                              }
                              >
                                {systemFieldBoolean = false}
                                {/* td sf */}
                                <td
                                  style={{
                                    textAlign: "left",
                                    alignItems: "center",
                                  }}
                                >
                                  <Checkbox
                                    disabled={SystemFieldResponse.defaults}
                                    checked={SystemFieldResponse.active}
                                    onChange={(e) => {
                                      this.handleSystemFieldChecked(SystemFieldResponse)
                                    }}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                  <label>{SystemFieldResponse.name}</label>
                                </td>
                                {/* td required */}
                                <td
                                  style={{
                                    textAlign: "Right",
                                    paddingRight: "10px",
                                  }}
                                >
                                  <button disabled={SystemFieldResponse.defaults} style={{border: "none",background: "none"}}>
                                  <div
                                    className="icon-container"
                                    type="checkbox"
                                    name="required"
                                    aria-disabled={SystemFieldResponse.defaults}
                                    onClick={(e) => {
                                      this.handleSystemFieldRequired(SystemFieldResponse);
                                    }}
                                  >
                                    <i
                                      className={`fa fa-3x icon-style ${
                                        SystemFieldResponse.required? "fa-toggle-on text-info": "fa fa-toggle-off text-dark"
                                      }`}
                                    ></i>
                                    {SystemFieldResponse.required ? (
                                      <span className="icon-text">Yes</span>
                                    ) : (
                                      <span className="icon-text-no">No</span>
                                    )}
                                  </div>
                                  </button>
                                </td>
                              </tr>
                            ) :systemFieldBoolean && index === systemField.length-1 && <label style={{display:"flex",justifyContent:"end"}}>No Data Found</label>
                          )
                        : <label>No Data Found</label>}
                    </table>

                    {/* custom field */}
                    <table className="systemfieldTable">
                      {/* table head */}
                      <tr>
                        <th style={{ textAlign: "left" }}>
                          <h4>Custom Fields</h4>
                        </th>
                        <th style={{ textAlign: "Right" }}>
                          <h4>Required</h4>
                        </th>
                      </tr>
                      {/* table Body */}
                      {CustomField.length > 0
                        ? CustomField.map((customFieldResponse,index) =>
                        customFieldResponse.applicant.id === applicantFieldresponse.id ? (
                              <tr key={customFieldResponse.id }
                              style={
                                customFieldResponse.active && !customFieldResponse.defaults
                                  ? { background: "#add8e6", color: "#1976d2" }
                                  : { background: "#DCDCDC" }
                              }
                              >
                                {CustomFieldBoolean = false}
                                {/* td sf */}
                                <td
                                  style={{
                                    textAlign: "left",
                                    alignItems: "center",
                                  }}
                                >
                                  <Checkbox
                                    disabled={customFieldResponse.defaults}
                                    checked={customFieldResponse.active}
                                    onChange={(e) => {
                                      this.handleCustomFieldChecked(customFieldResponse);
                                    }}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                  <label>{customFieldResponse.name}</label>
                                </td>
                                {/* td required */}
                                <td
                                  style={{textAlign: "Right",paddingRight: "10px",
                                  }}
                                >
                                   <button disabled={customFieldResponse.defaults} style={{border: "none",background: "none"}}>
                                  <div
                                    className="icon-container"
                                    type="checkbox"
                                    name="required"
                                    style={customFieldResponse.defaults?{block: "none"}:null}
                                    disabled={customFieldResponse.defaults}
                                    onClick={(e) => {
                                      this.handleCustomFieldRequired(customFieldResponse);
                                    }}
                                  >
                                    <i
                                      className={`fa fa-3x icon-style ${
                                        customFieldResponse.required
                                          ? "fa-toggle-on text-info"
                                          : "fa fa-toggle-off text-dark"
                                      }`}
                                    ></i>
                                    {customFieldResponse.required ? (
                                      <span className="icon-text">Yes</span>
                                    ) : (
                                      <span className="icon-text-no">No</span>
                                    )}
                                  </div>
                                  </button>
                                </td>
                              </tr>
                            ) :CustomFieldBoolean && index === CustomField.length-1 && <label style={{display:"flex",justifyContent:"end"}}>No Data Found</label>
                          )
                        : <label>No Data Found</label>}
                    </table>
                  </div>
                </div>
              </div>
            ))
          : null}
        {/* save btn */}
        <div className="row">
          <div className="col-md-6">
            <input className="btn btn-light hire-close" onClick={this.handleCancel}  value={"Cancel"} />
          </div>
          <div
            className="col-md-6"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
             {this.state.hireJobId == 0 ?
             <>
            <input
              onClick={this.handlePrevious}
              className="btn hire-next-btn"
              value="&larr;"
              style={{ width: "50px", marginRight: "5px" }}
            />
            <input
              type="submit"
              className="btn hire-next-btn"
              value={`Next Step `}
              onClick={this.handleSave}
            />
            </>:
            <input
            type="submit"
            className="btn hire-next-btn"
            value={`Apply Changes`}
            onClick={this.handleUpdate}
          />
            }
          </div>
        </div>
      </div>
    );
  }
}
