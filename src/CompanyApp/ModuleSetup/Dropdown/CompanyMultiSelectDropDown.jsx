import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { getMultiEntityCompanies } from "../../../utility"; 

class CompanyMultiSelectDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: props.defaultValue || [],
      companies: [],
    };
  }

  componentDidMount() {
    const companies = getMultiEntityCompanies();
    this.setState({ companies });
  }

  formatOptions = () => {
    const { companies } = this.state;
    const { excludeId } = this.props; 

    return companies
      .filter((company) => company.id !== excludeId) 
      .map((company) => ({
        value: company.id,
        label: company.name,
      }));
  };

  handleChange = (selectedOptions) => {
    this.setState({ selectedOptions });
  
    if (this.props.onChange) {
      this.props.onChange(selectedOptions || []);
    }
  };
  

  render() {
    return (
      <div>
        <Select
          value={this.state.selectedOptions}
          isMulti={!this.props.isMulti}
          options={this.formatOptions()}
          className="basic-multi-select multiSectCustmz"
          classNamePrefix="select"
          onChange={this.handleChange}
          placeholder="Select Company"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  companies: state.companies,
});

export default connect(mapStateToProps)(CompanyMultiSelectDropDown); 
