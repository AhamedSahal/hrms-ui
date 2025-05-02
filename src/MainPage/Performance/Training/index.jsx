/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Trainers from './trainers';
import Traininglist from './traininglist';
import Trainingtype from './trainingtype';

const Trainingroute = () => (
    <Routes>
        <Route path="trainer" element={<Trainers />} />
        <Route path="training-list" element={<Traininglist />} />
        <Route path="training-type" element={<Trainingtype />} />
        <Route path="*" element={<Navigate to="training-list" replace />} />
    </Routes>
);

export default Trainingroute;
