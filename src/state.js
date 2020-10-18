let state = {
  transformations: {},
  faces: [],
  vertices: [],
};

function updateState (newState) {
  console.log(`Updating state and redrawning`, { state, newState });
  state = newState;
  redraw();
};