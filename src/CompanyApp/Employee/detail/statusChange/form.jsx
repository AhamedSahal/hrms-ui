import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getReadableDate } from '../../../../utility';
import { getCompanyInformation, getPersonalInformation, getSalaryInformation, updateCompanyInformation, updateSalaryInformation } from '../service';
import { getBenefitSelfList } from '../benefits/service';
import moment from 'moment';
import JobTitlesDropdown from '../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import DivisionDropdown from '../../../ModuleSetup/Dropdown/DivisionDropdown';
import GradesDropdown from '../../../ModuleSetup/Dropdown/GradesDropdown';
import { Modal } from 'react-bootstrap';
import { getAllowanceInformation } from '../service';
import AllowanceStatus from './allowanceStatus';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveChangeStatus, getGradeInfo } from './service'
const { Header, Body, Footer, Dialog } = Modal;


export default class EmployeeStatusChangeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            benefitData: [],
            oldAllowance: [],
            benefitExistData: [],
            currentGradeId: 0,
            benfefitsValue: [],
            reasonForchange: [],
            changestatusdata: 0,
            status: 1,
            q: "",
            page: 0,
            size: 20,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            lastDate: props.lastDate,
            leaveData: '',
            salary: props.salary || {
                id: 0,
                name: "",
                active: true
            },
            newTotelAllowance: '',
            id: props.employeeId,
            employee: props.employee || {
                id: 0,
                name: "",
                active: true
            },
            benifitForm: false,
            newTicketMax: '',
            newMedicalMax: '',
            allowanceDetails: '',
            company: {
                id: 0,
                branchId: 0,
                departmentId: 0,
                divisionId: 0,
                jobTitleId: 0,
                gradesId: 0,
                sectionId: 0,
                functionId: 0,
                branch: {
                    id: 0,
                },
                dapartment: {
                    id: 0,
                },
                division: {
                    id: 0,
                },
                jobTitle: {
                    id: 0,
                },
                grades: {
                    id: 0,
                },
                section: {
                    id: 0,
                },
                functions: {
                    id: 0,
                }
            },
            leaveType: props.leaveType || {
                id: 5,
                title: "Annual Leave",
                days: 30,
                paid: true,
                accrual: true,
                encashment: true,
                attachmentRequired: true,
                applicableGender: null,

            },

        }

    }
    componentDidMount() {
        let reasonForchangearray = [
            {
                name: "Promotion",
                checked: true,
                value: 1
            }, {
                name: "Title Change",
                checked: false,
                value: 2
            }, {
                name: "Transfer",
                checked: false,
                value: 3
            }, {
                name: "Adjustment",
                checked: false,
                value: 4
            }, {
                name: "Increment",
                checked: false,
                value: 5
            }
        ]

        this.setState({ reasonForchange: reasonForchangearray });
        getCompanyInformation(this.state.id).then(res => {
            if (res.status == "OK") {
                this.bindState(res.data)
            } else {
                toast.error(res.message);
            }

        })
        getSalaryInformation(this.state.id).then(res => {
            let salary = res.data;
            this.setState({ salary })

        })
        getPersonalInformation(this.state.id).then(res => {
            let employee = res.data;
            if (res.status == "OK") {
                employee.dob = employee?.dob?.substr(0, 10);
                this.setState({ employee },
                    () => {

                    })
            }
        })
        getBenefitSelfList(this.state.id, this.state.q, this.state.page, this.state.size, this.state.sort, this.state.status).then(res => {
            if (res.status == "OK") {
                this.setState({ benefitData: res.data.list })
                this.setState({ benefitExistData: res.data.list })
            }

        })

        getAllowanceInformation(this.state.id).then(res => {
            this.setState({ allowanceDetails: res.data })
        })

       
    }

    closeForm = (data, allowances,oldAllowance) => {
        this.setState({oldAllowance : oldAllowance})
        this.setState({ allowanceDetails: allowances })
        this.setState({ newTotelAllowance: data })
        this.hideForm()
    }
    closeBenifitForm = (data) => {
        this.setState({ newTicketMax: data })
        this.setState({
            benifitForm: false
        })
    }
    medicalBenifitForm = (data) => {
        this.setState({ newMedicalMax: data })
        this.setState({
            benifitForm: false
        })
    }

    hideForm = () => {
        this.setState({
            showForm: false,
        })

    }
    generatePDF = () => {
        const input = document.getElementById('card');
        html2canvas(input).then(function (canvas) {
            canvas.getContext('2d');
            var imgWidth = canvas.width;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var top_left_margin = 15;
            var PDF_Width = imgWidth + (top_left_margin * 2);
            var PDF_Height = (PDF_Width * 2) + (top_left_margin * 2);
            var totalPDFPages = Math.ceil(imgHeight / PDF_Height) - 1;
            var imgData = canvas.toDataURL("image/png", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin, imgWidth, imgHeight);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage([PDF_Width, PDF_Height], 'p');
                pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), imgWidth, imgHeight);
            }
            pdf.save("EmployeeStatus" + Date().toLocaleString() + ".pdf");
        });
    };
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.changeStatus && nextProps.changeStatus != prevState.changeStatus) {
            return ({ changeStatus: nextProps.changeStatus })
        } else if (!nextProps.changeStatus) {
            return ({
                changeStatus: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }

            })
        }

        return null;
    }
    bindState = (company) => {
        try {
            company.doj = company.doj.substr(0, 10);
        } catch (err) {
            console.log(err);
        }
        this.setState({
            company: company
        })
    }

    updateList = (Benefits) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == Benefits.id);
        if (index > -1)
            data[index] = Benefits;
        else {
            data = [Benefits, ...data];
        }

    }
    refreshPage = () => {
        window.location.reload()
    }
    empBenifits = (data) => {
        let elements = []
        this.setState({ benefitData: data })

    }

    handleOnChange(id) {
        let changeFunction = this.state.reasonForchange;
        let filter = changeFunction.map((res) => {
            if (id == res.value) {
                let data = {
                    name: res.name,
                    value: res.value,
                    checked: !res.checked
                }
                this.setState({ changestatusdata: id });
                return data
            } else {
                let data = {
                    name: res.name,
                    value: res.value,
                    checked: false
                }
                return data;
            }
        })
        this.setState({ reasonForchange: filter });

    }

    handleGradeOnchange = (grade) => {
        let flag = true;
        this.setState({ currentGradeId: grade })
        this.setState({ benefitData: [] })
        if (this.state.benefitExistData.length > 0) {
            this.state.benefitExistData.map((res) => {
                if (res.gradesId == grade) {
                    flag = false;
                }
            })
        }
        if (flag) {
            getGradeInfo(this.state.id, grade).then(res => {
                if (res.status == "OK") {
                    this.setState({ benefitData: [] })
                    this.setState({ benefitData: res.data })
                } else {
                    toast.error(res.message);
                }

            })

        } else {
            let tempArray = [];
            let tempData = this.state.benefitExistData.filter((res) => res.gradesId == grade ? { ...res } : null)
            this.setState({ benefitData: tempData })
        }
    }

    handleBenefitsOnChnage = (e, name, salary, id) => {
        let { benfefitsValue } = this.state;
        let BenefitsArray = {
            id: id,
            benefitsName: name,
            benefitsSalary: salary

        }
        let befifitsData = []
        let flag = false;
        if (benfefitsValue.length > 0) {
            befifitsData = benfefitsValue.map((res) => {
                if (res.id == id) {
                    flag = true
                    return { ...res, benefitsSalary: salary }
                } else {
                    return { ...res }
                }
            })
            if (flag) {
                this.setState({ benfefitsValue: befifitsData });
            } else {
                let temArray = benfefitsValue;
                temArray.push(BenefitsArray);
                this.setState({ benfefitsValue: temArray });
            }
        } else {
            this.setState({ benfefitsValue: [BenefitsArray] });
        }


    }

    save = (data, action) => {
        let { allowanceDetails, newTotelAllowance, changestatusdata, benfefitsValue, employee, oldAllowance,benefitData } = this.state;
        let allowance = allowanceDetails;
        let BenifitName = '';
        let BenefitAmount = '';
        let allowanceIdAll = '';
        let allowanceAmountAll = '';
        let oldAllowanceInfo = '';
        let newAllowanceInfo = '';
        let oldTotalAllowance = 0;
        let newTotalAllowance = 0;
        // benifit
        let benefitAmountAll = '';
        let benefitIdAll = '';
        let benefitNameAll = '';
        let benefitIdArray = [];
        let newBenefitInfo = '';
        let oldBenefitInfo = '';
        let newDate = new Date(data.newStatus)
        let doj = new Date(employee.doj);
        if (doj <= newDate) {
            if (benfefitsValue.length) {
                benfefitsValue.map((res,i) => {
                    if(!res.benefitsSalary == ""){
                    benefitIdArray.push(res.id)
                    BenifitName = BenifitName.concat(",", res.benefitsName);
                    benefitNameAll = benefitNameAll + (benefitNameAll == ""? res.benefitsName : ","+ res.benefitsName);
                    benefitIdAll = benefitIdAll + (benefitIdAll == ""? res.id : ","+ res.id);
                    benefitAmountAll = benefitAmountAll + (benefitAmountAll == "" ? res.benefitsSalary : ","+ res.benefitsSalary);
                    newBenefitInfo = newBenefitInfo + (newBenefitInfo == "" ?res.benefitsName + " : " + res.benefitsSalary : "," + res.benefitsName + " : " + res.benefitsSalary);
                }
                });
            }

            if (benefitData.length) {
                benefitData.map((res,i) => {
                   if(!benefitIdArray.includes(res.id)){
                    BenifitName = BenifitName.concat(",", res.name);
                    benefitNameAll = benefitNameAll + (benefitNameAll == ""? res.name : ","+ res.name);
                    benefitIdAll = benefitIdAll + (benefitIdAll == ""? res.id : ","+ res.id);
                    benefitAmountAll = benefitAmountAll + (benefitAmountAll == ""? res.maxemployee : ","+ res.maxemployee);
                    newBenefitInfo = newBenefitInfo + (newBenefitInfo == "" ?res.name + " : " + res.maxemployee : "," + res.name + " : " + res.maxemployee);
                }
                oldBenefitInfo = oldBenefitInfo + (i == 0?res.name + " : " + res.maxemployee : "," + res.name + " : " + res.maxemployee);
                });
            }

            // allowance
            if (allowance.length > 0) {
                allowance.map((res,i) => {
                    newTotalAllowance = newTotalAllowance + Number(res.amount == null?0:res.amount);
                    allowanceIdAll = allowanceIdAll + (i == 0? res.allowanceId : ","+ res.allowanceId);
                    let amountValidation = res.amount == null?0:res.amount
                    allowanceAmountAll = allowanceAmountAll + (i == 0 ? amountValidation : ","+ amountValidation);
                    newAllowanceInfo = newAllowanceInfo + (i == 0 ?res.allowanceName + " : " + res.amount : "," + res.allowanceName + " : " + res.amount);
                });
            }

            // old allowance
            if (oldAllowance.length > 0) {
                oldAllowance.map((res,i) => {
                    oldTotalAllowance = oldTotalAllowance + res.amount;
                    oldAllowanceInfo = oldAllowanceInfo + (i == 0 ?res.allowanceName + " : " + res.amount : "," + res.allowanceName + " : " + res.amount);
                });
            }


            let changestatusValues = {
                "employeeId": data.company.id,
                "empId": data.company.employeeId,
                "effectiveDate": data.newStatus ? data.newStatus : 0,
                "reasonForChange": changestatusdata ? changestatusdata : 1,
                "jobTitleId": data.company.jobTitle ? data.company.jobTitle.id : 0,
                "divisionId": data.company.division ? data.company.division.id : 0,
                "gradesId": data.company.grades ? data.company.grades.id : 0,
                "basicSalary": data.salary.basicSalary,
                "benefitsName": BenifitName,
                "benefitsAmount": BenefitAmount,
                "totalAllowance": newTotelAllowance,        
                "allowanceIdAll": allowanceIdAll,
                "allowanceAmountAll" : allowanceAmountAll,
                "oldAllowanceInfo" : oldAllowanceInfo,
                "newAllowanceInfo" : newAllowanceInfo,
                "newTotalAllowance" : newTotalAllowance,
                "oldTotalAllowance" : oldTotalAllowance,
                // benefit 
                "benefitAmountAll" : benefitAmountAll,
                "benefitIdAll" : benefitIdAll,
                "benefitNameAll" : benefitNameAll,
                "oldBenefitInfo" : oldBenefitInfo,
                "newBenefitInfo" : newBenefitInfo

            }
            saveChangeStatus(changestatusValues).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            })


            this.props.closeForm();
        } else {
            toast.error("Can't Change The Status Before The Employee Joining Date");
        }
    }
    render() {
        const { employee, salary, leaveData, benefitData, company, leaveType, Benefits, lastDate } = this.state;

        const initialValues = { company, leaveType, salary, Benefits }

        return (
            <div id="card">



                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    onSubmit={this.save}

                // validationSchema={changeStatusSchema}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setSubmitting,
                        /* and other goodies */


                    }) => (
                        <Form>
                            <div>
                            </div>
                            <table className='empInfoTable table table-striped table-bordered'>
                                <tr>
                                    <th className='text-center' colSpan={2} >Employee Information</th>
                                </tr>

                                <tr>
                                    <td className='changeStatus'>Employee Name: <a>{employee.name}</a> </td>
                                    <td className='changeStatus'>Employee Number: {company.employeeId}</td>
                                </tr>
                                <tr>
                                    <td className='changeStatus'>Date of Joining: {employee.doj ? moment(employee.doj).utc().format('DD-MM-YYYY') : "-"}</td>
                                    <td className='changeStatus'>Date of Last Adjustment: {lastDate ? getReadableDate(lastDate) : "-"}</td>

                                </tr>
                                <tr>
                                    <td className='d-flex changeStatus'>Effective Date of New Status: <Field required style={{ height: '20px' }} name="newStatus" type="date" className="text-info border-0 ml-2 col-4"></Field></td>
                                    {/* <td className='changeStatus'>Last Performance Rating: 3</td> */}

                                </tr>
                            </table>
                            <div>
                                <table className='empInfoTable table table-bordered'>
                                    <tr>
                                        <th className='text-center' colSpan={5} >Reason for Change</th>
                                    </tr>

                                    <tr>
                                        {this.state.reasonForchange.map((res) =>
                                            <td className='changeStatus' key={res.value}><Field name="checked" value={res.value}
                                                checked={res.checked}
                                                onChange={() => this.handleOnChange(res.value)}
                                                className="mr-2 leading-tight" type="checkbox" />{res.name}</td>
                                        )}
                                    </tr>

                                </table>


                            </div>
                            <table className='empInfoTable table table-bordered'>
                                <tr>
                                    <th>#</th>
                                    <th>Current Status</th>
                                    <th>New Status</th>
                                </tr>

                                <tr>
                                    <td style={{ fontWeight: 700 }}>Job Title</td>
                                    <td className='changeStatus'>{employee.jobTitle?.name ?? "NA"}</td>
                                    <td>
                                        <FormGroup className='p-0 mb-0'>
                                            <Field className="form-control" name="jobTitleId" render={field => {
                                                return <JobTitlesDropdown defaultValue={values.jobTitle?.id} onChange={e => {
                                                    setFieldValue("company.jobTitleId", e.target.value);
                                                    setFieldValue("company.jobTitle", { id: e.target.value });
                                                }}></JobTitlesDropdown>
                                            }} ></Field>

                                        </FormGroup>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 700 }}>Division</td>
                                    <td className='changeStatus'>{employee.division?.name ?? "-"}</td>
                                    <td> <FormGroup className='p-0 mb-0'>

                                        <Field className="form-control" name="divisionId" render={field => {
                                            return <DivisionDropdown defaultValue={values.division?.id} onChange={e => {
                                                setFieldValue("company.divisionId", e.target.value);
                                                setFieldValue("company.division", { id: e.target.value });
                                            }}></DivisionDropdown>
                                        }} ></Field>
                                    </FormGroup></td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 700 }}>Grade</td>
                                    <td className='changeStatus'>{employee.grades?.name ?? "-"}</td>
                                    <td> <FormGroup className='p-0 mb-0'>

                                        <Field className="form-control" name="gradesId" render={field => {
                                            return <GradesDropdown defaultValue={values.grades?.id} onChange={e => {
                                                setFieldValue("company.gradesId", e.target.value);
                                                setFieldValue("company.grades", { id: e.target.value });
                                                this.handleGradeOnchange(e.target.value)
                                            }} ></GradesDropdown>
                                        }} ></Field>

                                    </FormGroup></td>
                                </tr>

                                <tr>
                                    <td style={{ fontWeight: 700 }}>Basic Salary</td>
                                    <td className='changeStatus'>{salary?.basicSalary ?? "-"}</td>
                                    <td> <FormGroup className='p-0 mb-0'>
                                        <Field name="salary.basicSalary" className="form-control" ></Field>
                                    </FormGroup></td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 700 }}>Total Allowances</td>
                                    <td className='changeStatus'>{salary?.allowance ?? "-"}</td>
                                    <>
                                        {this.state.newTotelAllowance ? <td className='tdHeight pl-4'>{this.state.newTotelAllowance}</td> : <td className='tdHeight' ><a href="#" className="" onClick={() => {
                                            this.setState({
                                                showForm: true
                                            })

                                        }}>Add Allowance</a></td>}
                                    </>

                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 700 }}>Total Monthly Salary</td>

                                    <td > {salary?.monthyPayment ?? "-"}</td>
                                    <td className='tdHeight pl-4' > {Number(values.salary.basicSalary) + Number(this.state.newTotelAllowance)}</td>
                                </tr>
                                {benefitData.map((res, index) => res.name ?
                                    (
                                        <tr key={res.id}>
                                            {res.grades1Id ? (res.grades1Id.name === employee.grades?.name || res.gradesId == this.state.currentGradeId) && <td style={{ fontWeight: 700 }}>{res.name}</td> : res.grades.name && <td style={{ fontWeight: 700 }}>{res.name}</td>}
                                            {res.grades1Id ? (res.grades1Id.name === employee.grades?.name || res.gradesId == this.state.currentGradeId) && <td>{res.maxemployee}</td> : res.grades.name && <td>{res.maxemployee}</td>}
                                            {res.grades1Id ? (res.grades1Id.name === employee.grades?.name || res.gradesId == this.state.currentGradeId) &&
                                                <td> <FormGroup className='p-0 mb-0'>
                                                    <Field name={`salary.${res.name}${index}`} onChange={(e) => this.handleBenefitsOnChnage(e, res.name, e.target.value, res.id)} className="form-control" ></Field>
                                                </FormGroup></td>
                                                : null}
                                            {res.grades ? res.grades.name &&
                                                <td> <FormGroup className='p-0 mb-0'>
                                                    <Field name={`salary.${res.name}${index}`} onChange={(e) => this.handleBenefitsOnChnage(e, res.name, e.target.value, res.id)} className="form-control" ></Field>
                                                </FormGroup></td>
                                                : null}
                                        </tr>
                                    ) : null)}

                            </table>
                            <input type="submit" className="btn btn-primary float-end" value={"Save"} />
                            <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div>
                        </Form>
                    )
                    }
                </Formik>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Allowance form</h5>
                    </Header>
                    <Body>
                        <AllowanceStatus closeForm={this.closeForm} employeeId={this.state.employee} buttonDisable={this.state.buttonDisable} >
                        </AllowanceStatus>
                    </Body>
                </Modal>
            </div>
        )
    }
}
