$(document).ready(() => {
  $("#vertices").change((event) => {
    const file = event.target.files[0];
    parseFile(
      file, 
      'vertices',
      (data) => {
        updateState({
          ...state,
          vertices: data
        });
      }
    );
  });

  $("#faces").change(async (event) => {
    const file = event.target.files[0];
    parseFile(
      file, 
      'faces',
      (data) => {
        updateState({
          ...state,
          faces: data
        });
      }
    );
  });

  $("#ratio").change((event) => {
    updateState({
      ...state,
      transformations: {
        ...state.transformations,
        ratio: event.target.value
      }
    });
  });
});

function setup() {
  createCanvas(800, 800, WEBGL); // createCanvas must be the first statement
  stroke('#F7CEAD'); // Set line drawing color
  background('#000'); // Set the background to black
  strokeWeight(2); // Set stroke size
  noLoop();
};

function getVertex (id, vertices) {
  return vertices.find(vertice => vertice.id === id);
};

function transformCoordinate (coordinate) {
  const {
    transformations: {
      ratio,
    },
  } = state;

  if (ratio) coordinate = coordinate * ratio;

  return coordinate;
};

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
  const {
    faces,
    vertices,
  } = state;

  // Clear board
  clear();
  beginShape(TRIANGLES);

  console.log("Drawing", faces, vertices)

  for (const face of faces) {
    const {
      fill: fillColor,
    } = face;

    fillColor ? fill(`#${fillColor}`) : noFill();

    for (v of ['v_1', 'v_2', 'v_3']) {
      vertex(
        transformCoordinate(getVertex(face[v], vertices).x), 
        transformCoordinate(getVertex(face[v], vertices).y),  
        transformCoordinate(getVertex(face[v], vertices).z),
      )
    }
  }

  endShape();
}