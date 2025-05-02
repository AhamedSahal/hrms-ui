/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import SubscriptionAdmin from './subscriptionadmin';
import SubscriptionCompany from './subscriptioncompany';
import SubscribedCompanies from './Subscribedcompanies';

const SubscriptionRoute = () => (
    <Routes>
        <Route path="subscriptionadmin" element={<SubscriptionAdmin />} />
        <Route path="subscriptioncompany" element={<SubscriptionCompany />} />
        <Route path="subscribedcompanies" element={<SubscribedCompanies />} />
        <Route path="*" element={<Navigate to="subscriptionadmin" replace />} />
    </Routes>
);

export default SubscriptionRoute;
