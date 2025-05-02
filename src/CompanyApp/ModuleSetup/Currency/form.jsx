import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import { Country_List } from './countryList'
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import Select from "react-select";
import { deleteCurrency, saveCurrencies,getCurrencyList,updateStatus } from './service';
import { confirmAlert } from 'react-confirm-alert';


export default class CurrencySettingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currencySetup: {
                id: 0,
                currency: 0,
                multiCurrency: [],
                active: false,
            },
            currency: Country_List,
            defaultCurrency: 'AE',
            selectedCurrencies: [],
            selectedCurrenciesData: [],
            data:[],
            defaultCurrencyId : 0
        };
    }

    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getCurrencyList().then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data,
                })
                if(res.data.length > 0){
                    let {currencySetup} = this.state;
                    currencySetup.currency = res.data[0].currencyId
                    currencySetup.id = res.data[0].currencyId;
                    if(res.data.length > 1){
                        currencySetup.active = true;
                        // multi currency data
                        let multicurrencyData = []
                        let multicurrencyFullData = []
                       let multicurrencytemp =  res.data.length > 0 && res.data.filter((currency) => {
                             if(currency.currencyId != res.data[0].currencyId){
                                let currencydata = Country_List[currency.currencyId - 1];
                                multicurrencyFullData.push(currencydata)
                                multicurrencyData.push(currency.currencyId)
                                return currency;
                             }
                        })
                        // multi curr dropdown data
                        this.setState({ selectedCurrencies: multicurrencyData });
                     this.setState({ selectedCurrenciesData : multicurrencyFullData});

                    }
                    // map
                    this.setState({defaultCurrency: res.data[0].countryCode})
                    // defaul id
                    this.setState({defaultCurrencyId: res.data[0].currencyId})
                    this.setState({currencySetup})
                    
                }
               
            }
        })
    }

    handleCurrency = (e, setFieldValue) => {

        const id = e.target.value;
        const currency = Country_List[id - 1];
        this.setState({ defaultCurrency: currency.countryCode });
        this.setState({ defaultCurrencyId: id });
        setFieldValue('currency', id);
        setFieldValue('currencyName', currency.currency);
        setFieldValue('countryCode', currency.countryCode);
        setFieldValue('currencyCode', currency.currencyName);
        setFieldValue('minorUnit', currency.minorUnit);

        
    };
    handleMultiCurrency = (selectedOptions, setFieldValue) => {
        const selectedCurrencies = selectedOptions ? selectedOptions.map(option => option.value) : [];
        const selectedCurrenciesData = selectedOptions ? selectedOptions.map((option) => Country_List[option.value - 1]) : [];
        this.setState({ selectedCurrencies });
        this.setState({ selectedCurrenciesData });
       
    }

    // update status
    makeAsDefault = (id) => {
        updateStatus(id).then(res => {
          if (res.status == "OK") {
            toast.success(res.message);
    
          } else {
            toast.error(res.message);
          }
    
        }).catch(err => {
          toast.error("Error while updating status");
        })
      }

    delete = (currencyId) => {
        confirmAlert({
            title: `Remove Currency`,
            message: 'Are you sure, you want to remove this Currency?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteCurrency(currencyId).then(res => {
                        if (res.status == "OK") {
                            toast.success(res.message);
                            this.fetchList();
                        } else {
                            toast.error(res.message)
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    save = (data, action) => {
        let {currencySetup} = this.state;
        let temp;
        if (currencySetup.id > 0) {
            if (currencySetup.active) {
                temp = this.state.selectedCurrenciesData
            }else{
                temp = []
            }
            if (currencySetup.id != data.currency) {

                let defaultData = { id: data.currency, currency: data.currencyName, countryCode: data.countryCode, currencyName: data.currencyCode, minorUnit: data.minorUnit, defaultData: true }
                temp.push(defaultData)
            } else {
                let defaultData = Country_List[data.currency - 1]

                temp.push(defaultData)
            }
        } else {
            if (currencySetup.active) {
                temp = { ...data, multiCurrency: this.state.selectedCurrenciesData }

            } else {
                temp = { ...data }

            }
        }
        action.setSubmitting(true);
       
        saveCurrencies(temp).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving currency");

            action.setSubmitting(false);
        })
    }

    render() {
        const { currency, defaultCurrency, selectedCurrencies, currencySetup } = this.state
        const currencyOptions = [];
        const currencyOptionsTemp = currency.filter(cur => ( this.state.defaultCurrencyId != cur.id && currencyOptions.push({ value: cur.id, label: cur.currency })));


        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Currency</h3>
                            </div>



                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                {verifyOrgLevelViewPermission("Module Setup Pay") && <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.currencySetup}
                                    onSubmit={this.save}
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

                                        <Form>
                                            <div style={{ border: ' solid 1px #dddddd', padding: '12px', borderRadius: '4px' }}>
                                                <div className="row">
                                                    <div >
                                                        <FormGroup className='pl-0 col-md-6'>
                                                            <label>Default Currency
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>

                                                            <div className="currency-select-box">
                                                                <img src={`https://flagcdn.com/w320/${defaultCurrency.toLowerCase()}.png`} alt="Currency Flag" />
                                                                <select
                                                                    onChange={(e) => this.handleCurrency(e, setFieldValue)}
                                                                    name="currency"
                                                                    className="form-control"
                                                                    value={values.currency}
                                                                >
                                                                    <option value=""> Select Currency</option>
                                                                    {currency.map((cur, index) => ( !selectedCurrencies.includes(cur.id) &&
                                                                        <option value={cur.id} key={index}> {cur.currency}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </FormGroup>
                                                        <FormGroup >
                                                            <div type="checkbox" name="active" onClick={e => {
                                                                let { currencySetup } = this.state;
                                                                currencySetup.active = !currencySetup.active;
                                                                setFieldValue("active", currencySetup.active);
                                                                this.setState({
                                                                    currencySetup
                                                                });
                                                            }} >
                                                                <label>Add Multi Currency</label><br />
                                                                <i className={`fa fa-2x ${this.state.currencySetup
                                                                    && this.state.currencySetup.active
                                                                    ? 'fa-toggle-on text-success' :
                                                                    'fa fa-toggle-off text-danger'}`}></i>
                                                            </div>
                                                        </FormGroup>
                                                        {currencySetup.active && <FormGroup className="pl-0 col-md-8">
                                                            <label>Choose Multiple Currency
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Select
                                                                isMulti
                                                                name="multiCurrency"
                                                                options={currencyOptions}
                                                                classNamePrefix="select"
                                                                onChange={(selectedOptions) => this.handleMultiCurrency(selectedOptions, setFieldValue)}
                                                                value={currencyOptions.filter(option => selectedCurrencies.includes(option.value) )}
                                                            />


                                                        </FormGroup >}



                                                    </div>
                                                </div>
                                                <input type="submit" style={{ color: 'white', background: '#102746' }} className="btn" value="Save" />
                                            </div>
                                        </Form>
                                    )
                                    }
                                </Formik>}
                                <div className="row">
                                    <div className="col-md-12 ">
                                        <div className="expireDocs-table">
                                            <table className="table">
                                                <thead >
                                                    <tr style={{ background: '#c4c4c4' }}>
                                                        <th>#</th>
                                                        <th>Currency</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.data.length > 0 && this.state.data.map((item, index) => (
                                                        <tr key={`${item.empId}_${index}`} className="table-row">
                                                            <td className="table-column">{index + 1}</td>
                                                            <td className="table-column">
                                                                {(item.currencyName).split("-")[0] + " - " + item.currencyCode} {item.default? <span className="badge bg-present p-2" style={{backgroundColor: "#55ce63"}}>Default</span> : null}
                                                            </td>

                                                            <td className="table-column">
                                                                <div className="dropdow">
                                                                    <>
                                                                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                            <i className="las la-bars"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                        {!item.default &&   <a className="dropdown-item" href="#" onClick={() => {
                                                                                this.makeAsDefault(item.id);
                                                                            }}>
                                                                                <i className="fa fa-check-circle-o"></i> Make as default </a>}
                                                                            <a className="dropdown-item" href="#" onClick={() => {
                                                                                this.delete(item.id);
                                                                            }}>
                                                                                <i className="fa fa-money"></i> Remove </a>
                                                                         
                                                                        </div>

                                                                    </>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
