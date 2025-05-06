import CreateEmployeeForm from '../CompanyApp/Employee/createForm';
import EmployeeDetailSetupRoute from '../CompanyApp/Employee/detail';

export default [
   {
      path: 'create',
      element: <CreateEmployeeForm />
   }, 
   {
      path: 'detail',
      element: <EmployeeDetailSetupRoute />
   },
];