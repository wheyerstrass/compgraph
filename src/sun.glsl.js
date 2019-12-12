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
uniform mat4 obj_scale;

out vec3 vert_pos;
out vec2 vert_uv;

void main() {
  mat4 M = obj_trans*obj_rota*obj_scale;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform vec2 res;
uniform float time;

in vec3 vert_pos;
in vec2 vert_uv;

uniform sampler2D samp_col;
uniform sampler2D samp_col2;

out vec4 color;

void main() {
  float d = distance(vert_uv, vec2(.5,.5));
  vec4 sun = vec4(0.25, 0.2, 1., 0.02) / d;
  color = sun;
  color.a = clamp(color.a, 0., 0.9);
}
`
}
