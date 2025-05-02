import { Routes, Route } from 'react-router-dom';
//main
import DashboardRoute from '../MainPage/Main/Dashboard';
import Notification from '../MainPage/Main/Notification';
import Apps from '../MainPage/Main/Apps';
//UI Interface
import UIinterface from '../MainPage/UIinterface';
//Pages
import ProfilePage from '../MainPage/Pages/Profile';
import Subscription from '../MainPage/Pages/Subscription';
import Pages from '../MainPage/Pages/Pages';
//Administrator
import Administrator from '../MainPage/Administration';
//Performance
import Performance from '../MainPage/Performance';
import Goals from '../MainPage/Performance/Goals';
import Performances from '../MainPage/Performance/Performance';
import Training from '../MainPage/Performance/Training';
//HR
import HR from '../MainPage/HR';
import Reports from '../MainPage/HR/Reports';
import Sales from '../MainPage/HR/Sales';
import Accounts from '../MainPage/HR/Accounts';
import Payroll from '../MainPage/HR/Payroll';
//Employees
import Employees from '../MainPage/Employees';
import Employee from '../MainPage/Employees/Employees';

import AdminApp from '../AdminApp';
import CompanyApp from '../CompanyApp';


const routesConfig = [
   { path: 'main/*', element: <DashboardRoute /> },
   { path: 'employee/*', element: <Employee /> },
   { path: 'employees/*', element: <Employees /> },
   { path: 'ui-interface/*', element: <UIinterface /> },
   { path: 'profile/*', element: <ProfilePage /> },
   { path: 'subscription/*', element: <Subscription /> },
   { path: 'pages/*', element: <Pages /> },
   { path: 'administrator/*', element: <Administrator /> },
   { path: 'performance/*', element: <Performance /> },
   { path: 'goals/*', element: <Goals /> },
   { path: 'performances/*', element: <Performances /> },
   { path: 'training/*', element: <Training /> },
   { path: 'hr/*', element: <HR /> },
   { path: 'reports/*', element: <Reports /> },
   { path: 'sales/*', element: <Sales /> },
   { path: 'accounts/*', element: <Accounts /> },
   { path: 'payroll/*', element: <Payroll /> },
   { path: 'admin-app/*', element: <AdminApp /> },
   { path: 'company-app/*', element: <CompanyApp /> },
];

const AppRoutes = () => {
   return (
      <Routes>
         {routesConfig.map(({ path, element }, idx) => (
            <Route key={idx} path={path} element={element} />
         ))}
      </Routes>
   );
};

export default AppRoutes;