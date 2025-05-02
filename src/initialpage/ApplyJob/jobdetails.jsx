import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { headerlogo, lnEnglish, lnFrench, lnSpanish, lnGerman } from "../../Entryfile/imagepath.jsx";

const JobDetails = () => {
  const [isViewModal, setIsViewModal] = useState(false);

  useEffect(() => {
    window.onpopstate = () => {
      localStorage.removeItem("jobview");
      window.location.reload();
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  

  return (
    <div className="main-wrapper">
      <Helmet>
        <title>Jobs - WorkPlus</title>
        <meta name="description" content="Login page" />
      </Helmet>

      {/* Header */}
      <div className="header">
        <div className="header-left">
          <a href="/app/main/dashboard" className="logo">
            <img src={headerlogo} width={40} height={40} alt="" />
          </a>
        </div>

        <div className="page-title-box float-left">
          <h3>Dreamguy's Technologies</h3>
        </div>

        <ul className="nav user-menu">
          <li className="nav-item">
            <div className="top-nav-search">
              <form action="/app/pages/search">
                <input className="form-control" type="text" placeholder="Search here" />
                <button className="btn" type="submit">
                  <i className="fa fa-search" />
                </button>
              </form>
            </div>
          </li>

          <li className="nav-item dropdown has-arrow flag-nav">
            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button">
              <img src={lnEnglish} alt="" height={20} /> <span>English</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a href="" className="dropdown-item">
                <img src={lnEnglish} alt="" height={16} /> English
              </a>
              <a href="" className="dropdown-item">
                <img src={lnFrench} alt="" height={16} /> French
              </a>
              <a href="" className="dropdown-item">
                <img src={lnSpanish} alt="" height={16} /> Spanish
              </a>
              <a href="" className="dropdown-item">
                <img src={lnGerman} alt="" height={16} /> German
              </a>
            </div>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/login">
              Login
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/register">
              Register
            </a>
          </li>
        </ul>
      </div>

      {/* Page Wrapper */}
      <div className="page-wrapper job-wrapper">
        <div className="content container">
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Jobs</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/app/main/dashboard">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item active">Jobs</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              <div className="job-info job-widget">
                <h3 className="job-title">Android Developer</h3>
                <span className="job-dept">App Development</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="job-det-info job-widget">
                <button className="btn job-btn" onClick={() => setIsViewModal(true)}>
                  Apply For This Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Job Modal */}
        {isViewModal && (
          <div className="modal custom-modal fade show d-block" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Your Details</h5>
                  <button type="button" className="close" onClick={() => setIsViewModal(false)}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label>Name</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                      <label>Message</label>
                      <textarea className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Upload your CV</label>
                      <div className="custom-file">
                        <input type="file" className="custom-file-input" id="cv_upload" />
                        <label className="custom-file-label" htmlFor="cv_upload">
                          Choose file
                        </label>
                      </div>
                    </div>
                    <div className="submit-section">
                      <button type="button" className="btn btn-primary submit-btn" onClick={() => setIsViewModal(false)}>
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
