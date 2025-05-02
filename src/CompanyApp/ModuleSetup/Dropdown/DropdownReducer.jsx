const initialState = {
    branches: [],
    departments: [],
    nationalities: [],
    religions: [],
    languages: [],
    designations: [],
    countries: [],
    employees: [],
    companies: [],
    plans: [],
    leaveTypes: [],
    leaveTypeReport: [],
    objectivegroups: [],
    performanceTemplates: [],
    roles: [],
    jobTitles: [],
    divisions: [],
    grades: [],
    templates: [],
    signatures: [],
    jobTitle: [],
    functions: [],
    section: [],
    recognition: [],
    project: [],
    activity: [],
    weekoff: [],
    shifts: [],
    roster: [],
    shift: [],
    category: [],
    surveyLanguages: [],
    surveys: [],
    expensecategories: [],
    sourceType: [],
    applicant: [],
    workFlowAutomate: [],
    workFlowStepAutomate: [],
    AssetsCategory: [],
    AssetSetup: [],
    paymentModes: [],
    payhubRegion: [],
    payhubSubRegion: [],
    payhubIndutry: [],
    payhubRevenue: [],
    employmentStatus: [],
    goals: [],
    goalsEmployee: [],
    entity:[]
}
const DropdownReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_BRANCH_DATA':
            return {
                ...state,
                branches: action.branches
            };
        case 'SET_DEPARTMENT_DATA':
            return {
                ...state,
                departments: action.departments
            };
        case 'SET_DESIGNATION_DATA':
            return {
                ...state,
                designations: action.designations
            };
        case 'SET_NATIONALITY_DATA':
            return {
                ...state,
                nationalities: action.nationalities
            };
        case 'SET_COUNTRY_DATA':
            return {
                ...state,
                countries: action.countries
            }
        case 'SET_RELIGION_DATA':
            return {
                ...state,
                religions: action.religions
            }
        default:
        case 'SET_LANGUAGE_DATA':
            return {
                ...state,
                languages: action.languages
            }
        case 'SET_EMPLOYEE_DATA':
            return {
                ...state,
                employees: action.employees
            }
        case 'SET_COMPANY_DATA':
            return {
                ...state,
                companies: action.companies
            }
        case 'SET_PLAN_DATA':
            return {
                ...state,
                plans: action.plans
            }
        case 'SET_OBJECTGROUP_DATA':
            return {
                ...state,
                objectivegroups: action.objectivegroups
            }
        case 'SET_LEAVETYPE_DATA':
            return {
                ...state,
                leaveTypes: action.leaveTypes
            }
        case 'SET_LEAVETYPE_DATA_REPORT':
            return {
                ...state,
                leaveTypeReport: action.leaveTypeReport
            }
        case 'SET_PERFORMANCE_TEMPLATE_DATA':
            return {
                ...state,
                performanceTemplates: action.performanceTemplates
            }
        case 'SET_ROLE_DATA':
            return {
                ...state,
                roles: action.roles
            }
        case 'SET_JOBTITLE_DATA':
            return {
                ...state,
                jobTitle: action.jobTitle
            };
        case 'SET_DIVISION_DATA':
            return {
                ...state,
                divisions: action.divisions
            };
        case 'SET_GRADES_DATA':
            return {
                ...state,
                grades: action.grades
            };
        case 'SET_JOBTITLES_DATA':
            return {
                ...state,
                jobTitles: action.jobTitles
            };
        case 'SET_TEMPLATES_DATA':
            return {
                ...state,
                templates: action.templates
            };
        case 'SET_SIGNATURES_DATA':
            return {
                ...state,
                signatures: action.signatures
            };

        case 'SET_FUNCTION_DATA':
            return {
                ...state,
                functions: action.functions
            };
        case 'SET_SECTION_DATA':
            return {
                ...state,
                section: action.section
            };
        case 'SET_RECOGNITIONCATEGORY_DATA':
            return {
                ...state,
                recognition: action.recognition
            };
        case 'SET_PROJECT_DATA':
            return {
                ...state,
                project: action.project
            };
        case 'SET_ACTIVITY_DATA':
            return {
                ...state,
                activity: action.activity
            };
        case 'SET_WEEKOFF_DATA':
            return {
                ...state,
                weekoff: action.weekoff
            };
        case 'SET_SHIFTS_DATA':
            return {
                ...state,
                shifts: action.shifts
            };
        case 'SET_ROSTER_DATA':
            return {
                ...state,
                roster: action.roster
            };
        case 'SET_SHIFT_DATA':
            return {
                ...state,
                shift: action.shift
            };
        case 'SET_CATEGORY_DATA':
            return {
                ...state,
                category: action.category
            };
        case 'SET_SURVEY_LANGUAGE_DATA':
            return {
                ...state,
                surveyLanguages: action.surveyLanguages
            };
        case 'SET_EMPLOYEE_DATA_BY_COMPANY':
            return {
                ...state,
                companyEmployees: action.companyEmployees
            };
        case 'SET_SURVEY_DATA':
            return {
                ...state,
                surveys: action.surveys
            };
        case 'SET_EXPENSE_CATEGORY_DATA':
            return {
                ...state,
                expensecategories: action.expensecategories
            };
        case 'SET_APPLICANT_DATA':
            return {
                ...state,
                applicant: action.applicant
            };

        case 'SET_WORKFLOWAUTOMATE_DATA':
            return {
                ...state,
                workFlowAutomate: action.workflowAutomate
            };
        case 'SET_SOURCETYPE_DATA':
            return {
                ...state,
                sourceType: action.sourceType
            };

        case 'SET_WORKFLOW_STEP_AUTOMATE_DATA':
            return {
                ...state,
                workflowStepAutomate: action.workflowStepAutomate
            };
        case 'SET_ASSETS_CATEGORY_DATA':
            return {
                ...state,
                AssetsCategory: action.AssetsCategory
            };
        case 'SET_ASSETS_SETUP_DATA':
            return {
                ...state,
                AssetSetup: action.AssetSetup
            };
        case 'PAYMENT_MODE':
            return {
                ...state,
                paymentModes: action.paymentModes
            };
        case 'SET_PAYHUB_REGION_DATA':
            return {
                ...state,
                payhubRegion: action.payhubRegion
            };
        case 'SET_PAYHUB_SUBREGION_DATA':
            return {
                ...state,
                payhubSubRegion: action.payhubSubRegion
            };
        case 'SET_PAYHUB_INDUSTRY_DATA':
            return {
                ...state,
                payhubIndutry: action.payhubIndutry
            };
        case 'SET_PAYHUB_REVENUE_DATA':
            return {
                ...state,
                payhubRevenue: action.payhubRevenue
            };
            return state;

        case 'SET_EMPLOYMENTSTATUS':
                return {
                    ...state,
                    employmentStatus: action.employmentStatus
                };
                return state;  
        case 'SET_GOALS_DATA':
            return {
                ...state,
                goals: action.goals
            };  
            case 'SET_GOALS_EMPLOYEE_DATA':
            return {
                ...state,
                goalsEmployee: action.goalsEmployee
            }; 
	    case 'SET_ENTITY':
            return {
                  ...state,
                        entity: action.entity
                    };
                return state;   
    } 
};
export default DropdownReducer;


