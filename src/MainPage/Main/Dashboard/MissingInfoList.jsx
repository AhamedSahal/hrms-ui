import React, { Component } from 'react';
import { getEmployeeMissingInfoList, getMissingDocumentList } from './service'
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn';
import DocumentDetailEmployeeForm from '../../../CompanyApp/Employee/detail/documentDetailForm';
import { Modal } from 'react-bootstrap';
import { verifyOrgLevelEditPermission } from '../../../utility';

const { Header, Body, Footer, Dialog } = Modal;

export default class MissingInfoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            document: {
                id: '',
                documentNo: "",
                documentStatus: "PENDING",
                documentType: "",
                documentTypeId: 0,
                downloadId: 0,
                expireOn: null,
                fileName: "",
                issuedOn: null,
                required: true,
            },
            missingInfoList: [],
            upComingLeaving: [],
            activeTab: 'missingInfo',
            documentMissingList: [],

        };
    }
    componentDidMount() {
        this.fetchList();
        this.getMissingDocumentList();
        const urlParams = new URLSearchParams(window.location.search);
        const activeTabParam = urlParams.get('activeTab');

        if (activeTabParam && ['missingDoc', 'missingInfo'].includes(activeTabParam)) {
            this.setState({ activeTab: activeTabParam });
        }
    }

    fetchList = () => {
        getEmployeeMissingInfoList().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    missingInfoList: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };
    getMissingDocumentList = () => {
        this.hideForm();
        return getMissingDocumentList().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    documentMissingList: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        }).catch(error => { console.log("Error: " + error); });
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    updateList = (document) => {
        try {
            this.getMissingDocumentList();
            let { data } = this.state;
            let index = data.findIndex(d => d.id == document.id);
            if (index > -1) {
                data[index] = document;
            } else {
                data = [document, ...data];
            }
            this.setState({ data });
        } catch (error) {
            console.error('Error fetching list:', error);
        }
    };

    hideForm = () => {
        this.setState({
            showForm: false,
            employee: undefined
        })
    }

    render() {
        const { documentMissingList,  activeTab } = this.state;
        
        return (
            <>
            <div className="page-wrapper">
                <div className="mt-4 content container-fluid">
                    <div className="tab-content">
                        <div className="row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Missing Information and Documents</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item">
                                                <a
                                                    href="#MissingInfo"
                                                    onClick={() => this.handleTabChange('missingInfo')}
                                                    className={`nav-link ${activeTab === 'missingInfo' ? 'active' : ''}`}
                                                    style={{ paddingBottom: "0px", height: "40px" }}
                                                >
                                                    Missing Information
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    href="#MissingDoc"
                                                    onClick={() => this.handleTabChange('missingDoc')}
                                                    className={`nav-link ${activeTab === 'missingDoc' ? 'active' : ''}`}
                                                    style={{ paddingBottom: "0px", height: "40px" }}
                                                >
                                                    Missing Documents
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="insidePageDiv">
                        <div className="row">
                            <div className="col-md-12 ">
                                {activeTab === 'missingInfo' && (
                                    <div className="chatBot-table">
                                        <h4>Missing Information</h4>
                                        <table className="table">
                                            <thead>
                                                <tr style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Missing Fields</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.missingInfoList.map((item, index) => (
                                                        item.missingFields.length > 2 && (
                                                    <tr key={item.day} className="table-row">
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <EmployeeListColumn
                                                                key={item.empId}
                                                                id={item.empId}
                                                                name={`${item.employeeName}`}
                                                                employeeId={item.employeeId}
                                                            />
                                                        </td>
                                                        <td className="table-column">{item.missingFields}</td>
                                                    </tr>
                                                        )
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === 'missingDoc' && (
                                    <div className="chatBot-table">
                                        <h4>Missing Documents</h4>
                                        <table className="table">
                                            <thead>
                                                <tr  style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Missing Documents Name</th>
                                                    {verifyOrgLevelEditPermission("EMPLOYEE") &&
                                                        <th>Action</th>
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documentMissingList.map((item, index) => (
                                                    <tr key={`${item.empId}_${index}`} className="table-row">
                                                        
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <EmployeeListColumn
                                                                key={item.empId}
                                                                id={item.empId}
                                                                name={`${item.employeeName}`}
                                                                employeeId={item.employeeId}
                                                            />
                                                        </td>
                                                        <td className="table-column">{item.documentTypeName}</td>
                                                        {verifyOrgLevelEditPermission("EMPLOYEE") &&
                                                            <td className='table-column'>
                                                                <div className="dropdown">
                                                                    <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                        <i className="las la-bars"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a key={`edit_${item.empId}_${index}`} className="dropdown-item" href="#" onClick={() => {
                                                                            const { document } = this.state;
                                                                            document.employeeId = item.empId;
                                                                            document.id = item.id;
                                                                            document.documentType = item.documentTypeName;
                                                                            document.documentTypeId = item.documentTypeId;
                                                                            document.expireOn = item.expiredOn;
                                                                            document.fileName = item.fileName;
                                                                            document.issuedOn = item.issuedOn;

                                                                            this.setState({ document, showForm: true });
                                                                        }}>
                                                                            <i className="fa fa-pencil m-r-5"></i> Upload Document </a>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        }
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                        <Header closeButton>
                            <h5 className="modal-title">upload Document</h5>
                        </Header>
                        <Body>
                            <DocumentDetailEmployeeForm updateList={this.updateList} document={this.state.document} FetchList={this.fetchList}>
                            </DocumentDetailEmployeeForm>
                        </Body>
                    </Modal>
                </div>
                </div>
            </>
        );
    };
}

