
import CreateEmployeeForm from '../CompanyApp/Employee/createForm';
import EmployeeDetailSetupRoute from '../CompanyApp/Employee/detail';

export default [  
   // {
   //    path: '',
   //    component: EmployeeList
   // }, 
   {
      path: 'create',
      component: CreateEmployeeForm
   }, 
   {
      path: 'detail',
      component: EmployeeDetailSetupRoute
   },
]