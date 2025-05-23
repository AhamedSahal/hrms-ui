/**
 * App Routes
 */
import React from 'react';
import { Route, useParams } from 'react-router-dom';

// router service
import chatService from "../../router_service/chatservice";

import Header from './header';
import SidebarContent from './chatsidebar';

class EmailLayout extends Component {
	render() {
		const { match } = this.props;
		return (
			<div className="main-wrapper">
				<Header/>
				<div>
					{chatService && chatService.map((route,key)=>
						<Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
					)}
				</div>				
				<SidebarContent/>
			</div>
		);
	}
}
export default (EmailLayout);
