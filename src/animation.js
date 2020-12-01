function interpolate (objStart, objEnd, framesTotal, currentFrame) {
  let objFrame = [] //objeto nestra frame
  for(let vIndex = 0; vIndex < objStart.length; vIndex++){ //para cada face
    current_face = []
    //descobrimos os deltas por pontos
    let deltaX = objEnd[vIndex]['x'] - objStart[vIndex]['x']
    let deltaY = objEnd[vIndex]['y'] - objStart[vIndex]['y']
    let deltaZ = objEnd[vIndex]['z'] - objStart[vIndex]['z']
    //somamos o delta ao objeto inicial, dependendo da frame atual e framerate
    
    objVertex = {
      'x': parseInt(objStart[vIndex]['x']) + deltaX/framesTotal * currentFrame,
      'y': parseInt(objStart[vIndex]['y']) + deltaY/framesTotal * currentFrame,
      'z': parseInt(objStart[vIndex]['z']) + deltaZ/framesTotal * currentFrame,
      'm': objStart[vIndex]['m'],
      'id': objStart[vIndex]['id']
    }
    objFrame.push(objVertex);
  }

  return objFrame;
}