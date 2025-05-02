import React, { Component } from 'react';
import { getPasswordPolicy, getPasswordValidationMessage } from '../utility';

const regex = getPasswordPolicy();
const passwordValidationMessage = getPasswordValidationMessage();
class PasswordField extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef()
        this.state = {
            errorMessage: '',
        };
    }
    validatePasswordWithRegex = (value) => {
        if (!value || value.length === 0) {
            this.setState({ errorMessage: 'Password is required' });
            return false;
        }
        if (value.match(regex)) {
            this.setState({ errorMessage: '' });
            return true;
        } else {
            this.setState({ errorMessage: passwordValidationMessage });
            return false;
        }
    }
    render() {
        return (
            <div>
                <input ref={this.inputRef} type={this.props.type}  pattern={regex || "*"} name="password" className="form-control" placeholder="Password *" onChange={e => {
                    this.validatePasswordWithRegex(e.target.value);
                    this.props.onChange(e.target.value);
                }} />
                <div className="error-message text-danger">{this.state.errorMessage}</div>
            </div>
        );
    }
}

export default PasswordField;
