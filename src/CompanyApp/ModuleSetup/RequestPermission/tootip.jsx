import React, { Component } from 'react';
import { styled } from "@mui/material";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

export const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
        width: "200px",
        height: "auto",
        padding: "5px",
        border: "1px solid black"
    },
}));