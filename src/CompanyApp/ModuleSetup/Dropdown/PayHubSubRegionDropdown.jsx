import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class SubRegionDropdown extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        this.props.getSubRegion();
    }
    
    render() { 
        return (
            <>
                <select disabled={this.props.readOnly} value={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select SubRegion</option>
                    {this.props.subRegion && this.props.subRegion.map((subRegion, index) => {
                        return <option key={index} value={subRegion.id}>{subRegion.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        subRegion: state.dropdown.subRegion
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getSubRegion: () => {
            dispatch(DropdownService.getPayhubSubRegion())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SubRegionDropdown);
