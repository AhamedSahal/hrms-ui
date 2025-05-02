import React, { Component } from 'react';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import { getCurrency, getLogo } from '../../../utility';
import { getUAE02Payslip } from './service';

export default class PayslipUAE02Viewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payslipData: undefined,
            logo: getLogo(),
            currency: getCurrency(),

        };
    }
    componentDidMount() {
        const { payslip } = this.props;
        var employeeId = payslip.employee.id;
        var salaryMonth = payslip.salaryMonth;
        getUAE02Payslip(employeeId, salaryMonth).then(res => {
            if (res.status == "OK") {
                this.setState({
                    payslipData: res.data
                })
            }
        })
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
        const { payslipData } = this.state;

        return (
            <div className="card">
                {
                    !payslipData && <div className="card-body text-center"> <i className='fa fa-spin fa-spinner fa-2x'></i></div>
                }
                {payslipData && <> <div className="card-body" id="card" dangerouslySetInnerHTML={{ __html: payslipData }}>

                </div>
                    <div><button className="btn btn-primary" onClick={this.generatePDF} >Export To PDF</button></div>
                </>
                }
            </div>
        )
    }
}
