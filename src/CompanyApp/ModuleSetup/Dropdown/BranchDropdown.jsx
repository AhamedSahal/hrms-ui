import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class BranchDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const { companyId } = this.props;
        this.props.getBranches(companyId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getBranches(this.props.companyId);
        }
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Location</option>
                    {this.props.branches && this.props.branches.map((branch, index) => {
                        return <option key={index} value={branch.id} selected={this.props.defaultValue == branch.id}>{branch.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        branches: state.dropdown.branches
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getBranches: (companyId) => {
            dispatch(DropdownService.getBranches(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(BranchDropdown);
