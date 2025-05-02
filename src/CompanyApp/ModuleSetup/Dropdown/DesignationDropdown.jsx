import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class DesignationDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getDesignationes();
    }
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Designation</option>
                    {this.props.designations && this.props.designations.map((designation, index) => {
                        return <option key={index} value={designation.id}>{designation.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        designations: state.dropdown.designations
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getDesignationes: () => {
            dispatch(DropdownService.getDesignations())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DesignationDropdown);
