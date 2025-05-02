import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Category from './category';
import Budget from './budget';
import BudgetExpense from './budgetexpense';
import BudgetRevenus from './budgetrevenus';
import SubCategory from './subcategory';

const AccountsRoute = () => (
   <Routes>
      <Route path="categories" element={<Category />} />
      <Route path="sub-category" element={<SubCategory />} />
      <Route path="budgets" element={<Budget />} />
      <Route path="budget-expenses" element={<BudgetExpense />} />
      <Route path="budget-revenues" element={<BudgetRevenus />} />
      <Route path="*" element={<Navigate to="categories" replace />} />
   </Routes>
);

export default AccountsRoute;
