import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { CONSTANT } from '../../../constant';
import { DropdownService } from './DropdownService';
import EmployeePhoto from '../../Employee/employeePhoto';
import EmployeeProfilePhoto from '../../Employee/widgetEmployeePhoto';

class EmployeeMultiSelectDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: this.props.defaultValue || [],
        };
    }

    componentDidMount() {
        this.props.getEmployees();
    }

    //  employee options for the dropdown
    formatOptions = () => {
        const { employees, excludeId } = this.props;
        return employees
            .filter((employee) => employee.id !== excludeId)
            .map((employee) => ({
                value: employee.id,
                label: employee.name,
            }));
    };

    // Handle selection change
    handleChange = (selectedOptions) => {
        this.setState({ selectedOptions });
        if (this.props.onChange) {
            this.props.onChange(selectedOptions);
        }
    };

    // Custom rendering for dropdown options
    renderOption = ({ data, innerRef, innerProps }) => (
        <div
            ref={innerRef}
            {...innerProps}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                cursor: 'pointer',
            }}
        >
            <EmployeeProfilePhoto className='multiSelectImgSize' id={data.value}></EmployeeProfilePhoto>
           
            {data.label}
        </div>
    );

    //  rendering for selected values
    renderMultiValue = ({ data }) => (
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
             <EmployeeProfilePhoto className='multiSelectImgSize' id={data.value}></EmployeeProfilePhoto>
            
            {data.label}
        </div>
    );

    render() {
        const { selectedOptions } = this.state;

        return (
            <div>
                <Select
                    value={selectedOptions}
                    isMulti
                    options={this.formatOptions()}
                    className="basic-multi-select multiSectCustmz"
                    classNamePrefix="select"
                    onChange={this.handleChange}
                    components={{
                        Option: this.renderOption, 
                        MultiValue: this.renderMultiValue, 
                    }}
                    placeholder="Select Employee"
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    employees: state.dropdown.employees,
});

const mapDispatchToProps = (dispatch) => ({
    getEmployees: () => dispatch(DropdownService.getEmployees()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeMultiSelectDropDown);
