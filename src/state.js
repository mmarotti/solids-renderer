let state = {
  transformations: {},
  faces: [],
  vertices: [],
  projection: undefined,
  gambiarra: false,
  valid: false
};

function updateState (newState) {
  console.log(`Updating state and redrawning`, { state, newState });
  state = newState;
  redraw();
};

function checkValidAndUpdate(newState) {
  // V + F - A = 2     ->      V + F - F*3/2 = 2     ->     V - F/2 = 2
  euler = newState.vertices.length - (newState.faces.length/2) == 2
  updateState({
    ...newState,
    valid: euler
  });
  console.log("Euler", euler)
}