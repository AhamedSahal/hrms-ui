import React, { Component } from 'react';
import { getCompanyInformation } from './service';
import { toast } from 'react-toastify';
import { getGradingStructureList, getPayCompositeList, getPayFixedList, getPayScaleType } from '../../ModuleSetupPage/CompensationSettings/service';
export default class ComparatioMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.employeeId || 0,
            compositeData: '',
            empMonthSalary: props.empSalary || 0,
            SalaryPercentage: '',
            fixedPayList: '',
            payScaleType: null,
            data: [],
            q: "",
            page: 0,
            size: 30,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            totalValue: 0,
        }
    }
    customizeTexts = (info) => {

        const valueText = info.valueText;
        let additionalText = "";

        if (valueText >= 80 && valueText < 100) {
            additionalText = " - Min";
        } else if (valueText >= 100 && valueText < 120) {
            additionalText = " - Mid";
        } else if (valueText >= 120 && valueText < 130) {
            additionalText = " - Max";
        }
        return `${valueText} % ${additionalText}`;
    };



    componentDidMount() {
        this.fetchType();
        getCompanyInformation(this.state.id).then(res => {
            if (res.status == "OK") {
                this.setState({ empGradeId: res.data.grades })

            } else {
                toast.error(res.message);
            }

        })
        getPayCompositeList().then((res) => {
            if (res.status === 'OK') {
                this.setState({ compositeData: res.data.list[0] })
            }
        });


        getPayFixedList().then((res) => {
            if (res.status === 'OK') {
                this.setState({ fixedPayList: res.data.list })
            }
        });

        this.fetchList()

    }

    fetchList = () => {
        getGradingStructureList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

            if (res.status == "OK") {
                this.setState({
                    data: res.data.list,
                })
            }
        })
    }

    fetchType = () => {
        getPayScaleType(this.state.q, this.state.page, this.state.size, this.state.sort).then((res) => {
            if (res.status === 'OK') {
                this.setState({ payScaleType: res.data[0].payScaleType == "COMPOSITE" ? 0 : res.data[0].payScaleType == "FIXED" ? 1 : null })
            }
        });
    }



    render() {

        const { compositeData, empGradeId, fixedPayList, payScaleType, data, totalValue } = this.state
        // Find the Employee grade
        const empGrades = []
        for (let i = 0; i < data.length; i++) {
            const gradesName = data[i].gradesName;
            if (gradesName === empGradeId?.name) {
                empGrades.push(i)
            }
        }
        let percentage = 0
        let totalRatio = 0
        // Fixed Approach Ratio
        const fixGrades = []
        if (payScaleType === 1 && fixedPayList && fixedPayList.length > 0) {
            for (let i = 0; i < fixedPayList.length; i++) {
                const fixList = fixedPayList[i];
                const grades = Object.keys(fixList)
                    .filter(key => key.startsWith('grade'))
                    .map(key => fixList[key]);
                fixGrades.push(grades)

            }
            const gradeSum = () => {
                const sums = Array(fixGrades[0].length).fill(0);
                fixGrades.forEach(item => {
                    item.forEach((value, index) => {
                        sums[index] += parseInt(value, 10);
                    });
                });

                return sums;
            };

            const sums = gradeSum();
            if (empGradeId && this.props?.empSalary) {
                const total = sums[empGrades];
                if (total === 0) {
                    percentage = 0
                } else {
                    const amount = this.props?.empSalary;
                    const addValue = (amount / total) * 100;
                    totalRatio = addValue
                    percentage = addValue > 200 ? 200 : addValue
                }
            }
        }

        // Composit approach ratio

        if (payScaleType === 0) {
            const grades = Object.keys(compositeData)
                .filter(key => key.startsWith('grade'))
                .map(key => compositeData[key]);

            if (empGradeId && this.props?.empSalary) {
                const total = grades[Number(empGrades)];
                if (total === 0) {
                    percentage = 0
                } else {
                    const amount = this.props?.empSalary;
                    const addValue = (amount / total) * 100;
                    totalRatio = addValue
                    percentage = addValue > 200 ? 200 : addValue
                }
            }
        }
        const value = parseFloat(percentage).toFixed(2)

        // Calculate the position of the value indicator
        let indicatorPosition;
        if (value <= 80) {
            indicatorPosition = `${(value / 80) * 25}%`;
        } else if (value <= 100) {
            indicatorPosition = `${((value - 80) / 20) * 25 + 25}%`;
        } else if (value <= 120) {
            indicatorPosition = `${((value - 100) / 20) * 25 + 50}%`;
        } else {
            indicatorPosition = `${((value - 120) / 80) * 25 + 75}%`;
        }

        // Calculate the position of the labels
        const labelMinPosition = `calc(0% - 20px)`;
        const labelMidPosition = `calc(25% - 20px)`;
        const labelMaxPosition = `calc(50% - 20px)`;

        return (
            <div className='pb-3 comperatioBox'>
                <div className="card">
                    <div className='card-header'>
                        <h5>Compa-Ratio Map</h5>
                    </div>
                    <div className="card-body">
                        <div className="linear-line-container">
                            <div className="linear-line">
                                <div
                                    className="linear-line-segment"
                                    style={{ width: "25%", background: "green" }}
                                />
                                <div
                                    className="linear-line-segment"
                                    style={{ width: "25%", background: "#234b23" }}
                                />
                                <div
                                    className="linear-line-segment"
                                    style={{ width: "25%", background: "#671d1d" }}
                                />
                                <div
                                    className="linear-line-segment"
                                    style={{ width: "25%", background: "#d70606" }}
                                />
                            </div>
                            <div className="comparatiolabels">
                                <div className="comparatiolabel" style={{ left: labelMinPosition }}>
                                    80% - Min
                                </div>
                                <div className="comparatiolabel" style={{ left: labelMidPosition }}>
                                    100% - Mid
                                </div>
                                <div className="comparatiolabel" style={{ left: labelMaxPosition }}>
                                    120% - Max
                                </div>
                            </div>
                            <div className="value-indicator" style={{ left: indicatorPosition }}>
                                {totalRatio > 200 ? totalRatio : value}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
