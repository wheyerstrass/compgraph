export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;
uniform mat4 obj_trans;
uniform mat4 obj_rota;
uniform mat4 obj_scale;
uniform vec3 light;

uniform samplerCube samp_norm;

out vec3 vert_uv;
out vec3 vert_pos;
out vec3 vert_norm;
out vec3 vert_light;

void main() {
  mat4 M = obj_scale*obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_light = (V * vec4(light, 0.0)).xyz;

  vert_uv = pos;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  vert_norm = (VM * vec4(pos, 0.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: (funcs="") =>
`#version 300 es

precision mediump float;

in vec3 vert_uv;
in vec3 vert_pos;
in vec3 vert_norm;
in vec3 vert_light;

uniform float time;

uniform sampler2D samp_col;

out vec4 color;

${funcs}

void main() {
  vec4 tex = triplanar(vert_uv, samp_col, 0.00001, 1.);

  color = vec4(0.2*tex.xyz, tex.a);
  if(vert_uv.z > 0.92)
    color.a = 0.0;
}
`
}
