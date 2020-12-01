function projectVertices(vertices, projection) {

    const verticesMatrix = vertices.map(({
      x,
      y,
      z,
      m
    }) => [
      [x, y, z, m]
    ]);
    let newVertices = [];
  
    verticesMatrix.forEach((vertex, index) => {
      const [
        [
          new_x,
          new_y,
          new_z,
          old_m
        ]
      ] = multiplyMatrix(vertex, projection.ortogonal);
  
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

function rotateVertices(vertices, projection) {

    const verticesMatrix = vertices.map(({
      x,
      y,
      z,
      m
    }) => [
      [x, y, z, m]
    ]);
    let newVertices = [];
  
    verticesMatrix.forEach((vertex, index) => {
      const [
        [
          new_x,
          new_y,
          new_z,
          old_m
        ]
      ] = multiplyMatrix(vertex, projection.rotation);
  
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