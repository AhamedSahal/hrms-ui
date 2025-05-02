import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class CategoryDropdown extends Component {
    constructor(props) {
        super(props)
        
    }

 componentDidMount() {
    this.props.getCategory()
   
 }
 componentDidUpdate(prevProps) {
    if (prevProps.refreshCategory !== this.props.refreshCategory) {
        this.componentDidMount();
    }
}

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control survey-dropdown" onChange={this.props.onChange}>
                    <option value="">Select Category</option>
                    {this.props.category && this.props.category.map((category, index) => {
                        return <option key={index} value={category.id} selected={this.props.defaultValue == category.id}>{category.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      category: state.dropdown.category
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getCategory: () => {
            dispatch(DropdownService.getCategory())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CategoryDropdown);
