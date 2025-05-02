import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Estimate from './estimate';
import EstimateView from './estimateview';
import Createestimate from './createestimate';
import Editestimate from './editestimate';

import Expense from './expense';
import Invoice from './invoice';
import Invoicecreate from './invoicecreate';
import Invoiceedit from './invoiceedit';
import Invoiceview from './invoiceview';

import Payments from './payments';
import ProvidentFund from './providentfund';
import Taxs from './tax';

const SalesRoute = () => (
   <Routes>
      <Route path="estimates" element={<Estimate />} />
      <Route path="estimatesview" element={<EstimateView />} />
      <Route path="createestimates" element={<Createestimate />} />
      <Route path="editestimates" element={<Editestimate />} />
      <Route path="expenses" element={<Expense />} />

      <Route path="invoices" element={<Invoice />} />
      <Route path="invoices-create" element={<Invoicecreate />} />
      <Route path="invoices-edit" element={<Invoiceedit />} />
      <Route path="invoices-view" element={<Invoiceview />} />

      <Route path="payments" element={<Payments />} />
      <Route path="provident-fund" element={<ProvidentFund />} />
      <Route path="taxes" element={<Taxs />} />
      <Route path="*" element={<Navigate to="estimates" replace />} />
   </Routes>
);

export default SalesRoute;
