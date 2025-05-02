import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class JobTitlesDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const { companyId } = this.props;
        this.props.getJobTitles(companyId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getJobTitles(this.props.companyId);
        }
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select JobTitles</option>
                    {this.props.jobTitles && this.props.jobTitles.map((jobTitles, index) => {
                        return <option key={index} value={jobTitles.id} selected={this.props.defaultValue == jobTitles.id}>{jobTitles.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        jobTitles: state.dropdown.jobTitles
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getJobTitles: (companyId) => {
            dispatch(DropdownService.getJobTitles(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobTitlesDropdown);
