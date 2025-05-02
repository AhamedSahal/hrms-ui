import React, { Component } from 'react';
import payslipPdf from "../../../assets/img/pdf/payslipview.pdf"

class PayslipViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            pdfUrl : props.pdfUrl || "",
            payslipName:  props.payslipName || "",
        }
    }
    render() {

        return (
            <div>
                <div style={{ textAlign: 'left', fontSize: '17px', fontWeight: 700 }} className='mt-2 mb-2'>
                    <span >Payslip</span>
                </div>
                <iframe src={this.props.pdfUrl} style={{ borderRadius: '6px', marginRight: '8px' }} height="500" width="550" title="Iframe Example"></iframe>
              {this.props.pdfUrl != "" &&  <div className="mt-2">
                    <a href={this.props.pdfUrl} download={this.props.payslipName} className="btn btn-primary">
                        Download Payslip
                    </a>
                </div>}

            </div>
        );
    }
}

export default PayslipViewer;