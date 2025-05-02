
import {  getWithAuth,  putWithAuth, putWithAuthSurvey } from '../../HttpRequest';

const servicePath = "/smtp";

export function get() {
    
    let path = `${servicePath}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function save(smtp) {
   
    let put  =  putWithAuth(`${servicePath}`, smtp,false);
    return put.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function saveSmtp(smtp) {
   
    let put  =  putWithAuthSurvey(`${servicePath}`, smtp,false);
    return put.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
  