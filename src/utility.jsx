import Cookies from 'universal-cookie';
import { headerlogo, loginLogo } from './Entryfile/imagepath';
import { getWithAuth } from './HttpRequest';
import * as XLSX from 'xlsx';
import { PERMISSION_LEVEL } from './Constant/enum';
const cookies = new Cookies();

export function getPaginationQueryString(search, currentPageNumber, pageSize, sort) {
    let queryString = [];
    let query = {};
    if (search) {
        query["q"] = search;
    }
    if (currentPageNumber) {
        query["page"] = currentPageNumber;
    }
    if (pageSize) {
        query["size"] = pageSize;
    }
    if (sort) {
        query["sort"] = sort;
    }
    return queryString = Object.keys(query)
        .map((v, i) => `${encodeURIComponent(v)}=${encodeURIComponent(query[v])}`)
        .join('&');
}
export function setTokenCookie(token) {
    cookies.set('token', token, { path: '/' });
}
export function tokenVerified() {
    let user = JSON.parse((localStorage.getItem('userData')));
    deleteUserData();
    user.inAppOtpEnabled = false;
    setUserData(user);
}
export function getTokenCookie() {
    return cookies.get('token');
}
export function setCompanyCookie(companyId) {
    cookies.set('companyId', companyId, { path: '/' });
}
export function getCompanyIdCookie() {
    return cookies.get('companyId');
}
export function deleteTokenCookie() {

    cookies.remove('token', { path: '/' });
}
export function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
}
export function getUserData() {
    return localStorage.getItem('userData');
}
export function getUserType() {
    return JSON.parse((localStorage.getItem('userData')))?.type;
}
export function getEmployeeId() {
    return JSON.parse((localStorage.getItem('userData')))?.empId;
}
export function getRoleId() {
    if (getUserType() != 'COMPANY_ADMIN' && getUserType() != 'SUPER_ADMIN') {

        return JSON.parse((localStorage.getItem('userData')))?.role?.id || 0;
    }
}

export function getRoleName() {
    if (getUserType() != 'COMPANY_ADMIN' && getUserType() != 'SUPER_ADMIN') {

        return JSON.parse((localStorage.getItem('userData')))?.role?.name || "";
    }
}

// get menu
export function getmenu() {
    if ((getUserType() == 'COMPANY_ADMIN' || verifyOrgLevelViewPermission("Settings Access")) && getUserType() != 'SUPER_ADMIN') {
        return JSON.parse((localStorage.getItem('userData')))?.menu || [];

    }
}
export function isEmployee() {
    return getEmployeeId() != null && getEmployeeId() != 0;
}
export function getEmailId() {
    return JSON.parse((localStorage.getItem('userData')))?.email;
}
export function getUserName() {
    return JSON.parse((localStorage.getItem('userData')))?.name;
}
export function getBranchId() {
    return JSON.parse((localStorage.getItem('userData')))?.branchId;
}
export function getOtpRequired() {
    return JSON.parse((localStorage.getItem('userData')))?.inAppOtpEnabled;
}
export function getUserTitleName() {
    return JSON.parse((localStorage.getItem('userData')))?.designation;
}
export function getProfilePicture() {
    return JSON.parse((localStorage.getItem('userData')))?.profilePicture || "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";
}
export function getDefaultProfilePicture() {
    return "data:image/jpeg;base64,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";
}
export function deleteUserData() {
    localStorage.removeItem('userData');
    localStorage.removeItem('chat_session');
    sessionStorage.removeItem('chat_session');
}
export function getCurrency() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.currencySymbol || "$";
}
export function getPayrollType() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.payrollType || "NORMAL";
}
export function getChatbotEnabled() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.chatbotEnabled || false;
}
export function getTitle() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.titleText || "WorkPlus";
}
export function getLogo() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.logo || headerlogo;
}
export function getFavIcon() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.favicon || loginLogo;
}
export function getCompanyId() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.companyId || 0;
}
export function getMultiEntityCompanies() {
    return JSON.parse((localStorage.getItem('userData')))?.multiAccessEntities || [];
}
export function getPrimaryColor() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.primaryColor || "#11e26e";
}
export function getPasswordPolicy() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.passwordPolicy || "";
}
export function getPasswordValidationMessage() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.passwordValidationMessage || "Invalid Password";
}
export function getMenuBgColor() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.menuBg || "#34444c";
}
export function getPrimaryGradientColor() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.gradientColor || "#30870a";
}
export function getSyncPeoplehumCustomField() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.syncPeoplehumCustomFields || false;
}
export function getDefaultOwner() {
    return JSON.parse((localStorage.getItem('userData')))?.defaultOwner || false;
}
export function getIsMultiEntity() {
    return JSON.parse((localStorage.getItem('userData')))?.companySetting?.multiEntity || false;
}
export function setCompanySetting(companySetting) {
    var tmpData = JSON.parse(localStorage.getItem('userData'));
    if (tmpData) {
        tmpData.companySetting.primaryColor = companySetting.primaryColor;
        tmpData.companySetting.menuBg = companySetting.menuBg;
        tmpData.companySetting.gradientColor = companySetting.gradientColor;
        tmpData.companySetting.titleText = companySetting.titleText;
        setUserData(tmpData);
    }

}

