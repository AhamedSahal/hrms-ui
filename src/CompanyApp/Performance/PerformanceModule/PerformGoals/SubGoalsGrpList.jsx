import React, { Component } from 'react';
import { Table } from 'antd';
import {  Modal,ProgressBar } from 'react-bootstrap';
import { itemRender } from "../../../../paginationfunction";
import {   getReadableDate } from '../../../../utility';
import { getSubGoalsList } from './service';
import TableDropDown from '../../../../MainPage/tableDropDown';
import PerformanceSubGoalsForm from './subGoalsform';
import SubGoalsStatusAction from './subGoalsStatusAction';
import SubGoalsEditWeigthage from './subGoalsEditWeightage';
import SubGoalsStatusHistory from './SubGoalsStatusViewHistory';
const { Header, Body, Footer, Dialog } = Modal;
export default class subGoalsGrpList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            no: 0,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            subGoalsStatusId: 0, 
            showSubGoalsForm: false,
            showUpdateWeigthage: false,
            goalsView: props.goalsView || {
                
                
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.goalsView && nextProps.goalsView != prevState.goalsView) {
            return ({ goalsView: nextProps.goalsView })
        } else if (!nextProps.goalsView) {
            return prevState.goalsView || ({
                goalsView: {
                   
                }
            })
        }
        return null;
    }
    componentDidMount() {
        
        this.fetchList(); 
        
    }



    fetchList = () => { 

        getSubGoalsList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.goalsView.id).then(res => {
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

    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
          size: pageSize,
          page: 0
        }, () => {
          this.fetchList();
    
        })
    
      }
      hideSubGoalsEditView = () => {
        this.setState({
            showSubGoalsEditView: false,
            subgoalsEditView: undefined
        })
    }
    
      hideSubGoalsAction = () => {
        this.setState({
            showSubGoalsAction: false,
            subgoalsEditView: undefined
        })
    }

    hideSubGoalsForm = () => {
        this.setState({showSubGoalsForm: false,showUpdateWeigthage: false})
    }
    
     hideSubGoalsViewChanges = () => {
        this.setState({
            showSubGoalsViewChanges: false
        })

    }

    updateList = () => {
        this.setState({
          PerformanceGoalsForm: undefined,
          showSubGoalsForm: false,
          showUpdateWeigthage: false,
          showSubGoalsAction: false
        }, () => {
          this.fetchList();
        })
       
      }
    
    render() {
        const { subgoalsEditView,subgoalsViewHistory } = this.state
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        const menuItems = (text) => {
            let achievementValidation = text.achievement == null?0:text.achievement
            const items = [];
            {this.props.goalStatus != 0 &&  items.push(
              <div>
                <a className="muiMenu_item" href="#" 
              onClick={() => {let { PerformanceGoalsForm } = this.state;
              PerformanceGoalsForm = text;
              PerformanceGoalsForm.subgoalWeightage = text.goalWeightage
              PerformanceGoalsForm.issubGoalWeightage = text.weightage
              PerformanceGoalsForm.employeeId = this.props.goalsView.employeeId
             this.setState({ PerformanceGoalsForm,showSubGoalsForm:  true})
               }}
                //  onMouseOver={"Edit the subgoal name, description, or reassign it to a different parent goal."}
                 >
                  <i className="fa fa-pencil m-r-5" /><b>Edit</b></a>
                  </div> )};
            
          { achievementValidation < 100 && items.push(<div>
                <a className="muiMenu_item" href="#" 
             onClick={() => {let { subgoalsEditView } = this.state;
             subgoalsEditView = text;
             this.setState({ subgoalsEditView, showSubGoalsAction: true,subGoalsStatusId: text.achievementId })
              }}
                // onMouseOver={"Update progress, add comments, and upload supporting documents for this subgoal."} 
                >
                 <i className="fa fa-check-square-o  m-r-5" /><b>Update Progress</b></a>
              </div>
            );}
	    items.push(<div>
                    <a className="muiMenu_item" href="#" 
                        onClick={() => {let { subgoalsViewHistory } = this.state;
                        subgoalsViewHistory = text;
                        this.setState({ subgoalsViewHistory,showSubGoalsViewChanges: true })
                        }}
                    // onMouseOver={"View the full history of changes, including progress updates, comments, and attachments."}
                    >
                    <i className="fa fa-eye  m-r-5" /><b>View Change History</b></a>
                </div>
                );
             
      
            return items;
          };

        const columns = [
            {
                title: 'Sub Goals Name',
                render: (text, record) => {
                    return <>
                        <div>{record.name}  </div>
                    </>
                }
            },
            {
                title: 'Description',
                render: (text, record) => {
                    return <>
                        <div>{record.description}</div>
                    </>
                }

            },
            {
                title: 'Weightage',
                render: (text, record) => {
                    return <>
                        <div>{record.goalWeightage}</div>
                    </>
                }

            },
            {
                title: 'Priority',
                render: (text, record) => {
                    return <>  
        
                        <div>{text.priority == "0" ? "Low" : text.priority == "1" ?  "Medium" : "High"}</div>
                    </>
                }

            },
            {
                title: 'Progress',
                render: (text, record) => {
                    let achievementValidation = text.achievement == null?0:text.achievement
                  return <span >
                     <ProgressBar variant={achievementValidation   < 25 ? "danger" : achievementValidation >= 25 && achievementValidation < 50 ? "warning" :
                      achievementValidation >= 50 && achievementValidation < 75 ? "info" : achievementValidation > 75 ? "success" : "danger"
                     } 
                     animated  now={achievementValidation} label={<h2 style={{fontWeight:"bold"}}>{achievementValidation}%</h2>} style={{border:"1px solid grey"}}/></span>
                }
              },
            {
                title: 'Deadline',
                render: (text, record) => {
                    return <>
                        <div>{getReadableDate(record.deadline)}</div>
                    </>
                }

            },
            {
                title: 'Status', 
                render: (text, record) => {
                 
                    return <span className={ new Date(text.deadline) < new Date() ? "badge bg-inverse-danger":text.active ? "badge bg-inverse-success "  : "badge bg-inverse-danger"}>
                    { new Date(text.deadline) < new Date() ? <i className="pr-2 fa fa-clock-o text-danger"></i>  : text.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
                      new Date(text.deadline) < new Date() ? "Overdue"  : text.active ? 'Active' : 'In-active'
                    }</span>
                  
                }
              },
            {
                title: 'Action',
                width: 50,
                className: "text-center",
        
                render: (text, record) => (
                    <div className="">
                    <TableDropDown menuItems={menuItems(text)} />
                    </div>
                ),
            }


        ]
        return (
            <div className="row">
                <div className="col-md-12" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="col-md-3" style={{ backgroundColor: "#36A1D4", color: "#EEF8FB", borderRadius: "5px", height: "35px", flex: "1", marginRight: "10px" }}>
                <p style={{ textAlign: "center", fontWeight: "bold", paddingTop: "5px", margin: 0 }}>Goal Name : {this.state.goalsView.name} &nbsp;</p>
                    </div>
                    <div>
                    <button style={{ backgroundColor: "#36A1D4", color: "#EEF8FB",borderRadius: "5px",height: "35px",  border: "none", cursor: "pointer",padding: "0 15px", fontWeight: "bold" }} 
                    onClick={() => this.setState({showUpdateWeigthage: true,subGoalsWeightageData: this.state.data })}
                    >
                        Upgrade Attributes
                    </button>
                </div> </div>&nbsp;
                <div className="col-md-12">
                    <div className="table-responsive">
                    <Table id='Table-style' className="table-striped "
                            style={{ overflowX: 'auto' }}
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
                            columns={columns}
                            // bordered
                            dataSource={[...data]}
                            rowKey={record => record.id}
                        />
                    </div>
                </div>
    
	    
	            <Modal enforceFocus={false} size={"md"} show={this.state.showSubGoalsAction} onHide={this.hideSubGoalsAction} >
                    <Header closeButton>
                        <h5 className="modal-title">Sub Goals Action </h5>
                    </Header>
                    <Body>
                        <SubGoalsStatusAction subgoalsEditView={subgoalsEditView} subGoalsStatusId={this.state.subGoalsStatusId} subGoalValidationStatus={true} updateList={this.updateList}></SubGoalsStatusAction>
                    </Body>
                </Modal>

             <Modal enforceFocus={false} size={"md"} show={this.state.showSubGoalsForm} onHide={this.hideSubGoalsForm} >
            
            
                      <Header closeButton>
                        <h5 className="modal-title">Edit Sub Goals</h5>
            
                      </Header>
                      <Body>
                        <PerformanceSubGoalsForm multiForm={false} subGoalsEdit={true}  PerformanceSubGoalsForm={this.state.PerformanceGoalsForm} updateList={this.updateList}>
                        </PerformanceSubGoalsForm>
                      </Body>
            
            
                      </Modal>

                {/* update weightage */}
                <Modal enforceFocus={false} size={"xl"} show={this.state.showUpdateWeigthage} onHide={this.hideSubGoalsForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Upgrade Attributes</h5>

                    </Header>
                    <Body>
                        <SubGoalsEditWeigthage updateList={this.updateList} subGoalsWeightageData={this.state.subGoalsWeightageData} goalStatus= {this.props.goalStatus}>
                        </SubGoalsEditWeigthage>
                    </Body>


                </Modal>
		  <Modal enforceFocus={false} size={"xl"} show={this.state.showSubGoalsViewChanges} onHide={this.hideSubGoalsViewChanges} >
                    <Header closeButton>
                        <h5 className="modal-title">Sub Goals Status History </h5>
                    </Header>
                    <Body>
                        <SubGoalsStatusHistory subgoalsViewHistory={subgoalsViewHistory}></SubGoalsStatusHistory>
                    </Body>
                </Modal>
            </div>
        )
    }
}
