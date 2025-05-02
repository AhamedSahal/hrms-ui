/**
 * App Header
 */
import React from 'react';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <div className="sidebar" id="sidebar">
            <div className="sidebar-inner slimscroll">
                <div className="sidebar-menu">
                    <ul>
                        <li>
                            <a href="/app/main/dashboard"><i className="la la-home" /> <span>Back to Home</span></a>
                        </li>
                        <li className="menu-title">Settings</li>
                        <li className={pathname.includes('companysetting') ? "active" : ""}>
                            <a href="/settings/companysetting"><i className="la la-building" /> <span>Company Settings</span></a>
                        </li>
                        <li className={pathname.includes('localization') ? "active" : ""}>
                            <a href="/settings/localization"><i className="la la-clock-o" /> <span>Localization</span></a>
                        </li>
                        <li className={pathname.includes('theme-') ? "active" : ""}>
                            <a href="/settings/theme-settings"><i className="la la-photo" /> <span>Theme Settings</span></a>
                        </li>
                        <li className={pathname.includes('roles-permissions') ? "active" : ""}>
                            <a href="/settings/roles-permissions"><i className="la la-key" /> <span>Roles &amp; Permissions</span></a>
                        </li>
                        <li className={pathname.includes('email-') ? "active" : ""}>
                            <a href="/settings/email-settings"><i className="la la-at" /> <span>Email Settings</span></a>
                        </li>
                        <li className={pathname.includes('performance-') ? "active" : ""}>
                            <a href="/settings/performance-setting"><i className="la la-chart-bar" /> <span>Performance Settings</span></a>
                        </li>
                        <li className={pathname.includes('approval-') ? "active" : ""}>
                            <a href="/settings/approval-setting"><i className="la la-thumbs-up" /> <span>Approval Settings</span></a>
                        </li>
                        <li className={pathname.includes('invoice-') ? "active" : ""}>
                            <a href="/settings/invoice-settings"><i className="la la-pencil-square" /> <span>Invoice Settings</span></a>
                        </li>
                        <li className={pathname.includes('salary-') ? "active" : ""}>
                            <a href="/settings/salary-settings"><i className="la la-money" /> <span>Salary Settings</span></a>
                        </li>
                        <li className={pathname.includes('notifications') ? "active" : ""}>
                            <a href="/settings/notifications"><i className="la la-globe" /> <span>Notifications</span></a>
                        </li>
                        <li className={pathname.includes('-password') ? "active" : ""}>
                            <a href="/settings/change-password"><i className="la la-lock" /> <span>Change Password</span></a>
                        </li>
                        <li className={pathname.includes('-type') ? "active" : ""}>
                            <a href="/settings/leave-type"><i className="la la-cogs" /> <span>Leave Type</span></a>
                        </li>
                        <li className={pathname.includes('toxbox-') ? "active" : ""}>
                            <a href="/settings/toxbox-setting"><i className="la la-comment" /> <span>ToxBox Settings</span></a>
                        </li>
                        <li className={pathname.includes('cron') ? "active" : ""}>
                            <a href="/settings/cron-setting"><i className="la la-rocket" /> <span>Cron Settings</span></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
