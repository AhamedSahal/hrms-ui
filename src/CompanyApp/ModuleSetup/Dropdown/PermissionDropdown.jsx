import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class PermissionTypeDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeId: props.employeeId,
            oldEmployeeId : 0
        }

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.employeeId && nextProps.employeeId != prevState.employeeId) {
            return ({ employeeId: nextProps.employeeId });
        }
        return ({ employeeId: "" })
    }

    componentDidMount() {
        if (this.props.employeeId) { 
            this.props.getPermissionTypes(this.props.employeeId);
        } 
    }
 
    componentDidUpdate(prevProps, prevState) {
        const { employeeId, oldEmployeeId } = this.state;
        const { permissionType } = this.props;
        if (employeeId) {
            if(permissionType && permissionType.length > 0 && oldEmployeeId==employeeId){
                return;
            }
            this.setState({
                oldEmployeeId : employeeId
              }, () => {
                this.props.getLeaveTypes(employeeId);
              });
           
        }
    }

    onChange = (e)=> {
        const { permission } = this.props;
        var permissionType = permission.find(item => item.id === parseInt(e.target.value));
        var attachmentRequired = permissionType?.attachmentRequired;
        this.props.setFieldValue("permissionId", e.target.value);
        this.props.setFieldValue("permissionType", e.target.value);
        this.props.onChange(e.target.value, attachmentRequired);
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.onChange}>
                    <option value="" >Select Permission Type</option>
                    <option value="" >Late Arrival</option>
                    <option value="" >Early Exit </option>
                    <option value="" >Early In & Early Out</option>
                    <option value="" >Flexible Hours </option>
                    
                    {this.props.permissionTypes && this.props.permissionTypes.map((permissionType, index) => {
                        return <option key={index} value={permissionType.id} selected={this.props.defaultValue == permissionType.id} attachmentRequired={permissionType.attachmentRequired}>{permissionType.name} </option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        permissionType: state.dropdown.permissionType
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getPermissionTypes: (employeeId) => {
            dispatch(DropdownService.getPermissionTypes(employeeId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PermissionTypeDropdown);
