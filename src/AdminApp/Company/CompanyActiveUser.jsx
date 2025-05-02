import React, { Component } from 'react';
import { getActiveUsersByCompanyId } from './service';
import { getCustomizedDate } from '../../utility';

export default class CompanyActiveUsers extends Component {
    constructor(props) {
        super(props);
        const company = this.props.company || {};
        this.state = {
            companyData: company,
            companyId: company.id,
            companyName: company.name,
            activeUsers:'',
        }
    }
    componentDidMount = () => {
        this.fetchList();
    }
    fetchList = () => {
        const currentDate = new Date();
        getActiveUsersByCompanyId(currentDate,this.props.company.id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    activeUsers: res.data,
                })
            }
        }) 
    }

    render() {
        const { companyData,activeUsers } = this.state;
        const d = companyData;
        const currentDate = new Date();
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col-md-10">
                                <h3 className="tablePage-title">Company Active Users </h3>
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
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Date </th>
                                                    <td>{getCustomizedDate(currentDate.toLocaleDateString())}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Active Users </th>
                                                    <td>{activeUsers.active}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Inactive Users </th>
                                                    <td>{activeUsers.inactive}</td>
                                                </tr>
                                                <tr>
                                                    <th style={{ background: '#c4c4c4', fontWeight: 'bold' }}>Total Users </th>
                                                    <td>{activeUsers.total}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }

}