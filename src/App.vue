<template>
  <div id="app" class="p-1">
    <canvas :id="canvasId"
      :width="w"
      :height="h">
    </canvas>
  </div>
</template>

<script>
import camera from "@/cam.js"
import meshes from "@/mesh.js"
import shader from "@/shader.js"

import dbp from "@/debug.glsl.js"
import phong from "@/phong.glsl.js"
import hullp from "@/dyson-hull.glsl.js"
import bgp from "@/bg.glsl.js"

export default {
  name: 'home',
  data() {
    return { w: 1024, h: 576 }
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
    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: false
    })
    if(!gl) {
      console.error("Keine WebGL 2 Unterstützung")
      return
    }
    const fog = { r: 0.9, g: 0.9, b: 0.9, min: 0, max: 1000 }
    /*
     * gl settings */
    gl.enable(gl.DEPTH_TEST)
    //gl.enable(gl.CULL_FACE)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.viewport(0, 0, this.w, this.h)
    gl.clearColor(fog.r, fog.g, fog.b, 1)

    /*
     * cam */
    let cam = camera(gl, this.w/this.h, 0.1, 2000,
      [0,0,1000], // pos
      [0,0,0], // vel
      [0,0,1,0], // rota
      [0,0,1,0], // rota_t
      [0,0], // uv_offset
      [1,0,0,0], // quat
      [0,0,1], [0,1,0], [1,0,0] // dir vectors
    )
    cam.fpsControls()

    /*
     * shader programs 
     */

    /*
     * bg */
    let bg_prog = shader.prog(gl, bgp.vert(), bgp.frag(fog), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_nor", "samp_dis",
      "uv_offset"
    ])
    let bg = meshes.bgquad(gl, bg_prog.id, [0,0,0.5,0.5])
    bg_prog.objs.push(bg)
    shader.texture(gl, "space2.png", 0, bg_prog.locs["samp_col"])
    /*
     * sphere */
    const phongf = phong(.2,.5,.9)
    let sphere_prog = shader.prog(gl, hullp.vert(), hullp.frag(phongf), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    let sphere = meshes.sphereOut(gl, sphere_prog.id, 500, 5, [0,0,0], [1,0,0,-90])
    sphere_prog.objs.push(sphere)
    shader.cubemap_dyson(gl,
      "img/hull2.png",
      "img/hull2.bot.png",
      1, sphere_prog.locs["samp_col"]
    )
    let _prog = shader.prog(gl, dbp.vert(), dbp.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_norm"
    ])
    let tube = meshes.tubeIn(gl, _prog.id, 200, 166, 30, [0,0,370], [1,1,1,0])
    _prog.objs.push(tube)

    let progs = [
      _prog,
      //bg_prog,
      sphere_prog
    ]
    function renderLoop(ts) {
      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

      // game logic goes here
      //tube.rota[3] += 1
      for(let p=0; p<progs.length; ++p) {
        let prog = progs[p]
        gl.useProgram(prog.id)
        /*
         * push time */
        gl.uniform1f(prog.locs["time"], ts)
        /*
         * push light */
        gl.uniform3fv(prog.locs["light"], [50,0,0])
        /*
         * push cam uniforms */
        cam.pushPerspective(prog.locs["P"])
        cam.pushTranslation(prog.locs["cam_trans"])
        cam.pushRotation(prog.locs["cam_rota"])
        cam.update()
        /* 
         * push objs */
        let {objs, locs} = prog
        for(let o=0; o<objs.length; ++o) {
          const ctx = { 
            cam,
            trans_loc: locs["obj_trans"],
            rota_loc: locs["obj_rota"],
            proj_loc: locs["P"],
            uv_offset_loc: locs["uv_offset"],
          }
          let obj = objs[o]
          obj.preDraw(ctx)
          obj.draw(ctx)
        }
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
