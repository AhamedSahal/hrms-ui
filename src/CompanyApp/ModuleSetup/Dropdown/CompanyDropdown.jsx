import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class CompanyDropdown extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        this.props.getCompanies();
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control bindSelect2" onChange={this.props.onChange}>
                    <option value="">Select Company</option>
                    {this.props.companies && this.props.companies.map((company, index) => {
                        return <option key={index} value={company.id} selected={this.props.defaultValue == company.id}>{company.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        companies: state.dropdown.companies
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getCompanies: () => {
            dispatch(DropdownService.getCompanies())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyDropdown);
