import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class RecognitionCategoryDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getRecognitionCategory();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Category</option>
                    {this.props.recognition && this.props.recognition.map((recognition, index) => {
                        return <option key={index} value={recognition.id} selected={this.props.defaultValue == recognition.id}>{recognition.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        recognition: state.dropdown.recognition
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getRecognitionCategory: () => {
            dispatch(DropdownService.getRecognitionCategory())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RecognitionCategoryDropdown);
