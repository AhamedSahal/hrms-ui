import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CompositeForm from './form';
import { getAllwoanceTypeList } from '../../ModuleSetup/Allowance/service';
import { getGradingStructureList, getPayCompositeList, getPayRangeList } from '../../ModuleSetupPage/CompensationSettings/service';

const { Header, Body, Footer, Dialog } = Modal;
export default class CompositePayScale extends Component {
    constructor(props) {
        super(props);

        this.state = {

            allowances: [],
            compositeData: '',
            payRange: '',
            q: "",
            page: 0,
            size: 30,
            sort: "id,desc",
            totalPages: 1,
            totalRecords: 23,
            currentPage: 1,
            gradesId: ''
        };
    }


    hideForm = () => {
        this.setState({
            showForm: false,
            recognition: undefined
        })
    }

    componentDidMount = () => {
        this.fetchList();
        this.fetchListComposite();
    }

    fetchList() {
        getPayRangeList().then((res) => {
            if (res.status === 'OK') {
                this.setState({ payRange: res.data.payRangePerc })

            }
        });
        getGradingStructureList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
            if (res.status == "OK") {
                this.setState({ gradesId: res.data.list.map(role => role.gradesName) })
                
            }
        })
        getAllwoanceTypeList().then((res) => {
            if (res.status === 'OK') {
                const allowance = res.data.list.map((item) => item.name)
                this.setState({ allowances: allowance })
            }
        });

    }

    fetchListComposite() {
        getPayCompositeList(this.state.q, this.state.page, this.state.size, this.state.sort).then((res) => {
            if (res.status === 'OK') {
                this.setState({ compositeData: res.data.list[0]})
            }
        });

    }

    render() {
        const { gradesId, compositeData, totalRecords, currentPage, size, allowances, payRange } = this.state
        
        const grades = Object.keys(compositeData)
            .filter(key => key.startsWith('grade'))
            .map(key => compositeData[key]);
        const allowance = Object.keys(compositeData)
            .filter(key => key.startsWith('allowance'))
            .map(key => compositeData[key]);
        const data = [];

        for (let i = 0; i < gradesId.length; i++) {
            const grade = Number(grades[i])
            const payRanges = Number(payRange)
            const basicSalary = (grade * compositeData.basicSalary) / 100
            const newData = {
                id: gradesId[i],
                minSalary: grade - (grade * payRanges / 100),
                midSalary: grade,
                maxSalary: grade + (grade * payRanges / 100),
                basicSalary: basicSalary,
                allowance: grade,
            };
            
            for (let j = 0; j < allowances.length ; j++) {
                newData[`allowance${j + 1}`] = (grade * allowance[j]) / 100;
            }
            data.push(newData);
        }

        const columns = [
            {
                title: "Grade",
                dataIndex: 'id',
                width: 100,
                className: "text-center",
            },

            {
                title: 'Monthly Gross Salary',
                dataIndex: 'monthlyGrossSalary',
                width: 300,
                children: [
                    {
                        title: 'Min',
                        dataIndex: 'minSalary',
                        width: 100,

                    },
                    {
                        title: 'Mid',
                        dataIndex: 'midSalary',
                        width: 100,
                    },
                    {
                        title: 'Max',
                        dataIndex: 'maxSalary',
                        width: 100,
                    },
                ],
            },
            {
                title: "Basic Salary",
                dataIndex: 'basicSalary',
                width: 100,
                className: "text-center",
            }, 
            
        ]

        for (let k = 0; k < allowances.length; k++) {
            if (allowances[k]) {
                columns.push({
                    title: allowances[k],
                    width: 100,
                    className: "text-center",
                    render: (text, record) => {
                        return <span>{record[`allowance${k + 1}`]}</span>;
                    },
                });
            }

        }

        return (
            <>

                <div className="page-container content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Composite</h3>
                            </div>

                        </div>
                    </div>
                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                <Table id='Table-style' className="table-striped "
                                    style={{ overflowX: 'auto' }}
                                    columns={columns}
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    pagination={false} 
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                    <Header closeButton>
                        <h5 className="modal-title">Edit Composite Pay Scale</h5>

                    </Header>
                    <Body>
                        <CompositeForm updateList={this.updateList} composite={this.state.composite}></CompositeForm>
                    </Body>
                </Modal>
            </>
        );
    }
}
