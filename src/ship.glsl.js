export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;

uniform float time;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

out vec3 vert_uv;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = pos;
  gl_Position = P * VM * vec4(pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec3 vert_uv;

uniform samplerCube samp_col;

out vec4 color;

void main() {
  vec3 base = texture(samp_col, vert_uv).rbg;
  color = vec4(base, 1.0);
}
`
}
