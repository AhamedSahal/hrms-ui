
import React, { Component } from "react";

export default class JobResponse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobResponse: {},
          
        }
    }

    render() {
        return(
            <div style={{ backgroundColor: '#f5f5f5', margin: "50px", padding: "20px" }} className="page-wrapper">
                <div style={{ border: "2px",display:"flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <h1>Thank you for submitting your application.</h1>
                <br />
                <img src="src/assets/img/check-thank-you-message.png"/>
                
                </div>

            </div>
        )
    }
}