export function getReadableDate(date) {
    if (!date) {
        return "";
    }
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
}

export function getReadableMonthYear(date) {
    if (!date) {
        return "";
    }
    const d = new Date(date);
    const options = { month: 'short', year: 'numeric' };
    const formattedDate = d.toLocaleDateString('en-US', options);

    return formattedDate;
}

// get day and month
export function getReadableDayMonth(date) {
    if (!date) {
        return "";
    }
    var d = new Date(date), day = '' + d.getDate();
    if (day.length < 2) day = '0' + day;
    const options = { month: 'short' };
    const formattedDate = d.toLocaleDateString('en-US', options);

    return [day, formattedDate].join('-');
}

export function getCustomizedDate(date) {
    if (!date) {
        return "";
    }
    var d = new Date(date);

    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return formattedDate;
}

export function getCustomizedWidgetDate(date) {
    if (!date) {
        return "";
    }
    var d = new Date(date);

    const formattedDate = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return formattedDate
}

export function isDateGreaterThanOrEqualsToCurrentDate(date) {

    var resDate1 = new Date(
        new Date(date).getFullYear(),
        new Date(date).getMonth(),
        new Date(date).getDate());

    var resDate2 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate());
    if (resDate1 > resDate2) {
        return true
    }
}
export function camelize(text) {
    var result = text.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function exportToSortedCsv(data, sheetName, fileName) {
    let selectedProperties = ["employeeId", "fullName", "email", "reportingManager", "jobTitle", "department"];
    // let capitalizedProperties = selectedProperties.map(property => property.charAt(0).toUpperCase() + property.slice(1));
    let capitalizedProperties = selectedProperties.map(property => camelize(property));

    let propertyMapping = {};
    selectedProperties.forEach((property, index) => {
        propertyMapping[property] = capitalizedProperties[index];
    });

    let wsProperties = [];
    let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).sort((a, b) => {
        const dateA = Date.parse(a);
        const dateB = Date.parse(b);
        let wstempObj = {
            wch: 20
        }
        wsProperties.push(wstempObj)
        return isNaN(dateA) || isNaN(dateB) ? a.localeCompare(b) : dateA - dateB;
    });
    let heading = [...capitalizedProperties, ...tempselectedProperties];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([heading]); // Create worksheet manually

    // Applying styles to header row
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        ws[cellAddress].s = {
            fill: {
                bgColor: { rgb: "FFFF00" }, // Yellow 
            },
            font: {
                color: { rgb: "FFFFFF" }, // White 
            }
        };
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    ws['!cols'] = [...wsProperties];
    XLSX.utils.sheet_add_json(ws, data.map(obj => {
        let newObj = {};
        for (let key in obj) {
            newObj[propertyMapping[key] || key] = obj[key];
        }
        return newObj;
    }), { origin: 'A2', skipHeader: true, delimiter: '\t', header: heading });
    XLSX.writeFile(wb, fileName + '.xlsx');
}

