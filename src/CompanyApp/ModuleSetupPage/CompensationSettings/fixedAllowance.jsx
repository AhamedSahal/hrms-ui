import { Input, Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { getAllwoanceTypeList } from '../../ModuleSetup/Allowance/service';
import { saveFixedAllowancePayscale, getPayFixedList, getGradingStructureList, getPayScaleType } from './service';

export default class FixedAllowancePayscale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            q: "",
            page: 0,
            size: 30,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            allAllowances: [],
            gradesId: '',
        };
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
                const type = res.data[0].payScaleType == "COMPOSITE" ? 0 : res.data[0].payScaleType == "FIXED" ? 1 : null

                if (type === 1) {
                    this.fetchFixedList();
                } else {
                    this.fetchList();
                }
            }
        });


    }
    fetchFixedList = () => {
        getPayFixedList().then((res) => {
            if (res.status === 'OK') {
                const fixedAl = res.data.list
                const fixData = []
                for (let i = 0; i < fixedAl.length; i++) {
                    const fixList = fixedAl[i];
                    const tAllowances = Object.keys(fixList)
                        .filter(key => key.startsWith('grade') || key.startsWith('field'))
                        .reduce((acc, key) => {
                            acc[key] = fixList[key] !== null ? fixList[key] : '0';
                            return acc;
                        }, {});

                    fixData.push(tAllowances)
                }
                this.setState({ data: fixData })
            }
        });
    }


    fetchList = () => {

        getAllwoanceTypeList().then((res) => {
            if (res.status === 'OK') {
                const index = Array.from({ length: 23 }, (_, index) => index + 1);
                const allowance = res.data.list.map((item) => item.name)
                allowance.splice(0, 0, "Basic salary");
                this.setState({ allAllowances: allowance })
                const data = allowance.map((field) => {
                    const rowData = {};
                    index.forEach((idx) => {
                        rowData[`grade${idx}`] = "0";
                    });
                    return { field, ...rowData };
                });

                this.setState({ data: data });
            }
        });


    }
    saveAllowance = (action) => {
        const { allAllowances, data } = this.state
        const allowanceData = [];

        for (let i = 0; i < allAllowances.length; i++) {
            const rowData = {};
            rowData[`${i}`] = data[i];
            allowanceData.push(rowData);
        }
        const datas = {
            id: 0,
            allowances: data,
            allowancelen: data.length
        }
        saveFixedAllowancePayscale(datas).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            toast.error("Error while saving Fixed Allowances");
        })
    };

    handleInputChange = (rowIndex, field, value) => {
        const newData = [...this.state.data];
        newData[rowIndex][field] = value;
        this.setState({ data: newData });
    };
    getRowClassName = (record, index) => {
        return index === 0 ? 'first-row-style' : '';
    };

    render() {
        const { totalPages, totalRecords, currentPage, size, data, gradesId } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        if (this.state.data.length === 0) {
            return null;
        }
        const columns = [
            {
                title: "Grades",
                dataIndex: "field",
                key: "field",
                fixed: "left",
                width: 150
            },
            ...Object.keys(data[0])
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
                                onChange={(e) => this.handleInputChange(rowIndex, key, e.target.value)}
                            />
                        </>
                    ),
                }))
        ];
        return (

            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowClassName={this.getRowClassName}
                    id='Table-style' scroll={{ x: 'max-content' }} className="table-striped"
                    pagination={false}
                />
                <input onClick={this.saveAllowance} style={{ width: '70px' }} className="mb-2 mt-3 btn btn-primary" value="Save" />

            </div>
        );
    }
}