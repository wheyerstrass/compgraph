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
uniform mat4 obj_scale;

uniform vec3 light;

uniform samplerCube samp_hm;
uniform samplerCube samp_hm_nm;

out vec3 vert_uv;
out vec3 vert_pos;
out vec3 vert_norm;
out vec3 vert_lnorm;
out vec3 vert_light;
out float vert_scale;
out float v_h;

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = pos;
  vert_scale = obj_scale[0][0];
  vert_light = (P*V * vec4(light, 0.0)).xyz;

  vert_norm = (V * vec4(pos, 0.0)).xyz;
  vert_lnorm = (V * vec4(texture(samp_hm_nm, pos).xyz, 0.0)).xyz;

  vec3 hm = texture(samp_hm,pos).xyz;
  float disp = 0.1*(hm.r+hm.g+hm.b)-0.1;
  v_h = disp;
  if(pos.z > 0.8)
    disp = 0.0;
  
  vec3 disp_pos = vert_scale * (pos - 0.5*disp*normalize(pos));
  vert_pos = (VM * vec4(disp_pos, 1.0)).xyz;
  gl_Position = P * vec4(vert_pos, 1.0);
}
`,

  frag: (funcs="") =>
`#version 300 es

precision mediump float;

in vec3 vert_uv;
in vec3 vert_pos;
in vec3 vert_norm;
in vec3 vert_lnorm;
in vec3 vert_light;
in float vert_scale;
in float v_h;

uniform float time;
uniform mat4 cam_trans;

uniform sampler2D samp_col;
uniform sampler2D samp_col2;

out vec4 color;

${funcs}

void main() {

  // lighting
  float li = phong(vert_light, vert_pos, vert_lnorm);

  // triplanar mapping
  vec4 tex = triplanar(vert_uv,samp_col,0.00001,0.02*vert_scale);

  color = tex;
  vec3 cam_pos = vec3(cam_trans[0][3], cam_trans[1][3], cam_trans[2][3]);
  float l = distance(cam_pos,vert_pos);
  vec3 raydir = normalize(vert_pos-cam_pos);
  vec4 f = vec4(fog(color.xyz, l, 0.0002), 1.0 );
  color = vec4(1.5*li*f.xyz, f.a);
  if(vert_uv.z > 0.85)
    color.a = 0.0;
}
`
}
