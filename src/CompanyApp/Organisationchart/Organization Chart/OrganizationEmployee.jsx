import React, { Component } from "react";
import { toast } from 'react-toastify';
import OrganizationalChart from "./OrgChart";
import { getOwnersEmployee } from "../../Employee/service";
import * as htmlToImage from 'html-to-image';
import { Button , Dropdown, Menu} from "antd";
import { verifyOrgLevelViewPermission } from "../../../utility";
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";
import { PictureOutlined } from '@ant-design/icons';



export default class OrganizationEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ownersEmployee: [],
    };
    this.chartContainerRef = null;
  }
  componentDidMount = () => {
    this.fetchList();
  }
  fetchList = () => {
    if(verifyOrgLevelViewPermission("Organize Organization Chart")){
    getOwnersEmployee()
      .then((res) => {
        if (res.status === 'OK') {
          this.setState({
            ownersEmployee: res.data,
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

  handleDownloadClick = () => {
    const chartContainer = this.chartContainerRef;
    if (chartContainer) {
      const chartWidth = chartContainer.scrollWidth; 
      const chartHeight = chartContainer.scrollHeight; 
  
      chartContainer.style.width = chartWidth + "px";
      chartContainer.style.height = chartHeight + "px"; 
  
      chartContainer.scrollTo(0, 0);
  
      htmlToImage
        .toPng(chartContainer)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "org-chart-emp.png";
          link.href = dataUrl;
          link.click();
  
          chartContainer.style.width = "100%"; 
          chartContainer.style.height = "100%"; 
          chartContainer.scrollTo(0, 0); 
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
    const downloadMenu = (
      <Menu>
        <Menu.Item key="png" onClick={() => this.handleDownloadClick()}>
          <PictureOutlined /> PNG Format
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <h2>Organization Employee Chart</h2>
        {verifyOrgLevelViewPermission("Organize Organization Chart") &&<>
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
                data={this.state.ownersEmployee}
                setChartContainerRef={(ref) =>
                  (this.chartContainerRef = ref)}>
              </OrganizationalChart>
            </div>
      </>}{!verifyOrgLevelViewPermission("Organize Organization Chart") && <AccessDenied></AccessDenied>}
      </>
    );
  }
}