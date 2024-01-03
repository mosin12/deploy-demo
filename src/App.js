
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Container, Card, Col, Row, Form } from 'react-bootstrap';
import Mgis from './Mgis';
import './SmallCard.css';



function App() {

  return (
    <div className="faq-layouting layout-spacing">
      <section id="mainContent">
        <div className="App">
         
          <Container className="p-3">
            <Row>
              <Col md="6" sm="6">
                <Card >
                  <Mgis />

                  <div style={{ right: '0px', paddingTop: '15%', position: 'absolute', zIndex: '25' }} >
                    <ul id="myiconmenu" className="iconmenu">

                      <li id="zoomfullext" data-toggle="tooltip" data-placement="left" title="Full Extent">
                        <button id="zoomfullextButton">
                          <img src="basemap-images/fullextent.png" alt="FullEXT" />
                        </button>
                      </li>
                      <li id="zoomprev" data-toggle="tooltip" data-placement="left" title="ZoomOut">
                        <button id="zoomprevButton">
                          <img src="basemap-images/backward.png" alt="ZoomOut" />
                        </button>
                      </li>
                      <li id="zoomnext" data-toggle="tooltip" data-placement="left" title="zoomIn">
                        <button id="zoomnextButton">
                          <img src="basemap-images/forward.png" alt="ZoomIn" /></button>
                      </li>
                      <li id="btnPrint" data-toggle="tooltip" data-placement="left" title="Print" className="subiconmenu">
                        <button id="btnPrintButton">
                          <img src="basemap-images/print.png" alt="print" />
                        </button>
                      </li>


                    </ul>
                  </div>
                </Card>
              </Col>

              <Col md="6" sm="6">

                <Card className="p-3">
                  <Row>
                    <Col>
                      <Form.Group controlId="dropdown1">
                        <Form.Label>Select State</Form.Label>
                        <select id="statedd" className="form-select" aria-label="Default select example" >
                          <option>Select State</option>
                        </select>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group controlId="dropdown2">
                        <Form.Label>Select District</Form.Label>
                        <select
                          id="distdd"
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option>Select District</option>
                        </select>

                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Group controlId="dropdown3">
                        <Form.Label>Select Block</Form.Label>

                        <select id="subdd" className="form-select" aria-label="Default select example">
                          <option>Select Sub District</option>
                        </select>

                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <div className="row">
                      <Col sm={4} className="ps-1 pe-1">
                        <div className="small-card">
                          <span className="icon">
                            <img src="school-flag-1.svg" alt="" />
                          </span>
                          <div className="card-text">
                            <h5>
                              Government+<br />{' '}
                            </h5>
                            <h6 >Govt. Aided School <span id="govtSch"></span></h6>
                          
                          </div>
                        </div>
                      </Col>
                      <Col sm={4} className="ps-1 pe-1">
                        <div className="small-card bg-purple">
                          <span className="icon">
                            <img src="school-flag-1.svg" alt="" />
                          </span>
                          <div className="card-text">
                            <h5>
                              KVS<br />
                            </h5>{' '}
                            <h6>Kendriya Vidyalaya Sangathan<span id="kvsSch"></span></h6>
                          </div>
                        </div>
                      </Col>
                      <Col sm={4} className="ps-1 pe-1">
                        <div className="small-card bg-dark-purple">
                          <span className="icon">
                            <img src="school-flag-1.svg" alt="" />
                          </span>
                          <div className="card-text">
                            <h5>
                              NVS<br />
                            </h5>
                            <h6>Navodaya Vidyalaya Samiti<span id="nvsSch"></span></h6>
                          </div>
                        </div>
                      </Col>
                    </div>
                    <div id="totalCount">
                     
                    </div>
                  </Row>
                </Card>
                <br></br> 
<div id="chart"></div>
                {/* <Card>
                 
                  <img src="Chart.png" alt="Chart" />
                </Card> */}
              </Col>


            </Row>
          </Container>
        </div>

      </section>
    </div>


  );

}


export default App;
