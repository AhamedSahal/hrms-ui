
import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { BsFillInfoCircleFill } from "react-icons/bs";

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
        width: "auto",
        height: "auto",
        padding: "5px",
        border: "1px solid black"
    },
}));



export default class shiftView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shiftView: props.shiftView || {
                id: 0,
                shiftname: "",
                shiftcodename: "",
                description: "",
                shiftstarttime: "",
                shiftendtime: "",
                breaktime: 0,
                noShift: true,
                totalhoursfulldaypresentinhours: 0,
                totalhoursfulldaypresentinmins: 0,
                totalfulldayflexiblehours: 0,
                totalhourshalfdaypresentinhours: 0,
                totalhourshalfdaypresentinmins: 0,
                totalhalfdayflexiblehours: 0

            }
        }

    };

    render() {
        const { id, noShift, totalhoursfulldaypresentinhours, totalhoursfulldaypresentinmins, totalfulldayflexiblehours, totalhourshalfdaypresentinhours, totalhourshalfdaypresentinmins, totalhalfdayflexiblehours, shiftname, shiftstarttime, shiftendtime } = this.state.shiftView;
        return (
            <div className="card" style={{ fontFamily: "wotfard" }}>
                <div className="card-body" id="card">
                    <div className="row">
                        <div className="row">
                            <div className="col-md-4">
                                <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Total Hours
                                    <span style={{ paddingLeft: "5px" }}>
                                        <>
                                            <LightTooltip title="Full Day Present" placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill size={15} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </>
                                    </span>
                                    <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px" }}>
                                        {totalhoursfulldaypresentinhours}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Total Mins
                                    <span style={{ paddingLeft: "5px" }}>
                                        <>
                                            <LightTooltip title="Full Day Present" placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill size={15} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </>
                                    </span>
                                    <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px" }}>
                                        {totalhoursfulldaypresentinmins}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Flexible Mins
                                    <span style={{ paddingLeft: "5px" }}>
                                        <>
                                            <LightTooltip title="Full Day Present" placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill size={15} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </>
                                    </span>
                                    <div style={{ color: "#55687d", fontSize: "14px" }}>
                                        {totalfulldayflexiblehours}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Total Hours
                                    <span style={{ paddingLeft: "5px" }}>
                                        <>
                                            <LightTooltip title="Half Day Present" placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill size={15} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </>
                                    </span>
                                    <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px" }}>
                                        {totalhourshalfdaypresentinhours}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Total Mins
                                    <span style={{ paddingLeft: "5px" }}>
                                        <>
                                            <LightTooltip title="Half Day Present" placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill size={15} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </>
                                    </span>
                                    <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "0px" }}>
                                        {totalhourshalfdaypresentinmins}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div style={{ display: "block", color: "#999", fontSize: "12px" }}>Flexible Mins
                                    <span style={{ paddingLeft: "5px" }}>
                                        <>
                                            <LightTooltip title="Half Day Present" placement="top" style={{ margin: "-10px" }}>
                                                <IconButton>
                                                    <BsFillInfoCircleFill size={15} style={{ color: "#1DA8D5" }} />
                                                </IconButton>
                                            </LightTooltip>
                                        </>
                                    </span>
                                    <div style={{ color: "#55687d", fontSize: "14px" }}>
                                        {totalhalfdayflexiblehours}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div >
        )
    }
}