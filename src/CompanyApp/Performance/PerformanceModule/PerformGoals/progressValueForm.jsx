import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import { Input, Select, Button } from 'antd';
import { FormGroup } from 'react-bootstrap';
import { BsFileEarmarkCheck, BsPaperclip } from "react-icons/bs";
import { updateGoalStatus, updateSubGoalStatus } from './service';
import { toast } from 'react-toastify';
import { Tooltip } from 'antd';



const { Option } = Select;

class ProgressValueForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newValue: '',
            status: '',
            achievement: this.props.progressValue || 0,
            goalId: this.props.goalId || 0,
            progressData: {},
            file: '',

        };
    }
    handleUpdate = () => {
        // Handle update logic here
    };

    handleClose = () => {
        this.setState({ file: '' });
        this.props.onClose();
    };

    save = (data) => {
        if (this.props.GoalsStatusValidation) {
            updateGoalStatus(this.state.goalId, data.file, this.state.achievement, data.comments).then(res => {

                if (res.status == "OK") {
                    toast.success(res.message);

                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {

                    this.props.updateProgressList()
                    this.handleClose();
                }
            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })

        } else {


            updateSubGoalStatus(this.state.goalId, data.file, this.state.achievement, data.comments).then(res => {

                if (res.status == "OK") {
                    toast.success(res.message);

                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {

                    this.props.updateProgressList()
                    this.handleClose();
                }
            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })
        }

    }

    render() {
        const uniqueId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;
        return (
            <div style={{ width: "400px" }}>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.progressData}
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
                            <FormGroup>
                                <label>Progress %
                                </label>
                                <td>
                                    <input name="achRadius" type="range" id="achRadius" min="0" max="100" class="form-range" value={this.state.achievement} style={{ paddingTop: "10px", paddingBottom: "10px" }}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            this.setState({ achievement: value });
                                        }}
                                    />
                                    <Field
                                        name="achievement" type="number" maxLength="100" className="form-control" value={this.state.achievement}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value >= 0 && value <= 100) {
                                                this.setState({ achievement: value });
                                                this.setFieldValue('achievement', value);
                                            }
                                        }}
                                        required
                                    />
                                </td>
                                {/* <Field name="achievement" type="number" className="form-control"></Field> */}
                            </FormGroup>
                            <FormGroup>
                                <label>Comment
                                </label>
                                <Field name="comments" className="form-control" placeholder="Enter Comment" component="textarea" rows="3"></Field>

                            </FormGroup>
                            <FormGroup>
                                <label
                                    htmlFor={uniqueId}
                                    style={{
                                        color: '#1890ff',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <BsPaperclip size={17} /> Add Attachments
                                    <Tooltip title="Attachment must be in DOCX,JPEG,PNG,XLSX,PPT format only and lesser than 5MB">
                                        <i
                                            className="fa fa-info-circle"
                                            style={{ marginLeft: '8px', marginBottom: '5px', cursor: 'pointer' }}
                                        ></i>
                                    </Tooltip>
                                </label>
                                <input
                                    id={uniqueId}
                                    name="file"
                                    type="file"
                                    style={{ display: 'none' }}
                                    className="form-control"
                                    onChange={(e) => {
                                        setFieldValue('file', e.currentTarget.files[0]);
                                    }}
                                />
                                {values.file?.name && (
                                    <div
                                        style={{
                                            marginTop: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <BsFileEarmarkCheck
                                            size={17}
                                            style={{
                                                color: 'green',
                                                marginRight: '5px',
                                            }}
                                        />
                                        <span>{values.file.name}</span>
                                    </div>
                                )}
                                {touched.file && errors.file && (
                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.file}</div>
                                )}
                            </FormGroup>

                            <div>
                                <Button className='mr-2' type="primary" htmlType="submit">Update</Button>
                                <Button type="default" onClick={this.handleClose}>Cancel</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

export default ProgressValueForm;