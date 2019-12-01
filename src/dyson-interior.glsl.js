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
uniform vec3 light;

uniform samplerCube samp_norm;

out vec3 vert_uv;
out vec3 vert_pos;
out vec3 vert_norm;
out vec3 vert_light;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_light = (V * vec4(light, 0.0)).xyz;

  vert_uv = pos;
  vert_pos = (VM * vec4(pos, 1.0)).xyz;
  vert_norm = (VM * vec4(pos, 0.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: (phong="") =>
`#version 300 es

precision mediump float;

in vec3 vert_uv;
in vec3 vert_pos;
in vec3 vert_norm;
in vec3 vert_light;

uniform float time;

uniform samplerCube samp_col;
uniform samplerCube samp_norm;

out vec4 color;

${phong}

void main() {

  // calc lighting intensity
  float li = 0.;
  phong(vert_light, vert_pos, normalize(vert_norm), li);

  // sample albedo
  vec4 alb = texture(samp_col, vert_uv);

  // final color
  color = vec4(li * alb.rgb, alb.a);
  //color = vec4(0.3,0.5,0.2,1.0);
}
`
}
