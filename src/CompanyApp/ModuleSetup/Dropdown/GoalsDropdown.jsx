import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class GoalsDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getGoals();
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Goals</option>
                    {this.props.goals && this.props.goals.map((goals, index) => {
                        return <option key={index} value={goals.id} selected={this.props.defaultValue == goals.id}>{goals.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        goals: state.dropdown.goals
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getGoals: () => {
            dispatch(DropdownService.getGoals())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GoalsDropdown);
