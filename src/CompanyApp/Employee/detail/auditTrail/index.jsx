import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';


const { Header, Body, Footer, Dialog } = Modal;
export default class SystemLog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            employeeId: props.employeeId || 0,
            data: [],
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
                title: 'Date',
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: 'Time',
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: 'Changed Field',
                
                sorter: true,
            },
            {
                title: 'Old Value',
                sorter: true,
                
            },
            {
                title: 'New Value',
                
                sorter: true,
            },
        
            {
                title: 'Changed By',
                dataIndex: 'maxperson',
                sorter: true,
            },
        ]
        return (
            <>

                {/* /Page Header */}
                <div className="row">
                    <div className="mt-3 col-md-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive">

                                    <Table id='Table-style' className="table-striped"
                                        pagination={{
                                            total: totalRecords,
                                            showTotal: (total, range) => {
                                                return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                                            },
                                            showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                            pageSizeOptions: [10, 20, 50, 100],
                                            current: currentPage,
                                            defaultCurrent: 1,
                                        }}
                                        style={{ overflowX: 'auto' }}
                                        columns={columns}
                                        // bordered
                                        dataSource={[...data]}
                                        rowKey={record => record.id}
                                        onChange={this.onTableDataChange}
                                    />


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* /Page Content */}

            </>
        );
    }
}
