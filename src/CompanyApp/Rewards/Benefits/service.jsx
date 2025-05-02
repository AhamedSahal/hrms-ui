import { putWithAuth, patchWithAuth,postWithAuth } from "../../../HttpRequest";

const servicePath = "/BenefitsType/BenefitsMain";
const servicePath1 = "/BenefitsType";
const servicePath2 = "/BenefitsType/BenefitListAction";

export function updateDocument(id, file,requestClaimedAmount) {
    let post = postWithAuth(`${servicePath}?benefitId=${id}&requestClaimedAmount=${requestClaimedAmount}`, { file: file }, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


export function updateStatus(id, status, claimamount) {
    let path = servicePath1 + "?id=" + encodeURIComponent(id) + "&status=" + status + "&claimamount=" + claimamount;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateBetifitListAction(id, status, claimamount,remark,benefitsActionId) {
    let path = servicePath2 + "?id=" + encodeURIComponent(id) + "&status=" + status + "&claimamount=" + claimamount + "&remark=" + remark+ "&benefitsActionId=" +benefitsActionId;
    return putWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

