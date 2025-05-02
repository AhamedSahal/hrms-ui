import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class RoleDropdownByCompanyId extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        const { companyId } = this.props;
            this.props.getRolesByCompanyId(companyId);
    }
    componentDidUpdate(prevProps) {
        const { companyId } = this.props;  
        if (companyId !== prevProps.companyId) {
            this.props.getRolesByCompanyId(companyId);
        }
    }
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Role</option>
                    {this.props.roles && this.props.roles.map((role, index) => {
                        return <option key={index} value={role.id} selected={this.props.defaultValue==role.id}>{role.name}</option>
                    })}
                </select> 
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        roles: state.dropdown.roles
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getRolesByCompanyId: (companyId) => {
            dispatch(DropdownService.getRolesByCompanyId(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RoleDropdownByCompanyId);
