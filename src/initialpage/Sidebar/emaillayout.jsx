/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// router service
import emailService from "../../router_service/emailService";

import Header from './header';
import SidebarContent from './emailsidebar';

class EmailLayout extends Component {
	render() {
		return (
			<div className="main-wrapper">
				<Header/>
				<div>
					{emailService && emailService.map(({path , element} ,key)=>
						<Route key={key} path={path} element={element} />
					)}
				</div>				
				<SidebarContent/>
			</div>
		);
	}
}
export default EmailLayout;
