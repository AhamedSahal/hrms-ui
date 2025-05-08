import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllowanceInformation, getPersonalInformation, getSalaryInformation, updateAllowanceInformation } from '../service';
import { getUserType } from '../../../../utility';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class AllowanceStatus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.employeeId.id || 0,
            allowances: [],
            oldAllowancedata: [],
        }

    }
    componentDidMount() {
        getAllowanceInformation(this.state.id).then(res => {
            let allowances = res.data;
            this.setState({ allowances })
            this.getOldAllowence()
        })
    }

    getOldAllowence = () => {
            // old allowance
          let oAllowancedata = this.state.allowances.map(item => {
                return {
                    allowanceId: item.allowanceId,
                    allowanceName: item.allowanceName,
                    amount: item.amount != null?item.amount:0
                }
            }
            )
            this.setState({oldAllowancedata: oAllowancedata})

    }

    onAllowanceChange = (e, allowanceId) => {
        let { allowances } = this.state;
            let index = allowances.findIndex(item => item.allowanceId == allowanceId);
            if (index > -1) {
                allowances[index].amount = e.target.value == ""?0:e.target.value;
                this.setState({ allowances })
            }
            
        
     
    }

    save = () => {

        let { allowances,oldAllowancedata } = this.state;
        let post = [];
        //map allowances to post array
        post = allowances.map(item => {
            return {
                allowanceId: item.allowanceId,
                allowanceName: item.allowanceName,
                amount: item.amount != null?item.amount:0
            }
        }
        )
    
        
        let sum = 0
        for (let i = 0; i < post.length; i++) {
            sum += parseFloat(post[i].amount);
        }
        this.props.closeForm(sum , post,oldAllowancedata);      
    }
    render() {
        let { allowances } = this.state;
        return (
            <div className="row">
                {allowances && allowances.length > 0 &&
                    <div className="col-sm-12">
                        <div className="card">
                            <div className='card-header'>
                                <h5>Allowances</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {allowances.map((allowance, index) => {
                                        return (
                                            <div className="col-md-6" key={index}>
                                                <div className="form-group">
                                                    <label>{allowance.allowanceName}</label>
                                                    <input type="text" className="form-control" onChange={(e) => {
                                                        this.onAllowanceChange(e, allowance.allowanceId);
                                                    }} defaultValue={allowance.amount} />
                                                    <input type="hidden" className="form-control" value={allowance.allowanceId} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="card-footer">
                                {(isCompanyAdmin) &&
                                    <>
                                 <input disabled={!isCompanyAdmin} type="button" onClick={this.save} className="btn btn-primary" value="Update" />  
                                    </>}
                            </div>
                        </div>
                    </div>}
            </div>
        )
    }
}
