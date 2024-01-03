import React, { useEffect, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import Query from "@arcgis/core/rest/support/Query.js";
import * as query from "@arcgis/core/rest/query.js";
import $ from "jquery";
import Graphic from "@arcgis/core/Graphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Basemap from "@arcgis/core/Basemap.js";
import SchoolTable from "./SchoolTable.js";
// import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
// import Draw from 'arcgis/views/2d/draw/Draw';

let markerGraphic;
const Mgis = () => {
  const [schData, setSchData] = useState([]);
  const [isDivVisible, setDivVisibility] = useState(false);
  
  const handleCloseClick = () => {
    setDivVisibility(!isDivVisible);
  };
  
  const [schoolCounts, setSchoolCounts] = useState({
    totalpmshriSschool: 0,
    totalKVSschool: 0,
    totalnvsschool: 0,
  });

  useEffect(() => {
   

    fetch("https://pmshri.education.gov.in/apipmshridashboard/api/v1/getstatewisedata/filterwisedata?sid=0&did=0&bid=0")
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          document.getElementById("govtSch").innerHTML =
          " =" + data.totalpmshriSschool;
          document.getElementById("kvsSch").innerHTML =
          " =" +data.totalKVSschool;
          document.getElementById("nvsSch").innerHTML =
          " =" + data.totalnvsschool;
          setSchoolCounts({
            totalpmshriSschool: data.totalpmshriSschool,
            totalKVSschool: data.totalKVSschool,
            totalnvsschool: data.totalnvsschool,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
   
  }, []);


  useEffect(() => {
    const map = new Map({
      basemap: "topo-vector",
      logo: false,
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 4,
      center: [78.9625, 22.5937],
    });

    const admin_url ="https://mapservice.gov.in/gismapservice/rest/services/BharatMapService/Admin_Boundary_Village/MapServer";
    const admin_token ="AYoPi0yUpPCJsWAW5QDg0ErJ0ibsTenyynRDz8ZH4YXdnosgL0K_HXPjufNI4khlVrnhPGMHZ2TH7Zt5nydOjA..";
    const title = "Boundary Village";

    let allIndiaLayer = new MapImageLayer({
      url: admin_url,
      apiKey: admin_token,
      title: title,
      opacity: 0.8,
    });

    view.map.addMany([allIndiaLayer]);
    
    const sch_url = "https://webgis.nic.in/publishing/rest/services/misc/pmshree/MapServer/0";

    const adminFeatureLayer1 = new FeatureLayer({
      url: sch_url,
      outFields: ["*"],
    });

    view.map.add(adminFeatureLayer1);
    adminFeatureLayer1.visible = false;
    view.whenLayerView(allIndiaLayer).then(function () {
      const params = new Query({
        returnGeometry: false,
        outFields: ["STNAME,State_LGD"],
        where: "1=1",
      });
      query
        .executeQueryJSON(admin_url + "/0?token=" + admin_token, params)
        .then(getStateResults)
        .catch();
    });

    function getStateResults(response) {
      var stateFeatures = response.features;
      var optionsArray = [];
      for (var i = 0; i < stateFeatures.length; i++) {
        optionsArray.push({
          value: stateFeatures[i].attributes["State_LGD"],
          label: stateFeatures[i].attributes["STNAME"],
        });
      }
    
      optionsArray.sort(function (a, b) {
        var labelA = a.label.toUpperCase();
        var labelB = b.label.toUpperCase();
        return labelA.localeCompare(labelB);
      });
    
      var curDropOptionsHTML = "<option value='-1'>Select All State</option> ";
      for (var k = 0; k < optionsArray.length; k++) {
        curDropOptionsHTML +=
          "<option value='" +
          optionsArray[k].value +
          "'>" +
          optionsArray[k].label +
          "</option>";
      }
    
      $("#statedd").html(curDropOptionsHTML);
    }
    
    view.on("click", function (event) {
      view.graphics.removeAll();
      view.hitTest(event).then(function (response) {
        if (response.results.length) {
          var graphics = response.results.filter(function (result) {
            return result.graphic.layer === adminFeatureLayer1;
          });

          if (graphics.length > 0) {
            setDivVisibility(true);
            var graphic = graphics[0].graphic;
            var attributes = graphic.attributes.udise_1;
            if (attributes === undefined) {
              alert(" Unable to fetch data.");
              return;
            }
    
            fetch(
              `https://pmshri.education.gov.in/apipmshridashboard/api/v1/school/details/${attributes}`,
              {
                mode: "cors",
                headers: {
                  "Access-Control-Allow-Origin": "*",
                 
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data) {
                  setSchData([data.data]);
                  var point = graphic.geometry;
                  var markerSymbol = {
                    type: "simple-marker",
                    color: [66, 78, 245], // Red color
                    outline: {
                      color: [255, 255, 255], // White color
                      width: 1,
                    },
                    size: 10,
                  };

                  markerGraphic = new Graphic({
                    geometry: point,
                    symbol: markerSymbol,
                  });

                  view.graphics.add(markerGraphic);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        }
      });
    });

     
   var boundaryHighLightGraphicLayer = new GraphicsLayer();
    boundaryHighLightGraphicLayer.title = "BoundaryHighlight";
    view.map.add(boundaryHighLightGraphicLayer);

    const basemaps = [
      {
        id: "topo-vector",
        title: "topo-vector",
        thumbnailUrl: "basemap-images/topo.png",
      },
      {
        id: "satellite",
        title: "Basemap",
        thumbnailUrl: "basemap-images/satellite.png",
      },
      {
        id: "terrain",
        title: " Esri terrain",
        thumbnailUrl: "basemap-images/street.png",
      },
      {
        id: "streets-vector",
        title: "ESRI Street",
        thumbnailUrl: "basemap-images/topo.png",
      },
    ];
    function switchBasemap(basemapId) {
      const selectedBasemap = basemaps.find(
        (basemap) => basemap.id === basemapId
      );
      if (selectedBasemap) {
        view.map.basemap = Basemap.fromId(basemapId);
      } else {
        console.error("Basemap not found");
      }
    }

    const basemapSelector = document.createElement("div");
    basemapSelector.className = "basemap-selector";
    basemapSelector.style.backgroundColor = "white";
    basemaps.forEach((basemap) => {
      const button = document.createElement("button");
      button.textContent = basemap.title;
      button.addEventListener("click", () => {
        switchBasemap(basemap.id);
      });
      button.style.backgroundImage = `url(${basemap.thumbnailUrl})`;
      button.className="basemap-button";  
      basemapSelector.appendChild(button);
    });

    function toggleBasemapSelector() {
      const currentDisplayStyle = basemapSelector.style.display;
      basemapSelector.style.display =
        currentDisplayStyle === "none" ? "block" : "none";
    }

    const displayImage = document.createElement("img");
    displayImage.src = "basemapx.png";
    displayImage.alt = "Show Basemaps";
    displayImage.addEventListener("click", toggleBasemapSelector);

    view.ui.add(displayImage, "top-right");
    view.ui.add(basemapSelector, "top-right");

    
    $("#zoomfullext").on("click",function () {
      allIndiaLayer.when(function () {
        view.goTo(allIndiaLayer.fullExtent);
      
      });
    });
 
 
    $("#zoomprev").on("click",function () {
      var currentZoom = view.zoom;
      view.goTo({
        zoom: currentZoom - 1
      });
    });

    $("#zoomnext").on("click",function () {
      var currentZoom = view.zoom;
      view.goTo({
        zoom: currentZoom + 1
      });
    });

    $("#btnPrint").on("click",function () {
      // alternatePrint();
      window.print();
    });

  
    var curStateCode;
    $( "#statedd" ).on( "change", function() {
      view.graphics.removeAll();
      boundaryHighLightGraphicLayer.graphics.removeAll();
      var curStateLGD = $(this).val();
      curStateCode = Number(curStateLGD);
      adminFeatureLayer1.visible = true;
      fetch(
        `https://pmshri.education.gov.in/apipmshridashboard/api/v1/getstatewisedata/filterwisedata?sid=${curStateCode}&did=&bid=0`,
        {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {   
  setSchoolCounts({
  totalpmshriSschool: data.totalpmshriSschool,
  totalKVSschool: data.totalKVSschool,
  totalnvsschool: data.totalnvsschool,
});
            document.getElementById("govtSch").innerHTML =
              " =" + data.totalpmshriSschool;
              document.getElementById("kvsSch").innerHTML =
              " =" + data.totalKVSschool;
              document.getElementById("nvsSch").innerHTML =
              " =" + data.totalnvsschool;
          }
        })
        .catch((error) => {
          console.error(error);
        });

        if (curStateLGD === "-1") {
          resetFilters();
          return;
        }
        
        const params = new Query({
          returnGeometry: true,
          outFields: ["STNAME"],
          where: "State_LGD=" + curStateLGD,
        });
        query
          .executeQueryJSON(admin_url + "/0?token=" + admin_token, params)
          .then(function (response) {
            // setTimeout(function () {
              zoom(response);
            // }, 300);


            var params = new Query({
              returnGeometry: false,
              outFields: ["dist_lgd ,dtname"],
              where: "State_LGD=" + curStateLGD,
            });

            query
              .executeQueryJSON(admin_url + "/1?token=" + admin_token, params)
              .then(getDistrictResults)
              .catch();
          });
      }
    );
    function getDistrictResults(response) {
      var districtFeatures = response.features;
      districtFeatures.sort(function(a, b) {
        var nameA = a.attributes["dtname"].toUpperCase(); 
        var nameB = b.attributes["dtname"].toUpperCase(); // ignore case
        return nameA.localeCompare(nameB);
      });
      var curDropOptionsHTML = "<option value='-1'>Select  District</option>";
      $("#subdd").empty().html("<option value='-1'>Select Subdistrict</option>");
      for (var i = 0; i < districtFeatures.length; i++) {
        curDropOptionsHTML +=
          "<option value='" +
          districtFeatures[i].attributes["dist_lgd"] +
          "'>" +
          districtFeatures[i].attributes["dtname"] +
          "</option>";
      }
      $("#distdd").html(curDropOptionsHTML);
    }
    var curDistCode;
    $( "#distdd" ).on( "change", function() {
      boundaryHighLightGraphicLayer.graphics.removeAll();
      var curDistLGD = $(this).val();
      curDistCode = Number(curDistLGD);
      fetch(
       
        `https://pmshri.education.gov.in/apipmshridashboard/api/v1/getstatewisedata/filterwisedata?sid=${curStateCode}&did=${curDistCode}&bid=0`,
        {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {

            setSchoolCounts({
              totalpmshriSschool: data.totalpmshriSschool,
              totalKVSschool: data.totalKVSschool,
              totalnvsschool: data.totalnvsschool,
            });
            document.getElementById("govtSch").innerHTML =
            " =" + data.totalpmshriSschool;
            document.getElementById("kvsSch").innerHTML =
            " =" + data.totalKVSschool;
            document.getElementById("nvsSch").innerHTML =
            " =" + data.totalnvsschool;
          }
        })
        .catch((error) => {
          console.error(error);
        });

     
        const dparams = new Query({
          returnGeometry: true,
          outFields: ["dist_lgd ,dtname"],
          where: "Dist_LGD=" + curDistLGD,
        });

        query
          .executeQueryJSON(admin_url + "/1?token=" + admin_token, dparams)
          .then(function (response) {
            // setTimeout(function(){
            zoom(response);
          // },300)
          });
        const params = new Query({
          returnGeometry: false,
          outFields: ["Subdt_LGD,sdtname"],
          where: "Dist_LGD=" + curDistLGD,
        });
        query
          .executeQueryJSON(admin_url + "/2?token=" + admin_token, params)
          .then(getSubDistrictDropResult)
          .catch();
       
      }
    );

    function getSubDistrictDropResult(response) {
      var subDistFeatures = response.features;
      subDistFeatures.sort(function(a, b) {
        var nameA = a.attributes["sdtname"].toUpperCase(); 
        var nameB = b.attributes["sdtname"].toUpperCase(); 
        return nameA.localeCompare(nameB);
      });
      var curDropOptionsHTML = "<option value='-1'>SELECT Subdistrict</option> ";

      for (var i = 0; i < subDistFeatures.length; i++) {
        curDropOptionsHTML +=
          "<option value='" +
          subDistFeatures[i].attributes["subdt_lgd"] +
          "'>" +
          subDistFeatures[i].attributes["sdtname"] +
          "</option>";
      }
      $("#subdd").html(curDropOptionsHTML);
    }

    var cursubDistCode;
    $( "#subdd" ).on( "change", function() {
        boundaryHighLightGraphicLayer.graphics.removeAll();
      var cursubDistLGD = $(this).val();

      cursubDistCode = Number(cursubDistLGD);
      fetch(
       
        `https://pmshri.education.gov.in/apipmshridashboard/api/v1/getstatewisedata/filterwisedata?sid=${curStateCode}&did=${curDistCode}&bid=${cursubDistCode}`,
        {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) {

            setSchoolCounts({
              totalpmshriSschool: data.totalpmshriSschool,
              totalKVSschool: data.totalKVSschool,
              totalnvsschool: data.totalnvsschool,
            });
            document.getElementById("govtSch").innerHTML =
            " =" + data.totalpmshriSschool;
            document.getElementById("kvsSch").innerHTML =
            " =" + data.totalKVSschool;
            document.getElementById("nvsSch").innerHTML =
            " =" + data.totalnvsschool;
          }
        })
        .catch((error) => {
          console.error(error);
        });

      if (cursubDistLGD === "-1") {
        $("#loader").addClass("d-none");
      } else {
      
        const suparams = new Query({
          returnGeometry: true,
          outFields: ["Subdt_LGD,sdtname"],
          where: "subdt_lgd=" + cursubDistLGD,
        });

        query
          .executeQueryJSON(admin_url + "/2?token=" + admin_token, suparams)
          .then(function (response) {
            // setTimeout(function(){
              zoom(response);
            // },300)
            });
        
      }
    });
   
    function zoom(fs) {
      
      if (fs && fs.features && fs.features.length > 0) {
        var current_geometry = fs.features[0].geometry;
        let simpleLineSymbol = {
          type: "simple-line",
          color: "red",
          width: "3px"
          
        };

        let highLightGraphics = new Graphic({
          geometry: current_geometry,
          symbol: simpleLineSymbol,
        });

        boundaryHighLightGraphicLayer.add(highLightGraphics);
        var curGeomExtent = fs.features[0].geometry.extent;
        view.extent = curGeomExtent.expand(1.5);
       
      }
    }
    function resetFilters() {
      $("#statedd").val("-1");
      $("#distdd").empty().html("<option value='-1'>Select District</option>");
      $("#subdd").empty().html("<option value='-1'>Select Subdistrict</option>");
      boundaryHighLightGraphicLayer.graphics.removeAll();
      allIndiaLayer.when(function () {
        view.goTo(allIndiaLayer.fullExtent);
      });
      adminFeatureLayer1.visible = false;
      fetch("https://pmshri.education.gov.in/apipmshridashboard/api/v1/getstatewisedata/filterwisedata?sid=0&did=0&bid=0")
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        setTimeout(() => {
        setSchoolCounts({
          totalpmshriSschool: data.totalpmshriSschool,
          totalKVSschool: data.totalKVSschool,
          totalnvsschool: data.totalnvsschool,
        });
        document.getElementById("govtSch").innerHTML = " =" + data.totalpmshriSschool;
        document.getElementById("kvsSch").innerHTML = " =" + data.totalKVSschool;
        document.getElementById("nvsSch").innerHTML = " =" + data.totalnvsschool;
      }, 500);
      }
      
    })
    .catch((error) => {
      console.error(error);
    });
    }
    
  }, []);

  return (
    <div className="App">
      
      <SchoolTable schoolCounts={schoolCounts} />
      <div id="mapprint">
        <div id="viewDiv" style={{ width: "100%", height: "60vh" }}>
        
          <div className="sch_table" style={{width:"320px"}}>
            {isDivVisible && (
              <>

               
<div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    background: "#443c78",
    color: "#fff",
    height: "37px", 
  }}
>
  <h5 style={{ margin: "17px", textAlign: "center", fontSize: "18px", fontfamily: "auto"}}>School Data</h5>
  <button className="closeButton" onClick={handleCloseClick}>
    X
  </button>
</div>

                <div
                  className="table-responsive"
                  style={{ width: "100%", height: "220px" }}
                >
                  <table className="table mx-0 mt-1">
                    <tbody>
                      {schData.map((school, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td style={{ fontSize: "15px" }}>
                              School Name
                            </td>
                            <td style={{ fontSize: "15px" }}>{school.school_name}</td>
                          </tr>
						  <tr>
                            <td style={{ fontSize: "15px" }}>
                              School Code
                            </td>
                            <td style={{ fontSize: "15px" }}>{school.udise_sch_code}</td>
                          </tr>

                          <tr>
                            <td style={{ fontSize: "15px" }}>
                              Category Name
                            </td>
                            <td style={{ fontSize: "15px" }}>{school.category_name}</td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: "15px" }}>
                              School Status
                            </td>
                            <td style={{ fontSize: "15px" }}>{school.schoolstatus_name}</td>
                          </tr>
						  <tr>
                            <td style={{ fontSize: "15px" }}>
                              Total Boys
                            </td>
                            <td style={{ fontSize: "15px" }}>{school.total_boys}</td>
                          </tr>
						  <tr>
                            <td style={{ fontSize: "15px" }}>
                              Total Girls
                            </td>
                            <td style={{ fontSize: "15px" }}>{school.total_girls}</td>
                          </tr>
                          
                          <img src="basemap-images/forward.png" alt="ZoomIn" />
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mgis;
