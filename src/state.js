let state = {
  transformations: {},
  faces: [],
  vertices: [],
  projection: undefined,
  gambiarra: false
};

function updateState (newState) {
  console.log(`Updating state and redrawning`, { state, newState });
  state = newState;
  redraw();
};