<template>
  <div id="app" class="p-1">
    <canvas :id="canvasId"
      :width="w"
      :height="h">
    </canvas>
  </div>
</template>

<script>
const texture = function(gl, url, texunit, mipmap=false) {
  let id = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0+texunit)
  gl.bindTexture(gl.TEXTURE_2D, id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, 
    new Uint8Array([0,0,255,255]))

  let img = new Image()
  img.src = url
  img.addEventListener("load", function() {
    gl.bindTexture(gl.TEXTURE_2D, id)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    if(mipmap)
      gl.generateMipmap(gl.TEXTURE_2D)
  })
  return {id,img}
}

import camera from "@/cam.js"
import meshes from "@/mesh.js"
import shader from "@/shader.js"

//import phong from "@/phong-fog.glsl.js"
import nmap from "@/normal-mapping.glsl.js"

export default {
  name: 'home',
  data() {
    return { w: 1024, h: 768 }
  },
  computed: {
    canvasId() { return `canvas-${Date.now()}` }
  },
  methods: {
  },
  beforeDestroy() {
    //window.removeEventListener("keydown")
  },
  mounted() {
    const canvas = document.getElementById(this.canvasId)
    const gl = canvas.getContext("webgl2")
    if(!gl) {
      console.error("Keine WebGL 2 Unterstützung")
      return
    }
    const fog = { r: 0.9, g: 0.9, b: 0.9, min: 0, max: 1000 }
    /*
     * settings */
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.viewport(0, 0, this.w, this.h)
    gl.clearColor(fog.r, fog.g, fog.b, 1)

    /*
     * cam */
    let cam = camera(gl, this.w/this.h, 0.1, 1000, [0,0,0], [0,1,0,0])
    const cs = -1
    window.addEventListener("keydown", function(e) {
      switch(e.key) {
        case "w":
          cam.pos[2] += -cs
          break
        case "s":
          cam.pos[2] += cs
          break
        case "a":
          cam.pos[0] += -cs
          break
        case "d":
          cam.pos[0] += cs
          break
        case " ":
          cam.pos[1] += cs
          break
        case "c":
          cam.pos[1] += -cs
          break
        case "ArrowLeft":
          cam.rota[3] += -1
          break
        case "ArrowRight":
          cam.rota[3] += 1
          break
      }
    })

    /*
     * shader program
     */
    //const prog = shader.prog(gl, phong.vert(), phong.frag(fog), [
    //  "time", "P", "cam_trans", "cam_rota", "obj_trans", "obj_rota"
    //])
    const prog = shader.prog(gl, nmap.vert(), nmap.frag(fog), [
      "time", "P", "cam_trans", "cam_rota", "obj_trans", "obj_rota",
      "samp_col", "samp_nor"
    ])


    /*
     * objects 
     */
    //let plane = meshes.plane(gl, prog.id, 4000, [0,0,0], [1,0,0,0])
    //let cube = meshes.cubeOut(gl, prog.id, 1, [-2,1,-12], [1,0,0,0])
    //let objs = [cube, plane] 
    //const rnd = (min, max) => {
    //  const r = Math.random()
    //  return min*(1-r) + max*r
    //}
    //for(let i=0; i<50; ++i) {
    //  let size = rnd(1, 50)
    //  let pos = [20*rnd(-size, size), 0.5*size, -20*size]
    //  objs.push(
    //    meshes.cubeOut(gl, prog.id, Math.pow(size,1.5), pos, [0, 1, 0, 45])
    //  )
    //}
    let objs = [meshes.quad(gl, prog.id, 100, [0,0,-50], [1,0,0,0])]
    texture(gl, "3.jpg", 0, true)
    gl.uniform1i(prog.locs["samp_col"], 0)
    texture(gl, "3.nm.jpg", 1, true)
    gl.uniform1i(prog.locs["samp_nor"], 1)

    function renderLoop(ts) {
      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

      /*
       * push time */
      gl.uniform1f(prog.locs["time"], ts)
      /*
       * push Perspective & View */
      cam.pushPerspective(prog.locs["P"])
      cam.pushTranslation(prog.locs["cam_trans"])
      cam.pushRotation(prog.locs["cam_rota"])

      /* 
       * push Model */
      for(let i=0; i<objs.length; ++i) {
        const ctx = { 
          trans_loc: prog.locs["obj_trans"],
          rota_loc: prog.locs["obj_rota"]
        }
        let obj = objs[i]
        obj.preDraw(ctx)
        obj.draw()
      }

      requestAnimationFrame(renderLoop)
    }
    requestAnimationFrame(renderLoop)

  },
}
</script>

<style scoped>
code {
  display: block;
  padding: 15px;

  border: 1px solid grey;
  background-color: whitesmoke;
}

canvas {
  border: 1px solid grey;
}
pre {
  white-space: break-spaces;
}
</style>
