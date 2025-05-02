import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class ExpenseCategoryDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getExpenseCategory();
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2" onChange={this.props.onChange}>
                    <option value="">Select Expense Category</option>
                    {this.props.expensecategories && this.props.expensecategories.map((expensecategories, index) => {
                        return <option key={index} value={expensecategories.id} selected={this.props.defaultValue == expensecategories.id}>{expensecategories.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        expensecategories: state.dropdown.expensecategories
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getExpenseCategory: () => {
            dispatch(DropdownService.getExpenseCategory())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExpenseCategoryDropdown);
