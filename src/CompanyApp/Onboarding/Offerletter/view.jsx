import React, { Component } from 'react'; 
import jsPDF  from 'jspdf'; 
import html2canvas from "html2canvas"; 
import { getCurrency, getLogo, getReadableDate} from '../../../utility';
export default class OfferLetterViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logo: getLogo(),
            offerletter: props.offerletter || {
                id: 0,
                candidatename: "",
                candidateemailid: "",
                candidateposition: "",
                offerletterdate: "",
                joiningdate: "",
                salary: "",
                basicsalary: "",
                allowances: "",
                workplace: "",
                worktype: "",
                weekworkhours: "",
                workingdays: "",
                weekoffdays: "",
                probationdays: "",
                noticeperiod: "",
                businesslanguages: ""
             
            }
        };
    }
    getNumberToWords(number) {
        var digit = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var elevenSeries = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var countingByTens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        var shortScale = ['', 'thousand', 'million', 'billion', 'trillion'];
        number = number.toString(); number = number.replace(/[\, ]/g, ''); if (number != parseFloat(number)) return 'not a number'; var x = number.indexOf('.'); if (x == -1) x = number.length; if (x > 15) return 'too big'; var n = number.split(''); var str = ''; var sk = 0; for (var i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += elevenSeries[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += countingByTens[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += digit[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += shortScale[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != number.length) { var y = number.length; str += 'point '; for (var i = x + 1; i < y; i++) str += digit[n[i]] + ' '; } str = str.replace(/\number+/g, ' '); return str.trim() + " " + getCurrency() ;
        return number;

    }

    generatePDF= () => {  
        const input = document.getElementById('test');
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
			
		    pdf.save("OfferLetter"+ Date().toLocaleString() +".pdf");
        });
	};
    render() {
        
        const { logo,offerletter } = this.state;  
        const {  offerletterdate,salary,candidatename,candidateemailid,candidateposition,joiningdate,basicsalary,allowances,workplace,weekworkhours,workingdays,worktype,weekoffdays,annualleave,probationdays,noticeperiod,businesslanguages,signatureholdername,signatureholderposition,candidateId,offerletterId } = this.state.offerletter;
        const netSalaryInWords = this.getNumberToWords(salary);
        return (
           
                 
            <div className="card" style={{ display: "flex", flexWrap: "wrap","fontSize" : "14px"}}>
                <div className="card-body" id="test" >
                <div className="row" >
                <div style={{height: "25px",width:"10%"}}>
                    <img className="img-fluid" src={logo} alt="responsive image" />
                   </div>
                    <p align="right" ><p style={{ "fontWeight" : "bolder","fontSize" : "18px"}} >Offer Id & Candidate Id:</p> {offerletterId} & {candidateId} </p>
                </div>
                <p  align="center" style={{ "fontWeight" : "bolder","fontSize" : "30px"}}><u>OFFER LETTER</u></p><br/><br/>
               <p align="justify" style={{   "fontSize" : "18px","paddingBottom" : "75px" }}>
                Date:  
                {new Intl.DateTimeFormat('en-GB', { 
                    month: 'long',day: '2-digit',year: 'numeric', 
                }).format(new Date(offerletterdate))} <br/> 
                <span style={{ "fontWeight" : "bolder" }}>{ candidatename }</span>
                 <br/> { candidateemailid } <br/><br/>
                Dear <span style={{ "fontWeight" : "bolder" }}>{ candidatename }</span>, <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Private and Confidential</u></span><br/>
                <span style={{ "fontWeight" : "bolder" }}>Offer of position at { offerletter.company?.name } (The Firm)</span> <br/><br/>
                We would like to confirm to you our offer of employment starting from &nbsp;
                 <span style={{ "fontWeight" : "bolder" }}>{new Intl.DateTimeFormat('en-GB', { 
                    month: 'long',day: '2-digit',year: 'numeric', 
                }).format(new Date(joiningdate))}</span> . This letter 
                now confirms the offer of a position as: &nbsp;   
                <span style={{ "fontWeight" : "bolder" }}>{ candidateposition }</span><br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Monthly Salary : </u></span>
                &nbsp;The total salary for this role will be 
                 <span style={{ "fontWeight" : "bolder" }}> AED { salary }/- ({ netSalaryInWords } only)</span> per month. The breakup of your salary will be as follows. <br/><br/>
                    Basic Salary &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AED { basicsalary }<br/>
                 <u>Allowances  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; AED { allowances }</u><br/>
                 <b>Total Monthly Pay &nbsp; AED { salary }</b><br/><br/>
                 <span style={{ "fontWeight" : "bolder" }}><u>Place of Work: </u></span>&nbsp; You place of work will be <b>{ workplace } </b>. Your place of work is subject to change depending 
                  on the Firm’s and Client’s requirement.<br/> <br/> 
                  <span style={{ "fontWeight" : "bolder" }}><u>Work Permit </u></span> 
                  &nbsp;The Firm will pay all costs relating to acquiring your legal work permit in the UAE. <br/><br/>
                  <span style={{ "fontWeight" : "bolder" }}><u> Contract Duration </u></span>&nbsp; This contract is for a duration of 3 years from the date of commencement. This 
                contract shall be renewed automatically unless either of the two parties involved, the employer or employee, 
                notifies the other in writing of his/her wish to terminate this contract in accordance with the conditions 
                mentioned in this contract. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Woking Hours:</u></span>&nbsp;You are recruited to work on a { worktype } basis. Your weekly working hours will be { weekworkhours } per week. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Working Week & Weekly Off Days:</u></span>&nbsp; You will work { workingdays } with a 1-hour lunch break, 
                { weekoffdays } will be your weekly off days.<br/><br/>  
                <span style={{ "fontWeight" : "bolder" }}><u>Leave entitlements:</u></span> <br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Annual leave:</u></span>&nbsp;You will be entitled for { annualleave }  calendar days of annual leave for every completed year of 
                service. You can use your accrued leave after completion of probationary period. All annual leave should 
                be used in the year of accrual and cannot be carried over or encashed. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Sick leave:</u></span>&nbsp;On completion of your probation period, you will be eligible for paid sick leave. The 
                entitlement is as per the UAE Labour Law. Please note, you should provide evidence of your illness 
                warranting sick leave by an official medical certificate. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Statutory Holidays:</u></span>&nbsp;You will be entitled to statutory holidays for the private sector as decreed by the 
                Government of UAE <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Probationary Employment:</u></span>&nbsp;We will regard the first { probationdays } days as a review period that will enable us 
                to see your progress and performance as a { offerletter.company?.name } employee, and for you to decide whether { offerletter.company?.name } is right 
                for you. During the Employee’s period of probationary employment, either the Firm or the Employee may 
                terminate the contract by giving 14 days written notice, or by the Firm paying the Employee 14 days’ pay 
                in lieu of notice. If the employee is moving to new job within UAE, the employee is required to give 30 
                days’ notice as per the UAE labour law.<br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Notice Period:</u></span>&nbsp;The employee or the Firm may terminate this contract by giving { noticeperiod } days written 
                notice to the other party. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>End of Service Benefits:</u></span>&nbsp; You will be eligible for end of service gratuity as per UAE labour law<br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Termination:</u></span>&nbsp;The Firm may terminate this Contract immediately (including imposition of suitable 
                penalties) if the Employee commits any act of gross misconduct which may detrimentally affect the Firm 
                or its client, including but not limited to an act of dishonesty, fraud, wilful disobedience, approaching 
                potential companies during the term of employment or breach of duty that wilfully, persistently or 
                materially breaches this Contract. <br/><br/>
                On termination of this Contract, the Employee must return to the Firm & Client all tangible property of the 
                Firm or the Client including but not limited to all books, documents, sketches, plans, drawings, paper, 
                materials, client lists and contact details, computer disks, stationery, cards and keys held by the Employee 
                or under the Employee’s control. All software codes, documents, standards, templates, plans, technical 
                material, etc, developed by the Employee during their employment with the Firm remains the property of 
                the Firm and must not be copied, reproduced or transferred for future use without the consent of the 
                Managing Director of the Firm. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Business Languages:</u></span>&nbsp; Only { businesslanguages } are recognized business languages at the Firm and at the 
                Client site. All business communications within the team verbally or in writing should be in { businesslanguages } <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Private work:</u></span>&nbsp; Employees of the Firm must not attempt to perform any work privately for any of the 
                Firm’s past or present clients during working hours without the express approval and permission of the Firm’s Managing Director.<br/>
                Employees must not undertake trade or work that is in conflict with the interests of the Firm. You may not 
                disclose information of a confidential nature to unauthorised persons within or outside the Firm or to the 
                Client, during or after your employment with the Firm. By signing this agreement, you agree to comply 
                with the terms of the Firm and the Clients Business Conduct and Ethic’s Policy, which may be amended 
                from time to time. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Copyright:</u></span>&nbsp;Copyright in all work created by the Employee in the course of his/her employment by the 
                Firm will be owned by the Firm. This includes copyright in any works created or to be created by the 
                Employee during the Employee’s hours of work; while performing duties for or on behalf of the Firm in 
                the course of the Employee’s employment; while on the Firm’s premises or using the Firm’s facilities, 
                equipment or computer systems; or using confidential information of the Firm that came to the Employee’s 
                attention in connection with the Employee’s employment. 
                The Employee assigns to the Firm all existing and future copyright works created by the Employee. Copies 
                of any documents for personal use may only be taken with the express approval of the Managing Director. 
                Any copies taken must retain the acknowledgement of copyright by the Firm. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Confidentiality & Non-Disclosure :</u></span>&nbsp; By entering into this Contract, the Employee agrees and undertakes 
                that at all times during and after the termination of this Agreement the Employee will not disclose any 
                Confidential Information to any person other than in the proper performance of the Employee’s duties, as 
                required by law or with the prior written consent of the Firm; and the Employee will not at any time during 
                or after the Employee’s employment with the Firm use any Confidential Information for the benefit of any 
                person except where authorised to do so by the Firm. This includes, but not limited to, copying any 
                materials to private commuters or media, emailing office files in electronic format to private email accounts 
                and using private email accounts to communicate with clients must be prohibited. 
                Upon the termination of the Employee’s employment with the Firm or immediately upon the request of the 
                Firm, the Employee will deliver to the Firm all Confidential Information which is in the Employee’s control 
                and which is physically capable of delivery; and destroy any Confidential Information which is stored in 
                any electronic, magnetic or optical form but which is not capable of delivery to the Firm so that it cannot 
                be recovered or in any way reconstructed or reconstituted. 
                The obligations in the terms shall lapse in relation to any of the Confidential Information which comes into 
                the public domain other than through a wrongful act of the Employee. 
                Confidential Information means any information in respect to the Firm’s / Client’s Business which is not 
                in the public domain and includes, but is not limited to, any information, document, book, paper, manual, 
                account, sketch, drawing, plan, process, trade secret, know how, data, research, model, forecast, code, 
                design, concept not reduced to material form, agreement with a third party, business plan, client list, client 
                and personnel information, or any other information intended to be kept out of the public domain which 
                comes to the notice of the Employee in the course of the Employee’s employment or is generated by the 
                Employee in the course of performing the Employee’s obligations. 
                The employee will also keep all client information confidential and will not disclose any client information 
                to any party during and after the termination of this agreement. Any documents or materials whether in 
                hard or soft copies must never be taken out of the Clients office premises neither transmitted to any third 
                party by any means. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Restraints:</u></span>&nbsp;  During the employment and after completion of the employment with the Firm, the Employee 
                must not, without the Firm’s prior written consent approach, solicit, encourage or entice away or attempt 
                to approach, solicit, encourage or entice away any person who is a client of the Firm and who the Employee 
                had dealings with or knowledge of during the Employee’s employment with the Firm. The Employee must 
                not approach, solicit, encourage or entice away or attempt to approach, solicit, encourage or entice away 
                any person who is an employee, contractor or agent of the Firm, for the twelve month period commencing 
                from the date that the notice period commences or the payment in lieu of notice is made. <br/>
                Each element of the restraints operates to the extent to which it is deemed reasonable by any court. In case 
                of any breach, the employee shall be liable to pay for the damage incurred by the Firm. Part of the 
                remuneration and benefits provided to the Employee by the Firm is specifically referable to these 
                obligations and your agreement to these terms is an acknowledgement that these terms are reasonable and 
                goes no further than is necessary to protect the interests and Confidential Information of the Firm. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Direct Employment By Client :</u></span>&nbsp; 
                During the period of this contract and 2 years subsequent to completion of the contract the employee shall 
                not work directly for the client without the prior written consent of the Managing Director of the Firm. 
                Direct employment includes accepting an offer and working on Clients visa or accepting an offer of a third 
                party and working directly for a Client of the Firm. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Social Media:</u></span>&nbsp; 
                Employees of the Firm shall correctly represent themselves on any social media sites including their correct 
                job title, period of employment etc with the Firm and avoid any misrepresentation. Employees shall be 
                cautious of posting any objectionable content on social media in line with UAE Laws. <br/><br/>
                <span style={{ "fontWeight" : "bolder" }}><u>Other Clauses:</u></span>&nbsp; 
                
                Your appointment is subject the receipt of satisfactory employment references and the receipt of proof of 
                educational and professional qualifications. <br/><br/>
                In making this offer we trust your time here will be as beneficial to your career development as it will be 
                productive for { offerletter.company?.name }. <br/><br/>
                The contents in this Contract of Employment are to be kept in the strictest of confidence, and must not be 
                discussed with any employees from this Firm or related to this Firm, and any parties that may use the 
                information in this Contract for the benefit of themselves, or against the Employer. <br/><br/>
                This contract is valid and deemed to be in force from the start of employment with the Firm. We look 
                forward to welcoming you to { offerletter.company?.name }.<br/><br/>
                Your's faithfully,<br/>
                <img style={{maxWidth: "200px"}}  src={offerletter.signatureholderId?offerletter.signatureholderId:""}/>
                </p>
            </div>
            <div><button className="btn btn-primary" onClick={this.generatePDF}>Export To PDF</button></div> 
            </div>
             )
        
    }
}
