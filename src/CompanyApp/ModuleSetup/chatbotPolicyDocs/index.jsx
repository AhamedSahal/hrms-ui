import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from '../../../paginationfunction';
import { deleteChatbotDocs, getChatbotDocs } from './service';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import ChatbotDocsForm from './form';
import { fileDownload } from '../../../HttpRequest';

const AIChatbotDocument = () => {
    const [data, setData] = useState([]);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("id,desc");
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [chatbotMessage, setChatbotMessage] = useState(undefined);

    useEffect(() => {
        fetchList();
    }, [q, page, size, sort]);

    const fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Chatbot")) {
            getChatbotDocs(q, page, size, sort).then(res => {
                if (res.status === "OK") {
                    setData(res.data.list);
                    setTotalPages(res.data.totalPages);
                    setTotalRecords(res.data.totalElements);
                    setCurrentPage(res.data.pageable ? res.data.pageable.pageNumber + 1 : 1);
                }
            });
        }
    };

    const onTableDataChange = (pagination, filter, sorter) => {
        setPage(pagination.current - 1);
        setSize(pagination.pageSize);
        setSort(sorter && sorter.field ? `${sorter.field},${sorter.order === 'ascend' ? 'asc' : 'desc'}` : sort);
    };

    const updateList = (chatbotMessage) => {
        const index = data.findIndex(d => d.id === chatbotMessage.id);
        if (index > -1) {
            data[index] = chatbotMessage;
        } else {
            data.unshift(chatbotMessage);
        }
        setData([...data]);
        hideForm();
    };

    const pageSizeChange = (currentPage, pageSize) => {
        setSize(pageSize);
        setPage(0);
        setCurrentPage(1);
    };

    const hideForm = () => {
        setShowForm(false);
        setChatbotMessage(undefined);
    };

    const deleteRecord = (chatbotMessage) => {
        confirmAlert({
            title: `Delete Chatbot Document`,
            message: 'Are you sure, you want to delete this Chatbot Document?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteChatbotDocs(chatbotMessage.id).then(res => {
                        if (res.status === "OK") {
                            toast.success(res.message);
                            fetchList();
                        } else {
                            toast.error(res.message);
                        }
                    })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const startRange = totalRecords === 0 ? 0 : ((currentPage - 1) * size) + 1;
    const endRange = totalRecords === 0 ? 0 : Math.min(currentPage * size, totalRecords);

    const columns = [
        {
            title: 'Policy/Document Name',
            sorter: true,
            width: 200,
            dataIndex: 'policiesName',
        },
        {
            title: 'File',
            sorter: false,
            width: 200,
            render: (text, record) => (
                <a href="#" onClick={e => {
                    e.preventDefault();
                    if (typeof fileDownload === 'function') {
                        fileDownload(record?.id, record?.id, "POLICY_DOCUMENT", record?.fileName);
                    }
                }} title={record?.fileName}>
                    <i className='fa fa-download'></i> {record?.fileName}
                </a>
            )
        },
        {
            title: 'Action',
            width: 100,
            render: (text, record) => (
                <div className="dropdown">
                    <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <i className="las la-bars"></i>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right">
                        <a className="dropdown-item" href="#" onClick={e => {
                            e.preventDefault();
                            setChatbotMessage(record);
                            setShowForm(true);
                        }}>
                            <i className="fa fa-pencil m-r-5"></i> Edit
                        </a>
                        <a className="dropdown-item" href="#" onClick={e => {
                            e.preventDefault();
                            deleteRecord(record);
                        }}>
                            <i className="fa fa-trash-o m-r-5"></i> Delete
                        </a>
                    </div>
                </div>
            )
        },
    ];

    return (
        <div className="page-container content container-fluid">
            <div className="tablePage-header">
                <div className="row pageTitle-section">
                    <div className="col">
                        <h3 className="tablePage-title">OpenAI Policy Document</h3>
                    </div>
                    <div className="mt-2 float-right col-auto ml-auto">
                        {verifyOrgLevelEditPermission("Module Setup Chatbot") && data.length === 0 && (
                            <a
                                href="#"
                                className="btn apply-button btn-primary"
                                onClick={() => setShowForm(true)}
                            >
                                <i className="fa fa-plus" /> Add
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="mt-3 mb-3 table-responsive">
                        {verifyOrgLevelViewPermission("Module Setup Chatbot") ? (
                            <Table
                                id='Table-style'
                                className="table-striped"
                                pagination={{
                                    total: totalRecords,
                                    showTotal: () => `Showing ${startRange} to ${endRange} of ${totalRecords} entries`,
                                    showSizeChanger: true,
                                    onShowSizeChange: pageSizeChange,
                                    itemRender: itemRender,
                                    pageSizeOptions: [10, 20, 50, 100],
                                    current: currentPage,
                                    defaultCurrent: 1,
                                    pageSize: size
                                }}
                                style={{ overflowX: 'auto' }}
                                columns={columns}
                                dataSource={data}
                                onChange={onTableDataChange}
                            />
                        ) : (
                            <AccessDenied />
                        )}
                    </div>
                </div>
            </div>

            <Modal enforceFocus={false} size={"md"} show={showForm} onHide={hideForm}>
                <Modal.Header closeButton>
                    <h5 className="modal-title">{chatbotMessage ? 'Edit' : 'Add'} Policy Document</h5>
                </Modal.Header>
                <Modal.Body>
                    <ChatbotDocsForm updateList={updateList} chatbotMessage={chatbotMessage} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AIChatbotDocument;