//Actions

export function setBranchData(branches) {
    return {
        type: 'SET_BRANCH_DATA',
        branches
    }
}
export function setDepartmentData(departments) {
    return {
        type: 'SET_DEPARTMENT_DATA',
        departments
    }
}

export function setDesignationData(designations) {
    return {
        type: 'SET_DESIGNATION_DATA',
        designations
    }
}
export function setNationalityData(nationalities) {
    return {
        type: 'SET_NATIONALITY_DATA',
        nationalities
    }
}

export function setCountryData(countries) {
    return {
        type: 'SET_COUNTRY_DATA',
        countries
    }
}
export function setReligionData(religions) {
    return {
        type: 'SET_RELIGION_DATA',
        religions
    }
}

export function setLanguageData(languages) {
    return {
        type: 'SET_LANGUAGE_DATA',
        languages: languages
    }
}

export function setSurveyLanguageData(surveyLanguages) {
    return {
        type: 'SET_SURVEY_LANGUAGE_DATA',
        surveyLanguages: surveyLanguages
    }
}

export function setEmployeeData(employees) {
    return {
        type: 'SET_EMPLOYEE_DATA',
        employees
    }
}
export function setEmployeeDataByCompany(companyEmployees){
    return {
        type:"SET_EMPLOYEE_DATA_BY_COMPANY",
        companyEmployees
    }
}

export function setCompanyData(companies) {
    return {
        type: 'SET_COMPANY_DATA',
        companies
    }
}

export function setPlanData(plans) {
    return {
        type: 'SET_PLAN_DATA',
        plans
    }
}
export function setLeaveTypeData(leaveTypes) {
    return {
        type: 'SET_LEAVETYPE_DATA',
        leaveTypes
    }
}

export function setLeaveTypeDataReport(leaveTypeReport) {
    return {
        type: 'SET_LEAVETYPE_DATA_REPORT',
        leaveTypeReport
    }
}

export function setObjectiveGroupData(objectivegroups) {
    return {
        type: 'SET_OBJECTGROUP_DATA',
        objectivegroups
    }
}

export function setPerformanceTemplateData(performanceTemplates) {
    return {
        type: 'SET_PERFORMANCE_TEMPLATE_DATA',
        performanceTemplates
    }
}

