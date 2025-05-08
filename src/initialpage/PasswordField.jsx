import React, { Component } from 'react';
import { getPasswordPolicy, getPasswordValidationMessage } from '../utility';

class PasswordField extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef()
        this.state = {
            errorMessage: '',
        };
    }
    validatePassword = (value) => {
        const regexPattern = getPasswordPolicy();
        const regex = new RegExp(regexPattern);
        const errorText = getPasswordValidationMessage();

        if (!value) {
            this.setState({ errorMessage: "Password is required" });
            return false;
        }
        if (!regex.test(value)) {
            this.setState({ errorMessage: errorText });
            return false;
        }

        this.setState({ errorMessage: "" });
        return true;
    };
    validatePasswordWithRegex = (value) => {
        return this.validatePassword(value);
    };
    handleChange = (e) => {
        const { value } = e.target;
        this.validatePassword(value);
        this.props.onChange(value);
    };
    render() {
        return (
            <div>
                <input type="password" name="password" className="form-control" placeholder="Password *"
                    onChange={this.handleChange}
                />
                <div className="error-message text-danger">{this.state.errorMessage}</div>
            </div>
        );
    }
}

export default PasswordField;
