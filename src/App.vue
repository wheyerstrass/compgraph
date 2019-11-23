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

//import phong from "@/phong-fog.glsl.js"
//import nmap from "@/normal-mapping.glsl.js"
import hmap from "@/heightmap.glsl.js"
import sbox from "@/skybox.glsl.js"

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
     * gl settings */
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.viewport(0, 0, this.w, this.h)
    gl.clearColor(fog.r, fog.g, fog.b, 1)

    /*
     * cam */
    let cam = camera(gl, this.w/this.h, 0.1, 2000, [0,50,0], [0,0,0], [0,1,0,0])
    cam.fpsControls()

    /*
     * shader programs 
     */

    /*
     * skybox */
    let skybox_prog = shader.prog(gl, sbox.vert(), sbox.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_nor", "samp_hm", "samp_cube"
    ])
    let skybox = meshes.cubeIn(gl, skybox_prog.id, 2000, [0,0,0], [0,1,0,0])
    skybox_prog.objs.push(skybox)
    shader.texture(gl, "desert.cube.png", 3, skybox_prog.locs["samp_cube"])
    /*
     * terrain */
    let terrain_prog = shader.prog(gl, hmap.vert(), hmap.frag(), [
      "time", "light",
      "P", "cam_trans", "cam_rota",
      "obj_trans", "obj_rota",
      "samp_col", "samp_nor", "samp_hm"
    ])
    let terrain = meshes.grid(gl, terrain_prog.id, 800, 500,
      [0,0,0], [0,0,1,0])
    terrain_prog.objs.push(terrain)
    shader.texture(gl, "hm.png", 0, terrain_prog.locs["samp_hm"])
    shader.texture(gl, "hm.nm.png", 1, terrain_prog.locs["samp_nor"])
    shader.texture(gl, "sand.jpg", 2, terrain_prog.locs["samp_col"])

    let progs = [
      skybox_prog,
      terrain_prog
    ]
    function renderLoop(ts) {
      gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT)

      for(let p=0; p<progs.length; ++p) {
        let prog = progs[p]
        gl.useProgram(prog.id)
        /*
         * push time */
        gl.uniform1f(prog.locs["time"], ts)
        /*
         * push light */
        gl.uniform3fv(prog.locs["light"], [0,100,0])
        /*
         * push cam uniforms */
        cam.pushPerspective(prog.locs["P"])
        cam.pushTranslation(prog.locs["cam_trans"])
        cam.pushRotation(prog.locs["cam_rota"])
        cam.update()
        /* 
         * push objs */
        let {objs} = prog
        skybox.rota[3] += 0.01
        for(let o=0; o<objs.length; ++o) {
          const ctx = { 
            trans_loc: prog.locs["obj_trans"],
            rota_loc: prog.locs["obj_rota"]
          }
          let obj = objs[o]
          obj.preDraw(ctx)
          obj.draw()
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
