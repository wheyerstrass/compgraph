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

uniform float time;

uniform sampler2D samp_col;
uniform sampler2D samp_col2;

in vec3 v_pos;
in vec3 v_col;
in vec2 v_uvt;
in float v_uvs;

out vec4 color;

void main() {

    vec2 uv = v_pos.xy;
              
    vec3 col = v_col;
      
    float d = length(uv);
    float t = 0.001*time;
        
    vec3 rays = 
      col*1.5*(sin(10.*asin(uv.x/d)+t))-0.1 +
      col*1.5*(sin(20.*asin(uv.x/d)+2.*t))-0.1 +
      col*1.5*(sin(30.*asin(uv.x/d)+3.*t))-0.1;

    vec3 glow = col/d;
    
    vec3 fcol = 0.05*rays+0.5*glow;
    fcol *= exp(-4.*d);
    
    color = vec4(0.5*fcol,1);
}
`
}
