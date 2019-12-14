export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec2 uv;
in vec3 pos;

uniform float time;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;
uniform mat4 obj_scale;

out vec2 vert_uv;

void main() {
  mat4 M = obj_trans*obj_rota*obj_scale;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  gl_Position = P * VM * vec4(pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec2 vert_uv;

uniform sampler2D samp_col;

out vec4 color;

void main() {
  color = texture(samp_col, vert_uv);
}
`
}
