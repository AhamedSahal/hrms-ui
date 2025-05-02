import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class SurveyDropdown extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        this.props.getSurveys();
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control col-md-4 mb-4" onChange={this.props.onChange}>
                    <option>Select Survey</option>
                    {this.props.surveys && this.props.surveys.map((survey, index) => {
                        return <option key={index} value={survey.id}>{survey.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        surveys: state.dropdown.surveys
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getSurveys: () => {
            dispatch(DropdownService.getSurveys())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SurveyDropdown);
