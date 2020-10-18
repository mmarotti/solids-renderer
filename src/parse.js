function mapToObject (data, type) {
  switch (type) {
    case 'vertices':
      return data.map((item) => {
        const [
          id,
          x,
          y,
          z
        ] = item;

        return { id, x, y, z }
      });
    case 'faces':
      return data.map((item) => {
        const [
          id,
          v_1,
          v_2,
          v_3,
          fill,
        ] = item;

        return { id, v_1, v_2, v_3, fill }
      });
    default:
      return data;
  }
};

function parseFile (file, type, callback) {
  return Papa.parse(file, {
    dynamicTyping: true,
    complete: (results) => {
      const value = mapToObject(results.data, type);
      callback(value);
    }
  });
};