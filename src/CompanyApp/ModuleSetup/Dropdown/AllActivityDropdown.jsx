import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class AllActivityDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectId: props.projectId
        }
    }
    componentDidMount(){
        const { activity } = this.props;
        if(!activity || activity.length==0){
            console.log("Loading all activities");
             this.props.getActivity();
        }
    }
     
 

    render() {
        let projectActivities = [];
        if(this.props.activity && this.props.activity.length>0 ){ 
            projectActivities =  this.props.activity.filter(a => {
            return a.projectId == this.props.projectId;
          })
        }
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange} required={this.props.isRequired}>
                    <option value="">Select Activity</option>
                    {projectActivities && projectActivities.map((activity, index) => {
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
        getActivity: () => {
            dispatch(DropdownService.getAllActivity())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AllActivityDropdown);
