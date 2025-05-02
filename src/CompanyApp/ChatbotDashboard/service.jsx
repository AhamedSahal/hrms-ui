
export default class Service {

    API_URL_User_Count = 'https://chatbot-service.workplus-hrms.com/api/get_user_count/';
    API_URL_Frequently_Ask = 'https://chatbot-service.workplus-hrms.com/api/get_frequently_askintents_count/';
    API_URL_Success_Failed = 'https://chatbot-service.workplus-hrms.com/api/get_success_failed/';
    API_URL_Chat_History = 'https://chatbot-service.workplus-hrms.com/api/get_chat_history/';
    API_URL_User_History = 'https://chatbot-service.workplus-hrms.com/api/get_chat_history/';


    fetchList(){
        const url = this.API_URL_User_Count ;
        const headers = new Headers();
            headers.append('Authorization','971767e8-6dd7-4bf8-9c8f-c86f1bc780a8');

            return fetch(url, { headers })
            .then(response => response.json())
            .then(jsonData => {
                const { user_data } = jsonData.data;
                return user_data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    getFrequentlyCount() {
        const url = this.API_URL_Frequently_Ask;
            const headers = new Headers();
            headers.append('Authorization','971767e8-6dd7-4bf8-9c8f-c86f1bc780a8');

            return fetch(url, { headers })
            .then(response => response.json())
            .then(jsonData => {
                const { intent_data } = jsonData.data;
                return intent_data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    getSuccessFailedCount() {
        const url = this.API_URL_Success_Failed ;
            const headers = new Headers();
            headers.append('Authorization','971767e8-6dd7-4bf8-9c8f-c86f1bc780a8');

            return fetch(url, { headers })
            .then(response => response.json()).then(jsonData => {
                const { status_data } = jsonData.data;
                return status_data
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    getChatHistory() {
        const url = this.API_URL_Chat_History;
        const headers = new Headers();
            headers.append('Authorization','971767e8-6dd7-4bf8-9c8f-c86f1bc780a8');

            return fetch(url, { headers })
        .then(response => response.json())
            .then(jsonData => {
                const { user_info } = jsonData;
                return user_info;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    getUserHistory (employeeId) {
        const url = this.API_URL_User_History + employeeId+ '/';
        const headers = new Headers();
            headers.append('Authorization','971767e8-6dd7-4bf8-9c8f-c86f1bc780a8');

            return fetch(url, { headers })
            .then(response => response.json())
            .then(jsonData => {
                const { data } = jsonData;
                return data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
}