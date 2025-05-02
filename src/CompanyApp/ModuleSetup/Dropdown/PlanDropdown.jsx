import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class PlanDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
  
    componentDidMount() {
        this.props.getPlans();
    }
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Plan</option>
                    {this.props.plans && this.props.plans.map((plan, index) => {
                        return <option key={index} value={plan.id} selected={this.props.defaultValue==plan.id}>{plan.name}</option>
                    })}
                </select> 
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        plans: state.dropdown.plans
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getPlans: () => {
            dispatch(DropdownService.getPlans())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanDropdown);
