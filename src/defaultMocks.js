async function setCircle() {
  Papa.parse('./mocks/circle/vertices.csv', {
    download: true,
    complete: function (results) {
      const value = mapToObject(results.data, 'vertices');
      console.log(results.data)
      updateState({
        
        ...state,
        vertices: value
      });
    }
  });
  Papa.parse('./mocks/circle/faces.csv', {
    download: true,
    complete: function (results) {
      const value = mapToObject(results.data, 'faces');
      
      updateState({
        ...state,
        faces: value
      });
    }
  });
  
  
}