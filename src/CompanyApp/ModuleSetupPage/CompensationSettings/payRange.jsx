import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormGroup } from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import { savePayRange, getPayRangeList } from './service';

export default class PayRange extends Component {
    constructor(props) {
        super(props)

        this.state = {
            payRangePerc: {}

        }
    }


    componentDidMount() {
        //  this.fetchList();
        getPayRangeList().then(res => {
            if (res.status == "OK") {
                this.setState({ payRangePerc: res.data })
            }
        })
    }
    // fetchList = () => {
    //     getPayRangeList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

    //         if (res.status == "OK") {
    //             console.log(res.data.list[1]);

    //             this.setState({
    //                 data: res.data.list
    //             })

    //             console.log(this.state.payRange.payRangePerc);
    //         }
    //     })
    // }
    save = (data, action) => {
        savePayRange(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Pay Range");
            action.setSubmitting(false);
        })

    }
    render() {


        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="mb-0 tablePage-title">Pay Range</h3>
                                <label>(The % difference between Midpoint & Minimum as well as Midpoint & Maximum of the pay scale.)</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.payRangePerc}
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
                                    <div className='p-3'>
                                        <FormGroup className='d-flex'>
                                            <label className='mr-2 mt-2'>Range
                                            </label>
                                            <Field type='number' name="payRangePerc" className="col-md-2 form-control"></Field>
                                            <label className='mr-2 mt-2' style={{ paddingLeft: "5px" }}> % </label>
                                            <input type="submit" style={{ height: '30px' }} className="mt-2 ml-4 btn btn-primary" value={"Update"} />
                                        </FormGroup>
                                    </div>

                                </Form>
                            )
                            }
                        </Formik>
                    </div>

                </div>

            </>
        )
    }
}
