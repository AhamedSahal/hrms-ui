import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class FunctionDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getFunctions();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Function</option>
                    {this.props.functions && this.props.functions.map((functions, index) => {
                        return <option key={index} value={functions.id} selected={this.props.defaultValue == functions.id}>{functions.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        functions: state.dropdown.functions
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getFunctions: () => {
            dispatch(DropdownService.getFunctions())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FunctionDropdown);
