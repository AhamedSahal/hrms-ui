import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class CompanyDropDownByAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyId: props.companyId,
            allCompany: props.allCompany
        }
    } 
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.companyId && nextProps.companyId != prevState.companyId) {
            return ({ companyId: nextProps.companyId ,});
        }
        return ({ companyId: "" })
    }
    componentDidMount() {
        if (this.props.companyId) { 
            this.props.getCompanyListByAdmin(this.props.companyId,this.props.allCompany)
        } 
    }
 
    componentDidUpdate(prevProps) {
        const { companyId,refresh, companies,allCompany } = this.props;
        if(refresh){
            this.props.getCompanyListByAdmin(companyId,allCompany);
        }  
        if (companyId && prevProps.companyId !== companyId) {
            if (companies?.some(company => company.id === companyId)) {
                return;
            }
            this.props.getCompanyListByAdmin(companyId,allCompany);
           }     
    }

    render() {
        const {title, disableValue} = this.props;
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">{title ? title : 'Select Company'}</option>
                    {this.props.companies && this.props.companies.map((company, index) => {
                        return <option key={index} value={company.id} selected={this.props.defaultValue == company.id}
                        disabled={String(company.id) === String(disableValue)}
                    >{company.name}</option>
                    })}
                </select>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        companies: state.dropdown.companies
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getCompanyListByAdmin: (companyId,allCompany) => {
            dispatch(DropdownService.getCompanyListByAdmin(companyId,allCompany))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyDropDownByAdmin);
