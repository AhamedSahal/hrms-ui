import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePerformanceTemplate } from './service';


export default class PerformanceTemplateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            performanceTemplate: props.performanceTemplate || {
                id: 0,
                name: "",
                objectiveGroupIds: []
            },
            objectiveGroups: props.objectiveGroups || [],
        }
        if (!this.state.performanceTemplate.objectiveGroupIds) {
            this.state.performanceTemplate.objectiveGroupIds = []
        }
        let performanceTemplate = this.state.performanceTemplate;

        this.state.objectiveGroups.map((objectiveGroup, index) => {
            performanceTemplate.objectiveGroupIds.push(objectiveGroup.id);
        })
        this.setState({
            performanceTemplate
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.performanceTemplate && nextProps.performanceTemplate != prevState.performanceTemplate) {
            return ({ performanceTemplate: nextProps.performanceTemplate })
        } else if (!nextProps.performanceTemplate) {
            return prevState.performanceTemplate || ({
                performanceTemplate: {
                    id: 0,
                    name: "",
                    objectiveGroupIds: []
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        savePerformanceTemplate(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Review Template");

            action.setSubmitting(false);
        })
    }
    render() {

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.performanceTemplate}
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
                    }) => (

                        <Form autoComplete='off'>
                            <div className="row">
                                {this.state.objectiveGroups.map((objectiveGroup, index) => {
                                    return <div className="col-md-12" key={index}> <input disabled={true} defaultChecked={true} type="checkbox" id={'grp' + index} name={`objectiveGroupIds[${index}]`} value={objectiveGroup.id}
                                        onChange={(e) => {
                                            let performanceTemplate = this.state.performanceTemplate;
                                            if (e.target.checked) {
                                                performanceTemplate.objectiveGroupIds.push(objectiveGroup.id)
                                            } else {
                                                performanceTemplate.objectiveGroupIds = performanceTemplate.objectiveGroupIds.filter(b => b !== objectiveGroup.performanceObjectiveId)
                                            }
                                            this.setState({
                                                performanceTemplate
                                            })
                                        }} />
                                        <label className='ml-2' htmlFor={'grp' + index}>{objectiveGroup.name}</label></div>
                                })}
                            </div>
                            <FormGroup>
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" required className="form-control"></Field>

                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.performanceTemplate.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
