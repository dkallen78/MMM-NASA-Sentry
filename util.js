function makeElement(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an HTML element                             //
  //----------------------------------------------------//
  //type(string): type of HTML element to create        //
  //id(string): id of the element                       //
  //classes(string): classes to add to the element      //
  //----------------------------------------------------//
  //return(element): HTML element                       //
  //----------------------------------------------------//

  let element = document.createElement(type);
  if (typeof id === "string") {element.id = id}
  classes.forEach(x => element.classList.add(x));
  return element;
}

function makeSVG(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an SVG element of the type indicated        //
  //----------------------------------------------------//
  //type(string): type of SVG element to create         //
  //id(string): id of the element                       //
  //classes(string): classes to add to the element      //
  //----------------------------------------------------//
  //return(element): SVG element                        //
  //----------------------------------------------------//

  let svg = document.createElementNS("http://www.w3.org/2000/svg", type);
  if (typeof id === "string") {svg.id = id}
  classes.forEach(x => svg.classList.add(x));
  return svg;
}

function clearElement(...elements) {
  //----------------------------------------------------//
  //Clears the innerHTML of any number of elements      //
  //----------------------------------------------------//
  //elements(element): elements to be cleared           //
  //----------------------------------------------------//

  elements.forEach(x => x.innerHTML = "");
}

function insertCommas(x) {
  //----------------------------------------------------//
  //Inserts commas between every third digit of a number//
  //  to increase readability on larger numbers         //
  //----------------------------------------------------//
  //x(string/number): number to insert commas into      //
  //----------------------------------------------------//
  //return(string): number w/ commas                    //
  //----------------------------------------------------//

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function findSemiMinor(a, e) {
  /*----------------------------------------------------//
  //Finds the semi-minor axis of an ellipse             //
  //----------------------------------------------------//
  //a(float): semi-major axis of ellipse                //
  //e(float): eccentricity of ellipse                   //
  //----------------------------------------------------//
  //return(float): semi-minor axis of an ellipse        //
  //----------------------------------------------------*/

  return (a * Math.sqrt(1 - (e ** 2)));
}

function findFocus(a, b) {
  //----------------------------------------------------//
  //Finds the distance from the center of an ellipse to //
  //  its foci                                          //
  //----------------------------------------------------//
  //a(float): semi-major axis of ellipse                //
  //b(float): semi-minor axis of ellipse                //
  //----------------------------------------------------//
  //return(float): distance from center of an ellipse   //
  //  to its foci                                       //
  //----------------------------------------------------//

  return (Math.sqrt((a ** 2) - (b ** 2)));
}