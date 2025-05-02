import { getWithAuth, getWithAuthSurvey } from "../../../HttpRequest";
import { getCompanyId } from "../../../utility";
import { setBranchData, setCountryData, setDepartmentData, setDesignationData, setEmployeeData,setEmployeeDataByCompany, setLanguageData, setLeaveTypeData, setLeaveTypeDataReport, setNationalityData, setPlanData, setReligionData, setObjectiveGroupData, setPerformanceTemplateData, setJobTitleData, setDivisionData, setGradesData, setJobTitlesData, setRoleData, setTemplatesData, setSignaturesData, setFunctionData, setSectionData, setRecognitionCategoryData, setProjectData, setActivityData, setWeekOffData, setShiftsData, setRosterData, setShiftData, setCategoryData, setSurveyLanguageData, setCompanyData, setSurveyData, setExpenseCategoryData, setWorkFlowAutomateData, setApplicantData, setWorkFlowStepAutomateData, setSourceTypeData, setAssetCategoryData, setAssetSetupData, setPaymentModeData, setPayhubRegionData, setPayhubSubRegionData, setpayhubIndustryData, setpayhubRevenueData, setEmploymentStatus , setGoalsData,setGoalsEmployeeData,setEntity} from "./DropdownReducer";
import { toast } from 'react-toastify';


