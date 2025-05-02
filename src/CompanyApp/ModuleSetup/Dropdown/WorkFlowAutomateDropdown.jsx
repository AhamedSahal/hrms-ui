import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';


class WorkFlowAutomateDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
      console.log("workflow",1)
        this.props.getWorkFlowAutomate();
    }

  render() {
    return (
      <>
      <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange}>
          <option value="">Select Workflow</option>
          {this.props.workFlowAutomate && this.props.workFlowAutomate.map((workflow, index) => {
              return <option key={index} value={workflow.id} selected={this.props.defaultValue == workflow.id}>{workflow.name}</option>
          })}
      </select>
  </>
    )
  }


}

const mapStateToProps = (state) => {
  return {
    workFlowAutomate: state.dropdown.workFlowAutomate
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getWorkFlowAutomate: () => {
          dispatch(DropdownService.getWorkFlowAutomate())
      }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WorkFlowAutomateDropdown);

