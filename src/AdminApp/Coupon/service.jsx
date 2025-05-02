
import { getPaginationQueryString } from '../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../HttpRequest';

const servicePath = "/coupon";

export function getCouponList(searchText, pageNumber, pageSize, sort) {
    console.log({sort:sort})
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveCoupon(coupon) {
   
    let post = coupon.id == 0 ? postWithAuth(servicePath, coupon)
        : putWithAuth(`${servicePath}?couponId=${coupon.id}`, coupon);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 
export function deleteCoupon(couponId) {
    let path = servicePath + "?couponId=" + encodeURIComponent(couponId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}