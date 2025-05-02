import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class NationalityDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getNationalities();
    }
    
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Nationality</option>
                    {this.props.nationalities && this.props.nationalities.map((nationality, index) => {
                        return <option key={index} value={nationality.id} selected={this.props.defaultValue==nationality.id}>{nationality.name}</option>
                    })}
                </select> 
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        nationalities: state.dropdown.nationalities
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getNationalities: () => {
            dispatch(DropdownService.getNationalities())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NationalityDropdown);
