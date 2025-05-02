import React, { Component } from 'react';
import OnboardingMSCheckList from './checkList/index';
import OnboardMSTaskView from './checkList/taskIndex';

class OnboardSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateData: null,
            checkListView: 'table'
        };
    }

    openChecklistView = (data, item) => {
        this.setState({ checkListView: item , viewData: data });
    }
    render() {
        const { checkListView , viewData} = this.state;


        return (

            <>
                {
                    <>
                        {checkListView == 'table' && <div style={{ padding: '15px' }}>
                            <OnboardingMSCheckList openChecklistView={this.openChecklistView}></OnboardingMSCheckList>
                        </div> }
                        
                        {checkListView == 'taskView' && <div style={{ padding: '15px' }}>

                            <OnboardMSTaskView viewData={viewData} openChecklistView={this.openChecklistView}></OnboardMSTaskView>
                        </div> }

                    </>
                }
            </>

        );
    }
}

export default OnboardSetup;