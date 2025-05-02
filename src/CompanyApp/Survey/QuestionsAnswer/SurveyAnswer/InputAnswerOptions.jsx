import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



class InputAnswerOptions extends Component {
    render() {
        const { value, onChange, onRemove, readOnly, placeholder, image, answerReadOnly } = this.props;
        return (
            <div className='mb-2'>
                <input
                    className='option-input-div'
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={answerReadOnly}
                />
                {!readOnly && !answerReadOnly && (
                    <button
                        className='option-deduct-but'
                        onClick={onRemove}
                        disabled={answerReadOnly}
                    >
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </button>
                )}
                {!readOnly && !answerReadOnly && (
                    <input
                        className='survey-option-input'
                        type="file"
                        accept="image/*"
                        disabled={answerReadOnly}
                        onChange={this.props.onFileChange}
                    />
                )}
                {image && <img className='square-image' src={image} alt={value} />}
            </div>
        );
    }
}

export default InputAnswerOptions;



