import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { itemRender, onShowSizeChange } from '../../../../MainPage/paginationfunction';
import { verifyOrgLevelViewPermission } from '../../../../utility';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';

export default class PlannedCycle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [{
                cycleName: 'Globelink April Q2 Cycle',
                applicablename: 'Department',
                stage: 'Pending',
                instanceName: 'Jun,23',
                startDate: '20/10/2023',
                endDate: '15/11/2023'
            }],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1
        };
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
                title: 'Cycle Name',
                dataIndex: 'cycleName',
                sorter: true,
            },
            {
                title: 'Applicable For',
                dataIndex: 'applicablename',
                sorter: true,
            },
            {
                title: 'Stage',
                dataIndex: 'stage',
                sorter: true,
            },
            {
                title: 'Instance Name',
                dataIndex: 'instanceName',
                sorter: true,
            },
            {
                title: 'Starts On',
                dataIndex: 'startDate',
                sorter: true,
            },
            {
                title: 'Ends On',
                dataIndex: 'endDate',
                sorter: true,
            },
        ]
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="mt-3 tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Planned</h3>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                            {verifyOrgLevelViewPermission("Performance Cycle") &&
                                <Table id='Table-style' className="table-striped "
                                    pagination={{
                                        total: data.length,
                                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                        showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                                    }}
                                    style={{ overflowX: 'auto' }}
                                    columns={columns}
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    onChange={this.onTableDataChange}
                                />}
                                {!verifyOrgLevelViewPermission("Performance Cycle") && <AccessDenied></AccessDenied>}                  

                            </div>
                        </div>
                    </div>
                </div>



            </>
        );
    }
}
