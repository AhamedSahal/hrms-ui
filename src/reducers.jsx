import { combineReducers } from "redux";
import auth from "./initialpage/authReducer";
import dropdown from "./CompanyApp/ModuleSetup/Dropdown/DropdownReducer";
export default combineReducers({
    auth,
    dropdown
})
