import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class GoalsEmployeeDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        let {employeeId} = this.props
       

        this.props.getGoalsEmployee(employeeId);
    }

    componentDidUpdate(prevProps) {
        const { employeeId } = this.props;

        if (prevProps.employeeId !== employeeId) {

            if (employeeId > 0) {
                this.props.getGoalsEmployee(employeeId);
            }
        }
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
        goals: state.dropdown.goalsEmployee
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getGoalsEmployee: (id) => {
            dispatch(DropdownService.getGoalsEmployee(id))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GoalsEmployeeDropdown);
