import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class shiftsDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getShift();
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} id="shifts" defaultValue={this.props.defaultValue} className="form-control"onChange={this.props.onChange}>
                    <option value="">Select Shifts</option>
                    {this.props.shift && this.props.shift.map((shift, index) => {
                        return <option key={index} value={shift.id} selected={this.props.defaultValue == shift.id}>{shift.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shift: state.dropdown.shift
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getShift: () => {
            dispatch(DropdownService.getShift())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(shiftsDropdown);
