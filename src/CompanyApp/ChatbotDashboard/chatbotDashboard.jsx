import React, { Component } from 'react';
import Service from './service';
import { verifyOrgLevelViewPermission } from '../../utility';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';

const service = new Service();
export default class ChatbotDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: [],
            frequentlyCount: [],
            successFailedCount: [],
            chatHistory: [],
            userHistory: [],
            selectedUser: null,
        }
        this.chartRef = React.createRef();
    }
    componentDidMount() {
        this.fetchList();
        this.getFrequentlyCount1();
        this.getSuccessFailedCount();
        this.getChatHistory();
    }
    fetchList = () => {
        service.fetchList()
            .then(user_data => {
                this.setState({ userCount: user_data });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    getFrequentlyCount1 = () => {
        service.getFrequentlyCount()
            .then(intent_data => {
                this.setState({ frequentlyCount: intent_data });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    getSuccessFailedCount = () => {
        service.getSuccessFailedCount()
            .then(status_data => {
                this.setState({ successFailedCount: status_data });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    getChatHistory = () => {
        service.getChatHistory()
            .then(user_info => {
                this.setState({ chatHistory: user_info });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    getUserHistory = (employeeId) => {
        service.getUserHistory(employeeId)
            .then(data => {
                this.setState({ userHistory: data });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    handleUserNameClick = (employeeId) => {
        this.setState({ selectedUser: employeeId }, () => {
            this.getUserHistory(employeeId);
        });
    }

    render() {
        const { userCount, frequentlyCount, successFailedCount, chatHistory, userHistory, selectedUser } = this.state;
        const firstUserCount = userCount.slice(0, 10);
        const firstFrequentlyCount = frequentlyCount.slice(0, 10);
        const firstSuccessFailedCount = successFailedCount.slice(0, 10);
        const firstChatHistory = chatHistory.slice(0, 100);
        return (
            <div className="insidePageDiv">
                <div className="page-containerDocList content container-fluid">
                {verifyOrgLevelViewPermission("Reports Chatbot Dashboard") && <div>
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">HRMS Chatbot Dashboard</h3>
                            </div>
                        </div>
                    </div>
                
                <div className="">
                    <div className="row">
                        <div className="col-md-4 ">
                            <div className="chatBot-table">
                                <h4>Login History</h4>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>User Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {firstUserCount.map(item => (
                                            <tr key={item.day} className="table-row">
                                                <td className="table-column">{item.day}</td>
                                                <td className="table-column">{item.user_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-4 ">
                            <div className="chatBot-table">
                                <h4>Frequently Asked Intents with Count</h4>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Intent Name</th>
                                            <th>Intent Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {firstFrequentlyCount.map(item => (
                                            <tr key={item.intent_name} className="table-row">
                                                <td className="table-column">{item.intent_name}</td>
                                                <td className="table-column">{item.intent_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-4 ">
                            <div className="chatBot-table">
                                <h4 class="panel-heading">Success & Fail Count</h4>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Status Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {firstSuccessFailedCount.map(item => (
                                            <tr key={item.status} className="table-row">
                                                <td className="table-column">{item.status}</td>
                                                <td className="table-column">{item.status_count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="row">
                        <div className="mb-3 col-md-3">
                            <div className="chatBot-table">
                                <h4>Chat History</h4>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>UserName</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {firstChatHistory.map(item => (
                                            <tr key={item.emailid}
                                                className="table-row"
                                                onClick={() => this.handleUserNameClick(item.emailid)}
                                            >
                                                <td className="table-column" >{item.user_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {selectedUser && (
                            <div class="col-md-9">
                                <div className="chatBot-table">
                                    <h4>{userHistory.length > 0 ? userHistory[0].user_name : ''}</h4>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>User Input</th>
                                                <th>Intent Name</th>
                                                <th>Bot Response</th>
                                                <th>Status</th>
                                                <th width="120px">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userHistory.map(item => (
                                                <tr key={item.id} className="table-row">
                                                    <td className="table-column">{item.user_input}</td>
                                                    <td className="table-column">{item.intent_name}</td>
                                                    <td className="table-column">{item.bot_reply}</td>
                                                    <td className="table-column">{item.status}</td>
                                                    <td className="table-column">{item.timestamp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </div>}
                {!verifyOrgLevelViewPermission("Reports Chatbot Dashboard") && <AccessDenied></AccessDenied>}
                </div>
            </div>
        );
    }
}