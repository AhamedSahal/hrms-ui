import React, { Component } from 'react';
import { getDocumentExpiry, getUpComingDocumentExpiry } from './service'
import EmployeeListColumn from '../../../CompanyApp/Employee/employeeListColumn';
import DocumentDetailEmployeeForm from '../../../CompanyApp/Employee/detail/documentDetailForm';
import { Modal } from 'react-bootstrap';
import { getReadableDate, verifyOrgLevelEditPermission } from '../../../utility';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { FaSearch } from "react-icons/fa";

const { Header, Body } = Modal;

export default class ExpiryDocumentList extends Component {
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
            documentList: [],
            filterList:[],
            showSearch: true,
            searchTerm: '',
            month: null,
            selectedYear: new Date().getFullYear(),
            upComingDocumentExpiry: [],

        };
        this.fetchDocumentExpiryList = this.fetchDocumentExpiryList.bind(this);
        console.log(this.state.document)
    }
    componentDidMount() {
        this.fetchList();
        this.getDocumentExpiry();
    }

    fetchList = () => {
        this.hideForm();
        return getDocumentExpiry().then((res) => {
            if (res.status === 'OK') {
                this.setState({
                    documentList: res.data,
                    filterList : res.data,
                });
            } else {
                console.log("Error: " + res.error);
                throw new Error("Fetch failed");
            }
        })
            .catch((error) => {
                console.log("Error: " + error);
                throw new Error("Fetch failed");
            });
    };


    updateList = (document) => {
        try {
            this.fetchList();
            let { data } = this.state;
            let index = data.findIndex((d) => d.id === document.id);
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

    getDocumentExpiry = () => {
        getUpComingDocumentExpiry().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    upComingDocumentExpiry: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
    };

    hideForm = () => {
        this.setState({
            showForm: false,
            employee: undefined
        })
    }

    getNextSixMonths = (count) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const months = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
    
        const options = [];
        for (let i = 0; i < count; i++) {
            const monthIndex = (currentMonth + i) % 12;
            const year = currentYear + Math.floor((currentMonth + i) / 12);
            options.push(`${months[monthIndex]} ${year}`);
        }
    
        return options;
    };
    
    handleMonthSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "all") {
            this.setState(
                { month: null },
            );
        } else {
            const selectedYear = parseInt(selectedValue.split(" ")[1]);
            const selectedMonth = new Date(Date.parse(selectedValue)).getMonth();
            this.setState(
                { selectedYear, month: selectedMonth },
            );
        }
    };

    handleYearSelect = (e) => {
        const selectedValue = e.target.value;    
        if (selectedValue === "all") {
            this.setState(
                { month: null },
                () => this.fetchDocumentExpiryList()
            );
        } else {
            const selectedYear = parseInt(selectedValue.split(" ")[1]);
            const selectedMonth = new Date(Date.parse(selectedValue)).getMonth();
            this.setState(
                { selectedYear, month: selectedMonth },
                () => this.fetchDocumentExpiryList()
            );
        }
    };
    
    fetchDocumentExpiryList() {
        const { searchTerm, month } = this.state;
        console.log(searchTerm)
        let filteredList = this.state.documentList;
            if (searchTerm && searchTerm.trim() !== '') {
            filteredList = filteredList.filter(item =>
                item.employeeId ?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.docNumber.includes(searchTerm)
            );
        }
            if (month !== null) {
            filteredList = filteredList.filter(item => {
                console.log(filteredList);
                const [year, monthInString] = item.expiredOn.split('-');
                const expiredMonth = parseInt(monthInString);
                return parseInt(year) === this.state.selectedYear && expiredMonth === month + 1;
            });
        }
        if ((searchTerm == "" || searchTerm.trim() === '') && month === null) {
            filteredList = this.state.documentList;
            this.fetchList();
        }
        this.setState({ filterList: filteredList });
    }    

    
    
    render() {
        const { filterList } = this.state;

        return (
            <>
                <div className="insidePageDiv">
                    <div className="page-containerDocList content container-fluid">
                        <div className="tablePage-header">
                            <div className="row pageTitle-section">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h3 className="tablePage-title">Expiring Documents List</h3>
                                        <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                        </div>
                                    </div>
                                </div>
                                <div className="row align-items-center">
                                    <div className="col">
                                        {/* <div className="item col">{rowData}</div> */}
                                        <div className="item-1">
                                            {this.state.upComingDocumentExpiry.map((data, index) => (
                                                <div key={index} className="box-1">
                                                    <div className="month-report">
                                                        {new Date(data.month + '-01').toLocaleString('default', { month: 'long' })}{' '}{data.expiryDocuments}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-0 mb-2 float-right col">
                                        {this.state.showSearch && (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextField
                                                        label="Search"
                                                        variant="standard"
                                                        sx={{ marginLeft: '4em', minWidth: 120 }}
                                                        onChange={(e) => this.setState({ searchTerm: e.target.value })}
                                                    />
                                                <FormControl variant="standard" sx={{ marginLeft: '4em', minWidth: 120 }}>
                                                    <InputLabel id="demo-simple-select-standard-label">Select Month</InputLabel>
                                                    <Select
                                                        MenuProps={{ disableScrollLock: true }}
                                                        labelId="demo-simple-select-standard-label"
                                                        id="demo-simple-select-standard"
                                                        onChange={this.handleMonthSelect}
                                                        
                                                    >
                                                        <MenuItem value="all">View All</MenuItem>
                                                        {this.getNextSixMonths(6).map((month, index) => (
                                                            <MenuItem value={month} key={index}>{month}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FaSearch
                                                    style={{ cursor: 'pointer', marginTop: '20px', marginLeft: '30px' }}
                                                    onClick={() => { this.fetchDocumentExpiryList() }}
                                                    fontSize={25}
                                                />
                                            </div></div>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="row">
                                <div className="col-md-12 ">
                                    <div className="expireDocs-table">
                                        <table className="table">
                                            <thead >
                                                <tr style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>Employee</th>
                                                    <th>Issued On</th>
                                                    <th>Expired On</th>
                                                    <th>Document Number</th>
                                                    <th>Document Type Name</th>
                                                    {verifyOrgLevelEditPermission("EMPLOYEE") &&
                                                        <th>Action</th>
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filterList.map((item, index) => (
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
                                                        <td className="table-column">{getReadableDate(item.issuedOn)}</td>
                                                        <td className="table-column">{getReadableDate(item.expiredOn)}</td>
                                                        <td className="table-column">{item.docNumber}</td>
                                                        <td className="table-column">{item.documentTypeName}</td>
                                                        {verifyOrgLevelEditPermission("EMPLOYEE") && (
                                                            <td className="table-column">
                                                                <div className="dropdown">
                                                                    <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                        <i className="las la-bars"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a key={`edit_${item.empId}_${index}`} className="dropdown-item" href="#" onClick={() => {
                                                                            const { document } = this.state;
                                                                            document.employeeId = item.empId;
                                                                            document.id = item.id
                                                                            document.documentNo = item.docNumber;
                                                                            document.documentType = item.documentTypeName;
                                                                            document.documentTypeId = item.documentTypeId;
                                                                            document.expireOn = item.expiredOn;
                                                                            document.fileName = item.fileName;
                                                                            document.issuedOn = item.issuedOn;

                                                                            this.setState({ document, showForm: true });
                                                                        }}
                                                                        >
                                                                            <i className="fa fa-pencil m-r-5"></i> Edit
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* </div> */}
                        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                            <Header closeButton>
                                <h5 className="modal-title">Edit Document</h5>
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

