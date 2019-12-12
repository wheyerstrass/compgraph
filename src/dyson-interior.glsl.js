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

void main() {
  mat4 M = obj_trans*obj_rota;
  mat4 V = cam_rota*cam_trans;
  mat4 VM = V * M;

  vert_uv = pos;
  vert_scale = obj_scale[0][0];
  vert_light = (P*V * vec4(light, 0.0)).xyz;

  vert_norm = (V * vec4(pos, 0.0)).xyz;
  vert_lnorm = (V * vec4(texture(samp_hm_nm, pos).xyz, 0.0)).xyz;

  vec3 hm = texture(samp_hm, pos).xyz-0.5;
  float disp = (0.6*hm.r + 0.3*hm.g + 0.2*hm.b);
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

uniform float time;

uniform sampler2D samp_col;

out vec4 color;

${funcs}

void main() {

  // lighting
  float li = phong(vert_light, vert_pos, vert_lnorm);

  // triplanar mapping
  vec3 coords = vert_uv;
  vec3 n = abs(normalize(vert_uv));
  n = normalize(max(n, 0.00001));
  float b = n.x + n.y + n.z;
  n /= vec3(b,b,b);

  float s = 0.02;
  vec4 xa = texture(samp_col, s*vert_scale*coords.yz);
  vec4 ya = texture(samp_col, s*vert_scale*coords.xz);
  vec4 za = texture(samp_col, s*vert_scale*coords.xy);
  vec4 tex = xa*n.x + ya*n.y + za*n.z;

  color = tex;
  vec4 f = vec4( fog(color.xyz, length(vert_pos),0.005), 1.0 );
  color = vec4(li*f.xyz, f.a);
  if(vert_uv.z > 0.85)
    color.a = 0.0;
}
`
}
