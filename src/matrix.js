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


/*
Escala
Formato da matriz:
|x 0 0|
|0 y 0|
|0 0 z|
*/
function createRatioMatrix(x,y,z){
  return [
    [parseFloat(x), 0, 0, 0],
    [0, parseFloat(y), 0, 0],
    [0, 0, parseFloat(z), 0],
    [0, 0, 0, 1]
  ]; 
}

/*
Cisalhamento
Formato da matriz:
        |1 xy xz| 
        |yx 1 yz|
        |zx zy 1|
*/
function createShearMatrix(xy, xz, yx, yz, zx, zy){
  return [
    [1, xy, xz, 0],
    [yx, 1, yz, 0],
    [zx, zy, 1, 0],
    [0, 0, 0, 1]
  ]; 
}

function getProjectionMatrix(type){
  switch (type) {
    case "isometric":
      return {
        rotation : [
          [0.707, 0.408, 0.577, 0],
          [0, 0.816, -0.577, 0],
          [-0.707, 0.408, 0.577, 0],
          [0, 0, 0, 1],
        ],
        ortogonal : [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 1],
        ],
      };
    case "isometric_gambiarra":
      return {
        rotation: [
        [0.707, 0.408, 0.577, 0],
        [0, 0.816, -0.577, 0],
        [-0.707, 0.408, 0.577, 0],
        [0, 0, 0, 1]
      ],
        ortogonal: [
          [1, 0, 0, 0],
          [0, 1, 0, 0],
          [0, 0, 1, 0],
          [0, 0, 0, 1],
        ],
      }
    default:
      return false;
  }
}