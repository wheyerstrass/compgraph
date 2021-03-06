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

uniform sampler2D samp_nor;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  vec3 n = 100.*texture(samp_nor,uv).xyz;
  gl_Position = P * vec4(vert_pos+sqrt(n), 1.0);
}
`,

  frag: (fog) =>
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

in vec3 vert_pos;
in vec2 vert_uv;

out vec4 color;

const vec3 s = vec3(${fog.r}, ${fog.g}, ${fog.b});
const vec2 fogr = vec2(${fog.min}, ${fog.max});

void phong(in vec3 light, in vec3 vpos, in vec3 vnorm, out float li) {

  vec3 nl = normalize(light-vpos);
  vec3 nn = normalize(vnorm);
  vec3 np = normalize(-vpos);

  // ambient
  float Ia = 0.2;

  // diffuse (lambert)
  float Id = 0.5* max( dot(nl, nn), 0.0 );

  // specular (blinn-phong)
  float rv = dot(nn, normalize(nl+np));
  float Is = 0.2* pow(rv, 4.);

  li = (Ia+Id+Is);
}

void fog(in vec3 vpos, in vec2 fz, inout vec3 col) {
  float f = (length(vpos.z) - fz.x) / (fz.y - fz.x);
  f = clamp(f, 0., 1.);
  col = mix(col, s, f);
}

void main() {

  float li = 0.;
  vec3 vert_nor = 2.*texture(samp_nor, 1.*vert_uv).xyz - 1.0;
  phong(light, vert_pos, vert_nor, li);

  //vec3 fogged_col = vec3(li,li,li);
  //fog(vert_pos,fogr,fogged_col);

  //color = vec4(fogged_col, 1.0);
  //color = vec4(li,li,li, 1.0);

  vec3 alb = texture(samp_col, 100.*vert_uv).rgb;
  //color = vec4(2.*li*alb, 1.0);
  li *= 1.0;
  color = vec4(li,li,li, 1.0);
}
`
}
