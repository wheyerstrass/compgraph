import matrix from "@/matrix.js"

export default {

  cubeOut: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vb = [
      // front
      l,   l, l,
      -l, -l, l,
      l,  -l, l,
      l,   l, l,
      -l,  l, l,
      -l, -l, l,
      // back
      l,   l, -l,
      l,  -l, -l,
      -l, -l, -l,
      l,   l, -l,
      -l, -l, -l,
      -l,  l, -l,
      // left
      -l,  l, l,
      -l, -l, -l,
      -l, -l, l,
      -l,  l,  l,
      -l,  l, -l,
      -l, -l, -l,
      // right
      l,  l, l,
      l, -l, l,
      l, -l, -l,
      l,  l,  l,
      l, -l, -l,
      l,  l, -l,
      // top
      l,  l, l,
      l,  l, -l,
      -l, l, -l,
      l,  l, l,
      -l, l, -l,
      -l, l, l,
      // bot
      l, -l,  l,
      -l, -l, -l,
      l, -l, -l,
      l, -l,  l,
      -l, -l,  l,
      -l, -l, -l,
      // normals
      // front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      // back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      // left
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      // right
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      // top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      // bot
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass normal to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, 3*4*6*6)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)

    //let pos = [0, -0.5, -3]
    //let rota = [0, 1, 0, 0]

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*6)
      }
    }
  },
  cubeIn: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vb = [
      // front
      l,   l, l,
      l,  -l, l,
      -l, -l, l,
      l,   l, l,
      -l, -l, l,
      -l,  l, l,
      // back
      l,   l, -l,
      -l, -l, -l,
      l,  -l, -l,
      l,   l, -l,
      -l,  l, -l,
      -l, -l, -l,
      // left
      -l,  l, l,
      -l, -l, l,
      -l, -l, -l,
      -l,  l,  l,
      -l, -l, -l,
      -l,  l, -l,
      // right
      l,  l, l,
      l, -l, -l,
      l, -l, l,
      l,  l,  l,
      l,  l, -l,
      l, -l, -l,
      // top
      l,  l, l,
      -l, l, -l,
      l,  l, -l,
      l,  l, l,
      -l, l, l,
      -l, l, -l,
      // bot
      l, -l,  l,
      l, -l, -l,
      -l, -l, -l,
      l, -l,  l,
      -l, -l, -l,
      -l, -l,  l,
      // texcoords
      // front
      4/4, 1/3,
      3/4, 2/3,
      4/4, 2/3,
      0/4, 1/3,
      0/4, 2/3,
      1/4, 1/3,
      // back
      3/4, 1/3,
      1/4, 2/3,
      2/4, 2/3,
      3/4, 1/3,
      2/4, 1/3,
      1/4, 2/3,
      // left
      1/4, 1/3,
      0/4, 2/3,
      1/4, 2/3,
      1/4, 1/3,
      1/4, 2/3,
      2/4, 1/3,
      // right
      4/4, 1/3,
      2/4, 2/3,
      3/4, 2/3,
      4/4, 1/3,
      3/4, 1/3,
      2/4, 2/3,
      // top
      1/4, 0/3,
      2/4, 1/3,
      2/4, 0/3,
      1/4, 0/3,
      1/4, 1/3,
      2/4, 1/3,
      // bot
      2/4, 2/3,
      2/4, 3/3,
      1/4, 2/3,
      2/4, 3/3,
      1/4, 3/3,
      1/4, 2/3,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass normal to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6*6)

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*6)
      }
    }
  },

  plane: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const t = size/10;
    const l = size/2;
    let vbuffer = [
      l,  0, l,
      l,  0, -l,
      -l, 0, -l,
      l,  0, l,
      -l, 0, -l,
      -l, 0, l,
      // normals
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      // texcoords
      t, t,
      t, 0,
      0, 0,
      t, t,
      0, 0,
      0, t,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbuffer), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /*
     * pass normal to shader */
    const nor_loc = gl.getAttribLocation(prog, "nor")
    gl.enableVertexAttribArray(nor_loc)
    gl.vertexAttribPointer(nor_loc, 3, gl.FLOAT, false, 0, 3*4*6)
    /*
     * pass texcoords to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6*2)

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
      }
    }
  },

  quad: function(gl, prog, size, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    const l = size/2;
    let vbuffer = [
       l,  l, 0,
      -l, -l, 0,
       l, -l, 0,
       l,  l, 0,
      -l,  l, 0,
      -l, -l, 0,
      // uv
       1,  1,
       0,  0,
       1,  0,
       1,  1,
       0,  1, 
       0,  0,
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbuffer), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6)

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*1)
      }
    }
  },

  grid: function(gl, prog, size, res, pos, rota) {
    gl.useProgram(prog)
    /*
     * data */
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    let vb = []
    let s = size/res
    // positions
    for(let z=0; z<res; ++z) {
      for(let x=0; x<res; ++x) {
        // bottom left triangle
        vb.push(-size/2+x*s, 0, -size/2+z*s) // ul
        vb.push(-size/2+x*s, 0, -size/2+(z+1)*s) // bl
        vb.push(-size/2+(x+1)*s, 0, -size/2+(z+1)*s) // br
        // top right triangle
        vb.push(-size/2+x*s, 0, -size/2+z*s) // ul
        vb.push(-size/2+(x+1)*s, 0, -size/2+(z+1)*s) // br
        vb.push(-size/2+(x+1)*s, 0, -size/2+z*s) // tr
      }
    }
    // texcoords
    s = 1/res
    for(let v=0; v<res; ++v) {
      for(let u=0; u<res; ++u) {
        // bottom left triangle
        vb.push(0+u*s, 0+v*s) // ul
        vb.push(0+u*s, 0+(v+1)*s) // bl
        vb.push(0+(u+1)*s, 0+(v+1)*s) // br
        // top right triangle
        vb.push(0+u*s, 0+v*s) // ul
        vb.push(0+(u+1)*s, 0+(v+1)*s) // br
        vb.push(0+(u+1)*s, 0+v*s) // tr
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vb), gl.STATIC_DRAW)

    /*
     * vao */
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    /* 
     * pass position to shader */
    const pos_loc = gl.getAttribLocation(prog, "pos")
    gl.enableVertexAttribArray(pos_loc)
    gl.vertexAttribPointer(pos_loc, 3, gl.FLOAT, false, 0, 0)
    /* 
     * pass uv to shader */
    const uv_loc = gl.getAttribLocation(prog, "uv")
    gl.enableVertexAttribArray(uv_loc)
    gl.vertexAttribPointer(uv_loc, 2, gl.FLOAT, false, 0, 3*4*6*res*res)

    return {
      pos,
      rota,
      preDraw: function({trans_loc, rota_loc}) {
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(trans_loc, false, matrix.translation(pos))
        gl.uniformMatrix4fv(rota_loc, false, matrix.rotation(rota))
      },
      draw: function() {
        gl.useProgram(prog)
        gl.drawArrays(gl.TRIANGLES, 0, 6*res*res)
      }
    }
  },
}
