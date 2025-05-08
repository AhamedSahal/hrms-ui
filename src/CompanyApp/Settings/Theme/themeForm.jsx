import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { getPrimaryColor, getPrimaryGradientColor, getTitle, getMenuBgColor, setCompanySetting } from '../../../utility';
import { updateTheme, getByCompanyId } from './service';
import { ThemeSchema } from './validation';
import CompanyDropdown from '../../ModuleSetup/Dropdown/CompanyDropdown';

export default class ThemeForm extends Component {
    constructor(props) {
        super(props);
        const company = this.props.company || {};
        const companyId = company && company.id !== null ? company.id : 0;
        this.state = {
            data:[],
            theme: props.theme || {
                primaryColor: getPrimaryColor(),
                gradientColor: getPrimaryGradientColor(),
                titleText:getTitle(),
                menuBg:getMenuBgColor(),
                companyId: company ? company.id : 0,
                companyEntity:{ id: companyId },
                themeCompanyId:'',
            }
        };
        if (companyId) {
            this.fetchList(companyId);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.theme && nextProps.theme != prevState.theme) {
            return ({ theme: nextProps.theme })
        } else if (!nextProps.theme) {
            return prevState.theme || ({
                theme: {
                    primaryColor: getPrimaryColor(),
                    gradientColor: getPrimaryGradientColor(),
                    titleText:getTitle(),
                    menuBg:getMenuBgColor(),
                    companyId : 0,
                    companyEntity:{ id:0 },
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        updateTheme(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                setCompanySetting(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving theme");
            action.setSubmitting(false);
        })
    }

    fetchList = (companyId) => {
        getByCompanyId(companyId).then(res => {
            let updatedData = {};
            if (res.status === "OK" && typeof res.data === "object") {
                updatedData = {
                    titleText: res.data.titleText === null ? "" : res.data.titleText,
                    primaryColor: res.data.primaryColor === null ? "" : res.data.primaryColor,
                    gradientColor: res.data.gradientColor === null ? "" : res.data.gradientColor,
                    menuBg: res.data.menuBg === null ? "" : res.data.menuBg,
                }
            }
            this.setState({
                data : updatedData,
            });
        })
    }
    hexToRgbA(hex){
        console.log("hex");
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return ({ "r":((c>>16)&255), "g":((c>>8)&255), "b":(c&255), "a": 1 });
        }
        toast.error("Invalid color:"+hex);
    }
    getHexCode(r,g,b,a){
        var outParts = [
            r.toString(16),
            g.toString(16),
            b.toString(16),
            Math.round(a * 255).toString(16).substring(0, 2)
        ];

        // Pad single-digit output values
        outParts.forEach(function (part, i) {
            if (part.length === 1) {
                outParts[i] = '0' + part;
            }
        })
        return ('#' + outParts.join(''));
    }
    getColorRgba(color)
    {
        var a=1;
        if(!isNaN(color.a))
        {
            a=color.a;
        }
        return this.getHexCode(color.r,color.g,color.b,a);
    }
    onThemeChange=(e) => {
        let companyId = e.target.value;
        this.setState(
            {
                themeCompanyId : companyId,
            }, () => { this.fetchList(companyId); });
    }

    render() {
        let { data,theme } = this.state;
        theme.companyId = this.props.company ? this.props.company.id : '';
        const  company  = this.props.company || {};
        const showField = !(company && company.id);
        return (
            <div className="page-wrapper">
                <Helmet>
                    <title>Theme | {getTitle()}</title>
                    <meta name="description" content="Login page" />
                </Helmet>
                <div className="content container-fluid">
                    <div className="row">

                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Theme</h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.theme}
                                        onSubmit={this.save}
                                        validationSchema={ThemeSchema}
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
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div>
                                                            {showField && (
                                                                <FormGroup>
                                                                    <label>Companies
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="companyId" render={field => {
                                                                        return <CompanyDropdown value={this.props.company && this.props.company.id?this.props.company.id:''} onChange={e => {
                                                                            setFieldValue("companyId", e.target.value);
                                                                            setFieldValue("companyEntity", { id: e.target.value });
                                                                            this.onThemeChange(e);
                                                                        }}></CompanyDropdown>
                                                                    }}></Field>
                                                                    <ErrorMessage name="companyId">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            )}
                                                        </div>
                                                        <FormGroup>
                                                            <label>Title Text
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field
                                                                name="titleText"
                                                                render={({ field }) => (
                                                                    <input {...field} type="text" className="form-control" value={this.state.data.titleText} onChange={e => {
                                                                        const newValue = e.target.value;
                                                                        this.setState(prevState => ({
                                                                            data: {
                                                                                ...prevState.data,
                                                                                titleText: newValue
                                                                            }
                                                                        }));
                                                                        field.onChange(e);
                                                                    }} />
                                                                )} />
                                                            <ErrorMessage name="titleText">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Primary Color
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <HexColorPicker color={values.primaryColor} value={this.state.data.primaryColor} onChange={color => {
                                                                document.body.style.setProperty('--primary-color', color)
                                                                setFieldValue('primaryColor', color);
                                                                this.setState(prevState => ({
                                                                    data: {
                                                                        ...prevState.data,
                                                                        primaryColor: color
                                                                    }
                                                                }));
                                                            }} />
                                                            <HexColorInput className="color-input" color={this.state.data.primaryColor} onChange={color => {
                                                                document.body.style.setProperty('--primary-color', color);
                                                                this.setState(prevState => ({
                                                                    data: {
                                                                        ...prevState.data,
                                                                        primaryColor: color
                                                                    }
                                                                }));
                                                                setFieldValue('primaryColor', color);
                                                            }} />
                                                            {/* <RgbaColorPicker color={this.hexToRgbA(this.state.primaryColor)} onChange={this.handlePrimaryChange} /> */}
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Gradient Color
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <HexColorPicker color={values.gradientColor} value={this.state.data.gradientColor} onChange={color => {
                                                                document.body.style.setProperty('--primary-gradient-color', color);
                                                                setFieldValue('gradientColor', color);
                                                                this.setState(prevState => ({
                                                                    data: {
                                                                        ...prevState.data,
                                                                        gradientColor: color
                                                                    }
                                                                }));
                                                            }} />
                                                            <HexColorInput className="color-input" color={this.state.data.gradientColor} onChange={color => {
                                                                document.body.style.setProperty('--primary-gradient-color', color);
                                                                this.setState(prevState => ({
                                                                    data: {
                                                                        ...prevState.data,
                                                                        gradientColor: color
                                                                    }
                                                                }));
                                                                setFieldValue('gradientColor', color);
                                                            }} />
                                                            {/* <RgbaColorPicker color={this.hexToRgbA(this.state.gradientColor)} onChange={this.handleGradientChange} /> */}
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <FormGroup>
                                                            <label>Active Menu Background Color
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <HexColorPicker color={values.menuBg} value={this.state.data.menuBg} onChange={color => {
                                                                    document.body.style.setProperty('--menu-background-color', color);
                                                                    setFieldValue('menuBg', color);
                                                                    this.setState(prevState => ({
                                                                        data: {
                                                                            ...prevState.data,
                                                                            menuBg: color
                                                                        }
                                                                    }));
                                                                }} />
                                                            <HexColorInput className="color-input" color={this.state.data.menuBg} onChange={color => {
                                                                document.body.style.setProperty('--menu-background-color', color);
                                                                this.setState(prevState => ({
                                                                    data: {
                                                                        ...prevState.data,
                                                                        menuBg: color
                                                                    }
                                                                }));
                                                                setFieldValue('menuBg', color);
                                                            }} />
                                                            {/* <RgbaColorPicker color={this.hexToRgbA(this.state.menuBg)} onChange={this.handleMenuBgChange} /> */}
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <input type="submit" className="btn btn-primary" value="Save" />
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
