import React, { Component } from "react";
import { toast } from 'react-toastify';
import { Button, Spin, Dropdown, Menu} from "antd";
import { verifyOrgLevelViewPermission } from "../../../utility";
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";
import { getMultiEntityCompanyList } from "../../../AdminApp/Company/service";
import CompanyOrganizationalChart from "./CompanyOrgChart";
import * as htmlToImage from 'html-to-image';
import { PictureOutlined } from '@ant-design/icons';


export default class OrganizationCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companies: [],
    };
    this.chartRef = null;
  }
  
  componentDidMount = () => {
    this.fetchList();
  }
  
  fetchList = () => {
    if(verifyOrgLevelViewPermission("Organize Organization Chart")){      
      getMultiEntityCompanyList()
        .then((res) => {
          if (res.status === 'OK') {            
            this.setState({
              companies: res.data,
            });
          } else {
            toast.error("Failed to load company data");
          }
        })
        .catch((error) => {
          toast.error("Failed to load company data");
        });
    }
  };

  handleDownloadClick = () => {
    setTimeout(() => {
      if (this.chartRef) {
        htmlToImage.toPng(this.chartRef)
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download = "org-chart-company.png";
            link.href = dataUrl;
            link.click();
          })
          .catch((error) => {
            console.error("Error converting SVG to PNG:", error);
          });
      }
    }, 1000); // Wait 1 second to ensure rendering
  };
  

      setChartRef = (ref) => {
        this.chartRef = ref;
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
        <h2>Multi Entity Organization Chart</h2>
        {verifyOrgLevelViewPermission("Organize Organization Chart") && this.state.companies.length > 0 ? (
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
            <CompanyOrganizationalChart data={this.state.companies} setChartRef={(ref) => (this.chartRef = ref )}/>
            </div>
          </>
        ) : (
          <AccessDenied />
        )}
      </>
    );
  }
}