import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import PlanInfo from './planInfo/form.jsx';
import AddOwner from './addOwner/index.jsx';
import AddCandidates from './addCandidates/index.jsx';

const SuccessionPlanFormLanding = () => {
    const location = useLocation();
    const [state, setState] = useState({
        candidates: false,
        ownerForm: false,
        poolShowForm: false,
        screenNum: 0,
    });

    const getStyle = (text) => {
        if (text === true) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === false) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'null';
    };

    const nextForm = (value) => {
        if (value === 1) {
            setState((prevState) => ({ ...prevState, candidates: true }));
        } else if (value === 2) {
            setState((prevState) => ({ ...prevState, ownerForm: true }));
        }
    };

    const { candidates, ownerForm } = state;
    const infoId = location?.state?.isPlan;

    return (
        <div className='planNewForm page-container content container-fluid'>
            <div>
                <div className='addPlanForm'>
                    <div
                        style={{
                            borderBottom: '1px solid #c7c7c7',
                            marginBottom: '11px',
                        }}
                        className='profileFormHeadContent'
                    >
                        <h3 className='dvlp-left-align'>Plan Info</h3>
                    </div>

                    <div>
                        <PlanInfo planInfo={location.state} nextForm={nextForm}></PlanInfo>
                    </div>
                </div>
            </div>
            {candidates || infoId ? (
                <>
                    <AddCandidates nextForm={nextForm}></AddCandidates>
                </>
            ) : (
                <div>
                    <div className='successionPlanFromDisable'>
                        <h3 style={{ color: 'grey' }} className='dvlp-left-align'>Candidates</h3>
                    </div>
                </div>
            )}
            {ownerForm || infoId ? (
                <>
                    <AddOwner nextForm={nextForm}></AddOwner>
                </>
            ) : (
                <div>
                    <div className='successionPlanFromDisable'>
                        <h3 style={{ color: 'grey' }} className='dvlp-left-align'>Owners</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuccessionPlanFormLanding;