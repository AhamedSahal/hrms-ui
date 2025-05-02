import React, { Component } from 'react'; 
import jsPDF  from 'jspdf'; 
import html2canvas from "html2canvas";
import { getCurrency, getLogo, getReadableDate } from '../../../utility';
export default class JobDescriptionViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logo: getLogo(),
            jobdescription: props.jobdescription || {
                id: 0 ,
                name: "",  
                departmentId: 0,
                gradesId: 0,
                branchId: 0,
                jobTitlesId: 0,
                repToId: 0,
                jobTitles:{
                    id: 0,
                },
                department :{
                    id: 0 
                },
                grades :{
                    id: 0 
                },
                branch: {
                    id: 0,
                },
                repTo: {
                    id: 0,
                },
                jobpurpose: "",
                noofreports: "",
                financialParameters: "",
                externalInterfaces: "",
                internalInterfaces: "",
                keyAccResp: "",
                qualiExper: "",
                keyskills: "",
                addReq: "",
                disclaimer: "" 
            }
        };
    }
    generatePDF= () => {  
        const input = document.getElementById('card');
		html2canvas(input).then(function(canvas) {
			canvas.getContext('2d');
            var imgWidth = canvas.width;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var top_left_margin = 15;
            var PDF_Width = imgWidth+(top_left_margin*2);
            var PDF_Height = (PDF_Width*2)+(top_left_margin*2);
            var totalPDFPages = Math.ceil(imgHeight/PDF_Height)-1;
			var imgData = canvas.toDataURL("image/png", 1);
			var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
		    pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin,imgWidth,imgHeight);
			
			
			for (var i = 1; i <= totalPDFPages; i++) { 
				pdf.addPage( [PDF_Width, PDF_Height],'p');
				pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),imgWidth,imgHeight);
			}
			
		    pdf.save("JobDescription"+ Date().toLocaleString() +".pdf");
        });
	};
    render() {
        const { logo } = this.state;
        const { jobdescription } = this.state;
        const{  name,jobpurpose,noofreports,financialParameters,externalInterfaces,internalInterfaces,keyAccResp,qualiExper,keyskills,addreq,disclaimer } = this.state.jobdescription;
        return (
           
                      
            <div className="card" >
                <table className="table table-bordered" id="card">
                <div className="card-body">
                <div className="row">
                    <div className="col-sm-6 m-b-20">
                        <img src={logo} className="inv-logo pslogo"  />
                    </div>
                </div>
                <h3 className="jd-title" align="center" style={{ fontFamily:'Lucida Sans',color:"#6D7B8D"}}>JOB DESCRIPTION</h3>
                    <div className="row">
                        <div className="col-sm-12">
                            <div>
                            <table className="table table-bordered" style={{"borderWidth":"2px", 'borderColor':"#000000", 'borderStyle':'solid'}}>
                                    <tr>
                                        <td className="block-example border border-dark" colSpan={"4"} align="center" style={{"background-color":"#808080",color:"white"}} ><strong> POSITION INFORMATION </strong></td>
                                    </tr>
                                    <tbody> 
                                        <tr >
                                            <td className="block-example border border-dark" bgcolor="#E5E4E2" ><strong>Job Code:</strong></td>
                                            <td className="block-example border border-dark">
                                               { name }
                                            </td>
                                            <td className="block-example border border-dark" bgcolor="#E5E4E2"><strong>Job Title:</strong></td>
                                            <td className="block-example border border-dark">{jobdescription.jobTitles?.name} </td>
                                        </tr>
                                        <tr >
                                            <td className="block-example border border-dark" bgcolor="#E5E4E2"><strong>Department:</strong></td>
                                            <td className="block-example border border-dark">{jobdescription.department?.name}</td>
                                            <td className="block-example border border-dark" bgcolor="#E5E4E2"><strong>Reporting To:</strong></td>
                                            <td className="block-example border border-dark">{jobdescription.approvalRequiredBy?.name} </td>
                                        </tr>
                                        <tr >
                                            <td className="block-example border border-dark" bgcolor="#E5E4E2"><strong>Grade:</strong></td>
                                            <td className="block-example border border-dark">{jobdescription.grades?.name}</td>
                                            <td className="block-example border border-dark" bgcolor="#E5E4E2"><strong>Location:</strong></td>
                                            <td className="block-example border border-dark">{jobdescription.branch?.name} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div>
                                <table className="table table-bordered" style={{"borderWidth":"2px", 'borderColor':"#000000", 'borderStyle':'solid'}}>
                                    <tr>
                                        <td className="block-example border border-dark" colSpan={"4"} align="center" style={{backgroundColor:"#808080",color:"white"}} ><strong>JOB PURPOSE</strong></td>
                                    </tr>
                                    <tbody> 
                                        <tr className="col-md-12">
                                            <td className="block-example border border-dark"> {jobpurpose} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div>
                                <table className="table table-bordered" style={{"borderWidth":"2px", 'borderColor':"#000000", 'borderStyle':'solid'}}>
                                    <tr>
                                        <td className="block-example border border-dark" colSpan={"4"} align="center" style={{backgroundColor:"#808080",color:"white"}} ><strong> DIMENSIONS </strong></td>
                                    </tr>
                                    <tbody> 
                                        <tr >
                                            <td className="block-example border border-dark"><strong>No of Reports:</strong></td>
                                            <td className="block-example border border-dark">{noofreports}</td>
                                            <td className="block-example border border-dark"><strong>Financial Parameters:</strong></td>
                                            <td className="block-example border border-dark">{financialParameters}</td>
                                        </tr>
                                        <tr >
                                            <td className="block-example border border-dark"><strong>External Interface(s):</strong></td>
                                            <td className="block-example border border-dark">
                                        	{externalInterfaces}
                                            </td>
                                            <td className="block-example border border-dark"><strong>Internal Interface(s):</strong></td>
                                            <td className="block-example border border-dark">{internalInterfaces}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div>
                                <table className="table table-bordered" style={{"borderWidth":"2px", 'borderColor':"#000000", 'borderStyle':'solid'}}>
                                    <tr>
                                        <td className="block-example border border-dark" colSpan={"4"} align="center" style={{backgroundColor:"#808080",color:"white"}} ><strong>KEY ACCOUNTABILITIES AND RESPONSIBILITIES</strong></td>
                                    </tr>
                                    <tbody> 
                                        <tr >
                                            <td className="block-example border border-dark"> 
                                            {keyAccResp}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div>
                                
                                <table className="table table-bordered" style={{"borderWidth":"2px", 'borderColor':"#000000", 'borderStyle':'solid'}}>
                                    <tr>
                                        <td className="block-example border border-dark" colSpan={"4"} align="center" style={{backgroundColor:"#808080",color:"white"}} ><strong> JOB REQUIREMENTS </strong></td>
                                    </tr>
                                    <tbody> 
                                        <tr >
                                            <td className="block-example border border-dark"><strong bgcolor="#E5E4E2">Minimum Qualifications and Experience:</strong>
                                            <p>{qualiExper}
                                            </p></td>
                                        </tr>
                                        <tr >
                                            <td className="block-example border border-dark"><strong>Key Skills and Competencies:</strong> 
                                            <p>{keyskills}
                                            </p></td>
                                           
                                        </tr>
                                        <tr >
                                            <td className="block-example border border-dark"><strong>Additional Requirements:</strong>
                                            <p> {addreq}
                                            </p></td>
                                         
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div>
                                <table className="table table-bordered" style={{"borderWidth":"2px", 'borderColor':"#000000", 'borderStyle':'solid'}}>
                                    <tr>
                                        <td className="block-example border border-dark" colSpan={"4"} align="center" style={{backgroundColor:"#808080",color:"white"}} ><strong> DISCLAIMER </strong></td>
                                    </tr>
                                     
                                    <tbody> 
                                        <tr >
                                            <td className="block-example border border-dark"> 
                                            {disclaimer}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    </div>
                </div>
                </table>
                <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div>
                
            </div>
             
        )
    }
}
