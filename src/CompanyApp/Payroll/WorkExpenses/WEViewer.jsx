
import React, { Component } from 'react';

import { toast } from 'react-toastify'; 
import { Anchor } from 'react-bootstrap'; 
import { getReadableDate } from '../../../utility';
import { updateStatus } from './service';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import { fileDownload } from '../../../HttpRequest';
export default class ExpenseView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ExpenseView: props.ExpenseView || {
                id: 0

            }
        }

    };
    // updateStatus = (id, status) => {
    //     updateStatus(id, status).then(res => {
    //         if (res.status == "OK") {
    //             toast.success(res.message);
    //             window.location.reload();
    //         } else {
    //             toast.error(res.message);
    //         }

    //     }).catch(err => {
    //         console.error(err);
    //         toast.error("Error while updating status");
    //     })
    // }
    render() {
      const { id,amountspent, employeeId, employee,description,category, createdOn, fileName, isPaid, project,referenceId,spenddate,vatamount,status } = this.state.ExpenseView;
        return (
            <div className="card"  >
                <div className="card-body" id="card">
                    <div className="row">
                        <div className="float-left"><h3 className="payslip-title">View Claim</h3></div> </div>
                    <div className="row"> 
                    <div className="p-0 ">
                            <table className="payslipView table table-bordered">
                                <tr>
                                    <th >Expense Category</th>
                                    <td>{category.name}</td>
                                    <th >Spend date</th>
                                    <td> {getReadableDate(spenddate)}</td>
                                </tr>
                                <tr>
                                    <th> Bill/Invoice No</th>
                                    <td> {referenceId != ""? referenceId : "-"}</td>
                                    <th>Project</th>
                                    <td>{project == null ? "-" : project.name}</td>
                                </tr>
                                <tr>
                                    <th>Total Amount</th>
                                    <td>{amountspent != ""? amountspent : "-"}</td>
                                    <th>VAT Amount</th>
                                    <td>{vatamount != ""? vatamount : "-"}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td> {description != ""? description : "-"}</td>
                                    <th>Attachment</th>
                                    <td> <Anchor onClick={() => {
                                                fileDownload(this.state.ExpenseView.id, this.state.ExpenseView.id, "EXPENSES", this.state.ExpenseView.fileName);
                                            }} title={this.state.ExpenseView.fileName}>
                                                <i className='fa fa-download'></i> {fileName}
                                            </Anchor></td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{status != ""? status : "-"}</td>
                                    <th>Payroll Status</th>
                                    <td> {isPaid == 1 ? "In Progress" : isPaid == 2 ? "Paid" : "Not Paid"}</td>
                                </tr>




                            </table>
                        </div>
                           
                               

                    </div>

                </div>
            </div>
        )
    }
}