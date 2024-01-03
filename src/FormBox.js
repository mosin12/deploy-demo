import React from "react";

const FormBox = () => {
  return (
    <div>
      <div
        className="card shadow"
        style={{
          width: "18rem",
          position: "absolute",
          top: "70px",
          left: "20px",
        }}
      >
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 mb-3">
              <label className="fw-bold small mb-1">Select State</label>
              <select
                id="statedd"
                className="form-select"
                aria-label="Default select example"
              >
                <option>Select State</option>
              </select>
            </div>
            <div className="col-md-12 mb-3">
              <label className="fw-bold small mb-1">Select District</label>
              <select
                id="distdd"
                className="form-select"
                aria-label="Default select example"
              >
                <option>Select District</option>
              </select>
            </div>
            <div className="col-md-12 mb-3">
              <label className="fw-bold small mb-1">Select Sub District</label>
              <select id="subdd"
                className="form-select"
                aria-label="Default select example"
              >
                <option >Select Sub District</option>
                
              </select>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBox;
