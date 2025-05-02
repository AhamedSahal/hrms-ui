import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class RevenueDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getRevenue();
    }
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Department</option>
                    {this.props.revenue && this.props.revenue.map((revenue, index) => {
                        return <option key={index} value={revenue.id}>{revenue.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        revenue: state.dropdown.revenue
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getRevenue: () => {
            dispatch(DropdownService.getPayhubRevanue())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RevenueDropdown);
