import React, { Component } from 'react';
import OffboardingMSCheckList from './checkList/index';
import OffboardMSTaskView from './checkList/taskIndex';

class OffboardSetup extends Component {
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
                            <OffboardingMSCheckList openChecklistView={this.openChecklistView}></OffboardingMSCheckList>
                        </div> }
                        
                        {checkListView == 'taskView' && <div style={{ padding: '15px' }}>

                            <OffboardMSTaskView viewData={viewData} openChecklistView={this.openChecklistView}></OffboardMSTaskView>
                        </div> }

                    </>
                }
            </>

        );
    }
}

export default OffboardSetup;