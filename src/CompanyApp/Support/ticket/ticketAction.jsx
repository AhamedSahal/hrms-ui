import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup, InputGroup } from 'reactstrap';
import { getTitle,toLocalDateTime } from '../../../utility';
import { getTicketReplies, saveTicketReply } from './service';
import { TicketSchema } from './validation';

export default class TicketAction extends Component {
    constructor(props) {
        super(props)
        console.log({ props })
        this.state = {
            id: props.match.params.id,
            ticket: {}
        }
    }
    componentDidMount() {
        getTicketReplies(this.state.id).then(res => {

            this.setState({
                ticket: res.data
            });
        })
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveTicketReply(data.ticketId, data.description).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                action.resetForm({ ticketId: data.ticketId, description: '' });
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false);
            this.setState({ ticket: res.data, description: "" })
        }).catch(err => {
            toast.error("Error while saving ticket");
            action.setSubmitting(false);
        })
    }
    render() {
        const { ticket } = this.state;
        return (

            <div className="page-wrapper">
                <Helmet>
                    <title>Ticket  | {getTitle()}</title>
                </Helmet>
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Ticket</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                    <li className="breadcrumb-item"><Link to={"/app/company-app/support/ticket"}>Ticket List</Link></li>
                                    <li className="breadcrumb-item active">Ticket#:{ticket?.ticketCode}</li>
                                </ul>
                            </div>
                            <div className="float-right col-auto ml-auto">
                                <span style={{color: 'white'}}>Ticket# :{ticket?.ticketCode}</span>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">

                            <div className="chat-main-row">
                                <div className="chat-main-wrapper">
                                    <div className="col-lg-5 message-view task-view task-left-sidebar" style={{ height: "75vh" }}>
                                        <table className="table">
                                            <tr>
                                                <th>Ticket Number</th>
                                                <td>{ticket?.ticketCode}</td>
                                            </tr>
                                            <tr>
                                                <th>Status</th>
                                                <td>{ticket?.status}</td>
                                            </tr>
                                            <tr>
                                                <th>Priority</th>
                                                <td>{ticket?.priority}</td>
                                            </tr>
                                            <tr>
                                                <th>Subject</th>
                                                <td>{ticket?.subject}</td>
                                            </tr>
                                            <tr>
                                                <th>Description</th>
                                                <td colSpan="3">{ticket?.description}</td>
                                            </tr>
                                        </table>
                                    </div>
                                    <hr />
                                    <div className="col-lg-7 message-view task-chat-view task-right-sidebar">
                                        <div className="chat-window">
                                            <div className="chat-contents task-chat-contents">
                                                <div className="chat-content-wrap">
                                                    <div className="chat-wrap-inner">
                                                        <div className="chat-box">
                                                            <div className="chats">
                                                                {ticket && ticket.ticketReplies && ticket.ticketReplies.map((v, i) => {

                                                                    return <>

                                                                        <div className="chat chat-left">
                                                                            <div className="chat-body">
                                                                                <div className="chat-bubble">
                                                                                    <div className="chat-content">
                                                                                        <span className="task-chat-user">{v.repliedBy}
                                                                                        </span> <span className="chat-time">{toLocalDateTime(v.repliedOn)}</span>
                                                                                        <p>{v.description}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </>
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                            <div className="chat-footer">
                                                <div className="message-bar">
                                                    <div className="message-inner">
                                                        <div className="message-area">
                                                            <Formik
                                                                enableReinitialize={true}
                                                                initialValues={{
                                                                    ticketId: this.state.id,
                                                                    description: this.state.description || ""
                                                                }}
                                                                onSubmit={this.save}
                                                            >
                                                                {({
                                                                    values,
                                                                    errors,
                                                                    touched,
                                                                    handleChange,
                                                                    handleBlur,
                                                                    handleSubmit,
                                                                    isSubmitting,
                                                                    setFieldValue,
                                                                    setSubmitting
                                                                    /* and other goodies */
                                                                }) => (
                                                                    <Form>
                                                                        <InputGroup>

                                                                            <Field name="description"
                                                                                component="textarea" rows="2"
                                                                                className="form-control"
                                                                                placeholder="Description"
                                                                            >
                                                                            </Field>
                                                                            <span className="input-group-append">
                                                                                <button className="btn btn-primary" type="submit"><i className="fa fa-send" /></button>
                                                                            </span>
                                                                        </InputGroup>
                                                                    </Form>)}
                                                            </Formik>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        )
    }
}
