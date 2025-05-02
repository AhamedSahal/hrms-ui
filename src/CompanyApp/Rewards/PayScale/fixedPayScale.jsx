import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from '../../../paginationfunction';
import { getRewardCompositeList, getRewardFixedList } from './service';
import { getGradingStructureList, getPayCompositeList, getPayFixedList, getPayRangeList } from '../../ModuleSetupPage/CompensationSettings/service';
import { getAllwoanceTypeList } from '../../ModuleSetup/Allowance/service';

const { Header, Body, Footer, Dialog } = Modal;
export default class FixedPayScale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            q: "",
            page: 0,
            size: 23,
            sort: "id,desc",
            totalPages: 3,
            totalRecords: 23,
            currentPage: 1,
            fixedPayList: '',
            payRange: '',
            gradesId: '',
            allowances: [],
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
        this.fetchListFixed();
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

    fetchListFixed() {
        getPayFixedList().then((res) => {
            if (res.status === 'OK') {
                this.setState({ fixedPayList: res.data.list })
            }
        });

    }



    render() {
        const { gradesId, fixedPayList, totalPages, totalRecords, currentPage, size, payRange, allowances } = this.state
        
        const data = [];
        if (fixedPayList && fixedPayList.length > 0) {

            // Basic Salary
            const basicSalary = fixedPayList[0];
            const grades = Object.keys(basicSalary)
                .filter(key => key.startsWith('grade'))
                .map(key => basicSalary[key]);
            const allowanceValue = [];
            for (let i = 1; i < fixedPayList.length; i++) {
                const basicSalary = fixedPayList[i];
                const grades = Object.keys(basicSalary)
                    .filter(key => key.startsWith('grade'))
                    .map(key => basicSalary[key]);
                allowanceValue.push(grades);
            }


            for (let i = 0; i < gradesId.length; i++) {

                const payRanges = Number(payRange);
                const salary = Number(grades[i]);
                const newData = {
                    id: gradesId[i],
                    minSalary: salary - (salary * payRanges / 100),
                    midSalary: salary,
                    maxSalary: salary + (salary * payRanges / 100),
                };

                for (let j = 0; j < allowanceValue.length; j++) {
                    newData[`allowance${j + 1}`] = allowanceValue[j][i];
                }

                data.push(newData);
            }



        }

        const columns = [
            {
                title: 'Grades',
                dataIndex: 'id',
                width: 100,
            },
            {
                title: 'Monthly Basic Salary',
                dataIndex: 'monthlyGrossSalary',
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
                                <h3 className="tablePage-title">Fixed Pay Scale</h3>
                            </div>

                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                <Table id='Table-style' className="table-striped "
                                    pagination={false}
                                    style={{ overflowX: 'auto' }}
                                    columns={columns}
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    onChange={this.onTableDataChange}
                                />
                            </div>
                        </div>
                    </div>

                </div>

            </>
        );
    }
}
