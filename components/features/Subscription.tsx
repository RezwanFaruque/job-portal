import React from "react";

const SubscribeSection: React.FC = () => {
  return (
    <section className="subscribe">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="main-section">
              <div className="title">
                Subscribe Newsletter & 
                <div>Ready for some good news?</div>
              </div>

              <div className="body">
                Every other week, we’ll send you emails with uplifting news of people
                banding together, opportunities to make a difference, and jobs that
                help others.
              </div>

              <div className="search-section">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your email address"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <button className="search-subscribe" type="submit">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;