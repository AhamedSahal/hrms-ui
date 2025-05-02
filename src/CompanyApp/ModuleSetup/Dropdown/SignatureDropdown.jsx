import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class SignatureDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getSignatures();
        window.TriggerSelect2();
        window.BindSelect2Event();
    }
    componentDidUpdate(){
       
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Signature</option>
                    {this.props.signatures && this.props.signatures.map((signature, index) => {
                        return <option key={index} data-img={signature.signature} data-designation={signature.designation} value={signature.signature} selected={this.props.defaultValue == signature.id}>{signature.name} ({signature.designation})</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        signatures: state.dropdown.signatures
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getSignatures: () => {
            dispatch(DropdownService.getSignatures())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignatureDropdown);
