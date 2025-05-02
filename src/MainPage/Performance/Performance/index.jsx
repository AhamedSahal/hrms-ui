/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PerformanceAppraisal from './perappraisal';
import PerformanceIndicator from './perindicator';
import PerformanceReview from './perreview';

const Performanceroute = () => (
    <Routes>
        <Route path="performance-appraisal" element={<PerformanceAppraisal />} />
        <Route path="performance-indicator" element={<PerformanceIndicator />} />
        <Route path="performance-review" element={<PerformanceReview />} />
        <Route path="*" element={<Navigate to="performance-appraisal" replace />} />
    </Routes>
);

export default Performanceroute;
