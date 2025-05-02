import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from '../Dropdown/DropdownService';

class PaymentModeDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getPaymentModes();
    }

    // onChange = (e)=> {
    //   let  paymentMode  = this.props.paymentModes;
    //     var paymentModeType = paymentMode.find(item => item.id === parseInt(e.target.value));
    //     var paymentModeName = paymentModeType?.paymentModeName;
    //     this.props.setFieldValue("paymentModeName", e.target.value);
    //     // this.props.onChange(e.target.value, paymentModeName);
    // }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Payment Mode</option>
                    {this.props.paymentModes && this.props.paymentModes.map((paymentMode, index) => {
                        return <option key={index} value={paymentMode.id}selected={this.props.defaultValue == paymentMode.id} > {paymentMode.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        paymentModes: state.dropdown.paymentModes
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getPaymentModes: () => {
            dispatch(DropdownService.getPaymentModes())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentModeDropdown);
