
import React, { Component } from 'react';

export default class SuccessAlert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            description: this.props.description || "",
            headText: this.props.headText || '',
            visible: true,
            imgUrl: this.props.img || '',
            description: this.props.desc || '',
        }

    }


    
    render() {
        const {headText , description, visible, imgUrl} = this.state
        if (!visible) return null;

        return <div className="success-box">

            <div className="success-content">
                <img style={{width: '140px', height: '140px'}} src={imgUrl} alt="" />
                <div className="success-header">
                    <span>{headText}</span>
                </div>
                <p>{description}</p>
            </div>
        </div>
    }
}