import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class IndustryDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getIndustries();
    }
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Industry</option>
                    {this.props.industry && this.props.industry.map((industry, index) => {
                        return <option key={index} value={industry.id}>{industry.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        industry: state.dropdown.industry
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getIndustries: () => {
            dispatch(DropdownService.getPayhubIndustry())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(IndustryDropdown);
