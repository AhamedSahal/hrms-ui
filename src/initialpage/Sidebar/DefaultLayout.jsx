/**
 * App Routes
 */
import React, { useState, useEffect } from 'react';
import Header from './header.jsx';
import SideMobileViewNavbar from './mobileViewNavbar.jsx';
import SideNavbar from './sideNavbar.jsx';
import AppRoutes from '../../router_service/index.jsx';

const DefaultLayout = ({ menu, logout }) => {
	const [showNavbarIs, setShowNavbarIs] = useState(true);
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);
	
	const hideSideNavBar = () => {
		setShowNavbarIs(!showNavbarIs);
	};
	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 600px)');
		const handleScreenChange = (e) => {
			setIsSmallScreen(e.matches);
		};

		mediaQuery.addListener(handleScreenChange);
		return () => {
			mediaQuery.removeListener(handleScreenChange);
		};
	}, []);
	return (
		<div className="main-wrapper">
			<Header showNavbarIs={showNavbarIs} menu={menu} logout={logout} />
			<>
				<p onClick={hideSideNavBar} className='sideNavbarIcon'>
					<i className="fa-lg fa fa-bars text-white" aria-hidden="true"></i>
				</p>
			</>

			{showNavbarIs ? (
				<div className='sideNav'>
					{isSmallScreen ? (
						<SideMobileViewNavbar menu={menu} showNavbarIs={showNavbarIs} />
					) : (
						<SideNavbar menu={menu} showNavbarIs={showNavbarIs} />
					)}
				</div>
			) : null}
			<div
				style={{
					marginLeft: showNavbarIs && (isSmallScreen ? '56px' : '165px'),
				}}
				className='mainPageDash'
			>
				<AppRoutes />
			</div>
		</div>
	);
};

export default DefaultLayout;

