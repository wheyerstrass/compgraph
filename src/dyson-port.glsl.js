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
  vec3 n = abs(normalize(vert_wpos));
  n = normalize(max(n, 0.00001));
  float b = n.x + n.y + n.z;
  n /= vec3(b,b,b);

  vec4 xa = texture(samp_col, n.yz);
  vec4 ya = texture(samp_col, n.xz);
  vec4 za = texture(samp_col, n.xy);
  vec4 tex = xa*n.x + ya*n.y + za*n.z;

  float d = distance(vert_light,vert_pos);
  float at = 800.*vert_scale/(d*d);
  float li = phong(vert_light, vert_pos, normalize(vert_n));
  color = vec4(at*li*tex.xyz, tex.a);
}
`
}
