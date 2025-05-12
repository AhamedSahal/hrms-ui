import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import { getCurrency, getLogo, getReadableDate } from '../../../../utility';

const Ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const Tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety", "Hundred"];
const Scale = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion"];

export default class FinalSlipViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finalViewslip: props.finalViewslip || {
                id: 0,
                employeeId: 0,
                resignationDate: "",
                lwd: "",
                doj: "",
                pendingsalary: "",
                noofdays: 0,
                currMonthSalary: "",
                totalamount: "",
                noticePeriod: "",
                Gratuity: "",
                annualLeaveSalary: "",
                otherPayments: "",
                otherPaymentsRemarks: "",
                otherDeductions: "",
                otherDeductionsRemarks: "",
            },
            currency: getCurrency(),
            logo: getLogo()
        };
    }
    convertNumberToWords = (n = 0) => {
        if (n === 0) return "Zero";

        n = ("0".repeat((2 * (n += "").length) % 3) + n).match(/.{3}/g);
        if (n.length > Scale.length) return "Too Large";

        let out = "";
        n.forEach((Triplet, pos) => {
            if (+Triplet) {
                out +=
                    " " +
                    (+Triplet[0] ? Ones[+Triplet[0]] + " " + Tens[10] : "") +
                    " " +
                    (+Triplet.substr(1) < 20
                        ? Ones[+Triplet.substr(1)]
                        : Tens[+Triplet[1]] +
                        (+Triplet[2] ? "-" : "") +
                        Ones[+Triplet[2]]) +
                    " " +
                    Scale[n.length - pos - 1];
            }
        });

        return out.replace(/\s+/g, " ").trim();
    };

    getNumberToWords = (number) => {
        const { currency } = this.state
        const amount = number;
        const integerPart = Math.floor(amount);
        const decimalPart = amount % 1 !== 0 ? Math.round((amount % 1) * 100) : null;
        const integerWords = this.convertNumberToWords(integerPart);
        const decimalWords = decimalPart ? this.convertNumberToWords(decimalPart) : null;
        if (currency === 'AED') {
            return `${integerWords} dirhams ${decimalWords ? ' and ' + decimalWords + ' fils' : ''}`
        } else if (currency === 'INR') {
            return `${integerWords} rupees ${decimalWords ? ' and ' + decimalWords + ' paise' : ''}`
        }
        else if (currency === 'SAR') {
            return `${integerWords} riyal ${decimalWords ? ' and ' + decimalWords + ' halalas' : ''}`

        }
        else if (currency === 'OMR') {
            return `${integerWords} rial ${decimalWords ? ' and ' + decimalWords + ' baisas' : ''}`
        }
        else if (currency === 'QAR') {
            return `${integerWords} riyal ${decimalWords ? ' and ' + decimalWords + ' dirhams' : ''}`
        } else if (currency === 'USD') {
            return `${integerWords} dollar ${decimalWords ? ' and ' + decimalWords + ' cents' : ''}`
        }

    };
    getMonthYear(salaryMonth) {
        let date = salaryMonth + "-01";
        let d = new Date(date);
        return d.toLocaleString("default", { month: "long" }) + '-' + d.getFullYear();
    }
    generatePDF = () => {
        const input = document.getElementById('card');
        html2canvas(input).then(function (canvas) {
            canvas.getContext('2d');
            var imgWidth = canvas.width;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var top_left_margin = 15;
            var PDF_Width = imgWidth + (top_left_margin * 2);
            var PDF_Height = (PDF_Width * 2) + (top_left_margin * 2);
            var totalPDFPages = Math.ceil(imgHeight / PDF_Height) - 1;
            var imgData = canvas.toDataURL("image/png", 1.0);
            var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin, imgWidth, imgHeight);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage([PDF_Width, PDF_Height], 'p');
                pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), imgWidth, imgHeight);
            }
            pdf.save("FinalSettlement" + Date().toLocaleString() + ".pdf");
        });
    };
    render() {
        const { resignationDate, lwd, currentMonthNetSalary, employee, currMonthSalary, annualLeaveSalary, swiftCode, pendingsalary,
            totalamount, noticePeriod, gratuity, noofdays, empid, doj, designation, department, status, otherPayments, otherPaymentsRemarks,
            otherDeductions, otherDeductionsRemarks, pendingsalarydays, currMonthSalarydays, noticepaydays, annualleavedays, gratuitydays,
            empstatus, companyName, companyAddress, bankName, accountNumber, ibanNumber, accountHolderName, createdOn } = this.state.finalViewslip;
        const { logo } = this.state;
        const netSalaryInWords = this.getNumberToWords(totalamount);
        return (
            <div className="card">
                <div className="card-body" id="card">
                    <h4 className="payslip-title">Final Settlement</h4>
                    <div className="row">
                        <div className="p-0">
                           
                            <div className="float-left mr-1 payslip-details">

                                <ul className="list-unstyled">
                                    <li><h5 className="mb-0"><strong>{employee?.name}</strong></h5></li>
                                    <li>{designation}</li>
                                    <li><i><small>{department}</small></i></li>
                                    <li><b>Employee ID:</b> {empid}</li>
                                    <li>Joined Date: <span>{getReadableDate(doj)}</span></li>
                                </ul>
                            </div>
                            <div className="text-end float-right col-sm-6 m-b-20">
                                <img  src={logo} className="inv-logo pslogo" alt={companyName} />
                            </div>

                            <table className="m-0 table table-bordered">
                                <tr className='Payslipeader' style={{
                                    background: '#102746',
                                    color: 'white',
                                    fontWeight: '600',
                                    marginLeft: '5px'
                                }}>
                                    <p className='pl-2 m-0'>{companyName}</p>
                                    <p className='pl-2 m-0'>{companyAddress}</p>

                                </tr>
                            </table>
                        </div>
                        <div className="p-0 mt-3">
                            <table className="payslipView table table-bordered">
                                <tr>
                                    <th >Account Holder</th>
                                    <td>{accountHolderName}</td>
                                    <th >Resignation/Termination Date</th>
                                    <td>{getReadableDate(resignationDate)}</td>
                                </tr>
                                <tr>
                                    <th>Bank</th>
                                    <td>{bankName}</td>
                                    <th>Last Working Date</th>
                                    <td>{getReadableDate(lwd)}</td>
                                </tr>
                                <tr>
                                    <th>A/C</th>
                                    <td>{accountNumber}</td>
                                    <th>Notice Days</th>
                                    <td>{noofdays}</td>
                                </tr>
                                <tr>
                                    <th>IBAN Number</th>
                                    <td> {ibanNumber}</td>
                                    <th>Employment Status</th>
                                    <td>{empstatus}</td>
                                </tr>
                                <tr>
                                    <th>SWIFT Code</th>
                                    <td>{swiftCode}</td>

                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="p-0 ">
                            <div>
                                <h4 className="m-b-10"><strong>Final Settlement Details</strong><h5 style={{ float: "right" }}><strong>Status:</strong>{status}</h5> </h4>
                                <br></br>
                                <table className="payslipView table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Days</th>
                                            <th scope="col">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Annual Leave Encashment</strong></td>
                                            <td>{annualleavedays}</td>
                                            <td>{annualLeaveSalary}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Gratuity</strong></td>
                                            <td>{gratuitydays}</td>
                                            <td>{gratuity}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Pending Salary</strong></td>
                                            <td>{pendingsalarydays}</td>
                                            <td>{pendingsalary}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Current Month Salary </strong></td>
                                            <td>{currMonthSalarydays}</td>
                                            <td>{currMonthSalary}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Notice Pay</strong></td>
                                            <td>{noticepaydays}</td>
                                            <td>{noticePeriod}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Other Payments</strong></td>
                                            <td>-</td>
                                            <td>{otherPayments}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Other Deductions</strong></td>
                                            <td>-</td>
                                            <td>{otherDeductions}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Final Settlement</strong></td>
                                            <td>-</td>
                                            <td>{totalamount}</td>
                                        </tr>

                                    </tbody>
                                </table>
                                {/* <table className="payslipView table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td><strong>Annual Leave Encashment</strong> <span >{annualleavedays}</span><span className="float-right">{annualLeaveSalary}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Gratuity</strong><span >{gratuitydays}</span><span className="float-right">{gratuity}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Pending Salary</strong><span >{pendingsalarydays} </span><span className="float-right">{pendingsalary}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Current Month Salary </strong><span >{currMonthSalarydays}</span><span className="float-right">{currMonthSalary}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Notice Pay</strong><span >{noticepaydays}</span><span className="float-right">{noticePeriod}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Other Payments </strong><span className="float-right">{otherPayments}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Other Deductions</strong><span ><b>( - )</b></span><span className="float-right">{otherDeductions}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Final Settlement</strong><span className="float-right"><strong>{totalamount}</strong></span></td>
                                        </tr>
                                    </tbody>
                                </table> */}
                            </div>
                        </div>
                        <div className="mt-1 netSalary col-sm-12">
                            <p><strong>Net Salary: {totalamount} {getCurrency()}  </strong> <span className='txt-sentence'>({netSalaryInWords})</span> </p>
                        </div>
                    </div>
                </div>
                <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div>
            </div>

            // <div className="card">
            //     <div className="card-body" id="card">
            //         <div className="row">
            //          <div className="float-left"><h4 className="payslip-title">Final Settlement</h4></div>
            //         <div className="float-right" style={{height: "50px",width:"10%", position:"absolute",top:"0",right:"0",paddingTop:"5px"}}>
            //         <img className="img-fluid" src={logo} alt="responsive image" />
            //        </div></div>
            //         <div className="row">
            //             <div className="col-sm-6 m-b-20"> 
            //                     <ul className="list-unstyled">
            //                         <li><h5 className="mb-0"><strong>{employee?.name}</strong></h5></li>
            //                         <li>{designation}</li>
            //                         <li><i><small>{department}</small></i></li>
            //                         <li><b>Employee ID:</b> {empid}</li>
            //                         <li>Joined Date: {getReadableDate(doj)}</li>
            //                     </ul> 
            //             </div>
            //             <div className="col-sm-6 m-b-20">
            //                 <img src={logo} className="inv-logo pslogo" alt={companyName} />
            //                 <ul className="list-unstyled mb-0">
            //                     <li>{companyName}</li>
            //                     <li>{companyAddress}</li>
            //                 </ul>
            //             </div>
            //         </div>
            //         <div className="row">
            //             <div className="col-lg-6 m-b-20">
            //                 <ul className="list-unstyled">
            //                     <li><b>Resignation/Termination Date:</b> {getReadableDate(resignationDate)}</li>
            //                     <li><b>Last Working Date:</b>  {getReadableDate(lwd)}</li>
            //                     <li><b>Notice Days:</b> {noofdays}</li>
            //                     <li><b>Employment Status:</b> {empstatus}</li>
            //                 </ul>
            //             </div>
            //             <div className="col-lg-6 m-b-20">
            //                 <ul className="list-unstyled">
            //                     <li>Account Holder: {accountHolderName}</li>
            //                     <li>Bank: {bankName}</li>
            //                     <li>A/C: {accountNumber}</li>
            //                     <li>IBAN Number: {ibanNumber}</li>
            //                     <li>SWIFT Code: {swiftCode}</li>
            //                 </ul>
            //             </div>

            //         </div>
            //         <div className="row">
            //             <div className="col-sm-12">
            //                 <div>
            //                     <h4 className="m-b-10"><strong>Final Settlement Details</strong><h5 style={{textAlign:"right"}}><strong>Status:</strong>{status}</h5> </h4>
            //                     <br></br>
            //                     <h4 className="float-center" style={{paddingLeft:"750px"}}> Days <span className="float-right"> Amount </span></h4>
            //                     <table className="table table-bordered">
            //                         <tbody>
            //                             <tr>
            //                                 <td><strong>Annual Leave Encashment</strong><span style={{paddingLeft:"577px"}}>{ annualleavedays}</span><span className="float-right">{annualLeaveSalary}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Gratuity</strong><span style={{paddingLeft:"693px"}}>{ gratuitydays}</span><span className="float-right">{gratuity}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Pending Salary</strong><span style={{paddingLeft:"650px"}}>{ pendingsalarydays} </span><span className="float-right">{pendingsalary}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Current Month Salary </strong><span style={{paddingLeft:"601px"}}>{ currMonthSalarydays}</span><span className="float-right">{currMonthSalary}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Notice Pay</strong><span style={{paddingLeft:"676px"}}>{ noticepaydays}</span><span className="float-right">{noticePeriod}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Other Payments </strong><span className="float-right">{otherPayments}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Other Deductions</strong><span style={{paddingLeft:"693px"}}><b>( - )</b></span><span className="float-right">{otherDeductions}</span></td>
            //                             </tr>
            //                             <tr>
            //                                 <td><strong>Total Final Settlement</strong><span className="float-right"><strong>{totalamount}</strong></span></td>
            //                             </tr>
            //                         </tbody>
            //                     </table>
            //                 </div>
            //             </div>
            //             <div className="col-sm-12">
            //                 <p><strong>Net Settlement: {totalamount} {getCurrency()} </strong> <span className='txt-sentence'>({netSalaryInWords})</span> </p>
            //             </div>
            //         </div>
            //     </div>
            //     <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div>
            // </div>
        )
    }
}
