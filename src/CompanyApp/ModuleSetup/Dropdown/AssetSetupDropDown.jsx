import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class AssetSetupDropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assetCatId: props.assetCatId
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.assetCatId && nextProps.assetCatId != prevState.assetCatId) {
            return ({ assetCatId: nextProps.assetCatId });
        }
        return ({ assetCatId: "" })
    }

    componentDidUpdate(prevProps, prevState) {
        const { assetCatId } = this.state;
        const { AssetSetup } = this.props;
        if (!!assetCatId) {
            if(AssetSetup && AssetSetup.length>0 && AssetSetup.findIndex(a=>a.assetCatId==assetCatId)>-1){
                return;
            }
            this.props.getAssetSetup(assetCatId);
        }
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Asset</option>
                    {this.props.AssetSetup && this.props.AssetSetup.map((AssetSetup, index) => {
                        return <option key={index} value={AssetSetup.id} selected={this.props.defaultValue == AssetSetup.id}>{AssetSetup.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        AssetSetup: state.dropdown.AssetSetup
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getAssetSetup: (assetCatId) => {
            dispatch(DropdownService.getAssetSetup(assetCatId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AssetSetupDropDown);
