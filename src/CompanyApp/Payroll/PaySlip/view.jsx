import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import { getCurrency, getLogo, getReadableDate, getSyncPeoplehumCustomField } from '../../../utility';
import { getCurrencyList } from '../../ModuleSetup/Currency/service';

const Ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const Tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety", "Hundred"];
const Scale = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion"];
export default class PayslipViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payslip: props.payslip,
            logo: getLogo(),
            currency: props.payslip.payCurrencyName != ""?(props.payslip.payCurrencyName).split("-")[0]:getCurrency(),
            currencyCode: props.payslip.payCurrencyCode,
            minorCode: props.payslip.payCurrencyMinorName,
            orgsetup: props.orgsetup  || false
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
       
        const { currency,currencyCode,minorCode } = this.state 
        const amount = number;
        const integerPart = Math.trunc(amount);
        const decimalPart = amount % 1 !== 0 ? Math.round((amount % 1) * 100) : null;
        const integerWords = this.convertNumberToWords(integerPart);
        const decimalWords = decimalPart ? this.convertNumberToWords(decimalPart) : null;
      
            return `${integerWords} ${currencyCode} ${decimalWords ? ' and ' + decimalWords + ' ' + minorCode  : ''}`
        

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

            pdf.save("Payslip" + Date().toLocaleString() + ".pdf");
        });
    };
    render() {
        const isCustomFieldEnabled = getSyncPeoplehumCustomField();
        const { basicSalary, allowance, salaryMonth, totalDays, unPaidLeaves, paidLeaves, daysWorked, employeeId, employee, dateOfJoining, designation, department, ot, entityName,
            companyName, companyAddress, bankName, accountNumber, ibanNumber, accountHolderName, taxPayerId, status, earningAmount, grossSalary, totalEarning, deductionAmount, netSalary, payslipItems ,payableDays,entityLogo} = this.state.payslip;
        const { logo } = this.state;
        const credit = payslipItems && payslipItems.length > 0 ? payslipItems.filter(item => item.type === "CREDIT" && item.amount > 0.0) : [];
        const debit = payslipItems && payslipItems.length > 0 ? payslipItems.filter(item => item.type === "DEBIT" && item.amount > 0.0) : [];
        const emptyRowsDebit = credit?.length > debit?.length ? (credit?.length - debit?.length) + 3 : 3;
        const emptyRowsCredit = debit?.length > credit?.length ? debit?.length - credit?.length : 0;
        const netSalaryInWords = this.getNumberToWords(netSalary.toFixed(2));
        console.log("cell",employee);
        return (
            <div className="card">
                <div className="card-body" id="card">
                    <div className="row">
                        <div className="p-0">
                            <div className="float-left mr-1 payslip-details">
                                <ul className="list-unstyled">
                                    <li><h5 className="mb-0"><strong>{employee?.name}</strong></h5></li>
                                    <li>{designation}</li>
                                    <li><p className='m-0 p-0'>{department}</p></li>
                                    <li>Employee ID: {employeeId}</li>
                                    <li>Joining Date: {getReadableDate(dateOfJoining)}</li>
                                    <li>Salary Month: <span>{this.getMonthYear(salaryMonth)}</span></li>
                                    {isCustomFieldEnabled === true && entityName && (
                                        <li>Entity Name: <span>{entityName}</span></li>
                                    )}
                                </ul>
                            </div>
                            <div className="text-end float-right col-sm-6 m-b-20">
                                <img src={entityLogo != null && this.state.orgsetup?`data:image/jpeg;base64,${entityLogo}`:logo} className="inv-logo pslogo" alt={companyName} />
                            </div>


                            <table className="m-0 table table-bordered">
                                <tr className='Payslipeader' style={{
                                    background: '#102746',
                                    color: 'white',
                                    fontWeight: '600',
                                    marginLeft: '5px'
                                }}>


                                    <p className='pl-2 m-0'>{entityName != null && this.state.orgsetup? entityName : companyName}</p>
                                    <p className='pl-2 m-0'>{companyAddress}</p>


                                </tr>
                                <tr>
                                    <h5 className="p-2 payslipView-title">Payslip for {this.getMonthYear(salaryMonth)}</h5>
                                </tr>
                            </table>
                        </div>
                        <div className="p-0 ">
                            <table className="payslipView table table-bordered">
                                <tr>
                                    <th >Account Holder</th>
                                    <td>{accountHolderName}</td>
                                    <th >Total Days</th>
                                    <td>{totalDays}</td>
                                </tr>
                                <tr>
                                    <th>Bank</th>
                                    <td>{bankName}</td>
                                    <th>Unpaid Leaves</th>
                                    <td>{unPaidLeaves}</td>
                                </tr>
                                <tr>
                                    <th>A/C</th>
                                    <td>{accountNumber}</td>
                                    <th>Paid Leaves</th>
                                    <td>{paidLeaves}</td>
                                </tr>
                                <tr>
                                    <th>IBAN Number</th>
                                    <td> {ibanNumber}</td>
                                    <th>Paid Days</th>
                                    <td> {payableDays}</td>
                                </tr>




                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="p-0 col-sm-6">
                            <div>

                                <table className="payslipView table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <h4 className="m-b-10"><strong>Earnings</strong></h4>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td><strong>Basic Salary</strong> <span className="float-right">{basicSalary.toFixed(2)}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Over Time</strong> <span className="float-right">{ot.toFixed(2)}</span></td>
                                        </tr>
                                        {credit && credit.map((item, index) => {
                                            if(item.amount > 0.0){
                                            return (
                                                <tr key={index}>
                                                    <td><strong>{item.title}</strong> <span className="float-right">{item.amount.toFixed(2)}</span></td>
                                                </tr>
                                            );
                                            }
                                        })}
                                        {
                                            emptyRowsCredit > 0 && Array.from(Array(emptyRowsCredit), (item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td><strong>&nbsp;</strong> </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td><strong>Total Earnings</strong> <span className="float-right"><strong>{totalEarning.toFixed(2)}</strong></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-0 col-sm-6">
                            <div>
                                <table className="payslipView table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <h4 className="m-b-10"><strong>Deductions</strong></h4>
                                            </th>
                                        </tr>
                                        {debit && debit.map((item, index) => {
                                            if (item.amount > 0.0) {
                                            return (
                                                <tr key={index}>
                                                    <td><strong>{item.title}</strong> <span className="float-right">{item.amount.toFixed(2)}</span></td>
                                                </tr>
                                            );
                                            }
                                        })}
                                        {
                                            emptyRowsDebit > 0 && Array.from(Array(emptyRowsDebit - 1), (item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td><strong>&nbsp;</strong> </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td><strong>Total Deductions</strong> <span className="float-right"><strong>{deductionAmount.toFixed(2)}</strong></span></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="netSalary col-sm-12">
                            <p><strong>Net Salary: {netSalary.toFixed(2)} {this.state.currency} </strong> <span className='txt-sentence'>({netSalaryInWords})</span> </p>
                        </div>
                    </div>
                </div>
                {/* <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div> */}
            </div>
        )
    }
}
