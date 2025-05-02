/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Forms from './Forms';
import Tables from './Tables';

const Uiinterfaceroute = () => (
    <Routes>
        <Route path="forms" element={<Forms />} />
        <Route path="tables" element={<Tables />} />
        <Route path="*" element={<Navigate to="forms" replace />} />
    </Routes>
);

export default Uiinterfaceroute;
