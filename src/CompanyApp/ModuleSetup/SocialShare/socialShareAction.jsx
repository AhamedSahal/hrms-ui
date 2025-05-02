import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import MediaComponent from '../../../MainPage/MediaComponent';
import { approvePost } from './service';
import { Button, Stack } from '@mui/material';


export default class SocialShareAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            socialShare: props.socialShare || {
                id: 0,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.socialShare && nextProps.socialShare != prevState.socialShare) {
            return ({ socialShare: nextProps.socialShare })
        } else if (!nextProps.socialShare) {
            return ({
                socialShare: {
                    id: 0,
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {

        approvePost(id, status).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
    render() {
        const { socialShare } = this.state;
        return (
            <div>
                {socialShare &&
                    <div>
                        <div className="card post mb-3">
                            <article className="card-body mb-0 pb-0">
                                <h3 className="post-title">{socialShare.title}</h3>
                                <p style={{ fontFamily: "sans-serif" }}>{socialShare.description}</p>
                                <MediaComponent mediaPath={socialShare.mediaPath} mediaType={socialShare.mediaType} />
                            </article>
                        </div>
                        <hr />
                        

                        <Stack direction="row" spacing={1}>

                            <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                this.updateStatus(socialShare.id, "APPROVED");
                            }}
                                variant="contained" color="success">
                                Approve
                            </Button>


                            <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                                this.updateStatus(socialShare.id, "REJECTED");
                            }} variant="contained" color="error">
                                Reject
                            </Button>
                        </Stack>
                    </div>}
            </div>
        )
    }
}
