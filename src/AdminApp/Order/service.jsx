
import { getPaginationQueryString } from '../../utility';
import { getWithAuth} from '../../HttpRequest';

const servicePath = "/order";

export function getOrderList(searchText,pageNumber, pageSize, sort) {
    console.log(sort);
    let path = `${servicePath}?${getPaginationQueryString(searchText,pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}