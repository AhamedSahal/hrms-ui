import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class RoleDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
  
    componentDidMount() {
        this.props.getRoles();
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
        getRoles: () => {
            dispatch(DropdownService.getRoles())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RoleDropdown);
