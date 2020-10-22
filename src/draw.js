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
    let values = event.target.value.split(",");
    console.log(values);
    let ratioTransformation = [[parseFloat(values[0]), 0, 0],
                               [0, parseFloat(values[1]), 0],
                               [0, 0, parseFloat(values[2])]];

    updateState({
      ...state,
      transformations: {
        ...state.transformations,
        ratio: ratioTransformation,
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

function multiplyMatrix (m_1, m_2) {
  if (!m_2) return m_1;
  if (!m_1) return m_2;
  if (m_1[0].length != m_2.length) return null;

  var resultMatrix = [];
  var actualRow;
  var sum;

  for(var i = 0; i<m_1.length; i++) {
    actualRow = [];
    for(var j = 0; j<m_2[0].length; j++){
      sum = 0;
      for(var k = 0; k<m_2.length; k++) {
        sum += m_1[i][k]*m_2[k][j];
      }
      actualRow.push(sum);
    }
    resultMatrix.push(actualRow);
  }

  return resultMatrix;
}

function transformVertices (vertices, transformations) {
  let verticesMatrix = vertices.map(({x, y, z}) => [[x],[y],[z]]);
  let transformationMatrix;
  for (let transformation in transformations) {
    transformationMatrix = multiplyMatrix(transformations[transformation], transformationMatrix);
  }
  let newVertices = [];
  for(let i = 0; i<verticesMatrix.length; i++) {
    let [[new_x], [new_y], [new_z]] = multiplyMatrix(transformationMatrix, verticesMatrix[i]);
    newVertices.push({
                        id : vertices[i].id,
                        x : new_x,
                        y : new_y,
                        z : new_z,
    });
  }
  return newVertices;
}

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

  console.log("Drawing", faces, vertices);

  var transformedVertices = transformVertices(vertices, transformations);

  for (const face of faces) {
    const {
      fill: fillColor,
    } = face;

    fillColor ? fill(`#${fillColor}`) : noFill();

    for (v of ['v_1', 'v_2', 'v_3']) {
      let transformedV = getVertex(face[v], transformedVertices);
      vertex(transformedV.x, transformedV.y, transformedV.z);
    }
  }

  endShape();
}