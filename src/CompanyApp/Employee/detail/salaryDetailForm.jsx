import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { PERMISSION_LEVEL, SALARY_MODE } from '../../../Constant/enum';
import { getUserType, getCurrency, verifyEditPermission, getPermission,verifyOrgLevelEditPermission } from '../../../utility';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import AllowanceForm from './allowanceForm';
import { getCountryList, getSalaryInformation, updateSalaryInformation } from './service';
import { SalaryBasicAndModeSchema } from '../validation';
import ComparatioMap from './comparatioMap';
import { getPayScaleType } from '../../ModuleSetupPage/CompensationSettings/service';
import { getCurrencyList } from '../../ModuleSetup/Currency/service';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN' || getPermission("Employee", "EDIT") == PERMISSION_LEVEL.ORGANIZATION || verifyOrgLevelEditPermission("Peoples Organization");

export default class SalaryDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,
            id: props.employeeId || 0,
            employee: props.employee || {
                id: 0,
                name: "",
                active: true,
            },
            salaryCalculationMode: "",
            payScaleType: null,
            CountryList : [],
            defaultCurrency: '',
            defaultCurrencyId : 0,
            defaultCurrencyCode: '',
         
        }
    }
    componentDidMount() {
        this.reloadSalary(this.state.id);
        
    }
    reloadSalary = (id) => {
        getSalaryInformation(id).then(res => {
            let employee = res.data;
            
            this.setState({
                employee,
                salaryCalculationMode: res.data.salaryCalculationMode,
                defaultCurrencyId: res.data.currency
            }, () => {
                this.fetchType();
            });
        });
    }
    
    handleCurrency = (id, setFieldValue) => {
        let data = this.state.CountryList.find(obj => obj.id == id);
        if (data) {
            this.setState({ defaultCurrency: data.countryCode });
            setFieldValue('currency', data.id);
        } else {
            this.setState({ defaultCurrency: '' });
            setFieldValue('currency', 0);
        }
    }

    save = (data, action) => {
        action.setSubmitting(true);
        updateSalaryInformation(data).then(res => {
            if (res.status == "OK") {
                this.reloadSalary(this.state.id);
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving salary detail");

            action.setSubmitting(false);
        })
    }
    fetchType = () => {
        getPayScaleType(this.state.q, this.state.page, this.state.size, this.state.sort).then((res) => {
            if (res.status === 'OK') {
                this.setState({ payScaleType: res.data[0].payScaleType == "COMPOSITE" ? 0 : res.data[0].payScaleType == "FIXED" ? 1 : null });
            }
        });

        getCurrencyList().then(res => {
            if (res.status == "OK") {
                this.setState({
                    CountryList: res.data,
                });

                if (this.state.defaultCurrencyId > 0) {
                    let data = res.data.find(obj => obj.id == this.state.defaultCurrencyId);
                    if (data) {
                        this.setState({
                            defaultCurrency: data.countryCode,
                            defaultCurrencyCode: data.currencyCode
                        });
                    } else {
                        this.setState({
                            defaultCurrency: '',
                            defaultCurrencyCode: ''
                        });
                    }
                } else {
                    let data = res.data[0];
                    if (data) {
                        let employee = this.state.employee;
                        employee.currency = data.id;
                        this.setState({
                            employee,
                            defaultCurrency: data.countryCode,
                            defaultCurrencyCode: data.currencyCode
                        });
                    }
                }
            }
        });
    };
    render() {
        let { editable, payScaleType } = this.state;
        // const isEditAllowed = getPermission("Employee", "EDIT") == PERMISSION_LEVEL.ORGANIZATION
        const isEditAllowed = getPermission("Peoples Organization", "EDIT") == PERMISSION_LEVEL.ORGANIZATION || 
                      getPermission("Peoples My Team", "EDIT") == PERMISSION_LEVEL.HIERARCHY
        if (editable && !isEditAllowed) {
            editable = false;
        }
       
        return (
            <>
                <div className="row">
                    <div className="pt-3 col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="alert alert-info alert-dismissible fade show" role="alert">
                                    <span>Monthy Salary: <strong> {this.state.employee.monthyPayment} {this.state.defaultCurrencyCode == ''?getCurrency():this.state.defaultCurrencyCode} </strong></span>
                                </div>
                                {(!editable && isEditAllowed) && <Anchor className="edit-icon" onClick={() => {
                                    this.setState({ editable: true })
                                }}><i className="fa fa-edit"></i></Anchor>}
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.employee}
                                    onSubmit={this.save}
                                    validationSchema={SalaryBasicAndModeSchema}
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
                                        setSubmitting
                                        /* and other goodies */
                                    }) => (
                                        <Form autoComplete='off'>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Basic Salary
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field readOnly={!editable} name="basicSalary" className="form-control"></Field>
                                                        <ErrorMessage name="basicSalary">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                         </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Allowance</label>
                                                        <Field readOnly={true} name="allowance" className="form-control"></Field>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                <FormGroup>
                                                            <label>Currency
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>

                                                            <div  className="currency-select-box">
                                                            {this.state.defaultCurrency != '' && <img src={`https://flagcdn.com/w320/${this.state.defaultCurrency.toLowerCase()}.png`} alt="Currency Flag" />}
                                                                <select
                                                                    onChange={(e) =>  this.handleCurrency(e.target.value, setFieldValue)}
                                                                    disabled={!editable}
                                                                    name="currency"
                                                                    className="form-control"
                                                                    value={values.currency}
                                                                >
                                                                    <option value={0}> Select Currency</option>
                                                                    {this.state.CountryList.map((cur, index) => (
                                                                        <option value={cur.id} key={index}> {(cur.currencyName).split("-")[0] + " - " + cur.currencyCode}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <ErrorMessage name="currency">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                        </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>Salary Calculation Mode
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field readOnly={!editable} name="salaryCalculationMode" className="form-control"
                                                            render={field => {
                                                                return <EnumDropdown readOnly={!editable} label={"Salary Calculation Mode"} enumObj={SALARY_MODE} defaultValue={this.state.salaryCalculationMode} onChange={e => {
                                                                    setFieldValue("salaryCalculationMode", e.target.value)
                                                                }}>
                                                                </EnumDropdown>
                                                            }}
                                                        ></Field>
                                                        <ErrorMessage name="salaryCalculationMode">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-4">
                                                    <FormGroup>
                                                        <label>End of Service Mode
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            name="endOfServiceMode"
                                                            className="form-control"
                                                            disabled={!editable}
                                                        >
                                                            <option value="">Select End of Service Mode</option>
                                                            <option value="0">Pension</option>
                                                            <option value="1">Gratuity</option>
                                                            <option value="2">Both</option>
                                                            <option value="3">None</option>
                                                        </Field>
                                                        <ErrorMessage name="endOfServiceMode">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                {(isEditAllowed || editable) && <div className='col-md-12'>
                                                    <input disabled={!isEditAllowed || !editable} type="submit" className="btn btn-primary btn-sm" value="Update" />
                                                    &nbsp;
                                                    <Anchor onClick={() => { this.setState({ editable: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                                </div>}
                                            </div>
                                        </Form>
                                    )
                                    }
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
                <AllowanceForm reloadCallBack={this.reloadSalary} employeeId={this.state.id}></AllowanceForm>

                {/* {isCompanyAdmin && <ComparatioMap empSalary={this.state.employee.monthyPayment} employeeId={this.state.id} ></ComparatioMap>} */}
            </>
        )
    }
}
