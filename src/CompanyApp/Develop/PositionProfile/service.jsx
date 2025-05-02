import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/position-profile";

export function getQualificationList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTrainingList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTechnicalList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getLeadershipList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getBehaviouralList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getHonoursList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getLicenseList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getMembershipList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getLanguageList(empJobtitle) {
    let get=getWithAuth(`${servicePath}?&empJobtitle=${empJobtitle}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function saveQualificationFrom(qualification) {
    console.log('cell ******', qualification)
    // let post = qualification.id == 0 ? postWithAuth(servicePath, qualification)
    //     : putWithAuth(`${servicePath}?id=${qualification.id}`, qualification);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveTrainingCourse(training) {
    console.log('cell ******', training)
    // let post = training.id == 0 ? postWithAuth(servicePath, training)
    //     : putWithAuth(`${servicePath}?id=${training.id}`, training);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveTechnicalCompetencies(technical) {
    console.log('cell ******', technical)
    // let post = technical.id == 0 ? postWithAuth(servicePath, technical)
    //     : putWithAuth(`${servicePath}?id=${technical.id}`, technical);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveLeadershipCompetencies(leadership) {
    console.log('cell ******', leadership)
    // let post = leadership.id == 0 ? postWithAuth(servicePath, leadership)
    //     : putWithAuth(`${servicePath}?id=${leadership.id}`, leadership);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}


export function saveBehaviouralCompetencies(qualification) {
    console.log('cell ******', qualification)
    // let post = qualification.id == 0 ? postWithAuth(servicePath, qualification)
    //     : putWithAuth(`${servicePath}?id=${qualification.id}`, qualification);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveHonoursAndAward(honours) {
    console.log('cell ******', honours)
    // let post = honours.id == 0 ? postWithAuth(servicePath, honours)
    //     : putWithAuth(`${servicePath}?id=${honours.id}`, honours);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveLicenseAndCertificate(license) {
    console.log('cell ******', license)
    // let post = license.id == 0 ? postWithAuth(servicePath, license)
    //     : putWithAuth(`${servicePath}?id=${license.id}`, license);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveMembership(membership) {
    console.log('cell ****** 333', membership)
    // let post = membership.id == 0 ? postWithAuth(servicePath, membership)
    //     : putWithAuth(`${servicePath}?id=${membership.id}`, membership);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function saveLanguage(language) {
    console.log('cell ******', language)
    // let post = language.id == 0 ? postWithAuth(servicePath, language)
    //     : putWithAuth(`${servicePath}?id=${language.id}`, language);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}

export function deleteIndividualProfile (profileId) {
    console.log('cell ******', profileId)
    // let path = servicePath + "?id=" + encodeURIComponent(profileId);
    // return deleteWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}

