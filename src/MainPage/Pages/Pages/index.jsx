/**
 * Tables Routes
 */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Blank from './blank';
import Faq from './faq';
import Privacypolicy from './privacypolicy';
import Search from './search';
import Terms from './terms';

const Uiinterfaceroute = () => (
    <Routes>
        <Route path="search" element={<Search />} />
        <Route path="blank" element={<Blank />} />
        <Route path="faq" element={<Faq />} />
        <Route path="privacypolicy" element={<Privacypolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="search" replace />} />
    </Routes>
);

export default Uiinterfaceroute;
