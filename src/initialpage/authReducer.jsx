import { getUserData } from "../utility";

const userData = getUserData();
const initialState = {
    user: userData,
    isAuthenticated: userData ? true : false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.user,
                isAuthenticated: true,
            };
        case 'LOGOUT': 
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};
export default authReducer;


export function loginAction(user) {
    return {
        type: 'LOGIN',
        user,
    };
}
export function logoutAction() {
    return {
        type: 'LOGOUT',
    };
}
export function otpAction() {
    return {
        type: 'OTP',
    };
}