import { getWithAuth, postSSO, postWithAuth, putWithAuth } from "../HttpRequest";
import { deleteTokenCookie, deleteUserData, setCompanyCookie, setTokenCookie, tokenVerified } from "../utility";
import { loginAction, logoutAction, otpAction } from "./authReducer";
import { toast } from 'react-toastify';

const authPath = "/authentication";
export const authService = {

    login(loginData) {
        return dispatch => {
            return postWithAuth(authPath, loginData).then(res => {
                if (res.data && res.data.status === "OK") {
                    setTokenCookie(res.data.data.token);
                    setCompanyCookie(res.data.data.companyId);
                    dispatch(loginAction(res.data.data));
                    return Promise.resolve(res.data);
                } else {
                    return Promise.reject(res.data);
                }
            }).catch(err => {
                toast.error(err.message)
                return Promise.reject(err);
            });
        }
    },
    validateOtp(otp) {
        return dispatch => {
            return postWithAuth(authPath + "/verify-in-app-otp?otp=" + otp).then(res => {
                if (res.data && res.data.status === "OK" && res.data.data === 1) {
                    tokenVerified();
                    dispatch(otpAction());
                    return Promise.resolve(res.data);
                } else {
                    return Promise.reject(res.data);
                }
            }).catch(err => {
                toast.error(err.message)
                return Promise.reject(err);
            });
        }
    },
    logout() {
        deleteTokenCookie();
        deleteUserData();
        return dispatch => {
            return putWithAuth(authPath, {}).then(res => {
                dispatch(logoutAction());
                window.location.href = "/login";
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });;

        }


    },
    autoLogin(token) {
        return dispatch => {
            return postSSO(`${authPath}/auto-login?source=WEB`, token).then(res => {
                if (res.data && res.data.status === "OK") {
                    setTokenCookie(res.data.data.token);
                    dispatch(loginAction(res.data));
                } else {
                    this.logout();
                }
                return Promise.resolve(res.data);
            }).catch(err => {
                this.logout();
                return Promise.reject(err);
            });
        }
    }
    , ssoCheck() {
        return dispatch => {
            return getWithAuth('/smtp/sso-status', {}).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });;

        }


    },
    getCompanyWiseMenuList(companyId) {
        let path = `/authentication/rebind-menus?companyId=${companyId}`;
        return dispatch => {
            return postWithAuth(path, null).then(res => {
                return Promise.resolve(res.data);
            }).catch(err => {
                return Promise.reject(err);
            });;

        }
    }

}