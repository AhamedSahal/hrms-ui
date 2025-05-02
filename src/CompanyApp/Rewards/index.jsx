/**
 * Crm Routes
 */
/* eslint-disable */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Benefits from './Benefits';
import PayScaleLanding from './PayScale';
const PayrollRoute = () => {
    return (
        <Routes>
            <Route path="Benefits" element={<Benefits />} />
            <Route path="Payscale" element={<PayScaleLanding />} />
        </Routes>
    )
};

export default PayrollRoute;
