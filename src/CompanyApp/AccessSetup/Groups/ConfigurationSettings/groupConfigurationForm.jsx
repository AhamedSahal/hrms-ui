import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import { FormGroup } from 'reactstrap';
import { Col, Modal, Row, ButtonGroup } from 'react-bootstrap';
import { getConfiguration, getConfigurationByGroupId, updateUserGroupConfiguration } from '../../../Configuration/service';
import WebAttendanceIPForm from './webAttendanceIpForm';
import { deleteFromMobileIPs, deleteFromMobileLoc, deleteFromWebIp, getIPs, getLocations, getMobileIPs } from './service';
import MobileAttendanceLocationForm from './mobileAttendanceLocationForm';
import MobileAttendanceIPForm from './mobileAttendanceIpForm';
import { Tooltip } from 'antd';
const { Header, Body } = Modal;


export default class GroupConfiguration extends Component {
    constructor(props) {
        super(props);
        let userGroup = this.props.userGroup ? this.props.userGroup : {};
        this.state = {
            groupConfig: {
                id: 0,
                webAttendance: false,
                mobileAttendance: false,
                biometricIntegration: false,
                autoAttendance: false,
                userGroupId: userGroup.id ? userGroup.id : 0,
                webRestrictedIpAddress: false,
                mobileRestrictedIpAddress: false,
                restrictedGeoLocation: false,
                selfieEnabled: false,
                allowOfflineAttendance: false,
                geoLocationRequired: false,
            },
            data: [],
            webAttendanceIpData: [],
            mobileAttendanceIpData: [],
            mobileAttendanceLocationData: [],
            selectedWebAttendanceIp: [],
            selectedMobileAttendanceIp: [],
            selectedMobileAttendanceLocation: [],
            companyConfiguration : {},
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchList();
        this.fetchCompanyConfigurationList();
    }
    fetchCompanyConfigurationList = () => {
        getConfiguration().then(res => {
            this.setState({
                companyConfiguration: res.data,
            })
        })
    }
    fetchList = () => {
        getConfigurationByGroupId(this.state.groupConfig.userGroupId).then(res => {
            if (res.status == "OK" && res.data != null) {
                
                this.setState({
                    groupConfig: res.data,
                }, () => {
                    if (res.data?.webRestrictedIpAddress) {
                       this.fetchWebAttendanceIp();
                    }
                    if (res.data?.restrictedGeoLocation) {
                        this.fetchMobileAttendanceLoc();
                    }
                    if (res.data?.mobileRestrictedIpAddress) {
                        this.fetchMobileAttendanceIPs();
                    }
                });
               
            }
        })
    }
    save = () => {
        const { groupConfig } = this.state;
        this._isMounted = true;
        updateUserGroupConfiguration(groupConfig).then(res => {
        if (this._isMounted) {
            if (res.status === "OK") {
                toast.success(res.message);
            if (groupConfig.id > 0) {
                this.fetchList();
                this.props.fetchList();
                this.props.updateList();
            } else {
            this.setState({ groupConfig: res.data });
            }
        } else {
        toast.error(res.message);
            }
        }
        }).catch(err => {
            if (!this._isMounted) {
            console.log("Error while updating configuration");}
        });
    };
    
    componentWillUnmount() {
        this._isMounted = false;
    }
    fetchWebAttendanceIp = () => {
        this.hideForm();
        const { groupConfig } = this.state;
        getIPs(groupConfig.userGroupId, groupConfig.id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    webAttendanceIpData: res.data
                })
            }
        }).catch(err => {
            console.error(err);
        });
    }
    fetchMobileAttendanceLoc = () => {
        this.hideForm();
        const { groupConfig } = this.state;
        getLocations(groupConfig.userGroupId, groupConfig.id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    mobileAttendanceLocationData: res.data
                })
            }
        }).catch(err => {
            console.error(err);
        });
    }
    fetchMobileAttendanceIPs = () => {
        this.hideForm();
        const { groupConfig } = this.state;
        getMobileIPs(groupConfig.userGroupId, groupConfig.id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    mobileAttendanceIpData: res.data
                })
            }
        }).catch(err => {
            console.error(err);
        });
    }

    onWebIpSelect = (data) => {
        let { selectedWebAttendanceIp } = this.state;
        let index = selectedWebAttendanceIp.indexOf(data.id);
        if (index > -1) {
            selectedWebAttendanceIp.splice(index, 1);
        } else {
            selectedWebAttendanceIp.push(data.id);
        }
        this.setState({ selectedWebAttendanceIp });
    }

    hideForm = () => {
        this.setState({
            showWebIpForm: false,
            showMobileIpForm: false,
            showMobileLocationForm: false,
        })
    }

    removeWebAttendanceIp = () => {
        const { selectedWebAttendanceIp, groupId, attendanceConfigurationId } = this.state;
        const data = {
            ids: selectedWebAttendanceIp,
            userGroupId: groupId,
            attendanceConfigurationId: attendanceConfigurationId
        };
        deleteFromWebIp(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({ selectedWebAttendanceIp: [] })
                this.fetchWebAttendanceIp(groupId, attendanceConfigurationId);
            } else {
                toast.error(res.message);
            }
        })
    }
    updateAllWebIps = (value) => {
        if (value === 0) {
            this.setState({
                selectedWebAttendanceIp: []
            })
        }
        if (value === 1) {
            const { webAttendanceIpData } = this.state;
            const selectedWebAttendanceIp = webAttendanceIpData.map(ip => ip.id);
            this.setState({
                selectedWebAttendanceIp: selectedWebAttendanceIp,
            });

        }
    }
    updateAllMobileLoc = (value) => {
        if (value === 0) {
            this.setState({
                selectedMobileAttendanceLocation: []
            })
        }
        if (value === 1) {
            const { mobileAttendanceLocationData } = this.state;
            const selectedMobileAttendanceLocation = mobileAttendanceLocationData.map(ip => ip.id);
            this.setState({
                selectedMobileAttendanceLocation: selectedMobileAttendanceLocation,
            });

        }
    }
    removeMobileAttendanceLoc = () => {
        const { selectedMobileAttendanceLocation, groupId, attendanceConfigurationId } = this.state;
        const data = {
            ids: selectedMobileAttendanceLocation,
            userGroupId: groupId,
            attendanceConfigurationId: attendanceConfigurationId
        };
        deleteFromMobileLoc(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({ selectedMobileAttendanceLocation: [] })
                this.fetchMobileAttendanceLoc(groupId, attendanceConfigurationId);
            } else {
                toast.error(res.message);
            }
        })
    }

    onLocationSelect = (data) => {
        let { selectedMobileAttendanceLocation } = this.state;
        let index = selectedMobileAttendanceLocation.indexOf(data.id);
        if (index > -1) {
            selectedMobileAttendanceLocation.splice(index, 1);
        } else {
            selectedMobileAttendanceLocation.push(data.id);
        }
        this.setState({ selectedMobileAttendanceLocation });
    }

    updateAllMobileIPs = (value) => {
        if (value === 0) {
            this.setState({
                selectedMobileAttendanceIp: []
            })
        }
        if (value === 1) {
            const { mobileAttendanceIpData } = this.state;
            const selectedMobileAttendanceIp = mobileAttendanceIpData.map(ip => ip.id);
            this.setState({
                selectedMobileAttendanceIp: selectedMobileAttendanceIp,
            });

        }
    }
    removeMobileAttendanceIPs = () => {
        const { selectedMobileAttendanceIp, groupId, attendanceConfigurationId } = this.state;
        const data = {
            ids: selectedMobileAttendanceIp,
            userGroupId: groupId,
            attendanceConfigurationId: attendanceConfigurationId
        };
        deleteFromMobileIPs(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({ selectedMobileAttendanceIp: [] })
                this.fetchMobileAttendanceIPs(groupId, attendanceConfigurationId);
            } else {
                toast.error(res.message);
            }
        })
    }

    onMobileIPSelect = (data) => {
        let { selectedMobileAttendanceIp } = this.state;
        let index = selectedMobileAttendanceIp.indexOf(data.id);
        if (index > -1) {
            selectedMobileAttendanceIp.splice(index, 1);
        } else {
            selectedMobileAttendanceIp.push(data.id);
        }
        this.setState({ selectedMobileAttendanceIp });
    }


    render() {
        const { data, webAttendanceIpData, groupConfig, selectedWebAttendanceIp, selectedMobileAttendanceLocation, mobileAttendanceLocationData, selectedMobileAttendanceIp, mobileAttendanceIpData ,companyConfiguration} = this.state;
        const allowSubmit = !(
            (groupConfig.webRestrictedIpAddress && webAttendanceIpData.length === 0) ||
            (groupConfig.mobileRestrictedIpAddress && mobileAttendanceIpData.length === 0) ||
            (groupConfig.restrictedGeoLocation && mobileAttendanceLocationData.length === 0)
        );
        return (

            <>
                <div className="page-container content container-fluimt-3" >
                   <div className="p-3">
                    <Formik
                        enableReinitialize={true}
                        initialValues={groupConfig}
                    // onSubmit={this.save}
                    //validationSchema={}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                            setSubmitting
                            /* and other goodies */
                        }) => (
                            <Form>
                                <Row>
                                    {companyConfiguration && companyConfiguration.autoAttendance && <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                            <label>Auto Attendance</label><br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.autoAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.autoAttendance = !groupConfig.autoAttendance;
                                                    setFieldValue("autoAttendance", groupConfig.autoAttendance);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>}
                                    {companyConfiguration && companyConfiguration.biometricIntegration && <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                            <label>Biometric Integration</label><br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.biometricIntegration ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.biometricIntegration = !groupConfig.biometricIntegration;
                                                    setFieldValue("biometricIntegration", groupConfig.biometricIntegration);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>}
                                </Row>
                                {companyConfiguration && (companyConfiguration.biometricIntegration || companyConfiguration.autoAttendance) && <hr />}
                                {companyConfiguration && companyConfiguration.webAttendance && <Row>
                                    <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                                <label>Web Attendance</label>
                                                <Tooltip title="Enable group members to mark attendance via the website on PC, laptop, or mobile browser.">
                                                <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                </Tooltip><br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.webAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.webAttendance = !groupConfig.webAttendance;
                                                    setFieldValue("webAttendance", groupConfig.webAttendance);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                    if (!groupConfig.webAttendance) {
                                                        groupConfig.webRestrictedIpAddress = false;
                                                    }
                                                }}></i>
                                        </div>
                                    </FormGroup>

                                    {groupConfig && groupConfig.webAttendance &&
                                        <FormGroup className="col-md-9">
                                            <div type="checkbox" name="active" >
                                                    <label> Restrict IP Address (Web) {groupConfig && groupConfig.webAttendance && groupConfig.id == 0 && <h5> Note: Please Save the Configuration to enable Restrict IP Address (Web) </h5>}
                                                    </label>
                                                <Tooltip title="Limit web attendance to specific IP addresses for enhanced security.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                                <i className={`fa fa-2x ${groupConfig && groupConfig.webRestrictedIpAddress ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                     style={{
                                                        pointerEvents: groupConfig.id !== 0 ? 'auto' : 'none',
                                                        opacity: groupConfig.id !== 0 ? 1 : 0.5, // Disabled look
                                                        cursor: groupConfig.id !== 0 ? 'pointer' : 'default' // Change cursor based on interactivity
                                                    }}
                                                    onClick={e => {
                                                        let { groupConfig } = this.state;
                                                        groupConfig.webRestrictedIpAddress = !groupConfig.webRestrictedIpAddress;
                                                        setFieldValue("webRestrictedIpAddress", groupConfig.webRestrictedIpAddress);
                                                        this.setState({
                                                            groupConfig
                                                        });
                                                        this.fetchWebAttendanceIp();
                                                    }}></i>
                                            </div>
                                        </FormGroup>
                                    }
                                </Row>}
                                {companyConfiguration && companyConfiguration.webAttendance && groupConfig && groupConfig.webAttendance && groupConfig.webRestrictedIpAddress &&
                                    <>
                                        <div className='row'>
                                            <div className='mt-3 mb-0 float-right col-md-4 d-flex'>
                                                <h2 className='tablePage-title ml-2' style={{ fontSize: '15px' }}>
                                                    Web Attendance Restricted IP
                                                </h2>
                                            </div>
                                            <div className="mt-0 mb-0 float-right col-md-6 ml-auto btn-group">
                                                <ButtonGroup className='pull-right my-3'>
                                                    <button
                                                        disabled={!webAttendanceIpData || webAttendanceIpData.length == 0}
                                                        className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                                        onClick={() => {
                                                            this.updateAllWebIps(1);
                                                        }}>Select All </button>
                                                    <button
                                                        disabled={!selectedWebAttendanceIp || selectedWebAttendanceIp.length == 0}
                                                        className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                                        onClick={() => {
                                                            this.updateAllWebIps(0);
                                                        }}>Unselect All </button>
                                                    <button
                                                        disabled={!selectedWebAttendanceIp || selectedWebAttendanceIp.length == 0}
                                                        className="markAll-btn-rejected btn-sm btn-outline-secondary mr-3"
                                                        onClick={() => {
                                                            this.removeWebAttendanceIp();
                                                        }}>Remove IP
                                                    </button>
                                                </ButtonGroup>
                                            </div>
                                            <div className="mt-2 mb-0 float-right col-md-2 d-flex">
                                                <p style={{ width: '16em' }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                    this.setState({
                                                        showWebIpForm: true,
                                                    })
                                                }}><i className="fa fa-plus" /> Add </p>
                                            </div>
                                        </div>
                                        <div className="tableCard-container row">
                                            <div className="col-md-12">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead >
                                                            <tr style={{ background: '#c4c4c4' }}>
                                                                <th>#</th>
                                                                <th> Name </th>
                                                                <th> IP </th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {webAttendanceIpData && webAttendanceIpData.map((item, index) => (
                                                                <tr key={`${item.empId}_${index}`} className="table-row">
                                                                    <td className="table-column">{index + 1}</td>
                                                                    <td className="table-column">{item.name}</td>
                                                                    <td className="table-column">{item.ip}</td>
                                                                    <td className="table-column">
                                                                        <Row>
                                                                            <Col md={6}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={selectedWebAttendanceIp && selectedWebAttendanceIp.length > 0 && selectedWebAttendanceIp.indexOf(item.id) > -1}
                                                                                    className="pointer"
                                                                                    onChange={e => {
                                                                                        this.onWebIpSelect(item);
                                                                                    }}></input>
                                                                            </Col>
                                                                        </Row>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    
                                
                                </>}
                                {companyConfiguration && companyConfiguration.webAttendance &&
                                <hr />}
                                {companyConfiguration && companyConfiguration.mobileAttendance && <Row>
                                    <FormGroup className="col-md-3">
                                        <div type="checkbox" name="active" >
                                                <label>Mobile Attendance (Mobile App)</label>
                                                <Tooltip title="Allow group members to mark attendance through the mobile application.">
                                                <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                </Tooltip><br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.mobileAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.mobileAttendance = !groupConfig.mobileAttendance;
                                                    setFieldValue("mobileAttendance", groupConfig.mobileAttendance);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </Row>}

                                {companyConfiguration && companyConfiguration.mobileAttendance && groupConfig && groupConfig.mobileAttendance && <><Row>

                                    <FormGroup className="col-md-4">
                                        <div type="checkbox" name="active" >
                                                <label>{groupConfig && groupConfig.mobileAttendance && groupConfig.id == 0 && <h5> Note: Please Save the Configuration to enable below options </h5>}
                                                    Allow Offline Attendance</label>                                           <Tooltip title="Enable attendance recording without internet. Data will sync once connected.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                    </Tooltip><br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.allowOfflineAttendance ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                 style={{
                                                    pointerEvents: groupConfig.id !== 0 ? 'auto' : 'none',
                                                    opacity: groupConfig.id !== 0 ? 1 : 0.5, // Disabled look
                                                    cursor: groupConfig.id !== 0 ? 'pointer' : 'default' // Change cursor based on interactivity
                                                }}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.allowOfflineAttendance = !groupConfig.allowOfflineAttendance;
                                                    setFieldValue("allowOfflineAttendance", groupConfig.allowOfflineAttendance);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                    if (groupConfig.allowOfflineAttendance) {
                                                        groupConfig.mobileRestrictedIpAddress = false;
                                                        groupConfig.restrictedGeoLocation = false;
                                                    }
                                                }}></i>
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="col-md-4">
                                        <div type="checkbox" name="active" >
                                            <label> Selfie Required </label>
                                            <Tooltip title="Require a verification photo each time a member marks attendance.">
                                                <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                            </Tooltip>
                                            <br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.selfieEnabled ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                style={{
                                                    pointerEvents: groupConfig.id !== 0 ? 'auto' : 'none',
                                                    opacity: groupConfig.id !== 0 ? 1 : 0.5, // Disabled look
                                                    cursor: groupConfig.id !== 0 ? 'pointer' : 'default' // Change cursor based on interactivity
                                                }}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.selfieEnabled = !groupConfig.selfieEnabled;
                                                    setFieldValue("selfieEnabled", groupConfig.selfieEnabled);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                }}></i>
                                        </div>
                                    </FormGroup>

                                    <FormGroup className="col-md-4">
                                        <div type="checkbox" name="active" >
                                                <label>Geo Location Required </label>
                                                <Tooltip title="Mandate sharing of location during attendance marking.">
                                                <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                </Tooltip><br />
                                            <i className={`fa fa-2x ${groupConfig && groupConfig.geoLocationRequired ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                 style={{
                                                    pointerEvents: groupConfig.id !== 0 ? 'auto' : 'none',
                                                    opacity: groupConfig.id !== 0 ? 1 : 0.5, // Disabled look
                                                    cursor: groupConfig.id !== 0 ? 'pointer' : 'default' // Change cursor based on interactivity
                                                }}
                                                onClick={e => {
                                                    let { groupConfig } = this.state;
                                                    groupConfig.geoLocationRequired = !groupConfig.geoLocationRequired;
                                                    setFieldValue("geoLocationRequired", groupConfig.geoLocationRequired);
                                                    this.setState({
                                                        groupConfig
                                                    });
                                                    if (!groupConfig.geoLocationRequired) {
                                                        groupConfig.restrictedGeoLocation = false;
                                                    }
                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </Row>
                                    <Row>
                                        <FormGroup className="col-md-4">
                                            <div type="checkbox" name="active" >
                                                <label> Restrict IP Address (Mobile App) </label>
                                                <Tooltip title=" Restrict mobile app users to mark attendance only from specific IP addresses.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                </Tooltip><br />
                                                <i className={`fa fa-2x ${groupConfig && groupConfig.mobileRestrictedIpAddress ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                    style={{
                                                        pointerEvents: !groupConfig.allowOfflineAttendance && groupConfig.id !== 0 ? 'auto' : 'none',
                                                        opacity: !groupConfig.allowOfflineAttendance && groupConfig.id !== 0 ? 1 : 0.5, // Disabled look
                                                        cursor: !groupConfig.allowOfflineAttendance && groupConfig.id !== 0 ? 'pointer' : 'default' // Change cursor based on interactivity
                                                    }}
                                                    onClick={e => {
                                                        let { groupConfig } = this.state;
                                                        groupConfig.mobileRestrictedIpAddress = !groupConfig.mobileRestrictedIpAddress;
                                                        setFieldValue("mobileRestrictedIpAddress", groupConfig.mobileRestrictedIpAddress);
                                                        this.setState({
                                                            groupConfig
                                                        });
                                                        this.fetchMobileAttendanceIPs();
                                                    }}></i>
                                            </div>
                                        </FormGroup>
                                        <FormGroup className="col-md-4">
                                            <div type="checkbox" name="active" >
                                                <label> Restrict Geo Location </label>
                                                <Tooltip title="Set a Geofence within which members can mark attendance, based on latitude, longitude, and range.">
                                                    <i className="fa fa-info-circle" style={{ marginLeft: '8px', cursor: 'pointer' }}></i>
                                                </Tooltip><br />
                                                <i className={`fa fa-2x ${groupConfig && groupConfig.restrictedGeoLocation ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}
                                                    style={{
                                                        pointerEvents: groupConfig.geoLocationRequired && !groupConfig.allowOfflineAttendance && groupConfig.id != 0 ? 'auto' : 'none',
                                                        opacity: groupConfig.geoLocationRequired && !groupConfig.allowOfflineAttendance && groupConfig.id != 0 ? 1 : 0.5, // To give a disabled look
                                                        cursor: !groupConfig.geoLocationRequired && !groupConfig.allowOfflineAttendance && groupConfig.id !== 0 ? 'pointer' : 'default' // Change cursor based on interactivity
                                                    }}
                                                    onClick={e => {
                                                        let { groupConfig } = this.state;
                                                        groupConfig.restrictedGeoLocation = !groupConfig.restrictedGeoLocation;
                                                        setFieldValue("restrictedGeoLocation ", groupConfig.restrictedGeoLocation);
                                                        this.setState({
                                                            groupConfig
                                                        });
                                                        this.fetchMobileAttendanceLoc();
                                                    }}></i>
                                            </div>
                                        </FormGroup>
                                    </Row>
                                </>}

                                {/* Mobile Location Restricted */}

                                {companyConfiguration && companyConfiguration.mobileAttendance && groupConfig && groupConfig.mobileAttendance && groupConfig.restrictedGeoLocation &&
                                    <>
                                        <div className='row'>
                                            <div className='mt-3 mb-0 float-right col-md-5 d-flex'>
                                                <h2 className='tablePage-title ml-2' style={{ fontSize: '15px' }}>
                                                Mobile App Attendance with Location Restrictions
                                                </h2>
                                            </div>
                                            <div className="mt-0 mb-0 float-right col-md-5 ml-auto btn-group">
                                                <ButtonGroup className='pull-right my-3'>
                                                    <button
                                                        disabled={!mobileAttendanceLocationData || mobileAttendanceLocationData.length == 0}
                                                        className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                                        onClick={() => {
                                                            this.updateAllMobileLoc(1);
                                                        }}>Select All </button>
                                                    <button
                                                        disabled={!selectedMobileAttendanceLocation || selectedMobileAttendanceLocation.length == 0}
                                                        className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                                        onClick={() => {
                                                            this.updateAllMobileLoc(0);
                                                        }}>Unselect All </button>
                                                    <button
                                                        disabled={!selectedMobileAttendanceLocation || selectedMobileAttendanceLocation.length == 0}
                                                        className="markAll-btn-rejected btn-sm btn-outline-secondary mr-3"
                                                        onClick={() => {
                                                            this.removeMobileAttendanceLoc();
                                                        }}>Remove Location
                                                    </button>
                                                </ButtonGroup>
                                            </div>
                                            <div className="mt-2 mb-0 float-right col-md-2 d-flex">
                                                <p style={{ width: '16em' }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                    this.setState({
                                                        showMobileLocationForm: true,
                                                    })
                                                }}><i className="fa fa-plus" /> Add </p>
                                            </div>
                                        </div>
                                        <div className="tableCard-container row">
                                            <div className="col-md-12">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead >
                                                            <tr style={{ background: '#c4c4c4' }}>
                                                                <th>#</th>
                                                                <th>Name</th>
                                                                <th>Location</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {mobileAttendanceLocationData && mobileAttendanceLocationData.map((item, index) => (
                                                                <tr key={`${item.empId}_${index}`} className="table-row">
                                                                    <td className="table-column">{index + 1}</td>
                                                                    <td className="table-column">{item.name}</td>
                                                                    <td className='table-column'>
                                                                        <Row>
                                                                            <h2  className="table-avatar">
                                                                                Latitude : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.latitude} </span>
                                                                            </h2>
                                                                        </Row>
                                                                        <Row>
                                                                            <h2  className="table-avatar">
                                                                                Longitude : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.longitude} </span>
                                                                            </h2>
                                                                        </Row>
                                                                        <Row>
                                                                            <h2  className="table-avatar">
                                                                                Radius : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.radius} </span>
                                                                            </h2>
                                                                        </Row>
                                                                    </td>
                                                                    <td className="table-column">
                                                                        <Row>
                                                                            <Col md={6}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={selectedMobileAttendanceLocation && selectedMobileAttendanceLocation.length > 0 && selectedMobileAttendanceLocation.indexOf(item.id) > -1}
                                                                                    className="pointer"
                                                                                    onChange={e => {
                                                                                        this.onLocationSelect(item);
                                                                                    }}></input>
                                                                            </Col>
                                                                        </Row>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                {/* Mobile IP Restricted */}
                                {companyConfiguration && companyConfiguration.mobileAttendance && groupConfig && groupConfig.mobileRestrictedIpAddress && groupConfig.restrictedGeoLocation &&
                                    <><br /><hr /></>
                                }

                                {companyConfiguration && companyConfiguration.mobileAttendance && groupConfig && groupConfig.mobileAttendance && groupConfig.mobileRestrictedIpAddress &&
                                    <>
                                        <div className='row'>
                                            <div className='mt-3 mb-0 float-right col-md-4 d-flex'>
                                                <h2 className='tablePage-title ml-2' style={{ fontSize: '15px' }}>
                                                Mobile App Attendance with IP Restrictions
                                                </h2>
                                            </div>
                                            <div className="mt-0 mb-0 float-right col-md-6 ml-auto btn-group">
                                                <ButtonGroup className='pull-right my-3'>
                                                    <button
                                                        disabled={!mobileAttendanceIpData || mobileAttendanceIpData.length == 0}
                                                        className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                                        onClick={() => {
                                                            this.updateAllMobileIPs(1);
                                                        }}>Select All </button>
                                                    <button
                                                        disabled={!selectedMobileAttendanceIp || selectedMobileAttendanceIp.length == 0}
                                                        className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                                        onClick={() => {
                                                            this.updateAllMobileIPs(0);
                                                        }}>Unselect All </button>
                                                    <button
                                                        disabled={!selectedMobileAttendanceIp || selectedMobileAttendanceIp.length == 0}
                                                        className="markAll-btn-rejected btn-sm btn-outline-secondary mr-3"
                                                        onClick={() => {
                                                            this.removeMobileAttendanceIPs();
                                                        }}>Remove IP
                                                    </button>
                                                </ButtonGroup>
                                            </div>
                                            <div className="mt-2 mb-0 float-right col-md-2 d-flex">
                                                <p style={{ width: '16em' }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                                    this.setState({
                                                        showMobileIpForm: true,
                                                    })
                                                }}><i className="fa fa-plus" /> Add </p>
                                            </div>
                                        </div>
                                        <div className="tableCard-container row">
                                            <div className="col-md-12">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead >
                                                            <tr style={{ background: '#c4c4c4' }}>
                                                                <th> # </th>
                                                                <th> Name </th>
                                                                <th> IP </th>
                                                                <th> Action </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {mobileAttendanceIpData && mobileAttendanceIpData.map((item, index) => (
                                                                <tr key={`${item.empId}_${index}`} className="table-row">
                                                                    <td className="table-column">{index + 1}</td>
                                                                    <td className="table-column">{item.name}</td>
                                                                    <td className="table-column">{item.ip}</td>
                                                                    <td className="table-column">
                                                                        <Row>
                                                                            <Col md={6}>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={selectedMobileAttendanceIp && selectedMobileAttendanceIp.length > 0 && selectedMobileAttendanceIp.indexOf(item.id) > -1}
                                                                                    className="pointer"
                                                                                    onChange={e => {
                                                                                        this.onMobileIPSelect(item);
                                                                                    }}></input>
                                                                            </Col>
                                                                        </Row>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                <hr /> </>}
                                <input type="submit" className="btn btn-primary" style={{ marginBottom: "10px" }} value={this.state.groupConfig.id > 0 ? "Update" : "Save"} onClick={() => { this.save() }}
                                    disabled={(!groupConfig.autoAttendance && !groupConfig.biometricIntegration && !groupConfig.mobileAttendance && !groupConfig.webAttendance) || !allowSubmit} />
                            </Form>
                        )}
                    </Formik>
                </div>
                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showWebIpForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title"> Add Web Restricted IP Address </h5>
                    </Header>
                    <Body>
                        <WebAttendanceIPForm fetchList={this.fetchWebAttendanceIp} userGroup={this.props.userGroup} configId={this.state.groupConfig.id}>
                        </WebAttendanceIPForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"md"} show={this.state.showMobileLocationForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title"> Add Mobile Restricted Locations </h5>
                    </Header>
                    <Body>
                        <MobileAttendanceLocationForm fetchList={this.fetchMobileAttendanceLoc} userGroup={this.props.userGroup} configId={this.state.groupConfig.id}>
                        </MobileAttendanceLocationForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"md"} show={this.state.showMobileIpForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title"> Add Mobile Restricted IP Address </h5>
                    </Header>
                    <Body>
                        <MobileAttendanceIPForm fetchList={this.fetchMobileAttendanceIPs} userGroup={this.props.userGroup} configId={this.state.groupConfig.id}>
                        </MobileAttendanceIPForm>
                    </Body>
                </Modal>
            </>
        )
    }
}