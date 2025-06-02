import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar_02, Avatar_03, Avatar_05, Avatar_06, Avatar_08, Avatar_09, Avatar_13, Avatar_17, Avatar_21, headerlogo, loginLogo, lnEnglish, lnFrench, lnGerman, lnSpanish } from '../../Entryfile/imagepath';
import { getUserName, getUserType, getTitle, getLogo, verifyViewPermission, getEmployeeId } from '../../utility';
import { getHeaderNotifications } from '../service';

const SideNavbar = ({ menu: initialMenu }) => {
    const [userName, setUserName] = useState(getUserName());
    const [title, setTitle] = useState(getTitle());
    const [logo, setLogo] = useState(getLogo());
    const [notifications, setNotifications] = useState([]);
    const [showNavbarIs, setShowNavbarIs] = useState(true);
    const [showdropId, setShowdropId] = useState(localStorage.getItem('showdropId') || '');
    const [subMenuId, setSubMenuId] = useState(localStorage.getItem('subMenuId') || '');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [roleValidationArray, setRoleValidationArray] = useState([]);
    const [menu, setMenu] = useState(initialMenu || []);

    const navigate = useNavigate();

    useEffect(() => {
        const validatedRoles = [];
        menu?.forEach((res) => {
            if (verifyViewPermission(res.name)) {
                validatedRoles.push(res.name);
            }
        });
        setRoleValidationArray(validatedRoles);
        fetchNotificationList();
    }, [menu]);

    useEffect(() => {
        setMenu(initialMenu);
    }, [initialMenu]);

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

    const pathname = "location.pathname";
    const isSuperAdmin = getUserType() === 'SUPER_ADMIN';
    const EmployeeValidation = getEmployeeId();

    return (
        <div className="sideNavHeader">
            <ul className="navbar-nav mainMenu w-100 justify-content-evenly align-items-center">
                {menu && menu.sort((a, b) => a.sortOrder - b.sortOrder).map((item, index) => {
                    const removeWord = ["mr-2"];
                    const appUrl = isSuperAdmin ? 'admin-app' : 'company-app';
                    const isCurrentUrl = pathname === `/app/${appUrl}${item.url}`;
                    const isSubMenuPresent = (item.subMenu && item.subMenu.length > 0) || item.url === "#";
                    const menuIcon = item.icon.split(/\s+/).filter(word => !removeWord.includes(word)).join(' ');

                    return (
                        <div key={index}>
                            {roleValidationArray.includes(item.name) && (
                                <div>
                                    {isSubMenuPresent ? (
                                        <div>
                                            <a onClick={() => { dropDownShow(item.id); handleLinkClick(item); }} style={{ color: 'white', width: '160px' }}
                                                className={`${parseInt(showdropId) === item.id ? 'menuBackgroud' : ''} p-2 mr-3 sideNavMenu nav-link`} >
                                                <em className={menuIcon}></em> <span className='ml-2 '>{item.name}</span>
                                            </a>
                                        </div>
                                    ) : (
                                        <Link to={item.url !== '/' ? `/app/${appUrl}${item.url}` : '/app/main/dashboard'} target={item.target} id='navText' className='text-white'>
                                            <a onClick={() => dropDownShow(item.id)} style={{ color: 'white', width: '160px' }}
                                                className={`${showdropId === item.id ? 'menuBackgroud' : ''} p-2 mr-3 sideNavMenu nav-link`} >
                                                <em className={menuIcon}></em> <span className='ml-2 '>{item.name}</span>
                                            </a>
                                        </Link>
                                    )}
                                    {!showSearchBar && (
                                        <div className='navSubMenu'>
                                            {item.id === parseInt(showdropId) &&
                                                item.subMenu.sort((a, b) => a.sortOrder - b.sortOrder).map((subItem, subIndex) => {
                                                    const isCurrentSubUrl = pathname === `/app/${appUrl}${subItem.url}`;
                                                    const isSubSubMenuPresent = (subItem.subMenu && subItem.subMenu.length > 0) || subItem.url === "#";
                                                    if (subItem.name === "My Team" && !verifyViewPermission("Peoples My Team")) {
                                                        return null;
                                                    }
                                                    if (subItem.name === "Organization" && !verifyViewPermission("Peoples Organization")) {
                                                        return null;
                                                    }
                                                    return (
                                                        <ul className='navSubMenu_items' key={subIndex}>
                                                            {(subItem.name !== "Approvals" || verifyViewPermission("Approvals")) && (subItem.name !== "My Team" || EmployeeValidation > 0) && (subItem.name !== "My Profile" || EmployeeValidation > 0) && (subItem.name !== "Candidate Info Form") &&
                                                                <li className={isSubSubMenuPresent ? 'openSubMenu' : ''}>
                                                                    <Link to={`/app/${appUrl}${subItem.url}`} target={item.target} >
                                                                        <span onClick={() => handleSubmenuId(subItem.id)} className={`${parseInt(subMenuId) === subItem.id ? 'subMenuBackground' : ''} subMenuName small`}>{subItem.name}</span>
                                                                    </Link>
                                                                </li>}
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
    );
};

export default SideNavbar;
