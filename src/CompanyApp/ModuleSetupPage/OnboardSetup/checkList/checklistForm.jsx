import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import Select from "react-select";
import { getBranchLists, getDepartmentLists } from '../../../Performance/ReviewCycle/CycleForms/service';
import { getJobTitles, saveMSChecklist } from './service';
import { CheckListSchema } from './validation';

export default class OnboardMSchecklistForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applicable: this.props?.checklist?.assign || '',
            jobtitle: [],
            department: [],
            branches: [],
            applicableFor: '',
            checklist: this.props.checklist || {
                id: 0,
                name: "",
                description: "",
                assign: "0",
                active: true,
                departments: [],
                branches: [],
                jobtitle: [],
            }

        }
    }


    componentDidMount() {
        getBranchLists().then(res => {
            if (res.status === "OK") {
                this.setState({
                    branches: res.data,
                }
                    , () => {
                        if (this.props.checklist?.branches != null) {
                            const brancheData = res.data.filter(br => this.props.checklist.branches.split(',').map(Number).includes(br.id));
                            let { checklist } = this.state;
                            checklist.branches = brancheData
                            this.setState({ checklist });
                        }
                    }
                );
            }
        });
        getDepartmentLists().then(res => {
            if (res.status === "OK") {
                this.setState({
                    department: res.data,
                }, () => {
                    if (this.props.checklist?.departments != null) {
                        const departmentData = res.data.filter(dept => this.props.checklist.departments.split(',').map(Number).includes(dept.id));
                        let { checklist } = this.state;
                        checklist.departments = departmentData
                        this.setState({ checklist });

                    }
                });
            }
        });

        getJobTitles().then(res => {
            if (res.status == "OK") {
                this.setState({
                    jobtitle: res.data,
                }, () => {
                    if (this.props.checklist?.jobtitle != null) {
                        const jobtitleData = res.data.filter(dept => this.props.checklist.jobtitle.split(',').map(Number).includes(dept.id));
                        let { checklist } = this.state;
                        checklist.jobtitle = jobtitleData
                        this.setState({ checklist });

                    }
                })
            }
        })

    }
    onChangeApplicable(event) {
        this.setState({ applicable: event.target.value });

    }

    save = (data, action) => {
        action.setSubmitting(true);

        const checklist = {
            id: data.id,
            name: data.name,
            description: data.description,
            active: data.active,
            applicableId: data.assign,
        };

        checklist.applicableFor = 'EveryOne';

        if (data.assign == '1') {
            const departmentsArray = Array.isArray(data.departments)
                ? data.departments
                : typeof data.departments === 'string'
                    ? this.state.department.filter(d => data.departments.split(',').map(id => id.trim()).includes(String(d.id)))
                    : [];

            let arr = departmentsArray.map(dept => dept.id);
            let arrname = departmentsArray.map(dept => dept.name);
            checklist.departments = arr.join(", ");
            checklist.applicableFor = arrname.join(", ");
        }

        if (data.assign == '2') {
            const branchesArray = Array.isArray(data.branches)
                ? data.branches
                : typeof data.branches === 'string'
                    ? this.state.branches.filter(b => data.branches.split(',').map(id => id.trim()).includes(String(b.id)))
                    : [];

            let arr = branchesArray.map(brnch => brnch.id);
            let arrname = branchesArray.map(brnch => brnch.name);
            checklist.branches = arr.join(", ");
            checklist.applicableFor = arrname.join(", ");
        }

        if (data.assign == '3') {
            const jobtitleArray = Array.isArray(data.jobtitle)
                ? data.jobtitle
                : typeof data.jobtitle === 'string'
                    ? this.state.jobtitle.filter(j => data.jobtitle.split(',').map(id => id.trim()).includes(String(j.id)))
                    : [];

            let arr = jobtitleArray.map(job => job.id);
            let arrname = jobtitleArray.map(job => job.name);
            checklist.jobtitle = arr.join(", ");
            checklist.applicableFor = arrname.join(", ");
        }

        saveMSChecklist(checklist)
            .then(res => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }
                action.setSubmitting(false);
            })
            .catch(err => {
                toast.error("Error while saving Checklist");
                action.setSubmitting(false);
            });
    };

    render() {
        const { applicable } = this.state;

        let options = [];
        if (applicable === '2') {
            options.push(...this.state.branches);
        } else if (applicable === '1') {
            options.push(...this.state.department);
        } else if (applicable === '3') {
            options.push(...this.state.jobtitle);
        }

        const CustomSelect = ({ field, setFieldValue }) => {
            const { name, value } = field;

            let selectedOptions = [];

            if (typeof value === "string") {
                const ids = value.split(",").map(id => id.trim()).filter(id => id !== "");
                selectedOptions = options.filter(opt => ids.includes(String(opt.id)));
            } else if (Array.isArray(value)) {
                selectedOptions = value;
            }


            const handleChange = (data) => {
                const ids = data.map(option => option.id);
                if (applicable === '1') {
                    setFieldValue("branches", []);
                    setFieldValue("jobtitle", []);
                } else if (applicable === '2') {
                    setFieldValue("departments", []);
                    setFieldValue("jobtitle", []);
                } else if (applicable === '3') {
                    setFieldValue("departments", []);
                    setFieldValue("branches", []);
                }

                setFieldValue(name, data);
            };

            return (
                <Select
                    {...field}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    getOptionValue={(options) => options.id}
                    getOptionLabel={(options) => options.name}
                    value={selectedOptions}
                />
            );
        };



        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.checklist}
                    onSubmit={this.save}
                    validationSchema={CheckListSchema}
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
                        validateForm
                        /* and other goodies */
                    }) => (
                        <Form autoComplete='off'>
                            <FormGroup>
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control" ></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                            </FormGroup>

                            <FormGroup>
                                <label>Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="description" className="form-control"></Field>
                                <ErrorMessage name="description">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                            </FormGroup>
                            <FormGroup>
                                <label>Applicable To
                                    <span style={{ color: "red" }}>*</span>
                                </label>

                                <div className='d-flex mb-2' onChange={(e) => {
                                    this.onChangeApplicable(e);
                                    setFieldValue("assign", e.target.value);
                                }}>
                                    <Field className='mr-1' type="radio" value="0" name="assign" /> Everyone
                                    <Field className='ml-4 mr-1' type="radio" value="1" name="assign" /> Department
                                    <Field className='ml-4 mr-1' type="radio" value="2" name="assign" /> Location
                                    <Field className='ml-4 mr-1' type="radio" value="3" name="assign" /> Job Title

                                </div>
                                <ErrorMessage name="assign">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                {applicable === '1' &&
                                    <div className='pl-0 col-md-12'>
                                        <FormGroup >
                                            <label>Select Department
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field
                                                name="departments"
                                                component={CustomSelect}
                                                isMulti
                                                options={options}
                                                setFieldValue={setFieldValue}
                                            />
                                            <ErrorMessage name="departments">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                }

                                {applicable === '2' &&
                                    <div className='pl-0 col-md-12'>
                                        <FormGroup >
                                            <label>Select Location<span style={{ color: "red" }}>*</span></label>

                                            <Field
                                                name="branches"
                                                component={CustomSelect}
                                                isMulti
                                                options={options}
                                                setFieldValue={setFieldValue}
                                            />
                                            <ErrorMessage name="branches">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                }
                                {applicable === '3' &&
                                    <div className='pl-0 col-md-12'>
                                        <FormGroup >
                                            <label>Select Job Title<span style={{ color: "red" }}>*</span></label>

                                            <Field
                                                name="jobtitle"
                                                component={CustomSelect}
                                                isMulti
                                                options={options}
                                                setFieldValue={setFieldValue}
                                            />
                                            <ErrorMessage name="jobtitle">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                }

                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active"  >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.checklist
                                        && this.state.checklist.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`} onClick={e => {
                                            let { checklist } = this.state;
                                            checklist.active = !checklist.active;
                                            setFieldValue("active", checklist.active);
                                            this.setState({
                                                checklist
                                            });
                                        }}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.checklist.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
