export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;
in vec2 uv;

uniform float time;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

out vec3 vert_pos;
out vec3 vert_nor;
out vec2 vert_uv;
out vec3 vert_light;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform float time;

uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

in vec3 vert_pos;
in vec2 vert_uv;

uniform sampler2D samp_col;

out vec4 color;

void main() {
  color = texture(samp_col, vert_uv);
}
`
}
