
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
      component: Companysettings
   },
   {
      path: 'localization',
      component: Localization
   },
   {
      path: 'theme-settings',
      component: Themesettings
   },
   {
      path: 'roles-permissions',
      component: Rolepermission
   },
   {
      path: 'email-settings',
      component: Emailsettings
   },
   {
      path: 'invoice-settings',
      component: Invoicesettings
   },
   {
      path: 'salary-settings',
      component: Salarysettings
   },
   {
      path: 'notifications',
      component: Notification
   },
   {
      path: 'change-password',
      component: ChangePassword
   },
   {
      path: 'leave-type',
      component: Leavetype
   },
   {
      path: 'approval-setting',
      component: ApprovalSetting
   },
   {
      path: 'performance-setting',
      component: PerformanceSetting
   },
   {
      path: 'toxbox-setting',
      component: Toxboxsetting
   },
   {
      path: 'cron-setting',
      component: CronSetting
   }
]