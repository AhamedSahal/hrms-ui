/**
 * App Header
 */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar_02, Avatar_03, Avatar_05, Avatar_06, Avatar_08, Avatar_09, Avatar_13, Avatar_17, Avatar_21, headerlogo, loginLogo, lnEnglish, lnFrench, lnGerman, lnSpanish } from '../../Entryfile/imagepath';
import { getUserName, getUserType, getProfilePicture, getTitle, getLogo, getReadableDate, getTokenCookie } from '../../utility';
import { getHeaderNotifications } from '../service';
import { verifyViewPermission, verifyViewPermissionForTeam, getRoleName } from '../../utility';

const SideMobileViewNavbar = ({ menu, location }) => {
    const [userName, setUserName] = useState(getUserName());
    const [title, setTitle] = useState(getTitle());
    const [logo, setLogo] = useState(getLogo());
    const [notifications, setNotifications] = useState([]);
    const [showNavbarIs, setShowNavbarIs] = useState(true);
    const [showdropId, setShowdropId] = useState(localStorage.getItem('showdropId') || '');
    const [subMenuId, setSubMenuId] = useState(localStorage.getItem('subMenuId') || '');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [roleValidationArray, setRoleValidationArray] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const roleArray = [];
        menu?.forEach((res) => {
            if (verifyViewPermission(res.name)) {
                roleArray.push(res.name);
            }
        });
        setRoleValidationArray(roleArray);

        fetchNotificationList();
    }, [menu]);

    const fetchNotificationList = () => {
        getHeaderNotifications().then((res) => {
            if (res.status === "OK") {
                setNotifications(res.data);
            }
        });
    };

    const dropDownShow = (ids) => {
        setShowdropId(ids);
        localStorage.setItem('showdropId', ids);
    };

    const handleSubmenuId = (ids) => {
        setSubMenuId(ids);
        localStorage.setItem('subMenuId', ids);
    };

    const handleLinkClick = (item) => {
        const subMenu = item.subMenu.sort((a, b) => a.sortOrder - b.sortOrder);
        const subItemUrl = subMenu[0].url;
        setSubMenuId(subMenu[0].id);
        localStorage.setItem('subMenuId', subMenu[0].id);
        navigate(`/app/company-app${subItemUrl}`);
    };

    const isEMPLOYEE = getUserType() === 'EMPLOYEE';
    const isSuperAdmin = getUserType() === 'SUPER_ADMIN';
    const isCompanyAdmin = getUserType() === 'COMPANY_ADMIN';
    const style = { color: "white", fontSize: "26px" };
    const pathname = "location.pathname";

    return (
        <>
            <div className="sideNavHeader">
                <ul className="navbar-nav mainMenu w-100 justify-content-evenly align-items-center">
                    {menu && menu.sort((a, b) => a.sortOrder - b.sortOrder).map((item, index) => {
                        const removeWord = ["mr-2"];
                        let appUrl = isSuperAdmin ? 'admin-app' : 'company-app';
                        let isCurrentUrl = pathname === `/app/${appUrl}${item.url}`;
                        let isSubMenuPresent = (item.subMenu && item.subMenu.length > 0) || item.url === "#";
                        let menuIcon = item.icon.split(/\s+/).filter(word => !removeWord.includes(word)).join(' ');

                        return (
                            <div key={index}>
                                {roleValidationArray.includes(item.name) && (
                                    <div>
                                        {isSubMenuPresent ? (
                                            <div className={parseInt(showdropId) === item.id ? 'mobMenuBackgroud' : 'navHover'}>
                                                <a onClick={() => { dropDownShow(item.id); handleLinkClick(item); }} style={{ color: 'white', width: '10px' }}
                                                    className={`${parseInt(showdropId) === item.id ? 'mobMenuBackgroud' : ''} p-2 mr-3 nav-link`}>
                                                    <em className={menuIcon}></em> <span className='ml-2 '></span>
                                                </a>
                                            </div>
                                        ) : (
                                            <Link to={item.url !== '/' ? `/app/${appUrl}${item.url}` : '/app/main/dashboard'} target={item.target} id='navText' className='text-white'>
                                                <div className={parseInt(showdropId) === item.id ? 'mobMenuBackgroud' : 'navHover'}>
                                                    <a onClick={() => dropDownShow(item.id)} style={{ color: 'white', width: '10px' }}
                                                        className={`${showdropId === item.id ? 'mobMenuBackgroud' : ''} p-2 mr-3  nav-link`}>
                                                        <em className={menuIcon}></em> <span className='ml-2 '></span>
                                                    </a>
                                                </div>
                                            </Link>
                                        )}
                                        {!showSearchBar && (
                                            <div className='navSubMenu'>
                                                {item.id === parseInt(showdropId) &&
                                                    item.subMenu.sort((a, b) => a.sortOrder - b.sortOrder).map((subItem, subIndex) => {
                                                        let isCurrentSubUrl = pathname === `/app/${appUrl}${subItem.url}`;
                                                        let isSubSubMenuPresent = (subItem.subMenu && subItem.subMenu.length > 0) || subItem.url === "#";
                                                        return (
                                                            <ul className='navSubMenu_items' key={subIndex}>
                                                                {(subItem.name !== "Approvals" || verifyViewPermission("Approvals")) && (
                                                                    <li className={isSubSubMenuPresent ? 'openSubMenu' : ''}>
                                                                        <Link to={`/app/${appUrl}${subItem.url}`} target={item.target}>
                                                                            <span onClick={() => handleSubmenuId(subItem.id)} className={`${parseInt(subMenuId) === subItem.id ? 'subMenuBackground' : ''} subMenuName small`}>{subItem.name}</span>
                                                                        </Link>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default SideMobileViewNavbar;
