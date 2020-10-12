const offset = 400;
const ratio = 0.2;

//getting faces and vertices
$.ajaxSetup({
  async: false
});
$.getJSON("faces.json", function (json) {
  faces = json;
});
$.getJSON("vertices.json", function (json) {
  vertices = json
});


function returnVerticeData(vertice_id) {
  return vertices.find(vertice => vertice.id === vertice_id);
}

faces.map(face => { //mudando os vertices para seus respectivos pontos
  face.v_1 = returnVerticeData(face.v_1);
  face.v_2 = returnVerticeData(face.v_2);
  face.v_3 = returnVerticeData(face.v_3);
})

function setup() {
  // createCanvas must be the first statement
  createCanvas(800, 800, WEBGL);
  stroke(255, 0, 0); // Set line drawing color to red
  strokeWeight(5); //set stroke size
  frameRate(1);
  noLoop(); //only draw once
};

function transforCoordinate (coordinate) {
  if (ratio) coordinate = coordinate * ratio;
  if (offset) coordinate = coordinate + offset;

  return coordinate;
};

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
  background(0); // Set the background to black
  
  for (face of faces){
    beginShape();
    for (v of ['v_1', 'v_2', 'v_3']) {
      vertex(transformCoordinate(face[v].x), transformCoordinate(face[v].y))
    };
    endShape();
  }
}