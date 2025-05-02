import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class DivisionDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getDivisions();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Division</option>
                    {this.props.divisions && this.props.divisions.map((divisions, index) => {
                        return <option key={index} value={divisions.id} selected={this.props.defaultValue == divisions.id}>{divisions.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        divisions: state.dropdown.divisions
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getDivisions: () => {
            dispatch(DropdownService.getDivisions())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DivisionDropdown);
