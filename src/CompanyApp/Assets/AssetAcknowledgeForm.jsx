import React, { Component, } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from 'react-toastify';
import { getLogo} from '../../utility';
import {  getAssetLatestHistory, getEmpEntity } from './service'; 
import {  verifyViewPermission,verifyOrgLevelEditPermission } from '../../utility'


export default class AssetAcknowledgeForm extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      Assets: props.AssetAcknowledge || {},
      AssetLatestHistory:[],
      logo: getLogo(),
      entityOrCompanyName:'',
    };
  }

   componentDidMount(){
          this.getEmpEntity();
          this.getAssetLatestHistory(this.state.Assets.category?.id,this.state.Assets.assets?.id,this.state.Assets.serialno)
      
      }
  
     getEmpEntity(){
      verifyViewPermission("Manage Assets") || verifyOrgLevelEditPermission("Manage Assets") &&  getEmpEntity(this.state.Assets.employee.id).then(res => {
        if (res.status == "OK") {
           
             this.setState({
              entityName: res.data.entityName,
              entityLogo: res.data.entityLogo,
              companyName: res.data.companyName
             });
          
        } else {
            toast.error(res.message);
        }
    }).catch(err => {
        toast.error("Error while getting Employee Entity Details");
    })
     }

      getAssetLatestHistory(categoryName,assetName,serialno){
          
         verifyViewPermission("Manage Assets") || verifyOrgLevelEditPermission("Manage Assets") &&  getAssetLatestHistory(categoryName,assetName,serialno).then(res => {
              if (res.status == "OK") {
              
                  this.setState(
                      {
                          AssetLatestHistory:res.data
                      }
                  )
                
              } else {
                  toast.error(res.message);
              }
          }).catch(err => {
              toast.error("Error while getting Asset History");
          })
      }
  

  generatePDF = async () => {

  
    const input = document.getElementById('card');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      html2canvas(input, { scale: 1.5, useCORS: true, logging: false }).then((canvas) => {
      
        const imgData = canvas.toDataURL("image/jpeg", 0.7); 
  
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(
          `Asset_Acknowledgment_Receipt_${new Date().toISOString().slice(0, 10)}.pdf`
        );
      }).catch((error) => {
        console.error("PDF generation failed:", error);
      });
  
    } catch (error) {
      console.error("Error during PDF generation:", error);
    }
  };
  
 

             
 

  render() {
    const { assets, serialno, category, assignDate, assignedEmp, employee,  } = this.state.Assets;

    return (
      <div >
                     <div id="card" class="border border-dark p-3" style={{ width: "210mm", padding: "20mm", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: "1.6", backgroundColor: "white" }}>
                      <div style={{ padding:"40px"}}>
                  

                      <div className="row align-items-center mb-4 px-4 py-2">
                        
                        {/* Left Side - Entity Name */}
                        <div className="col text-start">
                          <p className="fs-5 fw-semibold text-secondary">
                            <span>{this.state.entityName!=''||null? this.state.entityName:this.state.companyName}</span>
                          </p>
                        </div>

                        {/* Right Side - Logo */}
                        <div className="col-auto text-end">
                          <img
                            src={this.state.entityLogo != null ? `data:image/jpeg;base64,${this.state.entityLogo}` : this.state.logo}
                            className="inv-logo pslogo"
                            alt={this.state.companyName}
                          />
                        </div>

                      </div>


                       <h2 style={{ textAlign: "center", marginTop: "0px", marginBottom: "80px" }}>Asset Acknowledgment Receipt</h2>
                       <p style={{ textAlign: "right", fontSize: "16px" }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
            
                       <p style={{ marginTop: "20px", textIndent: "40px", fontSize: "16px" }}>
                        I acknowledge the receipt of the below asset in good condition and accept responsibility for its proper use and maintenance as per company policies.
                       </p>
            
                       <h3 style={{ marginTop: "90px", marginBottom:"30px" }}>Asset Details:</h3>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Asset Name:</strong> {assets.name}</p>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Asset ID/Serial No.:</strong> {serialno}</p>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Asset Category:</strong> {category.name}</p>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Date of Receipt:</strong> {new Date(assignDate).toLocaleDateString('en-GB')}</p>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Comment:</strong> {this.state.AssetLatestHistory.remarks}</p>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Issued By:</strong> {assignedEmp.name}</p>
                       <p style={{textIndent: "40px", fontSize: "16px" }}><strong>  · Issued To:</strong> {employee.name}</p>
            
                       <br /><br />
                      <p style={{fontSize: "16px",  marginTop: "120px" }}><strong>Recipient’s Signature:</strong> {employee.name}</p>
                      <p style={{fontSize: "16px" }}><strong>Issuer’s Signature:</strong> {assignedEmp.name}</p>
                    </div>
                    </div>
                    
                     <button  className="btn btn-primary" style={{marginTop: "20px"}} onClick={()=>{this.generatePDF()}}>
                      Download
                     </button>
                   </div>
               );
  }
}


