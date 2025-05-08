
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';
import { getCompanyId } from '../../../../utility';


const servicePath= "/settings"

export async function getAssetAcknowledgementStatus() {
    let path = `${servicePath}/getAssetAcknowledgementStatus`;
    try {
        const res = await getWithAuth(path);
        return await Promise.resolve(res.data);
    } catch (err) {
        return await Promise.reject(err);
    }
}

export async function updateAssetAcknowledgementStatus(acknowledgement) { 
    let post = putWithAuth(`${servicePath}/updateAssetAcknowledgementStatus?acknowledgement=${acknowledgement}`);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}


 

