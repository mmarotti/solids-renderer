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

  $("#ratio").on('input', (event) => {
    const [x, y, z] = event.target.value.split(",");
    
    updateState({
      ...state,
      transformations: {
        ...state.transformations,
        ratio: createRatioMatrix(x,y,z),
      }
    });
  });
  $(".shear").on('input', () => {
    const x = $("#shear_x").val();
    const y = $("#shear_y").val();
    updateState({
      ...state,
      transformations: {
        ...state.transformations,
        shear_x: createShearMatrix_X(x),
        shear_y: createShearMatrix_Y(y),
      }
    });

  })
    
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

function transformVertices (vertices, transformations) {
  const verticesMatrix = vertices.map(({ x, y, z }) => [[x],[y],[z]]);

  let transformationMatrix;

  for (const transformation in transformations) transformationMatrix = multiplyMatrix(transformations[transformation], transformationMatrix);

  let newVertices = [];
  
  verticesMatrix.forEach((vertex, index) => {
    const [[new_x], [new_y], [new_z]] = multiplyMatrix(transformationMatrix, vertex);

    newVertices.push({
      id : vertices[index].id, // Getting id from vertices array, as it's in same order from verticesMatrix
      x : new_x,
      y : new_y,
      z : new_z,
    });
  })

  return newVertices;
};

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
  const {
    faces,
    vertices,
    transformations,
  } = state;

  // Clear board
  clear();
  beginShape(TRIANGLES);

  const transformedVertices = transformVertices(vertices, transformations);

  console.log("Drawing", { faces, vertices, transformedVertices });

  for (const face of faces) {
    const {
      fill: fillColor,
    } = face;

    fillColor ? fill(`#${fillColor}`) : noFill();

    for (v of ['v_1', 'v_2', 'v_3']) {
      const { x, y, z } = getVertex(face[v], transformedVertices);

      // Draw vertex
      vertex(x, y, z);
    }
  }

  endShape();
}