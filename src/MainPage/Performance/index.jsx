/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Promotion from './promotion';
import Resignation from './resignation';
import Termination from './termination';

const Performanceroute = () => (
    <Routes>
        <Route path="promotion" element={<Promotion />} />
        <Route path="resignation" element={<Resignation />} />
        <Route path="termination" element={<Termination />} />
        <Route path="*" element={<Navigate to="promotion" replace />} />
    </Routes>
);

export default Performanceroute;
