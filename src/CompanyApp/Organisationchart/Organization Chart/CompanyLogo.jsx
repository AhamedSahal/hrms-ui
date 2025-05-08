import React, { Component } from "react";
import { companyLogoURL } from "../../../HttpRequest";
import { getDefaultProfilePicture } from "../../../utility";

export default class CompanyLogo extends Component {
    constructor(props) {
        super(props);
    }
     triggerCompanyLogoLoad = (id)=>{
        companyLogoURL(id)
            .then((url) => {
             window.bindProfilePhoto(id,url);
            })
            .catch((error) => {
              console.warn('Error retrieving employee profile photo:', error);
            });
        }

    render() {
        const { id } = this.props;
        const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAK4SURBVFiF7dZNiJVlFAfw34x3xg8cM0TJxaRW5IipBaZulGuOLRrsS1MxaFfiQqMwpRhhlEj8ID+Yle4UF7nqwxZtdNOmRR9KGy0oFJEgaCGKOuW0OM87vvP63juX6c6q+cPlfe77nPec/3PO/xwexvF/R8sY+HwOr+E+JuAftOJrfDcG8YZQwR68lQLn0YpN2If2/EY+A91YJhiPBgvxMa7gMbyB6WnvHH7E49iBDzCY/3gu3h9lYHhFHCDDCaxI68l4B++l/yvwZtFBNf1Gi/3puUBooA2fioNlWIeXCvZaazicjG34EEtGCN6BP9N6C9aLcuwW6c5IfCVKDFcxuxaBdhwUdTuMlVhbh0Bncgh3hRA3iGwUSdxPz9+EHkoJdOMMrmEA/VhVh8AdTEnrFiGuPdiMrhyJeaJTJPs7tQi0Z5s51OuM3/FkWg8I5Q+iV5Tk6URiO24mu2dwOe+k6oEIp+JYehI13ViHAOxN9tNwVGiIOOABUY4KJmGinAizgTE3d5p7+EGIcI2o1xcjEPhFpPkbXBR9vkhkpkOc+Dz+FsI+hb/yDqpGbsMpmFln/wWR6qys0zBHnJjQx7uiG4ZQ0RgqIpWDIn03SmzO4w8cwk+4gOuYJUS8DKfxaFmAqvoZ+AjzRRaON0C8C2+LjGwVcyFDX96wkQz04FcPVNuPXfikxLZFqP02Tjbgu+YkzNCJ53E29+4KfsarJfa9+FZMxvX/lUAbdsq1TA5f4lk8UQh+QXTQ56L1Fj78aTmqHtbA3kKAMoL9oud3lnzfKmbCI4X3fY0QeB0v1wmeoVOIsrvG/gwcMfzeMSKBp0Q6m4XFht81hhEoamCSuDgcbCKBS2Ie9JRtFgn0peD3mkgAPsNSkd1SLBfz+cUmB86jIvRyuPgSvsctrBYzfawwUYzscYxjCP8CgZJ37r69hzUAAAAASUVORK5CYII="

        this.triggerCompanyLogoLoad(this.props.id)
        return (
            <img className="events-proPic"
                src={defaultImage}  data-load-profile-image={id} data-profile-photo-id={id}
                alt="WorkPlus"
            />
        );
    }
}