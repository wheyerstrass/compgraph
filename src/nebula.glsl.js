export default {
  vert: () =>
`#version 300 es

precision mediump float;

uniform mat4 P;
uniform mat4 cam_rota;
uniform mat4 cam_trans;

in vec2 pos;
// instanced
in vec3 col;
in vec3 offs;
in float scale;
in vec3 cam_pos;
in vec2 uvt;
in float uvs;

out vec3 v_pos;
out vec3 v_col;
out float v_scale;
out vec2 v_uvt;
out float v_uvs;

const vec3 _up = vec3(0,1,0);
mat3 lookat0(in vec3 from, in vec3 to) {
    vec3 f = normalize(to-from);
    vec3 s = normalize(cross(f,_up));
    vec3 u = normalize(cross(s, f));
    return mat3(
      s.x, u.x, -f.x,
      s.y, u.y, -f.y,
      s.z, u.z, -f.z
    );
}

void main() {
  v_uvt = uvt;
  v_uvs = uvs;
  v_col = col;
  v_pos = vec3(pos,0);
  mat3 rota = lookat0(offs, -cam_pos);
  vec3 fpos = transpose(rota) * scale*scale*v_pos;
  gl_Position = P * cam_rota * vec4(fpos+offs, 1);
}
`,

  frag: () =>
`#version 300 es

precision mediump float;

in vec3 v_pos;
in vec3 v_col;
in vec2 v_uvt;
in float v_uvs;

out vec4 color;

float hash(in vec2 p) {
  vec2 _p = 50. * fract(p*0.3183099 + vec2(0.71,0.113));
  return 2.* fract(_p.x*_p.y*(_p.x+_p.y)) - 1.;
}

float vnoise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  vec2 u = f*f*(3.0-2.0*f);

  return mix(mix(hash(i + vec2(0.0,0.0)), 
                hash(i + vec2(1.0,0.0)), u.x),
            mix(hash(i + vec2(0.0,1.0)), 
                hash(i + vec2(1.0,1.0)), u.x), u.y);
}

const mat2 m = mat2(1.6,1.2,-1.2,1.6);

void main() {

  float d = distance(v_pos.xy,vec2(0));
  vec4 c = vec4(v_col, 0.005)-(1.-clamp(d,0.,1.0));

  vec4 b = vec4(0,0,0,1.0);
  vec4 cb = c.rgba*c.a + b.rgba*b.a;

  vec2 uv = 0.5*(v_pos.xy+1.);
  uv = 10.*v_uvs*(uv+v_uvt);

  float f = 0.5* vnoise(uv); uv = m*uv;
  f += 0.25* vnoise(uv); uv = m*uv;
  f += 0.125* vnoise(uv); uv = m*uv;
  f += 0.0625* vnoise(uv); uv = m*uv;
  f = 0.5 + 0.5*f;

  color = vec4(f*cb.xyz,cb.a);
}
`
}
