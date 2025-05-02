
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { getAttendancePhotos } from './service';
const { Header, Body, Footer, Dialog } = Modal;
export default class LocationListColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: props.location || null,
            id: props.id,
            photoIn: props.photoIn || null,
            photoOut: props.photoOut || null,
            clockInIp : props.clockInIp || '',
            clockOutIp :props.clockOutIp || '',

        }
    }
    
    fetchPhotos = (callback) => {
        const{id,clockInIp,clockOutIp}= this.props;
        getAttendancePhotos(id,clockInIp,clockOutIp).then(res => {

            if (res.status == "OK") {
              this.setState({
                photoIn: res.data.photoIn,
                photoOut: res.data.photoOut,
                clockInIp: res.data.clockInIp,
                clockOutIp:res.data.clockOutIp,
                showDetail:true
              })
            }
        })
    }
    openMap = (location) => {
        window.open(`http://maps.google.com/maps?q=${location}`, '_blank');
    }

    openPopup = () => {
        this.fetchPhotos();
    }

    closePopup = () => {
        this.setState({
            showDetail: false
        })
    }
    render() {

        const { location, photoIn,  photoOut,clockInIp,clockOutIp } = this.state;
        const { locationOut} = this.props;

        return <>
            <Anchor onClick={this.openPopup}><i className="menuIconFa fa fa-eye" aria-hidden="true"></i></Anchor>

            <Modal enforceFocus={false} size={"md"} show={this.state.showDetail} onHide={this.closePopup} >
                <Header closeButton>
                    <h5 className="modal-title"> Details</h5>
                </Header>
                <Body>
                    <table className='table table-bordered text-center'>
                        <tbody>
                        <tr>
                            <th>Details</th>
                            <th>In</th>
                            <th>Out</th>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>
                                {location ? <Anchor onClick={() => { this.openMap(location) }}>View Location</Anchor> : "NA"}
                            </td>
                            <td>
                                {locationOut ?
                                    <Anchor onClick={() => { this.openMap(locationOut) }}>
                                        View Location</Anchor> : "NA"}
                            </td>
                        </tr>
                        <tr>
                            <td>Selfie</td>
                            <td>
                                {photoIn ? <><img style={{ maxWidth: "100%" }} alt={'Photo In'} src={'data:image/jpeg;base64,' + photoIn} /></> : "NA"}
                            </td>
                            <td>
                                {photoOut ? <><img style={{ maxWidth: "100%" }} alt={'Photo Out'} src={'data:image/jpeg;base64,' + photoOut} /></> : "NA"}
                            </td>
                        </tr>
                        <tr>
                            <td> IP </td>
                            <td> {clockInIp && clockInIp != 0  ? clockInIp : 'NA'} </td>
                            <td> {clockOutIp && clockOutIp != 0  ? clockOutIp : 'NA'} </td>
                        </tr>
                        </tbody>
                    </table>
                </Body>


            </Modal>
        </>;
    }
}