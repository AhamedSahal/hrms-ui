/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import GoalList from './goallist';
import GoalType from './goaltype';

const Goalroute = () => (
    <Routes>
        <Route path="goal-tracking" element={<GoalList />} />
        <Route path="goal-type" element={<GoalType />} />
        <Route path="*" element={<Navigate to="goal-tracking" replace />} />
    </Routes>
);

export default Goalroute;
