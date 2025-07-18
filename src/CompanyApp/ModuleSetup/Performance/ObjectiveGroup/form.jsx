import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveObjectiveGroup, getObjectiveGroupListWeightage } from './service';
import { ObjectiveGroupSchema } from './validation';

export default class ObjectiveGroupForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            objectivegroup: props.objectivegroup || {
                id: 0,
                name: "",
                active: true,
            },
            totalWeightage: 0,
            defaultPerformFactorWeightage: 0
        }
    }

      componentDidMount() {
        getObjectiveGroupListWeightage().then(res => {
            if (res.status === "OK") {
               
                this.setState({
                    totalWeightage: res.data.totalWeightage,
                    defaultPerformFactorWeightage: res.data.defaultPerformFactorWeightage
                },);
            } else {
                toast.error("Failed to load weightage data");
            }
        }).catch(err => {
            toast.error("Error fetching weightage data");
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.objectivegroup && nextProps.objectivegroup != prevState.objectivegroup) {
            return ({ objectivegroup: nextProps.objectivegroup })
        } else if (!nextProps.objectivegroup ) { 
            return prevState.objectivegroup || ({
                objectivegroup: {
                    id: 0,
                    name: "",
                    active: true
                }
            })
        }
        return null;
    }
    save = (data, action) => {

        // let availableWeightage = 0;

        // if (this.state.objectivegroup.id === 0) {
        //     availableWeightage = this.state.defaultPerformFactorWeightage;
        // } else {
        //     availableWeightage = Number(this.state.objectivegroup.weightage) + Number(this.state.defaultPerformFactorWeightage);
        // }

        // if ((Number(data.weightage) > availableWeightage) && availableWeightage!=1 ) {
        //     toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
        //     action.setSubmitting(false);
        //     return;
        // }else if ((Number(data.weightage) > availableWeightage) && availableWeightage===1 ) {
        //     toast.error("Performance Factor weightage reached its limit. please reduce any perform factor weightage to create new factor");
        //     action.setSubmitting(false);
        //     return;
        // }else if(this.state.objectivegroup.id === 0 && this.state.defaultPerformFactorWeightage===1 && (Number(data.weightage) === availableWeightage)){
        //          toast.error("Performance Factor weightage reached its limit. please reduce any perform factor weightage to create new factor");
        //     action.setSubmitting(false);
        //     return;
        // }else if(this.state.objectivegroup.id === 0 && this.state.defaultPerformFactorWeightage>1 && (Number(data.weightage) === availableWeightage)){
        //     toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
        //     action.setSubmitting(false);
        //     return;
        // }else if(this.state.objectivegroup.id === 0 && this.state.defaultPerformFactorWeightage>1 && (Number(data.weightage) === availableWeightage)){
        //     toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
        //     action.setSubmitting(false);
        //     return;
        // }else if(this.state.objectivegroup.id != 0 && this.state.defaultPerformFactorWeightage===1 && (Number(data.weightage) === availableWeightage)){
        //          toast.error("Performance Factor weightage reached its limit. please reduce any perform factor weightage to create new factor");
        //     action.setSubmitting(false);
        //     return;
        // }else if(this.state.objectivegroup.id != 0 && this.state.defaultPerformFactorWeightage>1 && (Number(data.weightage) === availableWeightage)){
        //     toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
        //     action.setSubmitting(false);
        //     return;
        // }else if(this.state.objectivegroup.id != 0 && this.state.defaultPerformFactorWeightage>1 && (Number(data.weightage) === availableWeightage)){
        //     toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
        //     action.setSubmitting(false);
        //     return;
        // }

        let availableWeightage = 0;

        if (this.state.objectivegroup.id === 0) {
            availableWeightage = this.state.defaultPerformFactorWeightage;
        } else {
            availableWeightage = Number(this.state.objectivegroup.weightage) + Number(this.state.defaultPerformFactorWeightage);
        }

        const weightage = Number(data.weightage);

        if (weightage > availableWeightage) {
            if (availableWeightage === 1) {
                toast.error("Performance Factor weightage reached its limit. please reduce any perform factor weightage to create new factor");
            } else {
                toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
            }
            action.setSubmitting(false);
            return;
        }

        if (weightage === availableWeightage) {
            if (this.state.defaultPerformFactorWeightage === 1) {
                toast.error("Performance Factor weightage reached its limit. please reduce any perform factor weightage to create new factor");
            } else {
                toast.error(`Only ${availableWeightage - 1}% weightage is available. Otherwise reduce other factor weightage`);
            }
            action.setSubmitting(false);
            return;
        }

        action.setSubmitting(true);
        saveObjectiveGroup(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Factor");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.objectivegroup}
                    onSubmit={this.save}
                    validationSchema={ObjectiveGroupSchema}
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
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Weightage % 
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="weightage" type="number" className="form-control" min={1} max={100}></Field>
                                <ErrorMessage name="weightage">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>  
                            <input type="submit" className="btn btn-primary" value={this.state.objectivegroup.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
