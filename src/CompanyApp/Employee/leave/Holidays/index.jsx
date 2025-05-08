import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getBranchId } from '../../../../utility';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import { itemRender } from '../../../../paginationfunction';
import { getAllHolidayList } from '../../../ModuleSetup/Holiday/service';

export default class AllHolidaysList extends Component {
    constructor(props) {
        super(props);
        const currentYear = new Date().getFullYear();
        this.state = {
            data: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            validation: false,
            locationName: "",
            locationId: getBranchId(),
            holidayYear: currentYear.toString(),

        };
    }

    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        getAllHolidayList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.locationId, this.state.holidayYear).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    currentPage: res.data.currentPage + 1
                })
            }
        })
    }


    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchList();
        })
    }



    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const columns = [
            {
                title: 'Holiday',
                dataIndex: 'occasion',
                sorter: true,
            },
            {
                title: 'Day',
                dataIndex: 'date',
                sorter: true,
                render: (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
            },
            {
                title: 'Date',
                dataIndex: 'date',
                sorter: true,
                render: (date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            },

        ]
        return (
            <>

                < div className="page-container content container-fluid" >
                    < div className="tablePage-header" >
                        <div className="row pageTitle-section">
                            <div className="col-md-6">
                                <h3 className="tablePage-title">Holiday</h3>
                            </div>
                            <div className=" mb-2 float-right col-md-6 ml-auto d-flex">
                                <BranchDropdown defaultValue={this.state.locationId || "Select Location"}
                                    onChange={(e) => {
                                        this.setState({
                                            locationId: e.target.value,
                                            locationName: e.target.selectedOptions[0].label,

                                        }, () => {
                                            this.fetchList()
                                        }

                                        )
                                    }} >
                                </BranchDropdown>

                                <select className="form-control" defaultValue={this.state.holidayYear} style={{ marginLeft: "10px" }}
                                    onChange={e => {
                                        this.setState({ holidayYear: e.target.value }, () => { this.fetchList() })
                                    }}>
                                    <option value="">Year</option>
                                    <option value="2019">2019</option>
                                    <option value="2020">2020</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </div>
                        </div>

                    </div >

                    < div className="row" >
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                <Table id='Table-style' className="table-striped"
                                    pagination={{
                                        total: totalRecords,
                                        showTotal: (total, range) => {
                                            return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                        },
                                        showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                        itemRender: itemRender,
                                        pageSizeOptions: [10, 20, 50, 100],
                                        current: currentPage,
                                        defaultCurrent: 1,
                                    }}
                                    style={{ overflowX: 'auto' }}
                                    columns={columns}
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    onChange={this.onTableDataChange}
                                />

                            </div>

                        </div >

                    </div >



                </div >
            </>
        );
    }
}
