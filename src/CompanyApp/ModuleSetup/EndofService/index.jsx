import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBranchLists } from '../../Performance/ReviewCycle/CycleForms/service';
import PensionSettings from './Pension';
import GratuitySettingForm from '../gratuity/GratuitySettingForm';
import { id } from 'date-fns/locale';


const gratuityList = [
    {
        id: 1,
        branchId: 35,
        country: "Qatar",
        gratuityAmountPer: 5,
        gratuityAmountPerMax: 20,
        gratuityServiceRequired: 3,
        gratuityServiceRequiredMax: 180,
    },
];

const pensionList = [
    {
        id: 1,
        branchId: 44,
        pensionName: "GOSI",
        employeeContribution: 7,
        employerContribution: 14,
        governmentContribution: 0,
        allowanceId: [0,45,47]
    },
]

export default class EndofServices extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locationId: '',
            locationName: '',
            branches: [],
            pension: pensionList || '', 
            gratuity: gratuityList || '',
        }
    }
    componentDidMount() {
        getBranchLists().then(res => {
            if (res.status == "OK") {
                const branches = res.data;
                const defaultBranch = branches[0] || {};
                this.setState({
                    branches,
                    locationId: defaultBranch.id || '',
                    locationName: defaultBranch.name || '',
                },() => {
                    // this.fetchList()
                });
            }
        });
    }

    handleLocationChange = (e) => {
        this.setState({locationId: e.target.value },() => {
            // this.fetchList()
        });
    }

    fechList = () => {
        const { locationId } = this.state;
        // getPensionList(locationId).then(res => {
        //     if (res.status === "OK") {
        //         this.setState({
        //             pension: res.data
        //         });
        //     }
        // });
        // getgratuitySettings(locationId).then(res => {
        //     if (res.status === "OK") {
        //         this.setState({
        //             gratuity: res.data
        //         });
        //     }
        // });
    }

    render() {
        
        return (
            <>
                <div className="pb-2 page-container content container-fluid">
                    
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">End of Service</h3>
                            </div>
                            <div className="mt-2 mb-2 float-right col-auto ml-auto d-flex">
                                <select
                                    className="form-control"
                                    value={this.state.locationId}
                                    onChange={(e) => {
                                        this.handleLocationChange(e);
                                        const selectedOption = this.state.branches.find(branch => branch.id === parseInt(e.target.value));
                                        this.setState({
                                            locationId: e.target.value,
                                            locationName: selectedOption ? selectedOption.name : ''
                                        });
                                    }}
                                >
                                    {this.state.branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <GratuitySettingForm gratuityData={this.state.gratuity} ></GratuitySettingForm>
                    </div>
                    <div>
                        <PensionSettings pensionData={this.state.pension}></PensionSettings>
                    </div>
                </div>
            </>
        )
    }
}
