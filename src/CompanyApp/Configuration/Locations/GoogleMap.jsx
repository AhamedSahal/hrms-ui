import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, Circle, Autocomplete } from "@react-google-maps/api";
import { getGoogleMapKey } from "./service";

class GoogleMapComponent extends Component {
  constructor(props) {
    super(props);
    const latitude = parseFloat(this.props.latitude || "24.3311344");
    const longitude = parseFloat(this.props.longitude || "51.3072328");

    this.state = {
      center: { lat: latitude, lng: longitude },
      markerPosition: { lat: latitude, lng: longitude },
      radius: this.props.radius || 100,
      googleMapKey: '',

    }
    this.autocomplete = null;
  }
  componentDidMount() {
    const { latitude, longitude } = this.props;
    getGoogleMapKey().then(res => {
      if (res.status === "OK") {
        this.setState({
          googleMapKey: res.data,
        })
      }
    });
    if (latitude.length == 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.setState({
              center: { lat: latitude, lng: longitude },
              markerPosition: { lat: latitude, lng: longitude }
            });
          },
        )
      }
    }
  }

  onLoadAutocomplete = (autocompleteInstance) => {
    this.autocomplete = autocompleteInstance;
  }

  handlePlaceSelect = () => {
    const place = this.autocomplete.getPlace();
    const location = place.geometry?.location;

    if (location) {
      const lat = location.lat();
      const lng = location.lng();
      this.setState({
        center: { lat, lng },
        markerPosition: { lat, lng },
      });
      this.props.setFieldValue('latitude', lat);
      this.props.setFieldValue('longitude', lng);
    }
  };

  onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.setState({
      center: { lat, lng },
      markerPosition: { lat, lng },
    });
    this.props.setFieldValue('latitude', lat);
    this.props.setFieldValue('longitude', lng);
  };

  render() {
    const { markerPosition, center, googleMapKey } = this.state;
    const { radius } = this.props;

    if (!googleMapKey) { return <div>Loading Maps...</div>; }

    return (
      <LoadScript googleMapsApiKey={googleMapKey} libraries={["places"]}>
        <div>
          <Autocomplete onLoad={this.onLoadAutocomplete} onPlaceChanged={this.handlePlaceSelect}>
            <input
              type="text"
              placeholder="Enter a location"
              style={{ width: "100%", height: "40px" }}
            />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={{ height: "500px", width: "100%" }}
            zoom={14}
            center={center}
            onClick={this.onMapClick}
          >
            {markerPosition && (
              <>
                <Marker position={markerPosition} />
                <Circle
                  center={markerPosition}
                  radius={radius}
                  options={{ fillColor: "#ff0000", strokeColor: "#ff0000" }}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    );
  };
}
export default GoogleMapComponent;
