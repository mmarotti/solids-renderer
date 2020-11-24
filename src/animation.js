function interpolate (objStart, objEnd, framesTotal, currentFrame) {
  let objFrame = [] //objeto nestra frame
  for(let fIndex = 0; fIndex < objStart.length; fIndex++){ //para cada face
    current_face = []
    //descobrimos os deltas por pontos
    let deltaX = objEnd[fIndex]['x'] - objStart[fIndex]['x'] 
    let deltaY = objEnd[fIndex]['y'] - objStart[fIndex]['y']
    let deltaZ = objEnd[fIndex]['z'] - objStart[fIndex]['z'] 
    //somamos o delta ao objeto inicial, dependendo da frame atual e framerate
    
    objFace = {
      'x': parseInt(objStart[fIndex]['x']) + deltaX/framesTotal * currentFrame,
      'y': parseInt(objStart[fIndex]['y']) + deltaY/framesTotal * currentFrame,
      'z': parseInt(objStart[fIndex]['z']) + deltaZ/framesTotal * currentFrame,
      'm': objStart[fIndex]['m'],
      'id': objStart[fIndex]['id']
    }
    objFrame.push(objFace);
  }

  return objFrame;
}