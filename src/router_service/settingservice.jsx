import ApprovalSetting from '../MainPage/Administration/Settings/approvalsetting';
import ChangePassword from '../MainPage/Administration/Settings/changepassword';
import Companysettings from '../MainPage/Administration/Settings/companysettings';
import CronSetting from '../MainPage/Administration/Settings/cronsetting';
import Emailsettings from '../MainPage/Administration/Settings/EmailSettings';
import Invoicesettings from '../MainPage/Administration/Settings/InvoiceSettings';
import Leavetype from '../MainPage/Administration/Settings/leavetype';
import Notification from '../MainPage/Administration/Settings/NotificationsSettings';
import PerformanceSetting from '../MainPage/Administration/Settings/performancesetting';
import Rolepermission from '../MainPage/Administration/Settings/rolespermission';
import Salarysettings from '../MainPage/Administration/Settings/SalarySettings';
import Themesettings from '../MainPage/Administration/Settings/ThemeSettings';
import Toxboxsetting from '../MainPage/Administration/Settings/toxboxsetting';
import Localization from './../MainPage/Administration/Settings/localization';


export default [  
   {
      path: 'companysetting',
      element: <Companysettings />
   },
   {
      path: 'localization',
      element: <Localization />
   },
   {
      path: 'theme-settings',
      element: <Themesettings />
   },
   {
      path: 'roles-permissions',
      element: <Rolepermission />
   },
   {
      path: 'email-settings',
      element: <Emailsettings />
   },
   {
      path: 'invoice-settings',
      element: <Invoicesettings />
   },
   {
      path: 'salary-settings',
      element: <Salarysettings />
   },
   {
      path: 'notifications',
      element: <Notification />
   },
   {
      path: 'change-password',
      element: <ChangePassword />
   },
   {
      path: 'leave-type',
      element: <Leavetype />
   },
   {
      path: 'approval-setting',
      element: <ApprovalSetting />
   },
   {
      path: 'performance-setting',
      element: <PerformanceSetting />
   },
   {
      path: 'toxbox-setting',
      element: <Toxboxsetting />
   },
   {
      path: 'cron-setting',
      element: <CronSetting />
   }
]