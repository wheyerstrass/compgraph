export default (ka, kd, ks) => `
void phong(in vec3 light, in vec3 vpos, in vec3 vnorm, out float li) {

  vec3 nl = normalize(light-vpos);
  vec3 nn = normalize(vnorm);
  vec3 np = normalize(-vpos);

  // ambient
  float Ia = ${ka};

  // diffuse (lambert)
  float Id = ${kd} * max( dot(nl, nn), 0.0 );

  // specular (blinn-phong)
  float rv = dot(nn, normalize(nl+np));
  float Is = ${ks} * pow(rv, 4.);

  li = (Ia+Id+Is);
}
`