export const DropdownService = {

    getBranches: function (companyId) {

        return dispatch => {
            return getWithAuth(`/branch/select?companyId=${companyId || ''}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setBranchData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getDepartments: function (companyId) {
        return dispatch => {
            return getWithAuth(`/department/select?companyId=${companyId || ''}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setDepartmentData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getDesignations: function () {
        return dispatch => {
            return getWithAuth("/designation/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setDesignationData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getNationalities: function () {
        return dispatch => {
            return getWithAuth("/country/nationalities/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setNationalityData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getCountries: function () {
        return dispatch => {
            return getWithAuth("/country/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setCountryData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getReligions: function () {
        return dispatch => {
            return getWithAuth("/religions/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setReligionData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getLanguages: function () {
        return dispatch => {
            return getWithAuth("/languages/select").then(response => {
                if (response.data && response.data.status === "OK") {

                    dispatch(setLanguageData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getSurveyLanguages: function (surveyId) {
        return dispatch => {
            return getWithAuthSurvey("/language/select?surveyId=" + surveyId + "&companyId=" + getCompanyId()).then(response => {
                if (response.data && response.data.status === "OK") {

                    dispatch(setSurveyLanguageData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getSurveys: function () {
        return dispatch => {
            return getWithAuthSurvey("/survey/select?companyId=" + getCompanyId()).then(response => {
                if (response.data && response.data.status === "OK") {

                    dispatch(setSurveyData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getEmployees: function (permission) {
        return dispatch => {
            var getPath = permission ? "/employee/select?permission=" + permission : "/employee/select"
            return getWithAuth(getPath).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setEmployeeData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });
        }
    },
    getCompanies: function () {
        return dispatch => {
            return getWithAuth("/company/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setCompanyData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });
        }
    },
    getPlans: function () {
        return dispatch => {
            return getWithAuth("/plan/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setPlanData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });
        }
    },
    getLeaveTypeReport: function (companyId) {
        return dispatch => {
            return getWithAuth(`/leave-type/selects?companyId=${companyId || ''}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setLeaveTypeDataReport(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });
        }
    },
    getLeaveTypes: function (employeeId) {
        return dispatch => {
            return getWithAuth("/leave-type/select?employeeId=" + employeeId).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setLeaveTypeData(response.data.data));
                } else {
                   
                    dispatch(setLeaveTypeData(undefined));
                    toast.error(response.data.message);
                }
            }).catch(err => {
                 toast.error(err.message) //"Something went wrong");
            });
        }
    },

    getObjectiveGroups: function () {
        return dispatch => {
            return getWithAuth("/performance-objective-group/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setObjectiveGroupData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getPerformanceTemplates: function () {
        return dispatch => {
            return getWithAuth("/performance-template/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setPerformanceTemplateData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getRoles: function () {
        return dispatch => {
            return getWithAuth("/role/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setRoleData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });
        }
    },
    getRolesByCompanyId: function (companyId) {
        return dispatch => {
            return getWithAuth(`/role/select-by-company?companyId=${companyId}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setRoleData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });
        }
    },
    getJobTitle: function () {

        return dispatch => {
            return getWithAuth(`/forecast/select`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setJobTitleData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getDivisions: function () {

        return dispatch => {
            return getWithAuth("/division/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setDivisionData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getGrades: function () {

        return dispatch => {
            return getWithAuth("/grades/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setGradesData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getJobTitles: function (companyId) {

        return dispatch => {
            return getWithAuth(`/jobTitles/select?companyId=${companyId || ''}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setJobTitlesData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getTemplates: function () {

        return dispatch => {
            return getWithAuth("/template/select?type=DOCUMENT").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setTemplatesData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getSignatures: function () {
        return dispatch => {
            return getWithAuth("/signature/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setSignaturesData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getFunctions: function () {

        return dispatch => {
            return getWithAuth("/functions/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setFunctionData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getSection: function () {

        return dispatch => {
            return getWithAuth("/section/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setSectionData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getRecognitionCategory: function () {

        return dispatch => {
            return getWithAuth("/recognition/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setRecognitionCategoryData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getProjects: function (companyId) {
        return dispatch => {
            return getWithAuth(`/project/select?companyId=${companyId || ''}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setProjectData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getActivity: function (projectId) {
        return dispatch => {
            return getWithAuth(`/activity/select?projectId=${projectId}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setActivityData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    }, getAllActivity: function (projectId) {
        return dispatch => {
            return getWithAuth(`/activity/select-all`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setActivityData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getWeekOff: function () {

        return dispatch => {
            return getWithAuth("/weekoffsetup/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setWeekOffData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getShifts: function () {

        return dispatch => {
            return getWithAuth("/shiftssetup/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setShiftsData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getRoster: function () {

        return dispatch => {
            return getWithAuth("/rostersetup/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setRosterData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getShift: function () {

        return dispatch => {
            return getWithAuth("/shiftssetup/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setShiftData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getCategory: function () {

        return dispatch => {
            return getWithAuthSurvey(`/category/select?companyId=${getCompanyId()}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setCategoryData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getExpenseCategory: function () {

        return dispatch => {
            return getWithAuth("/expensecategories/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setExpenseCategoryData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getApplicants: function () {
        return dispatch => {
            return getWithAuth("/applicant/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setApplicantData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getWorkFlowAutomate: function () {
        return dispatch => {
            return getWithAuth("/workflow/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setWorkFlowAutomateData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getWorkFlowStepAutomate: function (workflowId) {
        return dispatch => {
            // return getWithAuth(`/activity/select?projectId=${projectId}`).then(response => {
            return getWithAuth(`/workflow/selectt?workflowId=${workflowId}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setWorkFlowStepAutomateData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getSourceType: function () {
        return dispatch => {
            return getWithAuth("/hsourcetype/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setSourceTypeData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getAssetCategory: function () {
        return dispatch => {
            return getWithAuth("/assetsetup/category/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setAssetCategoryData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getAssetSetup: function (assetCatId) {
        return dispatch => {
            return getWithAuth(`/assetsetup/select?assetCatId=${assetCatId}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setAssetSetupData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getEmployeeByAdmin: function (companyId) {
        return dispatch => {
            return getWithAuth(`/company/select-employee?companyId=${companyId}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setEmployeeDataByCompany(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message);
            });;
        }
    },
    getEmployeeByCompany: function (companyId) {
        return dispatch => {
            return getWithAuth(`/company/select-employee?companyId=${companyId}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setEmployeeData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message);
            });;
        }
    },
    getCompanyListByAdmin: function (companyId,allCompany) {
        return dispatch => {
            return getWithAuth(`/company/select-multiCompany?companyId=${companyId}&allCompany=${allCompany}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setCompanyData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message);
            });;
        }
    },
    getPaymentModes: function () {
        return dispatch => {
            return getWithAuth("/payment-mode/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setPaymentModeData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message)
            });;
        }
    },

    // getPayhubRegion: function () {
    //     return dispatch => {
    //         return getWithAuth("/payhub-region/select").then(response => {
    //             if (response.data && response.data.status === "OK") {
    //                 dispatch(setPayhubRegionData(response.data.data));
    //             } else {
    //                 toast.error(response.data.message);
    //             }
    //         }).catch(err => {
    //             toast.error(err.message) //"Something went wrong");
    //         });;
    //     }
    // },

    // getPayhubSubRegion: function () {
    //     return dispatch => {
    //         return getWithAuth("/payhub-sub-region/select").then(response => {
    //             if (response.data && response.data.status === "OK") {
    //                 dispatch(setPayhubSubRegionData(response.data.data));
    //             } else {
    //                 toast.error(response.data.message);
    //             }
    //         }).catch(err => {
    //             toast.error(err.message) //"Something went wrong");
    //         });;
    //     }
    // },
    // getPayhubIndustry: function () {
    //     return dispatch => {
    //         return getWithAuth("/payhub-industry/select").then(response => {
    //             if (response.data && response.data.status === "OK") {
    //                 dispatch(setpayhubIndustryData(response.data.data));
    //             } else {
    //                 toast.error(response.data.message);
    //             }
    //         }).catch(err => {
    //             toast.error(err.message) //"Something went wrong");
    //         });;
    //     }
    // },
    // getPayhubRevanue: function () {
    //     return dispatch => {
    //         return getWithAuth("/payhub-revenue/select").then(response => {
    //             if (response.data && response.data.status === "OK") {
    //                 dispatch(setpayhubRevenueData(response.data.data));
    //             } else {
    //                 toast.error(response.data.message);
    //             }
    //         }).catch(err => {
    //             toast.error(err.message) //"Something went wrong");
    //         });;
    //     }
    // },
    getEmploymentStatus: function () {

        return dispatch => {
            return getWithAuth("/employment_Status/select").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setEmploymentStatus(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
    getGoals: function () {

        return dispatch => {
            return getWithAuth("/employee-performance/goalsSelect").then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setGoalsData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

    getGoalsEmployee: function (id) {

        return dispatch => {
            return getWithAuth(`/employee-performance/goalsEmployeeSelect?employeeId=${id}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setGoalsEmployeeData(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },
     getEntity: function (companyId) {

        return dispatch => {
            return getWithAuth(`/orgentity/select?companyId=${companyId || ''}`).then(response => {
                if (response.data && response.data.status === "OK") {
                    dispatch(setEntity(response.data.data));
                } else {
                    toast.error(response.data.message);
                }
            }).catch(err => {
                toast.error(err.message) //"Something went wrong");
            });;
        }
    },

};
