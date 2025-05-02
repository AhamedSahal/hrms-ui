import React, { Component } from 'react';
import { getSubGoalsList, updateWeightData } from './service';
import { toast } from 'react-toastify';
import { FcHighPriority, FcLowPriority, FcMediumPriority } from 'react-icons/fc';

export default class SubGoalsEditWeigthage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goalId: props?.subGoalsWeightageData || 0,
            data: [],
            page: 0,
            size: 10,
            sort: "id,desc",
            q: "",

        }

    }
    componentDidMount() {
        let { data, goalId } = this.state;

        getSubGoalsList(this.state.q, this.state.page, this.state.size, this.state.sort, goalId).then(res => {
            if (res.status === "OK") {

                this.setState({
                    data: res.data.list,
                });

                let tempdata = res.data.list.map((res) => ({
                    id: res.id,
                    goalWeightage: res.goalWeightage,
                    priority: res.priority,
                    deadline: res.deadline,
                    issubGoalWeightage: res.weightage
                }));



                this.setState({ wightageData: tempdata });
            }
        });

    }

    // weigthage validation
    weightageValidation = () => {
        if (this.state.wightageData.length > 0) {
            let manualCount = 0
            let autoCount = 0
            let manualWeigthage = 0
            let autoApproveArray = []

            // 100% validation s
            this.state.wightageData.map((data, i) => {
                if (data.issubGoalWeightage) {
                    autoApproveArray.push(i)
                    autoCount++
                } else {
                    manualCount++
                    manualWeigthage = Number(manualWeigthage) + Number(data.goalWeightage)

                }
            })

            if (manualWeigthage > 100 || (manualWeigthage == 100 && autoCount > 0)) {
                toast.error("Total sub goals weightage should be less than or equals to 100.");
                return false;
            } else {


                if (autoCount > 0 && autoApproveArray.length > 0) {
                    let autoWeight = (100 - manualWeigthage) / autoCount
                    let tempData = this.state.wightageData;
                    autoApproveArray.map((res) => {
                        tempData[res].goalWeightage = autoWeight

                    })

                    this.setState({ wightageData: tempData })

                }
                return true;
            }
            // 100% validation e
        } else {
            return true;
        }

    }

    handleSave = () => {
        let { wightageData } = this.state;
        if (wightageData.length > 0) {
            if (this.weightageValidation()) {
                wightageData.map((res, i) => {
                    updateWeightData(res.id, res.goalWeightage, res.priority, res.deadline, res.issubGoalWeightage).then(res => {
                        if (res.status == "OK") {

                            if (wightageData.length - 1 == i) {
                                toast.success(res.message);
                                this.props.updateList();
                            }

                        } else {
                            toast.error(res.message);
                        }
                    })
                })
            } // if end

        }
    }

    render() {
        let { data, wightageData } = this.state;




        return (
            <div >
                <div >
                    {/* <h4 className="payslip-title">Annual Leave Settlement</h4> */}
                    <div className="row">
                        <div className="col-md-12">
                            {/* table */}
                            <table style={{ width: "100%" }}>
                                <tbody>
                                    <tr >
                                        <th >Sub Goals Name</th>
                                        <th >Current</th>
                                        {this.props.goalStatus != 0 && <th style={{ textAlign: 'center' }}>Weightage</th>}
                                        <th style={{ textAlign: 'center' }}>Priority</th>
                                        {this.props.goalStatus != 0 && <th style={{ textAlign: 'center' }}>Deadline</th>}
                                    </tr>
                                    {data.length > 0 && data.map((res, i) => {


                                        return <tr>
                                            <td>{res.name}</td>
                                            <td style={{ textAlign: 'center' }}>{res.goalWeightage}</td>
                                            {this.props.goalStatus !== 0 && (
                                                <td>
                                                    <input
                                                        className="form-control"
                                                        onChange={(e) => {
                                                            let { wightageData } = this.state;
                                                            if (!wightageData[i]) {
                                                                wightageData[i] = {};
                                                            }
                                                            wightageData[i].goalWeightage = e.target.value;
                                                            wightageData[i].issubGoalWeightage = false;
                                                            this.setState({ wightageData });
                                                        }}
                                                    />
                                                </td>
                                            )}
                                            <td>
                                                <select id="priority" className="form-control" name="priority"
                                                    onChange={e => {
                                                        let { wightageData } = this.state;
                                                        wightageData[i].priority = e.target.value;
                                                        this.setState({ wightageData })


                                                    }} required>
                                                    <option value="">Select Priority</option>
                                                    <option value="0"> Low</option>
                                                    <option value="1">Medium</option>
                                                    <option value="2"> High</option>
                                                </select>
                                            </td>
                                            {this.props.goalStatus != 0 && <td>
                                                <input name="deadline" type="date" className="form-control" onChange={(e) => {
                                                    let { wightageData } = this.state;
                                                    wightageData[i].deadline = e.target.value;
                                                    this.setState({ wightageData })
                                                }}></input>
                                            </td>}
                                        </tr>
                                    })}

                                </tbody>
                            </table>
                        </div>
                        <div className="row ">
                            <div className="col">
                                <input type="submit" className="btn btn-primary" value="Update" onClick={this.handleSave} />
                            </div>

                        </div>

                        {/* table */}



                    </div>

                </div>
            </div>

        )

    }
}