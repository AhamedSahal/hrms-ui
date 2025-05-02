import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { getTitle, verifyOrgLevelViewPermission } from '../../../utility';
import Objective from './Objective';
import ObjectiveGroup from './ObjectiveGroup';
import OverallScore from './OverallScore';
export default class PerformanceLanding extends Component {
    render() {
        return (
            <div>

                <div className="content container-fluid">

                    <div className="tab-content">

                        <div className="pro-overview tab-pane fade show active">
                            <ObjectiveGroup></ObjectiveGroup>
                        </div>
                        <div className="mt-2 pro-overview tab-pane fade show active">
                            <Objective></Objective>
                        </div>
                        <div className="mt-2 pro-overview tab-pane fade show active">
                            <OverallScore></OverallScore>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}