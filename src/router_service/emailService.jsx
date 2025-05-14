import Inbox from '../MainPage/Main/Apps/Email/inbox';
import Compose from '../MainPage/Main/Apps/Email/compose';
import Mailview from '../MainPage/Main/Apps/Email/mailview';

export default [  
   {
      path: 'inbox/*',
      element: <Inbox />
   }, 
   {
      path: 'compose/*',
      element: <Compose />
   }, 
   {
      path: 'mail-view/*',
      element: <Mailview />
   }
]