import React, { Component } from 'react'

export default class WeekDaysDropdown extends Component {
    render() {
        const { label, defaultValue, onChange,readOnly,isMultiple,id } = this.props; 
         return (
            <>
                <select  id={id} disabled={readOnly} multiple={isMultiple}
                    className="form-control" onChange={onChange}>
                    {label && <option value="">Select {label}</option>}
                    <option selected={defaultValue && defaultValue.includes("MONDAY")} value="MONDAY">Monday</option>
                    <option selected={defaultValue && defaultValue.includes("TUESDAY")} value="TUESDAY">Tuesday</option>
                    <option selected={defaultValue && defaultValue.includes("WEDNESDAY")} value="WEDNESDAY">Wednesday</option>
                    <option selected={defaultValue && defaultValue.includes("THURSDAY")} value="THURSDAY">Thursday</option>
                    <option selected={defaultValue && defaultValue.includes("FRIDAY")} value="FRIDAY">Friday</option>
                    <option selected={defaultValue && defaultValue.includes("SATURDAY")} value="SATURDAY">Saturday</option>
                    <option selected={defaultValue && defaultValue.includes("SUNDAY")} value="SUNDAY">Sunday</option>
                    
                </select>
            </>
        )
    }
}
