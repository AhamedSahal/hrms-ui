import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class GradesDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getGrades();
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Grades</option>
                    {this.props.grades && this.props.grades.map((grades, index) => {
                        return <option key={index} value={grades.id} selected={this.props.defaultValue == grades.id}>{grades.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        grades: state.dropdown.grades
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getGrades: () => {
            dispatch(DropdownService.getGrades())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GradesDropdown);
