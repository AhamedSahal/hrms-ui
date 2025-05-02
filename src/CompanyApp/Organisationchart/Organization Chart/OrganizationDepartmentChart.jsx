import React, { Component } from 'react';
import { toast } from 'react-toastify';
import OrganizationalChart from "./OrgChart";
import { getOwnerDepartment } from "../../Employee/service";
import * as htmlToImage from 'html-to-image';
import { Button, Dropdown, Menu } from "antd";
import { verifyOrgLevelViewPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { PictureOutlined } from '@ant-design/icons';


export default class DepartmentChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ownersDepartment: [],
        };
        this.chartContainerRef = null;
    }
    componentDidMount = () => {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Organize Organization Chart")) {
            getOwnerDepartment()
                .then((res) => {
                    if (res.status === 'OK') {
                        this.setState({
                            ownersDepartment: res.data,
                        });
                    } else {
                        console.log("Error :" + res.error);
                    }
                })
                .catch((error) => {
                    console.log("Error :" + error);
                });
        }
    };

    convertData(originalData) {
        const convertedData = [];
        const departmentIds = {};

        originalData.forEach((item) => {
            const {
                name,
                id,
                employeeId,
                team,
                userType,
                parentId,
                levels,
                deptId,
                deptName,
                positionName,
            } = item;

            if (userType === "Company") {
                convertedData.push({
                    name,
                    id,
                    employeeId,
                    team,
                    userType,
                    parentId,
                    levels,
                    deptId,
                    deptName,
                    positionName,
                    type: "Department",
                });
            } else if (userType === "Owner") {
                convertedData.push({
                    name,
                    id,
                    employeeId,
                    team,
                    userType,
                    parentId,
                    levels,
                    deptId,
                    deptName,
                    positionName,
                    type: "Department",
                });
            } else if (userType === "Employee" && levels === 2) {
                const ownerKey = parentId + deptName;
                if (!departmentIds[ownerKey]) {
                    departmentIds[ownerKey] = {
                        id: Object.keys(departmentIds).length + 1000001,
                        parentId,
                    };

                    convertedData.push({
                        name: deptName,
                        id: departmentIds[ownerKey].id,
                        employeeId: "",
                        team: "",
                        userType: "Department",
                        parentId,
                        levels: 2,
                        deptId: 0,
                        deptName: "",
                        positionName: "",
                        type: "Department",
                    });
                }
                convertedData.push({
                    name,
                    id,
                    employeeId,
                    team,
                    userType,
                    parentId: departmentIds[ownerKey].id,
                    levels,
                    deptId,
                    deptName,
                    positionName,
                    type: "Department",
                });
            } else {
                convertedData.push({
                    name,
                    id,
                    employeeId,
                    team,
                    userType,
                    parentId,
                    levels,
                    deptId,
                    deptName,
                    positionName,
                    type: "Department",
                });
            }
        });

        return convertedData;
    }

    handleDownloadClick = () => {
        const chartContainer = this.chartContainerRef;
        if (chartContainer) {
            htmlToImage
                .toPng(chartContainer)
                .then((dataUrl) => {
                    const link = document.createElement("a");
                    link.download = "org-chart-dept.png";
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error) => {
                    console.error("Error converting SVG to PNG:", error);
                });
        }
    };

    setChartContainerRef = (ref) => {
        this.chartContainerRef = ref;
    };

    render() {
       
        const convertedData = this.convertData(this.state.ownersDepartment);
        const downloadMenu = (
            <Menu>
                <Menu.Item key="png" onClick={() => this.handleDownloadClick()}>
                    <PictureOutlined /> PNG Format
                </Menu.Item>
            </Menu>
        );
        return (
            <>
                <h2>Organization Department Chart</h2>
                {verifyOrgLevelViewPermission("Organize Organization Chart") &&
                    <>
                        <div className="chart-controls" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                            <Dropdown overlay={downloadMenu} >
                                <Button type="primary">
                                    Download Chart <i type="down" />
                                </Button>
                            </Dropdown>
                            <Button type="default" onClick={this.fetchList}>
                                <i type="reload" /> Refresh Data
                            </Button>
                        </div>
                        <div id="org-chart-container" style={{ width: '100%', overflow: 'auto' }}>
                            <OrganizationalChart
                                data={convertedData}
                                setChartContainerRef={(ref) =>
                                    (this.chartContainerRef = ref)}>
                            </OrganizationalChart>
                        </div>
                    </>}{!verifyOrgLevelViewPermission("Organize Organization Chart") && <AccessDenied></AccessDenied>}
                </>
        );
    }
}
