import React, { Component } from 'react';
import Region from './Region';
import Industry from './Industries';
import SubRegion from './SubRegion';
import Revenue from './Revenue';

export default class SettingsModule extends Component {
    render() {
        return (
            <div className="">

                <div className=" tab-content">
                    <div className="custom-mt pro-overview tab-pane fade show active">
                        <Region></Region>
                    </div>
                    <div className="custom-mt pro-overview tab-pane fade show active">
                        <SubRegion></SubRegion>
                    </div>
                    <div className="custom-mt pro-overview tab-pane fade show active">
                        <Industry></Industry>
                    </div>
                    <div className="custom-mt pro-overview tab-pane fade show active">
                        <Revenue></Revenue>
                    </div>
                </div>


            </div>
        )
    }
}