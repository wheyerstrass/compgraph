export default {
  vert: () =>
`#version 300 es

precision mediump float;

in vec3 pos;
in vec3 nor;
in vec2 uv;

uniform float time;
uniform vec3 light;

uniform mat4 P;
uniform mat4 cam_trans;
uniform mat4 cam_rota;

uniform mat4 obj_trans;
uniform mat4 obj_rota;

out vec3 vert_pos;
out vec3 vert_nor;
out vec2 vert_uv;
out vec3 vert_light;

uniform sampler2D samp_dis;
uniform sampler2D samp_nor;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = uv;
  vert_light = (VM * vec4(light, 0.0)).xyz;
  vec3 disp = texture(samp_dis, uv).xyz;
  float d = disp.x + disp.y + disp.z;
  vert_pos = (VM * vec4(pos+vec3(0,20.*d,0), 1.0)).xyz;
  vert_nor = (VM * vec4(texture(samp_nor,uv).xyz, 0.0)).xyz;
  //vert_nor = (VM * vec4(nor, 0.0)).xyz;
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

in vec3 vert_light;
in vec3 vert_pos;
in vec3 vert_nor;
in vec2 vert_uv;

uniform sampler2D samp_col;
uniform sampler2D samp_nor;

out vec4 color;

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
  float Is = 0.9* pow(max(rv, 0.0), 4.);

  li = (Ia+Id+Is);
}

void main() {

  float li = 0.;
  phong(vert_light, vert_pos, vert_nor, li);

  color = vec4(li*texture(samp_col,50.*vert_uv).xyz, 1.0);
}
`
}
