import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class shiftDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getShifts();
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} id= "shifts" defaultValue={this.props.defaultValue} className="form-control" onChange={(e)=>{
                if(e.target.selectedIndex!==0)
                {
                    this.props.onChange(this.props.shifts[e.target.selectedIndex-1]) 
                }
                return null         
                }}>
                    <option value="">Select Shifts</option>
                    {this.props.shifts && this.props.shifts.map((shifts, index) => {
                        return <option key={index}  value={shifts.id} selected={this.props.defaultValue == shifts.id}>{shifts.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        shifts: state.dropdown.shifts
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getShifts: () => {
            dispatch(DropdownService.getShifts())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(shiftDropdown);
