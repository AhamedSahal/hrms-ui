import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ReligionDropdown extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        this.props.getReligions();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Religion</option>
                    {this.props.religions && this.props.religions.map((religion, index) => {
                        return <option key={index} value={religion.id} selected={this.props.defaultValue == religion.id}>{religion.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        religions: state.dropdown.religions
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getReligions: () => {
            dispatch(DropdownService.getReligions())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ReligionDropdown);
