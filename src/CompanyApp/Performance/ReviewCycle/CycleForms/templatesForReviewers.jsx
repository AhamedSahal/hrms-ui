import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component, createRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { getBranchLists, getDepartmentLists, getFunctionLists } from './service';
import { ModalFooter } from 'react-bootstrap';
import * as Yup from 'yup';
import Select from "react-select";
import { selectTemplateValidationSchema } from './validation';


const selectTemplateValidationSchemas = Yup.object().shape({
    assign: Yup.string().required("Select an option"),
    cycleRatingScale: Yup.string().required('Select a rating scale'),
    ratingValue: Yup.array().when('assign', {
        is: (assign, schema) => assign === 'department',
        then: Yup.array().min(1, 'At least one option must be selected'),
        otherwise: Yup.array(),
    }),

});

class TemplatesForReviewers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assign: this.props.formData.templateReview3?.assign || '',
            templatesName: [],
            functions: [],
            department: [],
            branche: [],
            selectedItem: this.props.formData.templateReview3?.section || [],
            departmentRate: [],
            ratings: this.props.formData.templateReview3?.templateRating || {},
            formValue: {
                id: 0,
                cycleRatingScale: this.props.formData.templateReview3?.cycleRatingScale || '',
                templateRating: {},
                assign: this.props.formData.templateReview3?.assign || '',
                ratingValue: this.props.formData.templateReview3?.ratingValue || ''
            }
        }
    }

    componentDidMount() {
        getBranchLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    branche: res.data,
                })
            }
        })
        getDepartmentLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    department: res.data,
                })
            }
        })
        getFunctionLists().then(res => {
            if (res.status == "OK") {
                this.setState({
                    functions: res.data,
                })
            }
        })

    }
    onChangeValue(event) {
        this.setState({ assign: event.target.value })
        this.setState({ templatesName: [] })
        this.setState({ selectedItem: [] })
    }



    handleRatingChange = (event, selectedItem) => {
        const { name, value } = event.target;
        const existingRatings = { ...this.state.ratings };
        const newRating = { ratingType: value, orgId: selectedItem.value };
        existingRatings[Object.keys(existingRatings).length] = newRating;
        this.setState({
            ratings: existingRatings,
        });
    };
    handleSelectChange = (selectedItem) => {
        this.setState({ selectedItem });
    };
    save = (data, action) => {
        if (this.state.assign === 'everyone') {
            this.props.handleFormData({ templateReview3: data })
            this.props.nextStep();
        } else {
            const orgSection = this.state.selectedItem
            const result = []
            for (let i = 0; i < Object.keys(this.state.ratings).length; i++) {
                const id1 = this.state.ratings[i].orgId
                for (let j = 0; j < orgSection.length; j++) {
                    const id2 = this.state.selectedItem[j].value;
                    if (id1 === id2) {
                        result.push({id : id1, type : this.state.ratings[i].ratingType});
                    }

                }

            }
            const reviewersData = {
                assign: data.assign,
                cycleRatingScale: data.cycleRatingScale,
                templateRating: this.state.ratings,
                orgRating: result,
                section: this.state.selectedItem,
                ratingValue: data.ratingValue
            };
            this.props.handleFormData({ templateReview3: reviewersData })
            this.props.nextStep();
        }


    }
    render() {
        const { assign, department, branche, functions } = this.state

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.formValue}
                    validationSchema={selectTemplateValidationSchemas}
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
                            <div className='reviewTemplateHeader'>
                                <p className="cycleFormTitle">Pick templates for reviewers and define target groups for them.</p>
                            </div>
                            <div className='d-flex'>
                                <div className="pl-0 col-md-4">
                                    <label>Cycle rating Scale
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <ErrorMessage name="cycleRatingScale">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                    <Field
                                        as="select"
                                        name="cycleRatingScale"
                                        className="form-control"
                                    >
                                        <option value="" disabled>
                                            Select rating point
                                        </option>
                                        <option value="1">10 point scale</option>
                                        <option value="2">5 point scale</option>
                                        <option value="3">4 point scale</option>
                                        <option value="4">3 point scale</option>
                                    </Field>
                                </div>

                            </div>
                            <FormGroup className='mt-2'>
                                <label>Select templates based on
                                    <span style={{ color: "red" }}>*</span>
                                </label>

                                <div className='d-flex' onChange={(e) => {
                                    this.onChangeValue(e)
                                    setFieldValue("assign", e.target.value)
                                }}>
                                    <Field className='mr-1' type="radio" value="everyone" name="assign" /> Everyone
                                    <Field className='ml-4 mr-1' type="radio" value="deparment" name="assign" /> Department
                                    <Field className='ml-4 mr-1' type="radio" value="function" name="assign" /> Function
                                    <Field className='ml-4 mr-1' type="radio" value="location" name="assign" /> Location

                                </div>
                                <ErrorMessage name="assign">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            {assign === 'deparment' &&
                                <div className='mb-4' >

                                    <div>
                                        <label>Select Departments
                                            <span style={{ color: "red" }}>*</span>
                                        </label>

                                        <Select
                                            name='section'
                                            isMulti
                                            options={department.map((item) => ({
                                                label: item.name,
                                                value: item.id,
                                            }))}
                                            value={this.state.selectedItem}
                                            onChange={this.handleSelectChange}
                                        />
                                        <div className='d-flex ratingField'>
                                            {this.state.selectedItem.map((selectedItem, index) => (
                                                <div className='mr-2' key={selectedItem.value}>
                                                    <p className='m-0 '>{selectedItem.label}</p>
                                                    <Field
                                                        as='select'
                                                        name={`ratingValue[${index}]`}
                                                        className="mt-2 col-md-12 form-control"
                                                        onChange={(e) => {
                                                            this.handleRatingChange(e, selectedItem)
                                                            setFieldValue(`ratingValue[${index}]`, e.target.value);
                                                        }}
                                                    >
                                                        <option value="">Select an option</option>
                                                        <option value="Leadership Feedback">Leadership Feedback</option>
                                                        <option value="360 Degree Feedback">360 Degree Feedback</option>
                                                        <option value="Feedback 2020">Feedback 2020</option>
                                                    </Field>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                            {assign === 'location' &&
                                <div className='mb-4' >

                                    <div>
                                        <label>Select Location
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            options={branche.map((item) => ({
                                                label: item.name,
                                                value: item.id,
                                            }))}
                                            value={this.state.selectedItem}
                                            onChange={this.handleSelectChange}
                                        />
                                        <div className='d-flex ratingField'>
                                            {this.state.selectedItem.map((selectedItem, index) => (
                                                <div className='mr-2' key={selectedItem.value}>
                                                    <p className='m-0'>{selectedItem.label}</p>
                                                    <Field
                                                        as='select'
                                                        name={`ratingValue[${index}]`}
                                                        className=" col-md-12 form-control"
                                                        onChange={(e) => {
                                                            this.handleRatingChange(e, selectedItem)
                                                            setFieldValue(`ratingValue[${index}]`, e.target.value);
                                                        }}
                                                    >
                                                        <option value="">Select an option</option>
                                                        <option value="Leadership Feedback">Leadership Feedback</option>
                                                        <option value="360 Degree Feedback">360 Degree Feedback</option>
                                                        <option value="Feedback 2020">Feedback 2020</option>
                                                    </Field>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                            {assign === 'function' &&
                                <div className='mb-4' >

                                    <div>
                                        <label>Select Function
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            options={functions.map((item) => ({
                                                label: item.name,
                                                value: item.id,
                                            }))}
                                            value={this.state.selectedItem}
                                            onChange={this.handleSelectChange}
                                        />
                                        <div className='d-flex ratingField'>
                                            {this.state.selectedItem.map((selectedItem, index) => (
                                                <div className='mr-2' key={selectedItem.value}>
                                                    <p className='m-0 '>{selectedItem.label}</p>
                                                    <Field
                                                        as='select'
                                                        name={`ratingValue[${index}]`}
                                                        className="col-md-12 form-control"
                                                        onChange={(e) => {
                                                            this.handleRatingChange(e, selectedItem)
                                                            setFieldValue(`ratingValue[${index}]`, e.target.value);
                                                        }}
                                                    >
                                                        <option value="">Select an option</option>
                                                        <option value="Leadership Feedback">Leadership Feedback</option>
                                                        <option value="360 Degree Feedback">360 Degree Feedback</option>
                                                        <option value="Feedback 2020">Feedback 2020</option>
                                                    </Field>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                            {assign === 'everyone' &&
                                <div className="col-md-4">
                                    <label>Everyone
                                        <span style={{ color: "red" }}>*</span>
                                    </label>

                                    <select
                                        name="templateRating"
                                        className="form-control"
                                        onChange={e => {
                                            setFieldValue("templateRating", e.target.value)
                                        }}
                                    >
                                        <option value="Leadership Feedback">Leadership Feedback</option>
                                        <option value="360 Degree Feedback">360 Degree Feedback</option>
                                        <option value="Feedback 2020">Feedback 2020</option>
                                    </select>
                                </div>
                            }
                            <div>
                            </div>
                            <ModalFooter className="cycle-modal-footer">
                                <div className='mt-2' style={{ marginLeft: 'auto' }}>
                                    <p onClick={this.props.prevStep} className="mb-0 cycle_btn btn btn-dark">Back</p>
                                    <button type='submit'
                                        className="cycle_btn ml-2 btn btn-dark"
                                    >
                                        Next
                                    </button>
                                </div>

                            </ModalFooter>
                        </Form>
                    )
                    }
                </Formik>

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        departments: state.dropdown.departments,
        functions: state.dropdown.functions,
        branches: state.dropdown.branches
    }
}
export default connect(mapStateToProps)(TemplatesForReviewers);