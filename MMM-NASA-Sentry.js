Module.register("MMM-NASA-Sentry", {

  defaults: {
    apiKey: "",
  },

  getStyles: function() { return ["NASA-Sentry.css"]},
  getScripts: function() { return ["util.js"]},
  getDom: function() {

    let neoWindow = document.createElement("div");
    neoWindow.id = "neo-window";

    let now = new Date();
    //let dateDeets = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = `${now.getFullYear()}-${(now.getMonth() + 1).toString(10).padStart(2, "0")}-${now.getDate().toString(10).padStart(2, "0")}`;
    let apiKey = this.config.apiKey;
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      let neoData = myJson;
      console.log(neoData);
      grabFirstRock(neoData);
    });

    function grabFirstRock(neoData) {
      let neoID = neoData.near_earth_objects[date][0].id;
      fetch(`https://api.nasa.gov/neo/rest/v1/neo/${neoID}?api_key=${apiKey}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        let objData = myJson;
        console.log(objData);
        showNEO(objData, neoData);
      });
    }

    function showNEO(obj, neos) {

      function makeOrbit(a, e, i, lan, peri, t, id) {
        //------------------------------------------------//
        //Draws an ellipse representing an orbit, and sets//
        //  a circle orbiting around it                   //
        //float-> a: semi-major axis of the ellipse       //
        //float-> e: eccentricity of the ellipse          //
        //float-> i: inclination of the orbit             //
        //float-> lan: longitude of ascending node of     //
        //  the orbit                                     //
        //float-> peri: argument of perihelion of the     //
        //  orbit                                         //
        //float-> t: period of the orbit                  //
        //string-> id: id of the element                  //
        //------------------------------------------------//

        let b = findSemiMinor(a, e);
        let f = findFocus((a * factor), (b * factor));
        let trans = `rotate3d(0, 0, 1, -${lan}deg) rotate3d(0, 1, 0, -${i}deg) rotate3d(0, 0, 1, -${peri}deg)`;
        let orbit = makeSVG("ellipse", id, "orbit");
          orbit.setAttribute("cx", ((svgSize / 2) - focus) + f);
          orbit.setAttribute("cy", (svgSize / 2));
          orbit.setAttribute("rx", a * factor);
          orbit.setAttribute("ry", b * factor);
          orbit.style.transform = trans;
          orbit.style.transformOrigin = `${tOrigin}%`;
        neoSvg.appendChild(orbit);

        let rock = makeSVG("circle", null, "rock");
          rock.setAttribute("r", 3);
          rock.style.transform = trans;
          rock.style.transformOrigin = `${tOrigin}%`;
        neoSvg.appendChild(rock);

        let angle = 0;
        let interval = (360 / t) / 500;

        let orbt = setInterval(function() {
          let x = (((svgSize / 2) - focus) + f) + ((a * factor) * Math.cos(angle));
          let y = (svgSize / 2) + ((b * factor) * Math.sin(angle));
          rock.setAttribute("cx", x);
          rock.setAttribute("cy", y);
          angle -= interval;
        }, 10);

        return orbit;
      }

      let divBox = neoWindow.getBoundingClientRect();
      //let svgSize = 500;
      let svgSize = divBox.height * .66666666;
      let semiMajor = parseFloat(obj.orbital_data.semi_major_axis);
      let e = parseFloat(obj.orbital_data.eccentricity);
      let semiMinor = findSemiMinor(semiMajor, e);
      let factor = (svgSize / 3) / semiMajor;
      let focus = findFocus(semiMajor * factor, semiMinor * factor);
      let iDeg = parseFloat(obj.orbital_data.inclination);
      let node = parseFloat(obj.orbital_data.ascending_node_longitude);
      let orbtPeriod = parseFloat(obj.orbital_data.orbital_period);
      let argOfPer = parseFloat(obj.orbital_data.perihelion_argument);
      let tOrigin = (((svgSize / 2) - focus) / svgSize) * 100;

      let neoDiv = makeElement("div", "neoDiv");
        let neoSvg = makeSVG("svg", "neoSvg");
          neoSvg.setAttribute("height", svgSize);
          neoSvg.setAttribute("width", svgSize);
          neoSvg.setAttribute("viewBox", `0 0 ${svgSize} ${svgSize}`);
          //☉
          //Makes the circle that represents the sun
          let sun = makeSVG("circle", "sun");
            sun.setAttribute("cx", (svgSize / 2) - focus);
            sun.setAttribute("cy", (svgSize / 2));
            sun.setAttribute("r", 2);
          neoSvg.appendChild(sun);
          //☿
          //Mercury orbit
          let mercury = makeOrbit(.387098, .205630, 7.005, 48.331, 29.124, 87.9691, "mercury");
          //♀
          //Venus orbit
          let venus = makeOrbit(.723332, .006772, 3.39458, 76.680, 54.884, 224.701, "venus");
          //🜨
          //Earth orbit
          let earth = makeOrbit(1, .0167086, 0, 348.7396, 114.20783, 365.256363004, "earth");
          //♂
          //Mars orbit
          let mars = makeOrbit(1.523679, .0934, 1.850, 49.558, 286.502, 686.971, "mars");
          //
          //Asteroid orbit
          let asteroid = makeOrbit(semiMajor, e, iDeg, node, argOfPer, orbtPeriod, "asteroid");
        neoDiv.appendChild(neoSvg);

        //let neoWindow = document.getElementById("neo-window");
        neoWindow.appendChild(neoDiv);
    }

    return neoWindow;
  }
})



