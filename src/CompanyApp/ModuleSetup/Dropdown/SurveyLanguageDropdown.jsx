import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class SurveyLanguageDropdown extends Component {
  componentDidMount() {
    this.props.getSurveyLanguages(this.props.surveyId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab === 'details') {
      this.props.getSurveyLanguages(this.props.surveyId);
    }
  }

  render() {
    return (
      <>
        <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control col-md-4 mb-4" onChange={this.props.onChange}>
          <option>Select Language</option>
          {this.props.surveyLanguages && this.props.surveyLanguages.map((surveyLanguage, index) => {
            return <option key={index} value={surveyLanguage.id}>{surveyLanguage.name}</option>
          })}
        </select>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    surveyLanguages: state.dropdown.surveyLanguages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSurveyLanguages: (surveyId) => {
      dispatch(DropdownService.getSurveyLanguages(surveyId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyLanguageDropdown);
