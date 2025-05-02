import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';


class WorkFlowStepAutomateDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workflowId: props.workflowId
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.workflowId && nextProps.workflowId != prevState.workflowId) {
            return ({ workflowId: nextProps.workflowId });
        }
        return ({ workflowId: "" })
    }

    componentDidUpdate(prevProps, prevState) {
        const { workflowId } = this.state;
        const { workflowStepAutomate } = this.props;
        if (!!workflowId) { 
            if(workflowStepAutomate && workflowStepAutomate.length>0 && workflowStepAutomate.findIndex(a=>a.workflowId==workflowId)>-1){
                return;
            }
            this.props.getWorkFlowStepAutomate(workflowId);
            
        }
    }


    

  render() {
    return (
      <>
      <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange}>
          <option value="">Select Workflow Step</option>
          {this.props.workflowStepAutomate && this.props.workflowStepAutomate.map((workflowStepAutomate, index) => { 
             return <option key={index} value={workflowStepAutomate.id} selected={this.props.defaultValue == workflowStepAutomate.id}>{workflowStepAutomate.name}</option>
          })}
      </select>
  </>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    workflowStepAutomate: state.dropdown.workflowStepAutomate
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getWorkFlowStepAutomate: (workflowId) => {
          dispatch(DropdownService.getWorkFlowStepAutomate(workflowId))
      }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WorkFlowStepAutomateDropdown);

