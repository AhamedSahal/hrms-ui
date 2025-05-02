import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { getChatbotIsEnabled, getCompanyAdminModuleAccess, getModuleSetupByCompanyId, getStatus, saveCompanyMenu, saveCompanySettingChatBot, updateModuleSetup,getReportAccessByCompanyId,updateReportModuleAccess } from './service';

export default class AccessModule extends Component {
  constructor(props) {
    super(props);
    const  company  = this.props.company || {};
    this.state = {
      accessModule: [],
      moduleSerialNumbers: {},
      currentSerialNumber: 1,
      companyName: company.name,
      companyId: company.id,
      companyData: [],
      chatbotData: "",
      chatbot: false,
      moduleSetUp: [],
      reportsList: []
    }
  }
  componentDidMount = () => {
    this.fetchList();
    this.getCompanyMenuStatus();
    this.fetchChatbot();
    this.fetchModuleSetup();
    this.fetchReportsStatus();
  }

  fetchList = () => {
    this.getCompanyMenuStatus();
    getCompanyAdminModuleAccess().then(res => {
      if (res.status === 'OK') {
        this.setState({
          accessModule: res.data,
        })
      } else { console.log("Error: " + res.error); }
    }).catch(error => { console.log("Error: " + error); });
  };

  getCompanyMenuStatus = () => {
    getStatus(this.state.companyId).then(res => {
      if (res.status === 'OK') {
        this.setState({
          companyData: res.data,
        })
      }
      else { console.log("Error: " + res.error); }
    }).catch(error => { console.log("Error: " + error); });
  }
  save = (data, action) => {
    action.setSubmitting(true);
    saveCompanyMenu({ ...data }).then(res => {
      if (res.status === "OK") {
        toast.success(res.message);
        this.fetchList();
      }
      else {
        this.fetchList();
        toast.error(res.message);
      }
      action.setSubmitting(false);
    }).catch(err => {
      toast.error("Error while saving company menu");
      action.setSubmitting(false);
    });
  }
  saveChatbot = (newChatbotValue) => {
    this.setState({
      chatbot: newChatbotValue
    }, () => {
      try {
        saveCompanySettingChatBot(this.state.chatbot, this.state.companyId).then(res => {
          if (res.status === "OK") {
            toast.success(res.message);
            this.fetchChatbot();
          } else {
            this.fetchChatbot();
            toast.error(res.message);
          }
        });
      } catch (error) {
        toast.error("Error while saving Document Expiry Alert");
      }
    });
  };

  fetchChatbot = () => {
    getChatbotIsEnabled(this.state.companyId).then(res => {
      if (res.status === 'OK') {
        this.setState({
          chatbotData: res.data,
        })
      } else {
        console.log("Error: " + res.error);
      }
    })
      .catch(error => { console.log("Error: " + error); });
  }

  fetchReportsStatus = () => {
    getReportAccessByCompanyId(this.state.companyId).then(res => {
      if (res.status === 'OK') {
        this.setState({
          reportsList: res.data,
        })
      } else {
        console.log("Error: " + res.error);
      }
    })
      .catch(error => { console.log("Error: " + error); });

  }

  reportAccessHandelChange = (event,item,isActive) => {
    const company ={
      id : item.id,
      companyId : this.state.companyId,
      active : isActive,
    }
    updateReportModuleAccess(company).then(res =>{
      if(res.status === 'OK') {
        toast.success(res.message);
        this.fetchReportsStatus();
      }
      else{
        toast.error(res.message);
      }
    })
    }

  fetchModuleSetup = () => {
    getModuleSetupByCompanyId(this.state.companyId).then(res => {
      if (res.status === 'OK') {
        this.setState({
          moduleSetUp: res.data,
        })
      } else {
        console.log("Error: " + res.error);
      }
    })
      .catch(error => { console.log("Error: " + error); });
  }
  moduleSetupHandelChange = (event,item,isActive) => {
    const company ={
      id : item.id,
      companyId : this.state.companyId,
      active : isActive,
    }
    updateModuleSetup(company).then(res =>{
      if(res.status === 'OK') {
        toast.success(res.message);
        this.fetchModuleSetup();
      }
      else{
        toast.error(res.message);
      }
    })
    }
  handleCheckboxChange = (event, item, isChecked) => {
    const { childId, parentName } = item;

    this.setState(prevState => ({
      companyData: prevState.companyData.map(parent => {
        if (parent.name === parentName) {
          if (parent.subMenu) {
            return {
              ...parent,
              subMenu: parent.subMenu.map(child => {
                if (child.childId === childId) {
                  return {
                    ...child,
                    active: !child.active
                  };
                }
                return child;
              })
            };
          } else if (parent.name === item.childName) {
            return {
              ...parent,
              active: !parent.active
            };
          }
        }
        return parent;
      })
    }));

    const data = {
      active: !isChecked,
      childId: childId,
      childName: item.childName,
      companyId: this.state.companyId,
      parentId: item.parentId,
      parentName: parentName,
    };
    const actualAction = {
      setSubmitting: (isSubmitting) => {
      },
    };
    this.save(data, actualAction);
  };

