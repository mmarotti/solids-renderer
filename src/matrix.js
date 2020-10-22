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