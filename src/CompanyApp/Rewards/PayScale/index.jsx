import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CompositePayScale from './compositePayScale';
import FixedPayScale from './fixedPayScale';
import { getPayScaleType } from './service';
import { BsDropbox } from "react-icons/bs";
import { getRewardCompositeList, getRewardFixedList } from './service';
import { getPayCompositeList, getPayFixedList } from '../../ModuleSetupPage/CompensationSettings/service';

export default class PayScaleLanding extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            compositData: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            fixedPayRecord: '',
            compositPayRecord: '',
            payScaleType: null
        };
    }

    componentDidMount() {
        this.fetchListFixed();
        this.fetchType();
    }
    fetchListFixed() {
        getPayFixedList().then((res) => {
            if (res.status === 'OK') {
                this.setState({ fixedPayRecord: res.data.list.length })
            }
        });
        getPayCompositeList().then((res) => {
            if (res.status === 'OK') {
                this.setState({ compositPayRecord: res.data.list.length })
            }
        });

    }

    fetchType = () => {
        getPayScaleType(this.state.q, this.state.page, this.state.size, this.state.sort).then((res) => {
            if (res.status === 'OK') {
                this.setState({ payScaleType: res.data[0].payScaleType == "COMPOSITE"?0:res.data[0].payScaleType == "FIXED"?1:null})    
            }
        });
    }


    render() {
        const { payScaleType } = this.state
        return (
            <div className='payscaleLanding'>
              {payScaleType === null &&  <div className='verticalCenter' style={{textAlign:"center",paddingTop: "200px"}}>
                <BsDropbox size={60} />
                 <h3>No Data Found</h3>
                </div>}
                {payScaleType === 0 && <CompositePayScale></CompositePayScale>}
                {payScaleType === 1 && <FixedPayScale></FixedPayScale>}
            </div>
        );
    }
}
