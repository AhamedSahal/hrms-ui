import React, { Component } from 'react';
import { getCustomizedDate } from '../../utility';
import CompanyForm from './form';
import { Modal } from 'react-bootstrap';
import { Button } from 'reactstrap';

const { Header, Body, Footer, Dialog } = Modal;
export default class CompanyDetails extends Component {
    constructor(props) {
        super(props);
        const company = this.props.company || {};
        this.state = {
            companyData: company,
            companyId: company.id,
            companyName: company.name,
        }
    }
    componentDidMount = () => {
    }
    fetchList = () => {
        this.hideForm();
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            showSettingForm: false,
            showSSOKeyForm: false,
            company: undefined,
        })
    }
    handleFormSave = () => {};
    getCompanyDetails =(company) => {};

    render() {
        const { companyData } = this.state;
        const d = companyData;
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col-md-10">
                                <h3 className="tablePage-title">Company Information </h3>
                            </div>
                            <div className='col-md-2'>
                                <Button className="btn btn-primary" href="#" onClick={() => {
                                    let companyData = d;
                                    d.companyName = d.name;
                                    this.setState({ companyData, showForm: true })
                                }} >
                                    <i className="fa fa-pencil m-r-5"></i> Edit
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="expireDocs-table">
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Company Name </th>
                                                    <td>{companyData.name}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Address</th>
                                                    <td>{companyData.address}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Company Admin </th>
                                                    <td>{companyData.contactName}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Company Admin Email </th>
                                                    <td>{companyData.email}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Created On </th>
                                                    <td>{getCustomizedDate(companyData.createdOn)}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Status </th>
                                                    <td>{companyData.active === true ? "Active" : "Inactive"}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Employee Count </th>
                                                    <td>{companyData.employeeCount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Page Content}

                {/* Manage Department Modal */}
                    <Modal enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm} >

                        <Header closeButton>
                            <h5 className="modal-title">{this.state.companyData ? 'Edit' : 'Add'} Company</h5>

                        </Header>
                        <Body>
                            <CompanyForm updateList={this.fetchList} company={this.state.companyData}  onFormSave={this.handleFormSave} getCompanyDetails={this.getCompanyDetails}>
                            </CompanyForm>
                        </Body>
                    </Modal>
                </div >
            </>
        )
    }

}