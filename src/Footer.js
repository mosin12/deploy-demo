import React from "react";

const Footer = () => {
  return (
    <div className="footer-wrapper admin-footer" style={{ bottom: '0px' }}>
       <div className="container d-flex justify-content-between">
        <div className="footer-section f-section-1">
          <ul>
            <li>Home</li>
            <li>About UDISE</li>
            <li>Get UDISE Code</li>
            <li>Data Capture Formats</li>
            <li>Publications & Statistics</li>
            <li>FAQ's</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="footer-section f-section-2">
            <ul>
                <li>Digital Repository</li>
                <li>Department of school Education & Literacy</li>
                <li>School GIS</li>
                <li>Ministry Of Education</li>
                <li>Click Here For UDISE 2018-19</li>
                <li>Click Here For UDISE 2019-20 for all States/UT</li>
            </ul>
        </div>
        <div className="footer-section f-section-2">
            <ul>
                <h5>Website Policy</h5>
                <li>Site Map</li>
            </ul>
        </div>
        <div className="footer-section f-section-3">
          <img src="nic.png" alt="footerm"></img>
          <p className="text-white">This site is designed, developed, hosted and maintained by
            <br /> National Informatics Centre (NIC). Ministry of Education.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
