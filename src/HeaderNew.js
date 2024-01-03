import './index.css';
import React from 'react';
const HeaderNew = () => {
  return (
    <div className="sidebar-noneoverflow">
      <header className="header">

        <div className="header-top">
          <div className="container d-flex align-items-center justify-content-between">
            <ul className="list-unstyled d-flex align-items-center mb-0 left-list mob-header">
              <li>भारत सरकार<br />Government of India
              </li><li> शिक्षा मंत्रालय<br />Ministry of Education</li>
            </ul>
            <ul className="list-unstyled d-flex align-items-center mb-0">
              <li className="d-none d-lg-block"><a href="#mainContent">Skip To Main Content</a></li>
              <li className="d-none d-lg-block"><a href="#main_content_2">Skip To Navigation</a></li>
              <li className="d-none d-lg-block"><a href="#main_content_3">Screen Reader Access</a></li>
            </ul>
          </div>
        </div>

        <div>
          <nav className="navbar navbar-expand-lg">
            <div className="container">
            <ul className="list-unstyled d-flex align-items-center mb-0 left-list mob-header">
            <img  src="pmshree.png" alt="Logo" style={{ height: '52px' }} ></img>
            </ul>
            <ul className="list-unstyled d-flex align-items-center mb-0 ">
            <img src="emblem.ca.svg " alt="Logo" className="d-none d-lg-block" style={{ height: '52px' }}></img>
            </ul>
              
            </div>
          </nav>
          
          
        </div>

        {/* <ul >
              <li>Home</li>
              <li>About PM SHRI</li>
              <li>DASHBOARD</li>
              <li>GALLERY</li>
              <li>METHODOLOGY</li>
              <li>PM SHRI LOGIN</li>
            </ul>  */}

      </header>
    </div>
  );
};

export default HeaderNew;
