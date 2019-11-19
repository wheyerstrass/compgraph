<template>
  <div id="app" class="p-1">
    <canvas :id="canvasId"
      :width="w"
      :height="h">
    </canvas>
  </div>
</template>

<script>
const w = 1024
const h = 768

const s = {r: 0.8, g: 0.9, b: 1.0}
const f = {min: 0, max: 1000.0}

const vertSrc = `#version 300 es

precision mediump float;

in vec3 pos;
in vec3 nor;

uniform float time;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

out vec3 vert_pos;
out vec3 vert_nor;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;
  vert_nor = (VM * vec4(nor, 0.0)).xyz;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`

const fragSrc = `#version 300 es

precision mediump float;

uniform float time;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

in vec3 vert_pos;
in vec3 vert_nor;

out vec4 color;

const vec3 s = vec3(${s.r}, ${s.g}, ${s.b});
const vec2 fogr = vec2(${f.min}, ${f.max});

void main() {

  vec4 light = vec4(0., 5., -5., 1);
  light = cam_rota*light;
  //light = cam_trans*cam_rota*light;

  vec3 nl = normalize(light.xyz-vert_pos);
  vec3 nn = normalize(vert_nor);
  vec3 np = normalize(vert_pos);

  // ambient
  float Ia = 0.2;

  // diffuse (lambert)
  float Id = 0.2* max( dot(nl, nn), 0.0 );

  // specular (blinn-phong)
  float rv = dot(nn, normalize(nl+np));
  float Is = 0.9* pow(rv, 4.);

  // sum
  float c = Ia+Id+Is;
  float f = (length(vert_pos.z)-fogr.x)/(fogr.y - fogr.x);
  f = clamp(f, 0., 1.);
  //color = vec4(c*vert_nor.r, c*vert_nor.g, c*vert_nor.b, 1.0);
  vec3 col = mix(vec3(c,c,c), s, f);
  color = vec4(col, 1.0);
}
`

import camera from "@/cam.js"
import meshes from "@/mesh.js"
import shader from "@/shader.js"

export default {
  name: 'home',
  data() {
    return { w, h }
  },
  computed: {
    canvasId() { return `canvas-${Date.now()}` }
  },
  methods: {
    keypress(obj) {
      console.log(obj)
      console.log("asd")
    }
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
    /*
     * settings */
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.viewport(0, 0, this.w, this.h)
    gl.clearColor(s.r, s.g, s.b, 1)

    /*
     */
    const prog = shader.prog(gl, vertSrc, fragSrc, [
      "time", "P", "cam_trans", "cam_rota", "obj_trans", "obj_rota"
    ])

    /*
     * cam */
    let cam = camera(gl, w/h, 0.1, 1000, [0,-10,0], [0,1,0,0])
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
     * objects */
    let plane = meshes.plane(gl, prog.id, 4000, [0,0,0], [1,0,0,0])
    let cube = meshes.cubeOut(gl, prog.id, 1, [-2,1,-12], [1,0,0,0])
    let objs = [cube, plane] 
    const rnd = (min, max) => {
      const r = Math.random()
      return min*(1-r) + max*r
    }
    for(let i=0; i<50; ++i) {
      let size = rnd(1, 50)
      let pos = [20*rnd(-size, size), 0.5*size, -20*size]
      objs.push(
        meshes.cubeOut(gl, prog.id, Math.pow(size,1.5), pos, [0, 1, 0, 45])
      )
    }

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

      //cam.pos[2] += 0.001
      cube.rota[3] += 0.5
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
