import { Checkbox, FormControlLabel, Radio } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import FixedAllowancePayscale from './fixedAllowance';
import { saveCompositePayscale, getPayCompositeList, getPayScaleType, getGradingStructureList, getPayFixedList } from './service';
import { getAllwoanceTypeList } from '../../ModuleSetup/Allowance/service';
import * as Yup from 'yup';
import { Input, Table } from 'antd';

export default class PayScaleGenaratorForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            allowances: [],
            payScale: {
                id: 0,
                basicSalary: '',
                totalAllowance: '',
            },
            allAllowance: [],
            typeofpayScale: '',
            // type: 0,
            total: 100,
            q: "",
            page: 0,
            size: 30,
            totalRecords: 0,
            sort: "id,desc",
            allowanceValues: {},
            totalPercentage: 0,
            maxTotalPercentage: 0,
            errors: {},
            gradesId: '',
            type: null,
            field: "Monthly Salary"
        }

    }
    componentDidMount() {
        getGradingStructureList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
            if (res.status == "OK") {
                this.setState({ gradesId: res.data.list.map(role => role.gradesName) })
                const grade = res.data.list.map(role => role.gradesName)
                if (grade.length > 0) {
                    this.fetchList()
                }
            }
        })

        getPayScaleType(this.state.q, this.state.page, this.state.size, this.state.sort).then((res) => {
            if (res.status === 'OK') {
                this.setState({ type: res.data[0].payScaleType == "COMPOSITE" ? 0 : res.data[0].payScaleType == "FIXED" ? 1 : null })
                const payType = res.data[0].payScaleType == "COMPOSITE" ? 0 : res.data[0].payScaleType == "FIXED" ? 1 : null

                if (payType === 0) {
                    this.fetchCompositeList()
                    this.setState({ typeofpayScale: '1' })
                }else if (payType === 1){
                    this.setState({ typeofpayScale: '2' })
                }
                else {
                    this.fetchList();
                }

            }

        });

    }

    fetchCompositeList = () => {
        getAllwoanceTypeList().then((res) => {
            if (res.status === 'OK') {
                const allowance = res.data.list.map((item) => item.name)
                this.setState({ allowances: allowance })
            }
        });


        this.setState({ maxTotalPercentage: Number(this.state.payScale.totalAllowance) })
        getPayCompositeList().then((res) => {
            if (res.status === 'OK') {
                const composit = res.data.list[0]
                this.setState({ payScale: composit })
                const field = ["Monthly Salary"];
                const monthlySalary = field.map((field) => {
                    const salary = Object.keys(composit)
                        .filter(key => key.startsWith('grade'))
                        .reduce((acc, key) => {
                            acc[key] = composit[key] !== null ? composit[key] : '0';
                            return acc;
                        }, {});
                    return { field, ...salary };
                });
                const allowance = Object.keys(composit)
                    .filter(key => key.startsWith('allowance'))
                    .reduce((acc, key) => {
                        acc[key] = composit[key];
                        return acc;
                    }, {});

                this.setState({ data: monthlySalary });
                this.setState({ allAllowance: allowance });

            }
        });
        
    }

    fetchList = () => {
        getAllwoanceTypeList().then((res) => {
            if (res.status === 'OK') {
                const allowance = res.data.list.map((item) => item.name)

                this.setState({ allowances: allowance })
            }
        });

        getGradingStructureList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
            if (res.status == "OK") {
                this.setState({ gradesId: res.data.list.map(role => role.gradesName) })
            }
        })

        const index = Array.from({ length: 23 }, (_, index) => index + 1);
        const allowance = ["Monthly Salary"];
        const data = allowance.map((field) => {
            const rowData = {};
            index.forEach((idx) => {
                rowData[`grade${idx}`] = "0";
            });
            return { field, ...rowData };
        });
        this.setState({ maxTotalPercentage: Number(this.state.payScale.totalAllowance) })
        this.setState({ data: data });

    }





    calculateTotal = () => {
        const { basicSalary, totalAllowance } = this.state.payScale;
        const total = Number(basicSalary || 0) + Number(totalAllowance || 0);
        this.setState({ total });
    };
    handleInputChange = (fieldName, e) => {
        const { payScale } = this.state;
        payScale[fieldName] = e.target.value;
        this.setState({ payScale }, () => {
            this.calculateTotal();
        });
    };
    handleAllowancesInputChange = (field, e) => {
        const value = e.target.value;
        const parsedValue = Number(value);
        const newAllowanceValues = {
            ...this.state.allowanceValues,
            [field]: parsedValue,
        };
        const newTotalPercentage = Object.values(newAllowanceValues).reduce(
            (total, val) => total + val,
            0
        );
        this.setState({
            allowanceValues: newAllowanceValues,
            totalPercentage: newTotalPercentage,
            errors: {
                ...this.state.errors,
                [field]: null,
            },
        });

    };
    handleTableInputChange = (rowIndex, field, value) => {
        const newData = [...this.state.data];
        newData[rowIndex][field] = value;
        this.setState({ data: newData });
    };
    // handleRadioChange = (event) => {
    //     this.setState({
    //         typeofpayScale: 1,
    //     });
    // };

    

    handleAllAllowance = (fieldname, e) => {
        this.setState({
            allAllowance: {
                ...this.state.allAllowance,
                [fieldname]: e.target.value,
            },
        });
    }

    save = (data, action) => {
        const compositData = {
            id: 0,
            payScale: [this.state.allAllowance],
            basicSalary: data.basicSalary,
            totalAllowance: data.totalAllowance,
            monthlyGrossSalary: this.state.data

        }
        saveCompositePayscale(compositData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            // action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Composite Payscale");
            action.setSubmitting(false);
        })

    }
    render() {
        const { total, data, gradesId, type, totalRecords, allAllowance } = this.state
        if (this.state.data.length === 0) {
            return null;
        }

        const calculateTotalAllowance = (allAllowance) => {
            return Object.values(allAllowance).reduce((sum, value) => {
                const num = parseFloat(value);
                return sum + (isNaN(num) ? 0 : num);
            }, 0);
        };

        const totalAllowances = calculateTotalAllowance(allAllowance);
        const columns = [
            {
                title: "Grade",
                dataIndex: "field",
                key: "field",
                fixed: "left",
                width: 150
            },
            ...Object.keys(this.state.data[0])
                .filter((key) => key !== "field").slice(0, gradesId.length)
                .map((key, index) => ({
                    title: gradesId[index],
                    dataIndex: key,
                    key,
                    render: (text, record, rowIndex) => (
                        <>
                            <Input
                                type='number'
                                value={text}
                                min="0"
                                step="1"
                                onkeypress="return event.charCode >= 48"
                                onChange={(e) => this.handleTableInputChange(rowIndex, key, e.target.value)}
                            />
                        </>
                    ),
                }))
        ];
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Pay Scale</h3>
                            </div>

                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                <Formik

                                    enableReinitialize={true}
                                    initialValues={this.state.payScale}
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
                                                <div className="col-md-4">
                                                    <FormControlLabel
                                                        disabled={this.state.type == 1 ? true : this.state.type == null ? false : false}
                                                        control={
                                                            <Radio
                                                                checked={this.state.typeofpayScale == "1"}
                                                                onChange={(e) => {
                                                                    // this.handleRadioChange(e),
                                                                    this.setState({ typeofpayScale: "1" })
                                                                }}
                                                                value="1"
                                                                name="typeofpayScale"
                                                            />
                                                        }
                                                        label="Composite Approach"
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <FormControlLabel
                                                        disabled={this.state.type == 0 ? true : this.state.type == null ? false : false}
                                                        control={
                                                            <Radio
                                                                checked={this.state.typeofpayScale == "2"}
                                                                onChange={(e) => {
                                                                    // this.handleRadioChange(e),
                                                                    this.setState({ typeofpayScale: "2" })
                                                                }}
                                                                value="2"
                                                                name="typeofpayScale"
                                                            />
                                                        }
                                                        label="Fixed Allowances per Grade"
                                                    />
                                                </div>
                                            </div>
                                            {this.state.typeofpayScale == '1' &&

                                                <div className="row">
                                                    <h5>Monthly Basic & Allowance <span>(In %)</span> </h5>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Basic
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field onChange={(e) => this.handleInputChange("basicSalary", e)}
                                                                min="0"
                                                                step="1"
                                                                onkeypress="return event.charCode >= 48"
                                                                name="basicSalary"
                                                                placeholder="%" type="number" className="form-control" required></Field>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Allowances
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field onChange={(e) => this.handleInputChange("totalAllowance", e)}
                                                                min="0"
                                                                step="1"
                                                                onkeypress="return event.charCode >= 48"
                                                                placeholder="%" name="totalAllowance" type="number" className="form-control" required></Field>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>Total monthly salary
                                                            </label>
                                                            <Field value={this.state.total} name="Total" type="number" className="form-control" readOnly required />
                                                            {total !== 100 && <span style={{ color: "red" }}>Total monthly salary should be 100 %</span>}
                                                        </FormGroup>
                                                    </div>
                                                    <h5>Allowance field<span>(In %)</span></h5>
                                                    <div className='d-flex flex-wrap'>
                                                        {this.state.allowances.map((field, index) => (
                                                            <div key={index} className="flex-item mr-3">
                                                                <div>
                                                                    <FormGroup >
                                                                        <label>{field}
                                                                            <span style={{ color: "red" }}>*</span>
                                                                        </label>
                                                                        <Field
                                                                            onChange={(e) => {
                                                                                setFieldValue(`allowance${index + 1}`, e.target.value);
                                                                                const fieldName = `allowance${index + 1}`
                                                                                this.handleAllAllowance(fieldName, e)
                                                                                this.handleAllowancesInputChange(field, e);

                                                                            }}
                                                                            name={field}
                                                                            placeholder="%"
                                                                            type="number"
                                                                            min="0"
                                                                            step="1"
                                                                            onkeypress="return event.charCode >= 48"
                                                                            className="form-control"
                                                                            required
                                                                            value={this.state.allAllowance[`allowance${index + 1}`] || ''}
                                                                        />

                                                                        <ErrorMessage name={field} >
                                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                        </ErrorMessage>
                                                                    </FormGroup>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                    {this.state.totalPercentage != this.state.payScale.totalAllowance && (
                                                        <>
                                                            {totalAllowances === this.state.totalPercentage &&
                                                                <div className='mb-2' style={{ color: 'red' }}>
                                                                    Total allowances percentage should be {this.state.payScale.totalAllowance} %.
                                                                </div>

                                                            }
                                                        </>
                                                    )}
                                                    <h5>Monthly Gross Salary</h5>
                                                    <div>
                                                        <Table
                                                            pagination={false}
                                                            columns={columns}
                                                            dataSource={this.state.data}
                                                            id='Table-style' scroll={{ x: 'max-content' }} className="table-striped"
                                                        />
                                                    </div>

                                                </div>}
                                            <div className='mb-4' >
                                                {this.state.typeofpayScale == '2' &&
                                                    <FixedAllowancePayscale ></FixedAllowancePayscale>}
                                            </div>

                                            {this.state.typeofpayScale == '1' &&
                                                <>
                                                    {/* {this.state.totalPercentage == this.state.payScale.totalAllowance && total === 100 ? */}
                                                    <input style={{ width: '70px' }} type="submit" className="btn btn btn-primary" value="Save" />
                                                    {/* //    <input style={{ width: '70px', height: '30px', cursor: 'no-drop' }} className="btn btn btn-secondary" value="Save" />} */}

                                                </>}



                                        </Form>
                                    )
                                    }
                                </Formik>

                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