export function setRoleData(roles) {
    return {
        type: 'SET_ROLE_DATA',
        roles
    }
}

export function setJobTitleData(jobTitle) {
    return {
        type: 'SET_JOBTITLE_DATA',
        jobTitle
    }
}

export function setDivisionData(divisions) {
    return {
        type: 'SET_DIVISION_DATA',
        divisions
    }
}

export function setGradesData(grades) {
    return {
        type: 'SET_GRADES_DATA',
        grades
    }
}

export function setJobTitlesData(jobTitles) {
    return {
        type: 'SET_JOBTITLES_DATA',
        jobTitles
    }
}
export function setFunctionData(functions) {
    return {
        type: 'SET_FUNCTION_DATA',
        functions
    }
}
export function setSectionData(section) {
    return {
        type: 'SET_SECTION_DATA',
        section
    }
}
export function setRecognitionCategoryData(recognition) {
    return {
        type: 'SET_RECOGNITIONCATEGORY_DATA',
        recognition
    }
}

export function setTemplatesData(templates) {
    return {
        type: 'SET_TEMPLATES_DATA',
        templates
    }
}

export function setSignaturesData(signatures) {
    return {
        type: 'SET_SIGNATURES_DATA',
        signatures
    }
}

export function setProjectData(project) {
    return {
        type: 'SET_PROJECT_DATA',
        project
    }
}

export function setApplicantData(applicant) {
    return {
        type: 'SET_APPLICANT_DATA',
        applicant
    }
}

export function setActivityData(activity) {
    return {
        type: 'SET_ACTIVITY_DATA',
        activity
    }
}

export function setWeekOffData(weekoff) {
    return {
        type: 'SET_WEEKOFF_DATA',
        weekoff
    }
}

export function setShiftsData(shifts) {
    return {
        type: 'SET_SHIFTS_DATA',
        shifts
    }
}

export function setRosterData(roster) {
    return {
        type: 'SET_ROSTER_DATA',
        roster
    }
}

export function setShiftData(shift) {
    return {
        type: 'SET_SHIFT_DATA',
        shift
    }
}
export function setCategoryData(category) {
    return {
        type: 'SET_CATEGORY_DATA',
        category
    }
}

export function setSurveyData(surveys) {
    return {
        type: 'SET_SURVEY_DATA',
        surveys: surveys,
    }
}

export function setExpenseCategoryData(expensecategories) {
    return {
        type: 'SET_EXPENSE_CATEGORY_DATA',
        expensecategories
    }
}

export function setWorkFlowAutomateData(workflowAutomate) {
    return {
        type: 'SET_WORKFLOWAUTOMATE_DATA',
        workflowAutomate
    }
}

export function setWorkFlowStepAutomateData(workflowStepAutomate) {
    return {
        type: 'SET_WORKFLOW_STEP_AUTOMATE_DATA',
        workflowStepAutomate
    }
}

export function setSourceTypeData(sourceType) {
    return {
        type: 'SET_SOURCETYPE_DATA',
        sourceType
    }
}

export function setAssetCategoryData(AssetsCategory) {
    return {
        type: 'SET_ASSETS_CATEGORY_DATA',
        AssetsCategory
    }
}

export function setAssetSetupData(AssetSetup) {
    return {
        type: 'SET_ASSETS_SETUP_DATA',
        AssetSetup
    }
}
export function setPaymentModeData(paymentModes) {
    return {
        type: 'PAYMENT_MODE',
        paymentModes
    }
}

export function setPayhubRegionData(payhubRegion) {
    // return {
    //     type: 'SET_PAYHUB_REGION_DATA',
    //     payhubRegion
    // }
}
export function setPayhubSubRegionData(payhubSubRegion) {
    // return {
    //     type: 'SET_PAYHUB_SUBREGION_DATA',
    //     payhubSubRegion
    // }
}
export function setpayhubIndustryData(payhubIndutry) {
    // return {
    //     type: 'SET_PAYHUB_INDUSTRY_DATA',
    //     payhubIndutry
    // }
}
export function setpayhubRevenueData(payhubRevenue) {
    // return {
    //     type: 'SET_PAYHUB_REVENUE_DATA',
    //     payhubRevenue
    // }
}   
export function setEmploymentStatus(employmentStatus) {
        return {
            type: 'SET_EMPLOYMENTSTATUS',
            employmentStatus
        }
}

export function setGoalsData(goals) {
    return {
        type: 'SET_GOALS_DATA',
        goals
    }
}

// goals employee
export function setGoalsEmployeeData(goalsEmployee) {
    return {
        type: 'SET_GOALS_EMPLOYEE_DATA',
        goalsEmployee
    }
}
export function setEntity(entity) {
    return {
        type: 'SET_ENTITY',
        entity
    }
}
