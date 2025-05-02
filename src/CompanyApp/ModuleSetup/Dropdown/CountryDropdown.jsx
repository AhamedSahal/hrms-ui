import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class CountryDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getCountries();
    }
    
    
    render() { 
        return (
            <>
                <select required={this.props.required} disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Country</option>
                    {this.props.countries && this.props.countries.map((country, index) => {
                        return <option key={index} value={country.id} selected={this.props.defaultValue==country.id}>{country.name}</option>
                    })}
                </select> 
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        countries: state.dropdown.countries
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getCountries: () => {
            dispatch(DropdownService.getCountries())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CountryDropdown);
