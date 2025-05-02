import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { CONSTANT } from "../../../constant";
import { employeeProfilePhotoURL } from "../../../HttpRequest";
import { DropdownService } from "./DropdownService";
import EmployeeProfilePhoto from "../../Employee/widgetEmployeePhoto";

class EmpMultiSelectDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEmployees: props.defaultValue || [],
    };
  }

  componentDidMount() {
    const { permission } = this.props;
    this.props.getEmployees(permission);
    this.props.employees.forEach((employee) => {
      this.triggerProfilePhotoLoad(employee.id);
    });
  }

  triggerProfilePhotoLoad = (id) => {
    employeeProfilePhotoURL(id)
      .then((url) => {
        window.bindProfilePhoto(id, url);
      })
      .catch((error) => {
        console.warn("Error retrieving employee profile photo:", error);
      });
  };

  handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    this.setState({ selectedEmployees: selectedValues });

    if (this.props.setFieldValue) {
      this.props.setFieldValue(this.props.name, selectedValues); // Updating Formik field
    }
  };

  render() {
    const { excludeId, readOnly, isRequired, employees } = this.props;

    const options = employees
      .filter((e) => e.id != excludeId)
      .map((employee) => ({
        value: employee.id,
        label: <div>
          <EmployeeProfilePhoto className='multiSelectImgSize' id={employee.id} />
          {employee.name}
        </div>,
      }));

    const selectedOptions = options.filter((option) => this.state.selectedEmployees.includes(option.value));

    return (
      <Select
        isMulti
        isDisabled={readOnly}
        options={options}
        value={selectedOptions}
        onChange={this.handleChange}
        className="react-select-container"
        classNamePrefix="react-select"
        required={isRequired}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  employees: state.dropdown.employees,
});

const mapDispatchToProps = (dispatch) => ({
  getEmployees: (permission) => dispatch(DropdownService.getEmployees(permission)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmpMultiSelectDropDown);
