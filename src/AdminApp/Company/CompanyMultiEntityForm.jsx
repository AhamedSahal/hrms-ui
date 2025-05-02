import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanyDropDownByAdmin from '../../CompanyApp/ModuleSetup/Dropdown/CompanyDropDownByAdmin';
import { Row } from 'react-bootstrap';
import { addChild, getChildCompanyList, getCompanyDetails, removeChild, updateMultiEntity } from './service';
import { confirmAlert } from 'react-confirm-alert';

export default class MultiEntityForm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        const company = this.props.company || {};
        this.state = {
            companyId: company.id,
            company: company,
            multiEntity: company.multiEntity || false,
            companies: [],
            childCompanyId: '',
            refresh : false
        };
    }

    componentDidMount() {
        this.fetchCompanyDetails();
        this.fetchList();
    }

    fetchCompanyDetails = () => {
        getCompanyDetails(this.state.companyId)
            .then(res => {
                if (res.status === 'OK') {
                    this.setState({
                        multiEntity: res.data.multiEntity,
                    });
                } else {
                    console.log("Error: " + res.error);
                }
            })
            .catch(error => {
                console.log("Error: " + error);
        });
    };

    fetchList = () => {
        getChildCompanyList(this.state.companyId)
            .then(res => {
                if (res.status === 'OK') {
                    this.setState({
                        companies: res.data,
                        childCompanyId: '',
                        refresh : false
                    });
                } else {
                    console.log("Error: " + res.error);
                }
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    };
    handleCompanyIdChange = (e) => {
        const newValue = e.target.value;
        this.setState({
            childCompanyId: newValue,
        })
    };
    addChild = () => {
        const { companyId, childCompanyId } = this.state;
        addChild(companyId, childCompanyId).then(res => {
            if (res.status === "OK") {
                toast.success(res.message);
                this.setState({
                    childCompanyId: '',
                    refresh : true
                }, () => {
                    this.fetchList();
                })
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            toast.error("Error while add child company");
            console.log(err)
        });
    }
    save = () => {
        const { companyId, multiEntity } = this.state;
        if (multiEntity) {
            updateMultiEntity(companyId, multiEntity).then(res => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    this.fetchCompanyDetails();
                    this.fetchList();
                } else {
                    toast.error(res.message);
                }
            }).catch(err => {
                toast.error("error while update multiEntity");
                console.log(err)
            });
        } else {
            confirmAlert({
                title: `Disable Multi-Entity`,
                message: 'Are you sure, you want to disable Multi-Entity Functionality, it will disable all Relation?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => updateMultiEntity(companyId, multiEntity).then(res => {
                            if (res.status === "OK") {
                                toast.success(res.message);
                                this.fetchCompanyDetails();
                                this.fetchList();
                            } else {
                                toast.error(res.message);
                            }
                        })
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            });
        }
    }
    delete = (child) => {
        const parentCompanyId = this.state.companyId;
        confirmAlert({
            title: `Remove Child Company ${child.name}`,
            message: 'Are you sure, you want to remove this Child Company',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => removeChild(parentCompanyId, child.id).then(res => {
                        if (res.status == "OK") {
                            this.setState({ 
                                refresh : true},
                            () => {
                                toast.success(res.message);
                                this.fetchList();       
                            })
                        } else {
                            toast.error(res.message)
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }
    render() {
        const { companies, companyId, multiEntity } = this.state;
        return (
            <>
                <div className="page-container content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Multi Entity </h3>
                            </div>
                        </div>
                    </div>

                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            multiEntity: this.state.multiEntity
                        }}
                    // onSubmit={this.save}
                    //validationSchema={}
                    >
                        {({
                            values,
                            isSubmitting,
                            setFieldValue,
                            setSubmitting
                            /* and other goodies */
                        }) => (
                            <Form>
                                <FormGroup className="col-md-4">
                                    <div type="checkbox" name="active" >
                                        <label>Allow Multi Entity</label><br />
                                        <i className={`fa fa-2x ${this.state.multiEntity ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                            onClick={e => {
                                                let { multiEntity } = this.state;
                                                multiEntity = !multiEntity;
                                                setFieldValue("multiEntity", multiEntity);
                                                this.setState({
                                                    multiEntity
                                                });
                                            }}></i>
                                    </div>
                                </FormGroup>
                                <input type="submit" className="btn btn-primary" style={{ marginBottom: "10px" }} value={this.state.company.id > 0 ? "Update" : "Save"} onClick={() => this.save()} />
                                <div className='m-5'/>
                                {multiEntity && ( <><hr />
                                <Row>
                                    <FormGroup className="col-md-9">
                                        <label> Select Child Company
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="childCompanyId" className="form-control"
                                            render={field => {
                                                return <CompanyDropDownByAdmin
                                                    defaultValue={this.state.childCompanyId}
                                                    onChange={this.handleCompanyIdChange}
                                                    companyId={companyId}
                                                    allCompany={true}
                                                    refresh = {this.state.refresh}
                                                    title={'Select Child Company'}
                                                ></CompanyDropDownByAdmin>
                                            }}
                                        ></Field>
                                    </FormGroup>
                                    <FormGroup className="col-md-3">
                                        <div className="mt-4 p-2">
                                            <div className="row">
                                                <button className="btn apply-button btn-primary"
                                                    style={{height : '41px',width : '90%'}}
                                                    onClick={() => this.addChild()}
                                                    disabled={this.state.childCompanyId === ''}>
                                                    <i className="fa fa-plus" /> Add Child Company </button>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Row></>
                                )}
                            </Form>
                        )}
                    </Formik>

                    {multiEntity && (
                        <div className="row">
                            <div className="col-md-12 ">
                                <div className="expireDocs-table">
                                    <table className="table">
                                        <thead >
                                            <tr style={{ background: '#c4c4c4' }}>
                                                <th>#</th>
                                                <th>Company Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companies.map((item, index) => (
                                                <tr key={`${item.id}_${index}`} className="table-row">
                                                    <td className="table-column">{index + 1}</td>
                                                    <td className="table-column">{item.name} </td>
                                                    <td className="table-column">
                                                        <div className="dropdow">
                                                            <>
                                                                <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                    <i className="las la-bars"></i>
                                                                </a>
                                                                <div className="dropdown-menu dropdown-menu-right">
                                                                    <a className="dropdown-item" href="#" onClick={() => {
                                                                        this.delete(item);
                                                                    }}>
                                                                        <i className="fa fa-user-times m-r-5"></i> Remove </a>
                                                                </div>
                                                            </>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
    }
}