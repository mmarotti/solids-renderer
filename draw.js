const ratio = 0.2;

//getting faces and vertices
$.ajaxSetup({
  async: false
});
$.getJSON("data/faces.json", function (json) {
  faces = json;
});
$.getJSON("data/vertices.json", function (json) {
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
  createCanvas(800, 800, WEBGL); // createCanvas must be the first statement
  stroke('#F7CEAD'); // Set line drawing color
  strokeWeight(2); // Set stroke size
  noLoop(); //only draw once
};

function transformCoordinate (coordinate) {
  if (ratio) coordinate = coordinate * ratio;

  return coordinate;
};

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
  background('#000'); // Set the background to black

  beginShape(TRIANGLES);

  for (face of faces){
    const {
      fill: fillColor,
    } = face;

    fillColor ? fill(fillColor) : noFill();

    for (v of ['v_1', 'v_2', 'v_3']) {
      vertex(transformCoordinate(face[v].x), transformCoordinate(face[v].y));
    }
  }

  endShape();
}