// order csv
export function exportToSortedCsvOrder(data, sheetName, fileName, selectedProperties) {
    let capitalizedProperties = selectedProperties.map(property => camelize(property));

    let propertyMapping = {};
    selectedProperties.forEach((property, index) => {
        propertyMapping[property] = capitalizedProperties[index];
    });

    let wsProperties = [];
    let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).sort((a, b) => {
        const dateA = Date.parse(a);
        const dateB = Date.parse(b);
        let wstempObj = {
            wch: 20
        }
        wsProperties.push(wstempObj)
        return isNaN(dateA) || isNaN(dateB) ? a.localeCompare(b) : dateA - dateB;
    });
    let heading = [...capitalizedProperties, ...tempselectedProperties];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([heading]); // Create worksheet manually

    // Applying styles to header row
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        ws[cellAddress].s = {
            fill: {
                bgColor: { rgb: "FFFF00" }, // Yellow 
            },
            font: {
                color: { rgb: "FFFFFF" }, // White 
            }
        };
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    ws['!cols'] = [...wsProperties];
    XLSX.utils.sheet_add_json(ws, data.map(obj => {
        let newObj = {};
        for (let key in obj) {
            newObj[propertyMapping[key] || key] = obj[key];
        }
        return newObj;
    }), { origin: 'A2', skipHeader: true, delimiter: '\t', header: heading });
    XLSX.writeFile(wb, fileName + '.xlsx');
}


export function exportToCsv(data, sheetName, fileName) {
    let Heading = [];
    Heading.push(Object.keys(data[0]).map(key => camelize(key)));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(ws, Heading);
    XLSX.utils.sheet_add_json(ws, data, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName + '.xlsx');
}

export function exportToCsvSorted(data, selectedProperties, sheetName, fileName) {

    let Heading = selectedProperties.map(key => camelize(key));
    const wb = XLSX.utils.book_new();
    const filteredData = data.map(item => {
        let filteredItem = {};
        selectedProperties.forEach(prop => {
            filteredItem[camelize(prop)] = item[prop];
        });
        return filteredItem;
    });
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.sheet_add_aoa(ws, [Heading], { origin: "A1" });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName + '.xlsx');
}

// new

export function exportToSurveyResponse(data, selectedProperties, sheetName, fileName) {
    let Heading = selectedProperties.map(key => camelize(key));

    const wb = XLSX.utils.book_new();
    let filteredData = data.map(item => {
        let filteredItem = {};
        selectedProperties.forEach(prop => {

            if (prop == "submittedOn") {
                filteredItem[camelize(prop)] = toLocalDateTimeforReport(item[prop]) || "";
            } else {
                filteredItem[camelize(prop)] = item[prop] || "";
            }
        });
        return filteredItem;
    });

    const ws = XLSX.utils.json_to_sheet(filteredData);


    XLSX.utils.sheet_add_aoa(ws, [Heading], { origin: "A1" });


    ws["!cols"] = selectedProperties.map(prop => ({
        wch: Math.max(10, prop.length * 2.5)
    }));


    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName + '.xlsx');
}



export function toLocalTime(time) {
    if (time) {
        return new Date('01/01/2022 ' + time + ' UTC').toLocaleTimeString([], { timeStyle: 'short' });
    }
}
export function toLocalCalendarTime(time) {
    if (time) {
        var tmp = (new Date('01/01/2022 ' + time + ' UTC').toLocaleTimeString([], { timeStyle: 'medium', hourCycle: 'h24' })).split(" ")[0];
        if (tmp.split(':')[0] == 24) {
            tmp = '00' + tmp.substring(2)
        }
        return tmp;
    }
}


export function toUTCCalendarTime(time) {
    if (time) {
        var date = new Date('01/01/2022 ' + time);
        return ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2) + ":00";
    }
}

export function convertToUTC(dateTimeString) {
    const inputDateTime = new Date(dateTimeString);
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const browserTimeZoneOffsetInMilliseconds = new Date().getTimezoneOffset() * 60000;
    const adjustedDateTime = new Date(inputDateTime.getTime() - browserTimeZoneOffsetInMilliseconds);
    const adjustedTimeZoneOffsetInMilliseconds = adjustedDateTime.getTimezoneOffset() * 60000;
    const utcDateTime = new Date(adjustedDateTime.getTime() + adjustedTimeZoneOffsetInMilliseconds);
    return utcDateTime.toISOString();
}

