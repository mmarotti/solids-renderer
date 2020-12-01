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
        checkValidAndUpdate({
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
        checkValidAndUpdate({
          ...state,
          faces: data
        })
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
  $("#frameRateHTML").on('input', (event) => {
    jQuery
    fps = parseInt($("#frameRateHTML").val());
    frameOffset = frameCount;
    frameRate(fps);
  })
  $("#animation_time").on('input', (event) => {
    jQuery
    totalTime = parseFloat($("#animation_time").val());
  })
  $("#play_animation").on('input', (event) => {
    animate  = $("#play_animation").is(":checked");
    console.log(animate);
  });

  $("#reset_transforms").on("click", () => {
    $(".shear").val(0);
    
    $('#isometric_projection').prop('checked', false);
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
    gambiarra: false,
    sorted : false,
  });
}

//Gambiarra Section
function toggleGambiarra() {
  const isometric = $("#isometric_projection").is(":checked");

  updateState({
    ...state,
    projection: isometric ? (state.gambiarra ? getProjectionMatrix("isometric") : getProjectionMatrix("isometric_gambiarra")) : undefined,
    gambiarra: !state.gambiarra,
    sorted : false,
  });
}

function keyPressed() {
  if (key == 'g') {
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
    },
    sorted : false,
  });
}


let fps = 30
let frameOffset = 0
let totalTime = 1
let animate = false;

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

// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
  const {
    faces,
    vertices,
    transformations,
    projection,
    valid,
    sorted
  } = state;

  // Clear board
  clear();
  beginShape(TRIANGLES);

  const transformedVertices = transformVertices(vertices, transformations);
  let rotatedVertices = null;
  let projectedVertices = null;
  if (animate) {
    let totalFrames = parseInt(fps * totalTime);
    let currentFrame = (frameCount - frameOffset) % totalFrames
    const frameVertices = interpolate(
      vertices,
      transformedVertices,
      totalFrames,
      currentFrame)
    rotatedVertices = projection ? rotateVertices(frameVertices, projection) : frameVertices
    projectedVertices = projection? projectVertices(rotatedVertices, projection) : frameVertices;
  } else {
    rotatedVertices = projection ? rotateVertices(transformedVertices, projection) : transformedVertices
    projectedVertices = projection? projectVertices(rotatedVertices, projection) : transformedVertices;
  }



  // console.log("Drawing", {
  //   faces,
  //   vertices,
  //   transformedVertices,
  //   projectedVertices
  // });

  if (valid) {
    if (!sorted) {

      faces.sort(function (a, b){
        let aZ = 0
        let bZ = 0
        for (v of ['v_1', 'v_2', 'v_3']) {
          aZ += getVertex(a[v], rotatedVertices).z;
          bZ += getVertex(b[v], rotatedVertices).z;
        }
        return aZ>bZ? 1 : -1;
      });
      updateState({
        ...state,
        faces : faces,
        sorted : true,
      });
    }

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
        vertex(x / m, y / m, z / m);
      }
    }
  
    endShape();
  }
  
}