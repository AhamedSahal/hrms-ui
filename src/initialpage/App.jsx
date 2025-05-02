import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import $ from 'jquery';
import Error404 from '../MainPage/Pages/ErrorPage/error404';
import Error500 from '../MainPage/Pages/ErrorPage/error500';
import ApplyJobs from './ApplyJob';
import { authService } from './authService';
import ForgotPassword from './forgotpassword';
import LockScreen from './lockscreen';
import LoginPage from './loginpage';
import AutoLoginPage from './autologin';
import OTPPage from './OTPPage';
import RegistrationPage from './RegistrationPage';
import DefaultLayout from './Sidebar/DefaultLayout';
import Emaillayout from './Sidebar/emaillayout';
import Settinglayout from './Sidebar/Settinglayout';
import Tasklayout from './Sidebar/tasklayout';
import { getFavIcon, getPrimaryColor, getPrimaryGradientColor, getMenuBgColor, getOtpRequired } from '../utility';
import ForgotPasswordReset from './ResetPassword';
import JobResponse from '../CompanyApp/Hire/hApplicants/hApplicantForm/JobResponse';
import AccessDenied from '../MainPage/Main/Dashboard/AccessDenied';
import JobCandidateFormIndex from '../CompanyApp/Hire/hApplicants/hApplicantForm/JobCandidateFormIndex';
import CandidateInfoForm from '../CompanyApp/Onboarding/Candidateinfo/form';

function getFaviconEl() {
    return document.getElementById("favicon");
}

function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.1)';
    }
    throw new Error('Bad Hex');
}

function setAppTheme(pc, pgc, mbc) {
    document.body.style.setProperty('--primary-gradient-color', pgc);
    document.body.style.setProperty('--primary-color', pc);
    document.body.style.setProperty('--light-bg-color', hexToRgbA(pc));
    document.body.style.setProperty('--menu-background-color', mbc);
}

const App = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [menu, setMenu] = useState(undefined);
    const location = useLocation();
    useEffect(() => {
        let parsedUser;
        try {
            if (user) {
                parsedUser = JSON.parse(user);
                setMenu(parsedUser.menu);
            }
        } catch (error) {
            console.error(error);
        }

        getFaviconEl().setAttribute("href", getFavIcon());
        setAppTheme(getPrimaryColor(), getPrimaryGradientColor(), getMenuBgColor());

        if (location.pathname.includes("login") || location.pathname.includes("register") || location.pathname.includes("forgot-password")
            || location.pathname.includes("otp") || location.pathname.includes("lockscreen")) {
            $('body').addClass('account-page');
        } else if (location.pathname.includes("error-404") || location.pathname.includes("error-500")) {
            $('body').addClass('error-page');
        }
    }, [user, location.pathname]);

    if (user === null && !location.pathname.includes("login") && !location.pathname.includes("forgot-password") && location.pathname !== '/hire/candidateinfo/:id/:sourcetype') {
        return (<Navigate to={'/login'} />);
    } else if (getOtpRequired() && !location.pathname.includes("/otp")) {
        return (<Navigate to={'/otp'} />);
    } else if (location.pathname === '/') {
        return (<Navigate to={'/app/main/dashboard'} />);
    } 
    console.log("menu", location.pathname);
    

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auto-login" element={<AutoLoginPage />} />
            <Route path="/forgot-password/reset" element={<ForgotPasswordReset />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/otp" element={<OTPPage />} />
            <Route path="/lockscreen" element={<LockScreen />} />
            <Route path="/applyjob" element={<ApplyJobs />} />
            <Route path="/settings" element={<Settinglayout />} />
            <Route path="/tasks" element={<Tasklayout />} />
            <Route path="/email" element={<Emaillayout />} />
            <Route path="/conversation" element={<chatlayout />} />
            <Route path="/ui-components" element={<uicomponents />} />
            <Route path="/error-404" element={<Error404 />} />
            <Route path="/error-500" element={<Error500 />} />
            <Route path={`/access-denied`} element={<AccessDenied />} />
            <Route exact path="/hire/candidateinfo/:id/:sourcetype" element={<JobCandidateFormIndex />} />
            <Route exact path="/externalofferlettercandidateinfo" element={<CandidateInfoForm />} />
            <Route exact path="/successMessage" element={<JobResponse />} />
            <Route path="/app/*" element={<DefaultLayout logout={() => dispatch(authService.logout())} menu={menu} />} />
        </Routes>
    );
};

export default App;