  getSerialNumber = (parentName) => {
    if (!this.state.moduleSerialNumbers[parentName]) {
      this.state.moduleSerialNumbers[parentName] = this.state.currentSerialNumber++;
    }
    return this.state.moduleSerialNumbers[parentName];
  };

  render() {
    const { chatbotData, companyData, moduleSetUp } = this.state;
    return (
      <>

        < div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
          < div className="tablePage-header" >
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">{this.state.companyName} Module Access </h3>
                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                </div>
              </div>
            </div>
          </div>
          
          
          <div className="row">
            <div className="col-md-12 ">
              <div className="expireDocs-table">
                <table className="table">
                  <thead>
                    <tr style={{ background: '#c4c4c4' }}>
                      <th>#</th>
                      <th>Module </th>
                      <th>Menu</th>
                      <th>Access Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-column">{this.getSerialNumber("ChatBot")}</td>
                      <td className="table-column">ChatBot</td>
                      <td className="table-column">ChatBot Enabled</td>
                      <td className="table-column">
                        <Button variant="link" size='sm' onClick={() => this.saveChatbot(chatbotData?.chatbotEnabled !== true)}>
                          <i className={`fa fa-2x fa-${chatbotData?.chatbotEnabled ? 'toggle-on text-success' : 'toggle-off text-danger'}`}></i>
                        </Button>
                      </td>
                    </tr>
                    {this.state.accessModule.map((item, index) => {
                      const parentData = this.state.companyData.find(data => data.name === item.parentName && data.url === item.parentUrl);
                      let isChecked = false;
                      if (parentData) {
                        if (parentData.subMenu && parentData.subMenu.length > 0) {
                          const childData = parentData.subMenu.find(subMenu => subMenu.name === item.childName);
                          if (childData) {
                            isChecked = childData.active;
                          }
                        } else if (parentData.name === item.childName) {
                          isChecked = parentData.active;
                        } else {
                          isChecked = parentData.active;
                        }
                      }
                      return (
                        <tr className="table-row" key={index}>
                          {index === 0 || item.parentName !== this.state.accessModule[index - 1].parentName ? (
                            <td className="table-column" rowSpan={this.state.accessModule.filter((i) => i.parentName === item.parentName).length}>
                              {this.getSerialNumber(item.parentName)}
                            </td>
                          ) : null}
                          {index === 0 || item.parentName !== this.state.accessModule[index - 1].parentName ? (
                            <td className="table-column" rowSpan={this.state.accessModule.filter((i) => i.parentName === item.parentName).length}>
                              {item.parentName}
                            </td>
                          ) : null}
                          <td className="table-column">{item.childName}</td>
                          <td className="table-column">
                            <Button variant="link" size='sm' onClick={(event) => this.handleCheckboxChange(event, item, isChecked)}>
                              <i className={`fa fa-2x ${isChecked ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'}`}></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        <div>
          < div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
            < div className="tablePage-header" >
              <div className="row pageTitle-section">
                <div className="col">
                  <h3 className="tablePage-title">{this.state.companyName} Module Setup Access </h3>
                  <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                  </div>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-md-12 ">
                <div className="expireDocs-table">
                  <table className="table">
                    <thead>
                      <tr style={{ background: '#c4c4c4' }}>
                        <th>#</th>
                        <th>Menu Setup Name</th>
                        <th>Access Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.moduleSetUp && this.state.moduleSetUp.map((item, index) => (
                        <tr className="table-row" key={index}>
                          <td className="table-column">{index + 1}</td>
                          <td>{item.moduleName}</td>
                          <td className="table-column">
                            <Button variant="link" size="sm"   onClick={(event) => this.moduleSetupHandelChange(event, item, item.isActive !== "1")}>
                              <i className={`fa fa-2x ${item.isActive === "1" ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'}`}></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* Reports */}

       <div>
          < div className="page-container content container-fluid" style={{ marginTop: "50px" }}>
            < div className="tablePage-header" >
              <div className="row pageTitle-section">
                <div className="col">
                  <h3 className="tablePage-title">{this.state.companyName} Reports Module Access </h3>
                  <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                  </div>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-md-12 ">
                <div className="expireDocs-table">
                  <table className="table">
                    <thead>
                      <tr style={{ background: '#c4c4c4' }}>
                        <th>#</th>
                        <th>Menu Setup Name</th>
                        <th>Access Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.reportsList && this.state.reportsList.map((item, index) => (
                        <tr className="table-row" key={index}>
                          <td className="table-column">{index + 1}</td>
                          <td>{item.moduleName}</td>
                          <td className="table-column">
                            <Button variant="link" size="sm"   onClick={(event) => this.reportAccessHandelChange(event, item, item.isActive !== "1")}>
                              <i className={`fa fa-2x ${item.isActive === "1" ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'}`}></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }
}
