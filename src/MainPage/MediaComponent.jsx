import React, { Component } from 'react'

export default class MediaComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mediaPath: props.mediaPath || "",
            mediaType: props.mediaType || "NONE",
            height: props.height || "100%",
            width: props.width || "100%",
            autoplay: props.autoplay || false
        }
    }
    render() {
        return (
            <>
                {this.state.mediaType === "IMAGE" &&
                    <img src={this.state.mediaPath} alt="Media" style={{maxWidth:this.state.width}} className="img-responsive" />
                }
                {this.state.mediaType === "VIDEO" &&
                    <video autoPlay={this.state.autoplay} style={{maxWidth:this.state.width}} controls>
                        <source src={this.state.mediaPath} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                }
            </>
        )
    }
}
