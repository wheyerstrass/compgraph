export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;
in vec2 uv;

uniform float time;
uniform vec3 light;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

out vec3 vert_pos;
out vec2 vert_uv;

uniform sampler2D samp_hm;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  vec3 tex = texture(samp_hm,uv).xyz;
  float disp = 10.*(tex.r + tex.g + tex.b);
  vert_pos.y += disp;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

uniform float time;
uniform vec3 light;

uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

uniform sampler2D samp_col;
uniform sampler2D samp_nor;
uniform sampler2D samp_hm;
uniform sampler2D samp_cube;

in vec3 vert_pos;
in vec2 vert_uv;

out vec4 color;

void phong(in vec3 light, in vec3 vpos, in vec3 vnorm, out float li) {

  vec3 nl = normalize(light-vpos);
  vec3 nn = normalize(vnorm);
  vec3 np = normalize(-vpos);

  // ambient
  float Ia = 0.3;

  // diffuse (lambert)
  float Id = 0.6* max( dot(nl, nn), 0.0 );

  // specular (blinn-phong)
  float rv = dot(nn, normalize(nl+np));
  float Is = 0.9* pow(rv, 4.);

  li = (Ia+Id+Is);
}

void main() {

  float li = 0.;
  vec3 vert_nor = 2.*texture(samp_nor,vert_uv).xyz - 1.0;
  phong(light, vert_pos, vert_nor, li);

  vec3 base = li*texture(samp_col,9.*vert_uv).xyz;
  color = vec4(base, 1.0);
}
`
}
