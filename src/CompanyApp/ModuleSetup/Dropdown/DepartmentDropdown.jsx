import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class DepartmentDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        const { companyId } = this.props;
        this.props.getDepartmentes(companyId); 
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getDepartmentes(this.props.companyId);
        }
    }
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Department</option>
                    {this.props.departments && this.props.departments.map((department, index) => {
                        return <option key={index} value={department.id}>{department.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        departments: state.dropdown.departments
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getDepartmentes: (companyId) => {
            dispatch(DropdownService.getDepartments(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DepartmentDropdown);
