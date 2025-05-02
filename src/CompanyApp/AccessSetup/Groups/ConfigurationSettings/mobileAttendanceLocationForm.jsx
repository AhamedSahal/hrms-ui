import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Col, Row, ButtonGroup } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { addLocationIntoGroup, getLocationList } from './service';



export default class MobileAttendanceLocationForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupId: props.userGroup.id ? props.userGroup.id : 0,
            group: props.userGroup ? props.userGroup : {},
            attendanceConfigurationId: props.configId ? props.configId : 0,
            selectedLocations: [],
            locationList: [],
        }
    }
    componentDidMount() {
        this.fetchLocationList();
    }
    fetchLocationList = () => {
        const { groupId, attendanceConfigurationId } = this.state;
        getLocationList(groupId, attendanceConfigurationId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    locationList: res.data,
                })
            }
        })
    }
    onSelect = (data) => {
        let { selectedLocations } = this.state;
        let index = selectedLocations.indexOf(data.id);
        if (index > -1) {
            selectedLocations.splice(index, 1);
        } else {
            selectedLocations.push(data.id);
        }
        this.setState({ selectedLocations });
    }
    save = () => {
        const { selectedLocations, groupId, attendanceConfigurationId } = this.state;
        const data = {
            ids: selectedLocations,
            userGroupId: groupId,
            attendanceConfigurationId: attendanceConfigurationId
        };
        addLocationIntoGroup(data).then(res => {
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
                selectedLocations: []
            })
        }
        if (value === 1) {
            const { locationList } = this.state;
            const selectedLocations = locationList.map(loc => loc.id);
            this.setState({
                selectedLocations: selectedLocations,
            });
        }
    }
    render() {
        const { locationList, selectedLocations } = this.state;
        return (
            <>
                <div id='page-head m-0'>
                    <div className='mt-2 approvalTable-card mb-2' >
                        <div className="tableCard-body">
                            <div className="row " >
                                <div className="mt-3 col">
                                    <h3 className="page-titleText"> Location </h3>
                                </div>
                                <div className='col-md-auto'>
                                    <ButtonGroup className='pull-right my-3'>
                                        <button
                                            disabled={!locationList || locationList.length == 0}
                                            className='markAll-btn btn-sm btn-outline-secondary mr-3'
                                            onClick={() => {
                                                this.updateAll(1);
                                            }}>Select All </button>
                                        <button
                                            disabled={!selectedLocations || selectedLocations.length == 0}
                                            className='markAll-btn-rejected btn-sm btn-outline-secondary mr-3'
                                            onClick={() => {
                                                this.updateAll(0);
                                            }}>Unselect All </button>
                                        <button
                                            className="btn btn-primary"
                                            disabled={!selectedLocations || selectedLocations.length == 0}
                                            onClick={() => {
                                                this.save();
                                            }}>Assign Location
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
                                                    <th> # </th>
                                                    <th> Location </th>
                                                    <th> Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {locationList && locationList.map((item, index) => (
                                                    <tr key={`${item.id}_${index}`} className="table-row">
                                                        <td className="table-column">{index + 1}</td>
                                                        <td className="table-column">
                                                            <Row>
                                                                <h2 style={{ wordSpacing: '-5px' }} className="table-avatar">
                                                                    Name : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.name} </span>
                                                                </h2>
                                                            </Row>
                                                            <Row>
                                                                <h2 style={{ wordSpacing: '-5px' }} className="table-avatar">
                                                                    Latitude : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.latitude} </span>
                                                                </h2>
                                                            </Row>
                                                            <Row>
                                                                <h2 style={{ wordSpacing: '-5px' }} className="table-avatar">
                                                                    Longitude : <span style={{ paddingBottom: "3px", fontSize: "14px" }}> {item.longitude} </span>
                                                                </h2>
                                                            </Row>
                                                        </td>
                                                        <td className="table-column">
                                                            <Row>
                                                                <Col md={6}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedLocations && selectedLocations.length > 0 && selectedLocations.indexOf(item.id) > -1}
                                                                        className="pointer"
                                                                        onChange={e => {
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