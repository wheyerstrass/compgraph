import matrix from "@/matrix.js"

export default function(gl, ar, nc, fc, pos, rota) {

  const pushPerspective = function(loc) {
    gl.uniformMatrix4fv(loc, false, matrix.perspective(ar,nc,fc))
  }

  const pushTranslation = function(loc) {
    gl.uniformMatrix4fv(loc, false, matrix.translation(pos))
  }

  const pushRotation = function(loc) {
    gl.uniformMatrix4fv(loc, true, matrix.rotation(rota))
  }

  return {
    pos,
    rota,
    pushTranslation,
    pushRotation,
    pushPerspective,
  }
}
