"use client";

import React from "react";

const SpecialSkill: React.FC = () => (
  <div id="special_skills">
    <div className="accordion" role="tablist">
      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">Specializations</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="specialization">
          <div className="specialization-info">
            <div className="title">Add skill</div>
            <div className="title-with-button">
              <div className="title">Skill 1</div>
              <div className="button">
                <button className="edit-button" type="button">
                  Edit
                </button>
                <button className="delete-button" type="button">
                  Delete
                </button>
              </div>
            </div>

            <div className="info-special-skills-section">
              <div className="skill-title">Microsoft Powerpoint</div>
              <div className="skill-description">
                <p>
                  Phasellus finibus enim nulla, quis ornare odio facilisis eu.
                  Suspendisse ornare ante sit amet arcu semper, vel eleifend
                  tortor egestas. Aenean luctus, lorem in hendrerit interdum,
                  leo orci egestas diam, ac euismod massa est et turpis. Etiam
                  auctor lectus vel neque convallis pharetra
                </p>
              </div>
            </div>

            <div className="specialization-input">
              <form>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">Skill 2</label>
                      <input
                        className="form-control"
                        placeholder="write your skill.."
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Skill Description *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe your skill..."
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="buttons">
                      <button type="submit" className="save">
                        save
                      </button>
                      <button type="button" className="close">
                        close
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">Language Proficiency</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="language-profiency">
          <div className="language-skills">
            <div className="title-with-buttons">
              <div className="title">Language 1</div>
              <div className="button">
                <button className="edit-button" type="button">
                  Edit
                </button>
                <button className="delete-button" type="button">
                  Delete
                </button>
              </div>
            </div>

            <div className="language-info-details">
              <div className="language-name">English</div>
              <div className="language-level-withname">
                <div className="l-name">Language Level</div>
                <div className="l-level">Medium</div>
              </div>
            </div>

            <div className="language-info-input-form">
              <form>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">Language</label>
                      <input
                        className="form-control"
                        placeholder="write your Language.."
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Language Level</label>
                      <select className="form-select">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="buttons">
                      <button type="submit" className="save">
                        save
                      </button>
                      <button type="button" className="close">
                        close
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-sections">
        <header className="p-1 title-with-toggle" role="tab">
          <div className="title">References</div>
          <div className="toggle-icon">
            <i className="fas fa-chevron-down" />
          </div>
        </header>
        <div className="collapse-body" id="reference">
          <div className="reference-section">
            <div className="reference-info">
              <div className="title-with-button">
                <div className="title">Reference 1</div>
                <div className="button">
                  <button className="edit-button" type="button">
                    Edit
                  </button>
                  <button className="delete-button" type="button">
                    Delete
                  </button>
                </div>
              </div>

              <div className="reference-details">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="info">
                      <div className="title">Name</div>
                      <div className="inf">- MOHAMMAD ALI</div>
                    </div>

                    <div className="info">
                      <div className="title">Company Name</div>
                      <div className="inf">- Abc Comany</div>
                    </div>

                    <div className="info">
                      <div className="title">Email</div>
                      <div className="inf">- example@gmail.com</div>
                    </div>

                    <div className="info">
                      <div className="title">Relation</div>
                      <div className="inf">- Family Member</div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="info">
                      <div className="title">Designation</div>
                      <div className="inf">- Senior UI/UX Designer</div>
                    </div>
                    <div className="info">
                      <div className="title">Company Address</div>
                      <div className="inf">- Dhaka, Bangaldesh</div>
                    </div>
                    <div className="info">
                      <div className="title">Phone</div>
                      <div className="inf">- 01234 567890</div>
                    </div>
                    <div className="info">
                      <div className="title">Address</div>
                      <div className="inf">- Noakhali 3800, Bangladesh</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="reference-input">
              <div className="title">Reference 2</div>
              <form>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">Name*</label>
                      <input className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Company Name*</label>
                      <input className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">relations*</label>
                      <select className="form-select">
                        <option>Relative</option>
                        <option>Family Member</option>
                        <option>Academic</option>
                        <option>Professionals</option>
                        <option>Others</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="mb-3">
                      <label className="form-label">Designation *</label>
                      <input className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Company Address *</label>
                      <input className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone*</label>
                      <input className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Location*</label>
                      <input className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="buttons">
                      <button type="submit" className="save">
                        save
                      </button>
                      <button type="button" className="close">
                        close
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SpecialSkill;

