import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class AssetsCategoryDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getAssetCategory();
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange}>
                    <option value="">Select Category</option>
                    {this.props.AssetsCategory && this.props.AssetsCategory.map((AssetsCategory, index) => {
                        return <option key={index} value={AssetsCategory.id} selected={this.props.defaultValue == AssetsCategory.id}>{AssetsCategory.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AssetsCategory: state.dropdown.AssetsCategory
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getAssetCategory: () => {
            dispatch(DropdownService.getAssetCategory())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AssetsCategoryDropdown);
