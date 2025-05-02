import React, { Component } from 'react'

export default class EnumDropdown extends Component {
    render() {
        const { label, defaultValue, onChange, enumObj,readOnly,disabledValues } = this.props; 
        return (
            <>
                <select defaultValue={defaultValue} disabled={readOnly}
                    className="form-control survey-dropdown select" onChange={onChange}>
                    {label && <option value="">Select {label}</option>}
                    {Object.keys(enumObj).map((e, index) => {
                        return <option key={index} value={e} disabled={disabledValues && disabledValues.indexOf(e)>-1} selected={this.props.defaultValue == e}>{e}</option>
                    })}
                </select>
            </>
        )
    }
}
