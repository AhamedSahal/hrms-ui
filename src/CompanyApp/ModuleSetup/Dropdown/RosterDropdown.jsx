import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class rosterDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getRoster();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} id="rosterId" defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Roster</option>
                    {this.props.roster && this.props.roster.map((roster, index) => {
                        return <option key={index} value={roster.id} selected={this.props.defaultValue == roster.id}>{roster.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        roster: state.dropdown.roster
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getRoster: () => {
            dispatch(DropdownService.getRoster())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(rosterDropdown);
