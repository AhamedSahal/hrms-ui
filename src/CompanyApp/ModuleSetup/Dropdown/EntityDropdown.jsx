import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class EntityDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount(){
        const { companyId } = this.props;
        this.props.getEntity(companyId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getEntity(this.props.companyId);
        }
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Entity</option>
                    {this.props.entity && this.props.entity.map((entity, index) => {
                        return <option key={index} value={entity.id} selected={this.props.defaultValue == entity.id}>{entity.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        entity: state.dropdown.entity
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getEntity: (companyId) => {
            dispatch(DropdownService.getEntity(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EntityDropdown);
