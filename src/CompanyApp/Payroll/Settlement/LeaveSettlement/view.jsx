import React, { Component } from 'react';
import jsPDF  from 'jspdf';
import html2canvas from "html2canvas";
import { getCurrency, getLogo, getReadableDate } from '../../../../utility';

const Ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const Tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety", "Hundred"];
const Scale = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion"];

export default class LeaveslipViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leaveViewslip: props.leaveViewslip || {
                currentMonthNetSalary:"",
                employee: "",
                currentMonthSalary: "",
                currentLeaveMonthSalary: "",
                totalamount: "",
                totalLeaveSalary: "",
                currMonthleavedays: "",
                noofdays: "",
                empid: "",
                doj: "",
                designation: "",
                department: "",
                companyName: "",
                companyAddress: "",
                bankName: "",
                accountNumber: "",
                ibanNumber: "",
                accountHolderName: "",
                swiftCode: "",
                payrollMonth: ""
            },
            logo: getLogo(),
            currency: getCurrency(),
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
            var imgData = canvas.toDataURL("image/png", 1.0);
            var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin,imgWidth,imgHeight);
            for (var i = 1; i <= totalPDFPages; i++) {
                pdf.addPage( [PDF_Width, PDF_Height],'p');
                pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),imgWidth,imgHeight);
            }

            pdf.save("LeaveSettlement"+ Date().toLocaleString() +".pdf");
        });
    };
    render() {
        const { payrollMonth,currentMonthNetSalary,employee,currentMonthSalary, currentLeaveMonthSalary, swiftCode,leavestartendmonthname,
            totalamount,totalLeaveSalary,currMonthleavedays,noofdays, empid, doj, designation, department,status,
            companyName, companyAddress, bankName, accountNumber, ibanNumber, accountHolderName,createdOn} = this.state.leaveViewslip;
        const { logo } = this.state;
        let total = parseInt(totalamount);
        const netSalaryInWords = this.getNumberToWords(totalamount);
        return (
            <div className="card">
                <div className="card-body" id="card">
                    <h4 className="payslip-title">Annual Leave Settlement</h4>
                    <div className="row">
                        <div className="p-0">

                            <div className="float-left mr-1 payslip-details">

                                <ul className="list-unstyled">
                                    <li><h5 className="mb-0"><strong>{employee?.name}</strong></h5></li>
                                    <li>{designation}</li>
                                    <li><i><small>{department}</small></i></li>
                                    <li><b>Employee ID:</b> {empid}</li>
                                    <li>Joined Date: {getReadableDate(doj)}</li>
                                    <li>Salary Month: <span>{this.getMonthYear(payrollMonth)}</span></li>
                                </ul>
                            </div>
                            <div className="text-end float-right col-sm-6 m-b-20">
                                <img src={logo} className="inv-logo pslogo" alt={companyName} />
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
                                    <th >Approved Leave Period</th>
                                    <td>{leavestartendmonthname}</td>
                                </tr>
                                <tr>
                                    <th>Bank</th>
                                    <td>{bankName}</td>
                                    <th>Approved Leave Days</th>
                                    <td>{noofdays}</td>
                                </tr>
                                <tr>
                                    <th>A/C</th>
                                    <td>{accountNumber}</td>
                                    <th>Processed Date</th>
                                    <td>{getReadableDate(createdOn)}</td>
                                </tr>
                                <tr>
                                    <th>IBAN Number</th>
                                    <td> {ibanNumber}</td>
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

                                <table className="payslipView table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <h4 className="m-b-10"><strong>Leave Settlement Details</strong></h4>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td><strong>Current Month Net Salary</strong> <span className="float-right">{currentMonthNetSalary}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Leave salary advance for {noofdays} days</strong> <span className="float-right">{totalLeaveSalary}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Leave Settlement Amount</strong> <span className="float-right">{totalamount}</span></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-1 netSalary col-sm-12">
                            <p><strong>Net Salary: {totalamount} {getCurrency()}  </strong> <span className='txt-sentence'>({netSalaryInWords})</span> </p>
                        </div>
                    </div>
                </div>
                <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div>
            </div>
           
        )
    }
}
