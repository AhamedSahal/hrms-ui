import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class WeekOffDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getWeekOff();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} id="weekoff" defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Weekly Off</option>
                    {this.props.weekoff && this.props.weekoff.map((weekoff, index) => {
                        return <option key={index} value={weekoff.id} selected={this.props.defaultValue == weekoff.id}>{weekoff.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        weekoff: state.dropdown.weekoff
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getWeekOff: () => {
            dispatch(DropdownService.getWeekOff())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(WeekOffDropdown);
