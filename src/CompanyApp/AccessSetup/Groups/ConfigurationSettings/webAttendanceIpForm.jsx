import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Col, Row, ButtonGroup } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { addIPIntoGroup, getIPList } from './service';


export default class WebAttendanceIPForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupId: props.userGroup.id ? props.userGroup.id : 0,
            group: props.userGroup ? props.userGroup : {},
            attendanceConfigurationId: props.configId ? props.configId : 0,
            selectedIPs: [],
            ipList: [],
        }
    }
    componentDidMount() {
        this.fetchIPList();
    }
    fetchIPList = () => {
        const { groupId, attendanceConfigurationId } = this.state;
        getIPList(groupId, attendanceConfigurationId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    ipList: res.data,
                })
            }
        })
    }

    onSelect = (data) => {
        let { selectedIPs } = this.state;
        let index = selectedIPs.indexOf(data.id);
        if (index > -1) {
            selectedIPs.splice(index, 1);
        } else {
            selectedIPs.push(data.id);
        }
        this.setState({ selectedIPs });
    }
    save = () => {
        const { selectedIPs, groupId, attendanceConfigurationId } = this.state;
        const data = {
            ids: selectedIPs,
            userGroupId: groupId,
            attendanceConfigurationId: attendanceConfigurationId
        };
        addIPIntoGroup(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.fetchList(groupId);
            } else {
                toast.error(res.message);
            }
        })
    }
    updateAll = (value) => {
        if (value === 0) {
            this.setState({
                selectedIPs: []
            })
        }
        if (value === 1) {
            const { ipList } = this.state;
            const selectedIPs = ipList.map(ip => ip.id);
            this.setState({
                selectedIPs: selectedIPs,
            });
        }
    }

    render() {
        const { ipList, selectedIPs } = this.state;
        return (
            <>
                <div id='page-head m-0'>
                    <div className='mt-2 approvalTable-card mb-2' >
                        <div className="tableCard-body">
                            <div className="row " >
                                <div className="mt-3 col">
                                    <h3 className="page-titleText"> IP Address </h3>
                                </div>
                                <div className='col-md-auto'>
                                    <ButtonGroup className='pull-right my-3'>
                                        <button
                                            disabled={!ipList || ipList.length == 0}
                                            className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                            onClick={() => {
                                                this.updateAll(1);
                                            }}>Select All </button>
                                        <button
                                            disabled={!selectedIPs || selectedIPs.length == 0}
                                            className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                            onClick={() => {
                                                this.updateAll(0);
                                            }}>Unselect All </button>
                                        <button
                                            className="btn btn-primary"
                                            disabled={!selectedIPs || selectedIPs.length == 0}
                                            onClick={() => {
                                                this.save();
                                            }}>Assign IP
                                        </button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            {/* /Page Header */}
                            <div className="tableCard-container row">
                                <div className="col-md-12">
                                    <div className="table-responsive" style={{maxHeight:'500px'}}>
                                        <table className="table">
                                            <thead >
                                                <tr style={{ background: '#c4c4c4' }}>
                                                    <th>#</th>
                                                    <th>IP</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ipList && ipList.map((item, index) => (
                                                    <tr key={`${item.id}_${index}`} className="table-row">
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <Row>
                                                                <h2  className="table-avatar">
                                                                    Name : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.name} </span>
                                                                </h2>
                                                            </Row>
                                                            <Row>
                                                                <h2  className="table-avatar">
                                                                    IP : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.ip} </span>
                                                                </h2>
                                                            </Row>
                                                        </td>
                                                        <td className="table-column">
                                                            <Row>
                                                                <Col md={6}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedIPs && selectedIPs.length > 0 && selectedIPs.indexOf(item.id) > -1}
                                                                        className="pointer"
                                                                        onChange={() => {
                                                                            this.onSelect(item);
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
                        </div>
                    </div>
                </div>
            </>
        )
    }
}