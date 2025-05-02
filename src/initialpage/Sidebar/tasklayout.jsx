import React from 'react';
import Header from './header';
import SidebarContent from './tasksidebar';

const Tasklayout = () => {

  return (
    <div className="main-wrapper">
      <Header />
      <div>
        {/* Add your routed content here */}
      </div>
      <SidebarContent />
    </div>
  );
};

export default Tasklayout;
