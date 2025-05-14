/**
 * App Routes
 */
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

// router service
import settingservice from "../../router_service/settingservice";

import Header from './header';
import SidebarContent from './settingsidebar';

class SettingsLayout extends Component {
	render() {
		return (
			<div className="main-wrapper">
				<Header/>
				<div>
					{settingservice && settingservice.map(({path , element},key)=>
						<Route key={key} path={path} element={element} />
					)}
				</div>				
				<SidebarContent/>
			</div>
		);
	}
}
export default (SettingsLayout);
