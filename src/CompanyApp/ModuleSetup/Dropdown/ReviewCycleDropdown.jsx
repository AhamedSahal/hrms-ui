import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ReviewCycleDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            empId:props.empId || 0,
        };

    }

    componentDidMount() {
      console.log("props.empId : ",this.props.empId )
      this.props.getReviewCycle(this.props.empId);
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange}>
                    <option value="">Select Review Cycle</option>
                    {this.props.reviewCycle && this.props.reviewCycle.map((reviewCycle, index) => {
                        return <option key={index} value={reviewCycle.id} selected={this.props.defaultValue == reviewCycle.id}>{reviewCycle.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps:",state.dropdown.reviewCycle)
    return {
        
        reviewCycle: state.dropdown.reviewCycle
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getReviewCycle: (empId) => {
            dispatch(DropdownService.getReviewCycle(empId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReviewCycleDropdown);
