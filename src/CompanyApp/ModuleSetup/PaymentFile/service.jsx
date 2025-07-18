import { postWithAuth,putWithAuth,getWithAuth,deleteWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from '../../../utility';
const servicePath = "/paymentFile";


export function getPaymentFileList( ) {
    let path = `${servicePath}?${getPaginationQueryString()}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function savePaymentFile(PaymentFile) {
    let post = PaymentFile.id == 0 ? postWithAuth(servicePath, PaymentFile)
        : putWithAuth(`${servicePath}?id=${PaymentFile.id}`, PaymentFile);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            console.log({err})
            return Promise.reject(err);
        });
}