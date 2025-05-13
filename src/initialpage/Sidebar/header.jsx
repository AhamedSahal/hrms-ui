/**
 * App Header
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Avatar_02, Avatar_03, Avatar_05, Avatar_06, Avatar_08, Avatar_09, Avatar_13, Avatar_17, Avatar_21, } from '../../Entryfile/imagepath';
import { getUserName, getUserType, getProfilePicture, getTitle, getLogo, getReadableDate, getChatbotEnabled, getMultiEntityCompanies, getCompanyIdCookie, getTokenCookie } from '../../utility';
import { getChangeCompany, getHeaderNotifications } from '../service';
import { authService } from '../authService';
import { connect } from 'react-redux';
import { FaRobot } from "react-icons/fa";
import Chatbot from './openAiChatbot';
import chatbotGif from '../../assets/img/chatbotgif.gif'
import { companyLogoURL } from '../../HttpRequest';
import RasaChat from './rasaChat';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: getUserName(),
      title: getTitle(),
      logo: getLogo(),
      notifications: [],
      showSearchBar: false,
      companyId: getCompanyIdCookie(),
      showChatbot: false,
      showOptions: false,
      selectedChatbot: null,

    }

  }
  componentDidMount() {
    this.fetchNotificationList();
    document.addEventListener('mousedown', this.handleClickOutside);
    if (this.state.companyId) {
      this.props.dispatch(authService.getCompanyWiseMenuList(this.state.companyId)).then((res) => {
        if (res.status === "OK") {
          // localStorage.setItem("menuEntities", JSON.stringify(res.data));
          const userData = JSON.parse(localStorage.getItem('userData')) || {};
          userData.menu = res.data.companyMenuEntity;
          if (res.data.roleEntity != null) {
            userData.role = res.data.roleEntity;
          }
          userData.companyId = res.data.companyId;
          userData.companySetting = res.data.companySetting;
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      }).catch(error => {
        console.error("Error fetching menu data:", error);
      });
    }
  }
  fetchNotificationList = () => {
    getHeaderNotifications().then((res) => {
      if (res.status === "OK") {
        this.setState({ notifications: res.data });
      }
    });
  }

  handleCloseChatbot = () => {
    this.setState({ showOptions: false, showChatbot: false });
  };

  handleMouseEnter = () => {
    this.setState({ showOptions: !this.state.showOptions, showChatbot: false });
  };

  closeChatbot = () => {
    this.setState({ showChatbot: false });
  };

  handleScroll = (e) => {
    e.stopPropagation();
  };

  handleWheel = (e) => {
    // Prevent the default scroll behavior
    e.preventDefault();
    // Manually scroll the notification widget
    e.currentTarget.scrollTop += e.deltaY;
  };

  handleCompanyChange = (companyId) => {
    getChangeCompany(companyId)
      .then(response => {
        this.setState({ companyId }, () => {
          document.cookie = `companyId=${companyId}; path=/`;
          this.props.dispatch(authService.getCompanyWiseMenuList(companyId))
            .then((res) => {
              if (res.status === "OK") {
                // localStorage.setItem("menuEntities", JSON.stringify(res.data));
                const userData = JSON.parse(localStorage.getItem('userData')) || {};
                userData.menu = res.data.companyMenuEntity;
                if (res.data.roleEntity != null) {
                  userData.role = res.data.roleEntity;
                }
                userData.companyId = res.data.companyId;
                userData.companySetting = res.data.companySetting;
                localStorage.setItem('userData', JSON.stringify(userData));
                window.location.reload();
                setTimeout(() => {
                  window.location.href = "/app/main/dashboard"; // Redirects after reload
                }, 100);
                // if (this.props.updateMenu) {
                //   this.props.updateMenu(res.data);
                // }
              }
            })
            .catch(error => {
              console.error("Error fetching menu data:", error);
            });
        });
      })
      .catch(error => {
        console.error("Error changing company:", error);
      });
  };
  toggleChatbot = () => {
    this.setState(prevState => ({ showChatbot: !prevState.showChatbot, showOptions: !prevState.showChatbot }));
  };

  triggerCompanyLogoLoad = (id) => {
    companyLogoURL(id)
      .then((url) => {
        window.bindProfilePhoto(id, url);
      })
      .catch((error) => {
        console.warn('Error retrieving employee profile photo:', error);
      });
  }

  handleClickOutside = (event) => {
    if (
      this.aibotContainerRef &&
      !this.aibotContainerRef.contains(event.target)
    ) {
      this.handleCloseChatbot();
    }
  };

  render() {
    const { logo, notifications, showChatbot, showOptions, companyId } = this.state;

    let isSuperAdmin = getUserType() == 'SUPER_ADMIN';
    let companies = getMultiEntityCompanies();
    const selectedCompany = companies.find((company) => company.id === parseInt(companyId));
    const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK4SURBVFiF7dZNiJVlFAfw34x3xg8cM0TJxaRW5IipBaZulGuOLRrsS1MxaFfiQqMwpRhhlEj8ID+Yle4UF7nqwxZtdNOmRR9KGy0oFJEgaCGKOuW0OM87vvP63juX6c6q+cPlfe77nPec/3PO/xwexvF/R8sY+HwOr+E+JuAftOJrfDcG8YZQwR68lQLn0YpN2If2/EY+A91YJhiPBgvxMa7gMbyB6WnvHH7E49iBDzCY/3gu3h9lYHhFHCDDCaxI68l4B++l/yvwZtFBNf1Gi/3puUBooA2fioNlWIeXCvZaazicjG34EEtGCN6BP9N6C9aLcuwW6c5IfCVKDFcxuxaBdhwUdTuMlVhbh0Bncgh3hRA3iGwUSdxPz9+EHkoJdOMMrmEA/VhVh8AdTEnrFiGuPdiMrhyJeaJTJPs7tQi0Z5s51OuM3/FkWg8I5Q+iV5Tk6URiO24mu2dwOe+k6oEIp+JYehI13ViHAOxN9tNwVGiIOOABUY4KJmGinAizgTE3d5p7+EGIcI2o1xcjEPhFpPkbXBR9vkhkpkOc+Dz+FsI+hb/yDqpGbsMpmFln/wWR6qys0zBHnJjQx7uiG4ZQ0RgqIpWDIn03SmzO4w8cwk+4gOuYJUS8DKfxaFmAqvoZ+AjzRRaON0C8C2+LjGwVcyFDX96wkQz04FcPVNuPXfikxLZFqP02Tjbgu+YkzNCJ53E29+4KfsarJfa9+FZMxvX/lUAbdsq1TA5f4lk8UQh+QXTQ56L1Fj78aTmqHtbA3kKAMoL9oud3lnzfKmbCI4X3fY0QeB0v1wmeoVOIsrvG/gwcMfzeMSKBp0Q6m4XFht81hhEoamCSuDgcbCKBS2Ie9JRtFgn0peD3mkgAPsNSkd1SLBfz+cUmB86jIvRyuPgSvsctrBYzfawwUYzscYxjCP8CgZJ37r69hzUAAAAASUVORK5CYII="

    return (
      <>
        {!isSuperAdmin && getChatbotEnabled() ? <div
          className="aibot-container"
          ref={(refValue) => (this.aibotContainerRef = refValue)}
        >
          <div onClick={this.handleMouseEnter} className="aibot-circle aibot-chatbot">
            <img className='botImgGif' src={chatbotGif} alt="Chatbot Gift" />
          </div>
          {showOptions &&
            <div className={`aibot-openai ${showOptions ? 'aibot-visible' : ''}`}> <div className='boticon' >

              <div onClick={this.toggleChatbot}>
                <FaRobot size={40} />
              </div>
            </div>
            </div>
          }

          {console.log("cell --- showOptions", showOptions)}
          {showOptions === true &&
          <div className={` aibot-rasa ${showOptions ? 'aibot-visible' : ''}`}>
            <RasaChat />
            </div>
          }
          {showChatbot && <Chatbot closeChatbot={this.closeChatbot} />}
        </div> : <></>}



        <div className="header" style={{ right: "0px" }}>
          <nav id='navbg' className="navbar navbar-expand-lg">
            <div className="container-fluid navbar-container">
              {/* Logo */}
              <div className="header-left">
                {/* <a href="/app/main/dashboard" className="logo"> */}
                <a style={{ cursor: 'revert' }} >
                  <img src={logo} alt="WorkPlus" width={"110px"} height={"40px"} />
                </a>
              </div>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main_nav">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="main_nav">
                <nav className="navbar navbar-expand-lg  w-100">

                  <div className="collapse navbar-collapse" id="main_nav">
                  </div>
                </nav>
              </div>

              <ul className="navbar-nav ms-auto profile-nav align-items-center">
                {companies.length > 1 &&
                  <li className="nav-item dropdown has-arrow main-drop mainMenu">
                    <a className="dropdown-toggle nav-link mt-2" data-toggle="dropdown" aria-expanded="false">
                      <span className="ml-3 username">
                        {selectedCompany ? selectedCompany.name : "Select Company"}
                      </span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-new profile-dropdown" style={{ width: "250px" }}>
                      {companies.map((company) => (
                        <a
                          key={company.id}
                          className="dropdown-item"
                          onClick={() => this.handleCompanyChange(company.id)}
                          style={{ display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          <img
                            className="employee-profile"
                            src={defaultImage}
                            data-load-profile-image={company.id}
                            data-profile-photo-id={company.id}
                            alt="WorkPlus"
                            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                          />
                          <span className="company-name">{company.name}</span>
                        </a>
                      ))}
                    </div>
                  </li>
                }
                <li className="nav-item notifDropdown align-items-center">

                  <a href="#" id='navText' className="notificationIconView dropdown-toggle nav-link notificationAction" data-toggle="dropdown">
                    <i className="fa fa-bell-o" />
                  </a>
                  <div style={{ marginTop: '-6px' }} className="dropdown-menu dropdown-menu-new notifications">
                    <div className="topnav-dropdown-header">
                      <span className="notification-title">Notifications</span>
                    </div>
                    <div className="noti-content" onWheel={this.handleWheel} onScroll={this.handleScroll}>
                      <ul aria-labelledby="navText" className="notification-list">
                        {notifications && notifications.length > 0 && notifications.map((notification, index) => {
                          return (
                            <li key={index} className="notification-message">
                              <Link to={`/app/main/notification`}>
                                <div className="media">
                                  <span className="avatar">
                                    <img alt={getUserName()} src={'data:image/jpeg;base64,' + getProfilePicture()} />
                                  </span>
                                  <div className="media-body">
                                    <p className="noti-details">
                                      <span className="noti-title">{notification.details}</span>
                                    </p>
                                    <p className="noti-time"><span className="notification-time">
                                      {getReadableDate(notification.createdOn)}
                                    </span>
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>)
                        })}
                      </ul>
                    </div>
                    <div className="topnav-dropdown-footer">
                      <Link to={`/app/main/notification`}>View all Notifications</Link>
                    </div>
                  </div>
                </li>
                <li className="nav-item dropdown has-arrow main-drop mainMenu">
                  <a href="#" id='navText' className="dropdown-toggle nav-link" data-toggle="dropdown">
                    <span className="user-img"><img src={'data:image/jpeg;base64,' + getProfilePicture()} alt={getUserName()} />
                      <span className="status online" /></span>
                    <span className='ml-3 username'>{getUserName()}</span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-new profile-dropdown">
                    {/* <> <Link className="dropdown-item" to="/app/company-app/profile">My Profile</Link> </> */}
                    <a className="dropdown-item" href="#" onClick={() => {
                      this.props.logout()
                    }}>Logout</a>
                  </div>
                </li>
                <li className="user-details">
                  {/* <i className="fas fa-bell fa-lg"></i>  */}
                  {/* <div className="user-details">
            <div className='switchBtn'>
              <div className='circle'></div>
              <div className='bar'></div>
            </div>
          </div> */}

                </li>

              </ul>
            </div>
          </nav>
        </div>


      </>
    );
  }
}
export default connect()(Header);