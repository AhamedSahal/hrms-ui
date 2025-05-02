import {  getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/ticket";

export function getTicketList(employeeId, searchText, pageNumber, pageSize, sort) {
    let get = getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveTicket(ticket) {
    let post = ticket.id == 0 ? postWithAuth(servicePath, ticket)
        : putWithAuth(`${servicePath}?id=${ticket.id}`, ticket);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function closeTicket(id) {
    let path = servicePath + "/close?id=" + encodeURIComponent(id);
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTicketReplies(ticketId) {
    return getWithAuth(`${servicePath}/replies?ticketId=${ticketId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function saveTicketReply(ticketId, description) {
    let path = `${servicePath}/reply?ticketId=${ticketId}&description=${description}`;
    return postWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });

}