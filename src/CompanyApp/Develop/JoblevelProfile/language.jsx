import React, { Component } from 'react';
import { Table } from 'antd';
import { Field, Formik } from 'formik';
import { getLanguageList } from '../../ModuleSetup/Language/service';
import { toast } from 'react-toastify';
import { saveLanguage } from './service';

export default class Language extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedItems: [],
            itemId: 1,
            languageSetup: {
                language: '',
                reading: '',
                writing: '',
                native: '',
                speaking: ' ',
            }
        };
    }

    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {

        getLanguageList().then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,

                })
            }
        })

    }

    handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        if (!this.state.selectedItems.some(item => item.name === selectedValue)) {
            this.setState((prevState) => ({
                selectedItems: [
                    ...prevState.selectedItems,
                    {
                        id: prevState.itemId,
                        name: selectedValue,
                        native: false,
                        reading: '',
                        writing: '',
                        speaking: '',
                    }
                ],
                itemId: prevState.itemId + 1,
            }));
        }
    };

    handleSubmit = (values, action) => {
        const data = this.state.selectedItems[0]
        const language = {
            laguage: data.name,
            native: data.native,
            reading: data.reading,
            speaking: data.speaking,
            writing: data.writing,
            id: 1,
            employeeGradeId: this.props.employeeGrade,
        }
        saveLanguage(language).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving Language form");
            action.setSubmitting(false);
        })
    };
    render() {
        const { values, setFieldValue } = this.props;
        const columns = [
            {
                title: 'Sr.N',
                dataIndex: 'id',
                key: 'snum',
            },
            {
                title: 'Language',
                dataIndex: 'name',
                key: 'languages',
            },
            {
                title: 'Native',
                dataIndex: 'native',
                key: 'native',
                render: (text, record, index) => {
                    const id = record.id
                    return (
                        <input onChange={(e) => {
                            const isChecked = e.target.checked;
                            this.setState((prevState) => ({
                                selectedItems: prevState.selectedItems.map(selectedItem => ({
                                    ...selectedItem,
                                    native: selectedItem.id === id ? isChecked : selectedItem.native
                                }))
                            }));
                        }} type="checkbox" />
                    );

                },

            },
            {
                title: 'Reading',
                dataIndex: 'reading',
                key: 'reading',
                width: '10em',
                render: (text, record, index) => {
                    const id = record.id
                    return (
                        <select data-toggle="dropdown" className='form-control '
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                this.setState((prevState) => ({
                                    selectedItems: prevState.selectedItems.map(selectedItem => ({
                                        ...selectedItem,
                                        reading: selectedItem.id === id ? selectedValue : selectedItem.reading
                                    }))
                                }));
                            }}

                        >
                            <option value="1">Beginner</option>
                            <option value="2">Limited Working Proficiency</option>
                            <option value="3">Professional Working Proficiency</option>
                            <option value="4">Full Professional Proficiency</option>
                            <option value="5">Advanced</option>

                        </select>
                    );

                },
            },
            {
                title: 'Writing',
                dataIndex: 'writing',
                key: 'writing',
                width: '10em',
                render: (text, record, index) => {
                    const id = record.id
                    return (
                        <select data-toggle="dropdown" className='form-control '
                            onChange={(e) => {
                                const selectedValue = e.target.value;
                                this.setState((prevState) => ({
                                    selectedItems: prevState.selectedItems.map(selectedItem => ({
                                        ...selectedItem,
                                        writing: selectedItem.id === id ? selectedValue : selectedItem.writing
                                    }))
                                }));
                            }}
                        >
                            <option value="1">Beginner</option>
                            <option value="2">Limited Working Proficiency</option>
                            <option value="3">Professional Working Proficiency</option>
                            <option value="4">Full Professional Proficiency</option>
                            <option value="5">Advanced</option>

                        </select>
                    );

                },
            },
            {
                title: 'Speaking',
                dataIndex: 'speaking',
                key: 'speaking',
                width: '10em',
                render: (text, record, index) => {
                    const id = record.id
                    return (
                        <>
                            <div >
                                <select
                                    data-toggle="dropdown"
                                    className='form-control'
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        this.setState((prevState) => ({
                                            selectedItems: prevState.selectedItems.map(selectedItem => ({
                                                ...selectedItem,
                                                speaking: selectedItem.id === id ? selectedValue : selectedItem.speaking
                                            }))
                                        }));
                                    }}
                                >
                                    <option value="1">Beginner</option>
                                    <option value="2">Limited Working Proficiency</option>
                                    <option value="3">Professional Working Proficiency</option>
                                    <option value="4">Full Professional Proficiency</option>
                                    <option value="5">Advanced</option>
                                </select>
                            </div>

                        </>
                    );

                },

            },


        ];



        return (
            <Formik
                initialValues={this.state.languageSetup}
                validationSchema={this.validationSchema}
                onSubmit={this.handleSubmit}
            >
                {(formikProps) => (
                    <form onSubmit={formikProps.handleSubmit}>
                        <div className='float-right p-2 col-md-6'>
                            <select
                                onChange={(e) => this.handleSelectChange(e)}
                                data-toggle="dropdown"
                                className='form-control'
                            >
                                {this.state.data.map((item) => (
                                    <option key={item.id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Table id='Table-style' className="table-striped"
                            dataSource={[...this.state.selectedItems]}
                            columns={columns}
                            bordered
                            pagination={false}
                            rowKey={(record) => record.snum}
                        />
                        <input type="submit" className="mt-3 m-3 float-right btn btn-primary" value={'Save'} />

                    </form>
                )}
            </Formik>
        );
    }
}
