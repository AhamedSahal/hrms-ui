import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class RegionDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getRegion();
    }
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Region</option>
                    {this.props.region && this.props.region.map((region, index) => {
                        return <option key={index} value={region.id}>{region.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        region: state.dropdown.region
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getRegion: () => {
            dispatch(DropdownService.getPayhubRegion())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(RegionDropdown);