export function convertToUserTimeZone(dateTimeString) {
    const datetime = new Date(dateTimeString);
    const userTimeZoneOffset = datetime.getTimezoneOffset();
    const userDateTime = new Date(datetime.getTime() - (userTimeZoneOffset * 60000));
    const hour = userDateTime.getHours();
    const minute = userDateTime.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute < 10 ? '0' + minute : minute;

    return `${formattedHour}:${formattedMinute} ${ampm}`;
}
// Convert UTC to user's local timezone 
export function convertToUserDateTimeZone(dateTimeString) {
    const datetime = new Date(dateTimeString);
    const localTime = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 60000);

    const year = localTime.getFullYear();
    const month = (localTime.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed
    const day = localTime.getDate().toString().padStart(2, '0');
    const hour = localTime.getHours().toString().padStart(2, '0');
    const minute = localTime.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hour}:${minute}`;

    console.log(`${formattedDate} ${formattedTime}`);
    return `${formattedDate} ${formattedTime}`;
}

/* 02:10 AM -- Ahamed changes  26 sept 24*/
export function convertToUserTimeZoneForAttendance(dateTimeString) {
    const datetime = new Date(dateTimeString);
    const userTimeZoneOffset = datetime.getTimezoneOffset();
    const userDateTime = new Date(datetime.getTime() - (userTimeZoneOffset * 60000));
    const hour = userDateTime.getHours();
    const minute = userDateTime.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const twoDigiHour = formattedHour < 10 ? '0' + formattedHour : formattedHour;
    const formattedMinute = minute < 10 ? '0' + minute : minute;

    return `${twoDigiHour}:${formattedMinute} ${ampm}`;
}

export function convertToUserTimeZoneWithAMPM(dateTimeString) {

    var date = new Date('01/01/2022 ' + dateTimeString);
    const datetime = new Date(date);
    const userTimeZoneOffset = datetime.getTimezoneOffset();
    const userDateTime = new Date(datetime.getTime() - (userTimeZoneOffset * 60000));
    const hour = userDateTime.getHours();
    const minute = userDateTime.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12 < 10 ? '0' + hour % 12 : hour % 12;
    const formattedMinute = minute < 10 ? '0' + minute : minute;

    return `${formattedHour}:${formattedMinute} ${ampm}`;
}

export function toLocalDate(date) {
    if (date) {
        return new Date(date + ' UTC').toLocaleDateString();
    }
}
export function toLocalDateTime(dateTime) {
    if (dateTime) {
        dateTime = dateTime.replace('T', ' ');
        return new Date(dateTime + ' UTC').toLocaleString([], { timeStyle: 'short', dateStyle: 'medium', hourCycle: 'h12' });

    }
}

// reports local date
export function toLocalDateTimeforReport(dateTime) {
    if (dateTime) {
        return new Date(dateTime.replace(' ', 'T') + 'Z').toLocaleString([], { timeStyle: 'short', dateStyle: 'medium', hourCycle: 'h12' })
    }
}

export function formatDate(dateString) {
    return dateString.split("T")[0];
};

export function toGoalsLocalDateTime(dateTime) {
    if (dateTime) {
        dateTime = dateTime.replace('T', ' ');
        const localDateTime = new Date(dateTime + ' UTC');
        const formattedDate = localDateTime.toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric', });
        const formattedTime = localDateTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true, });
        return { date: formattedDate, time: formattedTime };
    }
    return null;
}

export function formTime(time) {
    if (time) {
        return new Date('01/01/2022 ' + time + ' UTC').toLocaleTimeString().slice(0, -3);
    }
}
export function formTimeFormat(time) {
    if (time) {
        const date = new Date('01/01/2022 ' + time + ' UTC');
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    return "-";
}

export function permissionCheck(response) {
    if (response.status == "LOCKED" || response.message == "Invalid Permission" || response.message == "You are not authorized to perform this action") {
        console.log(response)
        window.location.pathname = '/access-denied';
        return false;
    }
    return true;
}

export function getPermission(module, actionType) {
    if (getUserType() == 'COMPANY_ADMIN') {
        return PERMISSION_LEVEL.ORGANIZATION;
    }
    var roleActionEntities = JSON.parse((localStorage.getItem('userData')))?.role?.roleActionEntities;
    if (roleActionEntities) {
        var moduleRoleActions = roleActionEntities.filter(a => a.module.toLowerCase() == module.toLowerCase() && a.actionType == actionType);
        if (moduleRoleActions.filter(r => r.permissionLevel == PERMISSION_LEVEL.ORGANIZATION).length > 0) {
            return PERMISSION_LEVEL.ORGANIZATION;
        } else if (moduleRoleActions.filter(r => r.permissionLevel == PERMISSION_LEVEL.HIERARCHY).length > 0) {
            return PERMISSION_LEVEL.HIERARCHY;
        } else if (moduleRoleActions.filter(r => r.permissionLevel == PERMISSION_LEVEL.SELF).length > 0) {
            return PERMISSION_LEVEL.SELF;
        }
    }
    return PERMISSION_LEVEL.NONE;
}
export function getSelfPermission(module, actionType) {
    if (getUserType() == 'COMPANY_ADMIN') {
        return PERMISSION_LEVEL.ORGANIZATION;
    }
    var roleActionEntities = JSON.parse((localStorage.getItem('userData')))?.role?.roleActionEntities;
    if (roleActionEntities) {
        var moduleRoleActions = roleActionEntities.filter(a => a.module.toLowerCase() == module.toLowerCase() && a.actionType == actionType);
        if (moduleRoleActions.filter(r => r.permissionLevel == PERMISSION_LEVEL.SELF).length > 0) {
            return PERMISSION_LEVEL.SELF;
        }
    }
    return PERMISSION_LEVEL.NONE;
}

export function verifyViewPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN' || getUserType() == 'SUPER_ADMIN') {
        return true;
    }
    return getPermission(module, "VIEW") != PERMISSION_LEVEL.NONE;
}
export function verifySelfViewPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN') {
        return true;
    }
    return getSelfPermission(module, "VIEW") != PERMISSION_LEVEL.NONE;
}
export function verifySelfEditPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN') {
        return true;
    }
    return getSelfPermission(module, "EDIT") != PERMISSION_LEVEL.NONE;
}
export function verifyEditPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN' || getUserType() == 'SUPER_ADMIN') {
        return true;
    }
    return getPermission(module, "EDIT") != PERMISSION_LEVEL.NONE;
}

export function verifyRoleEditPermissionforSelf(module) { // Irfan changes - 26Sept24
    if (getUserType() == 'COMPANY_ADMIN' || getUserType() == 'SUPER_ADMIN') {
        return true;
    }
    return getPermission(module, "EDIT") == PERMISSION_LEVEL.SELF;
}

export function verifyApprovalPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN' || getUserType() == 'SUPER_ADMIN') {
        return true;
    }
    var permission = getPermission(module, "EDIT");
    return permission == PERMISSION_LEVEL.ORGANIZATION || permission == PERMISSION_LEVEL.HIERARCHY;
}
export function verifyViewPermissionForTeam(module) {
    if (getUserType() == 'COMPANY_ADMIN') {
        return true;
    }
    var permission = getPermission(module, "VIEW");
    return permission == PERMISSION_LEVEL.ORGANIZATION || permission == PERMISSION_LEVEL.HIERARCHY;
}
export function verifyOrgLevelViewPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN' || getUserType() == 'SUPER_ADMIN') {
        return true;
    }
    return getPermission(module, "VIEW") == PERMISSION_LEVEL.ORGANIZATION;
}
export function verifyOrgLevelEditPermission(module) {
    if (getUserType() == 'COMPANY_ADMIN' || getUserType() == 'SUPER_ADMIN') {
        return true;
    }
    return getPermission(module, "EDIT" || getUserType() == 'SUPER_ADMIN') == PERMISSION_LEVEL.ORGANIZATION;
}
export function getQueryParam(paramName) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(paramName);
}
export function getOrDefault(field, defaultText) {
    return field ? field.length > 0 ? field : defaultText : defaultText;
}

export function setAllChecked(data, selectedProperties, checkAll) {
    let sortedData = []
    if (data && data.length > 0 && checkAll) {
        let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).map(key => key);
        sortedData = [...selectedProperties, ...tempselectedProperties]
    }
    return sortedData;

}

export function setAllCheckedEmployee(data, selectedProperties, checkAll) {
    let sortedData = []
    if (data && data.length > 0 && checkAll) {
        let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).map(key => key);
        sortedData = [...selectedProperties]
    }
    return sortedData;

}

export function toDateTime(date, time) {
    if (time) {
        const d = new Date(date);
        var dateee = new Date(d + time);
        return ("0" + dateee).slice(-2) + ":" + ("0" + dateee).slice(-2) + ":00 " + time;
    }
}

// date and time formate
export function formatDateTime(dateString) {
    let date = new Date(dateString);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return `${day}-${month}-${year} , ${formattedTime}`;
}