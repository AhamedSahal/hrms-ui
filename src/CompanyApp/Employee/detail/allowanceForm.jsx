import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { getPermission, getUserType, verifyEditPermission } from '../../../utility';
import { getAllowanceInformation, updateAllowanceInformation } from './service';
import { PERMISSION_LEVEL } from '../../../Constant/enum';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN' || getPermission("Peoples Organization", "EDIT") == PERMISSION_LEVEL.ORGANIZATION;
export default class AllowanceForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: isCompanyAdmin,
            id: props.employeeId || 0,
            allowances: [],
            post: []
        }
    }
    componentDidMount() {
        getAllowanceInformation(this.state.id).then(res => {
            let allowances = res.data;
            this.setState({ allowances })
        })
    }
    onAllowanceChange = (e, allowanceId) => {
        let { allowances } = this.state;
        let index = allowances.findIndex(item => item.allowanceId == allowanceId);
        if (index > -1) {
            allowances[index].amount = e.target.value;
            this.setState({ allowances }, () => {
                console.log(this.state.allowances);
            })
        }
    }

    save = () => {
        let { allowances } = this.state;
        let post = [];
        //map allowances to post array
        post = allowances.map(item => {
            return {
                allowanceId: item.allowanceId,
                amount: item.amount
            }
        }
        );
        updateAllowanceInformation(this.state.id, post).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                if (this.props && this.props.reloadCallBack) {
                    this.props.reloadCallBack(this.state.id);
                }
            } else {
                toast.error(res.message);
            }
        })
    }
    render() {
        let { allowances, editable } = this.state;
        if (!isCompanyAdmin) {
            allowances = allowances.filter(item => item.amount != null && item.amount > 0);
        }
        const isEditAllowed = getPermission("Peoples Organization", "EDIT") == PERMISSION_LEVEL.ORGANIZATION
        if (editable && !isEditAllowed) {
            editable = false;
        }
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
                                        // e.g allowance {amount: null, allowanceName: "HRA", allowanceId: 4}
                                        //create form to update amount of allowance with allowanceName as readonly and allowanceId as hidden
                                        return (
                                            <div className="col-md-6" key={index}>
                                                <div className="form-group">
                                                    <label>{allowance.allowanceName}</label>
                                                    <input type="number" className="form-control" onBlur={(e) => {
                                                        this.onAllowanceChange(e, allowance.allowanceId);
                                                    }} defaultValue={allowance.amount} readOnly={!this.state.editable} />
                                                    <input type="hidden" className="form-control" value={allowance.allowanceId} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="card-footer">
                                {(isCompanyAdmin || editable) &&
                                    <>
                                        <input disabled={getPermission("Peoples Organization", "EDIT") != PERMISSION_LEVEL.ORGANIZATION || !editable} type="button" onClick={this.save} className="btn btn-primary" value="Update" />
                                    </>}
                            </div>
                        </div>
                    </div>}
            </div>
        )
    }
}
