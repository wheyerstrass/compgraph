export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec2 uv;
in vec3 pos;
in vec3 nor;

uniform float time;
uniform vec3 light;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;
uniform mat4 obj_scale;

out vec3 vert_n;
out vec3 vert_pos;
out vec3 vert_wpos;
out vec3 vert_light;
out float vert_scale;

void main() {
  mat4 M = obj_scale*obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_scale = obj_scale[0][0];
  vert_light = (VM * vec4(light, 1.0)).xyz;
  vert_n = (VM * vec4(nor, 0.0)).xyz;

  vert_wpos = pos;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: (funcs="") =>
`#version 300 es

precision mediump float;

in vec3 vert_pos;
in vec3 vert_wpos;
in vec3 vert_n;
in vec3 vert_light;
in float vert_scale;

uniform sampler2D samp_col;

out vec4 color;

${funcs}

void main() {
  vec4 tex = triplanar(vert_wpos, samp_col, 0.00001, 1.);

  float d = distance(vert_light,vert_pos);
  float at = vert_scale*vert_scale/(d*d);
  float li = phong(vert_light, vert_pos, normalize(vert_n));
  color = vec4(at*li*tex.xyz, tex.a);
}
`
}
