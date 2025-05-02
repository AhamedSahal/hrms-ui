import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import Select from "react-select";
import { getBranchLists, getDepartmentLists } from '../../../Performance/ReviewCycle/CycleForms/service';
import { getJobTitles } from '../../OnboardSetup/checkList/service';



export default class OffboardMSchecklistForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            applicable: '',
            jobtitle: [],
            department: [],
            branches: [],
            checklist: this.props.checklist || {
                id: 0,
                name: "",
                description: "",
                active: true,
            }

        }
    }


    componentDidMount() {
        getBranchLists().then(res => {
            if (res.status === "OK") {
                this.setState({
                    branches: res.data,
                }, () => {
                    if (this.props.taskData?.branches) {
                        const brancheData = res.data.filter(br => this.props.taskData.branches.includes(br.id));
                        this.setState(prevState => ({
                            task: {
                                ...prevState.task,
                                branches: brancheData
                            }
                        }));
                    }
                });
            }
        });
        getDepartmentLists().then(res => {
            if (res.status === "OK") {
                this.setState({
                    department: res.data,
                }, () => {
                    if (this.props.taskData?.departments) {
                        const departmentData = res.data.filter(dept => this.props.taskData.departments.includes(dept.id));
                        this.setState(prevState => ({
                            task: {
                                ...prevState.task,
                                departments: departmentData
                            }
                        }));
                    }
                });
            }
        });

        getJobTitles().then(res => {
            if (res.status == "OK") {
                this.setState({
                    jobtitle: res.data,
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
        if (data.departments && data.departments.length > 0) {
            checklist.departments = data.departments.map(dept => dept.id);
        }
        if (data.branches && data.branches.length > 0) {
            checklist.branches = data.branches.map(brnch => brnch.id);
        }
        if (data.jobtitle && data.jobtitle.length > 0) {
            checklist.jobtitle = data.jobtitle.map(job => job.id);
        }
        // saveMSChecklist(checklist).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //         this.props.updateList(res.data);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     toast.error("Error while saving Checklist");
        //     action.setSubmitting(false);
        // })
    }
    render() {
        const { applicable } = this.state;

        let options = [];
        if (applicable === '2') {
            options.push(...this.state.branches);
        } else if (applicable === '1') {
            options.push(...this.state.department);
        }else if (applicable === '3') {
            options.push(...this.state.jobtitle);
        }

        const CustomSelect = ({ field, setFieldValue }) => {
            const { name } = field;

            const handleChange = (data) => {
                const ids = data.map(option => option.id);
                if (applicable === '1') {
                    setFieldValue("departments", [])
                } else if (applicable === '2') {
                    setFieldValue("branches", [])
                }else if (applicable === '3') {
                    setFieldValue("departments", [])
                    setFieldValue("branches", [])
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
                />
            );
        };
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.checklist}
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
                        <Form autoComplete='off'>
                            <FormGroup>
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control" required></Field>

                            </FormGroup>

                            <FormGroup>
                                <label>Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="description" className="form-control" required></Field>

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
                                            <label>Select Location  <span style={{ color: "red" }}>*</span></label>
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
                                            <label>Select Job Title  <span style={{ color: "red" }}>*</span></label>
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
                                <div type="checkbox" name="active" onClick={e => {
                                    let { checklist } = this.state;
                                    checklist.active = !checklist.active;
                                    setFieldValue("active", checklist.active);
                                    this.setState({
                                        checklist
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.checklist
                                        && this.state.checklist.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
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
