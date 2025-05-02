import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { itemRender, onShowSizeChange } from '../../../../MainPage/paginationfunction';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import { verifyOrgLevelViewPermission } from '../../../../utility';


export default class CompletedCycle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [{
                cycleName: 'Globelink April Q2 Cycle',
                applicablename: 'Department',
                instance: 1,
                date: '20/08/2023'
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
                title: 'Completed Instance',
                dataIndex: 'instance',
                sorter: true,
            },
            {
                title: 'Completed On',
                dataIndex: 'date',
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
                                <h3 className="tablePage-title">Completed</h3>
                            </div>

                        </div>
                    </div>
                    {/* /Page Header */}
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
