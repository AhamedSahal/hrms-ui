import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ProjectDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const { companyId } = this.props;
        this.props.getProjects(companyId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getProjects(this.props.companyId);
        }
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange} required={this.props.isRequired}>
                    <option value="">Select Project</option>
                    {this.props.project && this.props.project.map((project, index) => {
                        return <option key={index} value={project.id} selected={this.props.defaultValue == project.id}>{project.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        project: state.dropdown.project
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getProjects: (companyId) => {
            dispatch(DropdownService.getProjects(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDropdown);
