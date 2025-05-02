import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ActivityDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectId: props.projectId
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.projectId && nextProps.projectId != prevState.projectId) {
            return ({ projectId: nextProps.projectId });
        }
        return ({ projectId: "" })
    }

    componentDidUpdate(prevProps, prevState) {
        const { projectId } = this.state;
        const { activity } = this.props;
        if (!!projectId) {
            if(activity && activity.length>0 && activity.findIndex(a=>a.projectId==projectId)>-1){
                return;
            }
            this.props.getActivity(projectId);
        }
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Activity</option>
                    {this.props.activity && this.props.activity.map((activity, index) => {
                        return <option key={index} value={activity.id} selected={this.props.defaultValue == activity.id}>{activity.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        activity: state.dropdown.activity
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getActivity: (projectId) => {
            dispatch(DropdownService.getActivity(projectId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityDropdown);
