$(document).ready(() => {
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {
    'accordion': true
  });

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

  $(".projection").on('input', (event) => {
    updateProjection();
  });
  $(".ratio").on('input', (event) => {
    updateScale()
  });
  $(".shear").on('input', (event) => {
    updateShear()
  })
  $("#frameRate").on('input', (event) => {
    jQuery
    fps = parseInt($("#frameRate").val());
    frameOffset = frameCount;
    frameRate(fps);
  })
  $("#animation_time").on('input', (event) => {
    jQuery
    totalTime = parseFloat($("#animation_time").val());
     
  })

  $("#reset_transforms").on("click", () => {
    $("#ratio_x").val(1);
    $("#ratio_y").val(1);
    $("#ratio_z").val(1);
    $("#shear_x").val(0);
    $("#shear_y").val(0);
    $('#isometric_projection').prop('checked',false);
    $("#frameRate").val(30);
    updateScale();
    updateShear();
    updateProjection();
  })
  setCircle();
});

function updateProjection() {
  const isometric = $("#isometric_projection").is(":checked");

  updateState({
    ...state,
    projection: isometric ? getProjectionMatrix("isometric") : undefined,
    gambiarra: false
  });
}

//Gambiarra Section
function toggleGambiarra() {
  const isometric = $("#isometric_projection").is(":checked");

  updateState({
    ...state,
    projection: isometric ? (state.gambiarra? getProjectionMatrix("isometric") : getProjectionMatrix("isometric_gambiarra")) : undefined,
    gambiarra: !state.gambiarra
  });
}

function keyPressed(){
  if(key=='g'){
    toggleGambiarra()
  }
}
//END

function updateScale() {
  const x = $("#ratio_x").val();
  const y = $("#ratio_y").val();
  const z = $("#ratio_z").val();

  updateState({
    ...state,
    transformations: {
      ...state.transformations,
      ratio: createRatioMatrix(x, y, z),
    }
  });
}

function updateShear() {
  const xy = parseFloat($("#shear_xy").val());
  const xz = parseFloat($("#shear_xz").val());
  const yx = parseFloat($("#shear_yx").val());
  const yz = parseFloat($("#shear_yz").val());
  const zx = parseFloat($("#shear_zx").val());
  const zy = parseFloat($("#shear_zy").val());

  updateState({
    ...state,
    transformations: {
      ...state.transformations,
      shear: createShearMatrix(xy, xz, yx, yz, zx, zy),
    }
  });
}


let fps = 30
let frameOffset = 0
let totalTime = 1

function setup() {
  let renderer = createCanvas(600, 600, WEBGL); // createCanvas must be the first statement
  renderer.parent("#main");
  stroke('#F7CEAD'); // Set line drawing color
  background('#000'); // Set the background to black
  strokeWeight(2); // Set stroke size
  frameRate(fps);
};

function getVertex(id, vertices) {
  return vertices.find(vertice => vertice.id === id);
};

function transformVertices(vertices, transformations) {
  const verticesMatrix = vertices.map(({
    x,
    y,
    z,
    m
  }) => [
    [x],
    [y],
    [z],
    [m]
  ]);

  let transformationMatrix;

  for (const transformation in transformations) {
    // console.log(transformation);
    transformationMatrix = multiplyMatrix(transformations[transformation], transformationMatrix)
  };

  let newVertices = [];

  verticesMatrix.forEach((vertex, index) => {
    const [
      [new_x],
      [new_y],
      [new_z],
      [old_m]
    ] = multiplyMatrix(transformationMatrix, vertex);

    newVertices.push({
      id: vertices[index].id, // Getting id from vertices array, as it's in same order from verticesMatrix
      x: new_x,
      y: new_y,
      z: new_z,
      m: old_m
    });
  })

  return newVertices;
};

function projectVertices(vertices, projection) {

  const verticesMatrix = vertices.map(({
    x,
    y,
    z,
    m
  }) => [[x,y,z,m]]
  );

  let newVertices = [];

  verticesMatrix.forEach((vertex, index) => {
    const [[
      new_x,
      new_y,
      new_z,
      old_m
    ]] = multiplyMatrix(vertex, projection);

    newVertices.push({
      id: vertices[index].id, // Getting id from vertices array, as it's in same order from verticesMatrix
      x: new_x,
      y: new_y,
      z: new_z,
      m: old_m
    });
  })
  return newVertices
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
    projection
  } = state;

  // Clear board
  clear();
  beginShape(TRIANGLES);

  const transformedVertices = transformVertices(vertices, transformations);
  let currentFrame = (frameCount - frameOffset) % (fps * totalTime)
  let totalFrames = parseInt(fps * totalTime);

  const frameVertices = interpolate(
    vertices, 
    transformedVertices,
    totalFrames,
    currentFrame)
  const projectedVertices = projection ? projectVertices(frameVertices, projection) : frameVertices

  // console.log("Drawing", {
  //   faces,
  //   vertices,
  //   transformedVertices,
  //   projectedVertices
  // });
  
  
  
  for (const face of faces) {
    const {
      fill: fillColor,
    } = face;

    fillColor ? fill(`#${fillColor}`) : noFill();

    for (v of ['v_1', 'v_2', 'v_3']) {
      const {
        x,
        y,
        z,
        m
      } = getVertex(face[v], projectedVertices);

      // Draw vertex
      vertex(x/m, y/m, z/m);
    }
  }

  endShape();
}