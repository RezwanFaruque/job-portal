import React from "react";

const PrimaryJobInformationPage: React.FC = () => {
  return (
    <div id="primary-job-information" className="pt-4">
      <div className="container">
        <h3 className="mb-3">Post a Job - Primary Information</h3>
        <form>
          <div className="mb-3">
            <label htmlFor="jobTitle" className="form-label">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              className="form-control"
              placeholder="e.g., Frontend Developer"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              className="form-control"
              placeholder="e.g., Acme Corp"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              id="location"
              className="form-control"
              placeholder="City, State or Remote"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Job Description
            </label>
            <textarea
              id="description"
              className="form-control"
              rows={4}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Next
          </button>
        </form>
        <p>This page will collect the primary details required when posting a job.</p>
      </div>
    </div>
  );
};

export default PrimaryJobInformationPage;
