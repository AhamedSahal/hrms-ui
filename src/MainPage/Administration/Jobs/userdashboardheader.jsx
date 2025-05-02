/**
 * Signin Firebase
 */

import React from 'react';
import { useLocation } from 'react-router-dom';

const UserDashboardHeader = () => {
    const location = useLocation();
    const pathname = location.pathname;

    return (  
        <div className="card">
            <div className="card-body">
                <ul className="nav nav-tabs nav-tabs-solid nav-justified">
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('user-dashboard') ?"active" :""}`} href="/app/administrator/user-dashboard">Dashboard</a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('user-all-jobs') ?"active" :""}`} href="/app/administrator/user-all-jobs">All </a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('saved-jobs') ?"active" :""}`} href="/app/administrator/saved-jobs">Saved</a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('applied-jobs') ?"active" :""}`} href="/app/administrator/applied-jobs">Applied</a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname === ('/app/administrator/interviewing') 
                    ||pathname.includes('job-aptitude') || pathname.includes('questions') ?"active" :""}`} href="/app/administrator/interviewing">Interviewing</a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('offered-jobs') ?"active" :""}`} href="/app/administrator/offered-jobs">Offered</a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('visited-jobs') ?"active" :""}`} href="/app/administrator/visited-jobs">Visitied </a></li>
                    <li className="nav-item"><a className={`nav-link ${pathname.includes('archived-jobs') ?"active" :""}`} href="/app/administrator/archived-jobs">Archived </a></li>
                </ul>
            </div>
        </div>
    );
};

export default UserDashboardHeader;
