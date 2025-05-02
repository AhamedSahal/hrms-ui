import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ObjectiveGroupDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getObjectiveGroups();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Objective Group</option>
                    {this.props.objectivegroups && this.props.objectivegroups.map((objectivegroup, index) => {
                        return <option key={index} value={objectivegroup.id} selected={this.props.defaultValue == objectivegroup.id}>{objectivegroup.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        objectivegroups: state.dropdown.objectivegroups
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getObjectiveGroups: () => {
            dispatch(DropdownService.getObjectiveGroups())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ObjectiveGroupDropdown);
