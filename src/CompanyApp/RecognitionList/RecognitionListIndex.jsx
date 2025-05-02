import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { getTitle, getUserType } from '../../utility';
import RecognitionGiven from './RecognitionGiven.jsx';
import RecognitionReceive from './RecognitionReceive.jsx';
import RecognitionMainList from './RecognitionHRAdmin.jsx';
import RecognitionMain from '../RecognitionMain/form.jsx';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class RecognitionListIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            req: true
        };
    }
    render() {
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Recognition Wall | {getTitle()}</title>
                </Helmet>
                <div className="content container-fluid">
                    <div className="mt-4 tab-content">
                        <div className="subMenu_box row user-tabs">
                            <div className="nav-box">
                                <div className="page-headerTab">
                                    <h3 style={{ color: 'white' }} className="page-title">Recognition</h3>
                                    <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                                        <ul className="nav nav-items">
                                            <li className="nav-item"><a href="#poverall" data-toggle="tab" className="nav-link active">Recognition Wall</a></li>
                                            <li className="nav-item"><a href="#psomeone" data-toggle="tab" className="nav-link " title="Recognize Someone">New Recognition</a></li>
                                            {!isCompanyAdmin && <li className="nav-item"><a href="#preceive" data-toggle="tab" className="nav-link">My Recognitions</a></li>}
                                            {!isCompanyAdmin && <li className="nav-item"><a href="#pgiven" data-toggle="tab" className="nav-link">Recognitions Given</a></li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="poverall" className="pro-overview insidePageDiv tab-pane fade show active">
                            <RecognitionMainList></RecognitionMainList>
                        </div>
                        <div id="preceive" className="pro-overview insidePageDiv tab-pane fade">
                            <RecognitionReceive></RecognitionReceive>
                        </div>
                        <div id="pgiven" className="pro-overview insidePageDiv tab-pane fade">
                            <RecognitionGiven></RecognitionGiven>
                        </div>
                        <div id="psomeone" className="pro-overview insidePageDiv tab-pane fade">
                            <RecognitionMain></RecognitionMain>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}