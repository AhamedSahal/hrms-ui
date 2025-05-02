import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ApplicantDropDown extends Component {
    constructor(props) {
        super(props)

    }
    
    componentDidMount() {
        this.props.getApplicants();
    }
  render() {
    
    return (
        <>
            <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange}>
                <option value="">Select Applicant Field</option>
                {this.props.applicant && this.props.applicant.map((project, index) => {
                    return <option key={index} value={project.id} selected={this.props.defaultValue == project.id}>{project.name}</option>
                })}
            </select>
        </>
    )
  }
}

const mapStateToProps = (state) => {
    return {
        applicant: state.dropdown.applicant
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getApplicants: () => {
            dispatch(DropdownService.getApplicants())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicantDropDown);
