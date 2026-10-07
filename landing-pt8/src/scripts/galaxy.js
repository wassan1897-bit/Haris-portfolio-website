/** WebGL galaxy background (Background Animations/7) — B&W stars */

let active = null;

export function destroyGalaxy() {
  if (!active) return;
  cancelAnimationFrame(active.raf);
  window.removeEventListener('resize', active.onResize);
  if (active.container) {
    active.container.removeEventListener('mousemove', active.onMove);
    active.container.removeEventListener('mouseleave', active.onLeave);
    active.container.innerHTML = '';
  }
  active = null;
}

export function initGalaxy(root = document) {
  const container = root.querySelector('#galaxy');
  if (!container) return;
  destroyGalaxy();

  const opts = {
    focal: [0.5, 0.5],
    rotation: [1, 0],
    starSpeed: 0.5,
    density: 0.7,
    hueShift: 0,
    speed: 1,
    glowIntensity: 0.18,
    saturation: 0,
    repulsionStrength: 1.6,
    twinkleIntensity: 0.12,
    rotationSpeed: 0.08,
    autoCenterRepulsion: 0,
  };

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const gl =
    canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    }) ||
    canvas.getContext('experimental-webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    });
  if (!gl) return;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const vertexSrc = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  const fragmentSrc = `
precision mediump float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
varying vec2 vUv;
#define NUM_LAYER 2.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0
float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}
float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / max(d, 1e-4);
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 800.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 800.0));
  m += rays * 0.25 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}
vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      col += star * size * base;
    }
  }
  return col;
}
void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }
  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }
  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    gl_FragColor = vec4(col, min(alpha, 1.0));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
    return sh;
  }
  function link(vs2, fs2) {
    const p = gl.createProgram();
    gl.attachShader(p, vs2);
    gl.attachShader(p, fs2);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    return p;
  }

  const vs = compile(gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return;
  const program = link(vs, fs);
  if (!program) return;
  gl.useProgram(program);

  const posLoc = gl.getAttribLocation(program, 'position');
  const uvLoc = gl.getAttribLocation(program, 'uv');
  const uTimeLoc = gl.getUniformLocation(program, 'uTime');
  const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
  const uFocalLoc = gl.getUniformLocation(program, 'uFocal');
  const uRotationLoc = gl.getUniformLocation(program, 'uRotation');
  const uStarSpeedLoc = gl.getUniformLocation(program, 'uStarSpeed');
  const uDensityLoc = gl.getUniformLocation(program, 'uDensity');
  const uHueShiftLoc = gl.getUniformLocation(program, 'uHueShift');
  const uSpeedLoc = gl.getUniformLocation(program, 'uSpeed');
  const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
  const uGlowIntensityLoc = gl.getUniformLocation(program, 'uGlowIntensity');
  const uSaturationLoc = gl.getUniformLocation(program, 'uSaturation');
  const uMouseRepulsionLoc = gl.getUniformLocation(program, 'uMouseRepulsion');
  const uTwinkleIntensityLoc = gl.getUniformLocation(program, 'uTwinkleIntensity');
  const uRotationSpeedLoc = gl.getUniformLocation(program, 'uRotationSpeed');
  const uRepulsionStrengthLoc = gl.getUniformLocation(program, 'uRepulsionStrength');
  const uMouseActiveFactorLoc = gl.getUniformLocation(program, 'uMouseActiveFactor');
  const uAutoCenterRepulsionLoc = gl.getUniformLocation(program, 'uAutoCenterRepulsion');
  const uTransparentLoc = gl.getUniformLocation(program, 'uTransparent');

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 2, 0, 0, 2]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(uvLoc);
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

  const targetMouse = { x: 0.5, y: 0.5 };
  const smoothMouse = { x: 0.5, y: 0.5 };
  let targetActive = 0;
  let smoothActive = 0;
  let lastT = 0;
  let raf = 0;

  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform3fv(uResolutionLoc, new Float32Array([w, h, w / h]));
  }

  gl.uniform2fv(uFocalLoc, new Float32Array(opts.focal));
  gl.uniform2fv(uRotationLoc, new Float32Array(opts.rotation));
  gl.uniform1f(uStarSpeedLoc, opts.starSpeed);
  gl.uniform1f(uDensityLoc, opts.density);
  gl.uniform1f(uHueShiftLoc, opts.hueShift);
  gl.uniform1f(uSpeedLoc, opts.speed);
  gl.uniform1f(uGlowIntensityLoc, opts.glowIntensity);
  gl.uniform1f(uSaturationLoc, opts.saturation);
  gl.uniform1i(uMouseRepulsionLoc, 1);
  gl.uniform1f(uTwinkleIntensityLoc, opts.twinkleIntensity);
  gl.uniform1f(uRotationSpeedLoc, opts.rotationSpeed);
  gl.uniform1f(uRepulsionStrengthLoc, opts.repulsionStrength);
  gl.uniform1f(uAutoCenterRepulsionLoc, opts.autoCenterRepulsion);
  gl.uniform1i(uTransparentLoc, 1);

  function onMove(e) {
    const rect = container.getBoundingClientRect();
    targetMouse.x = (e.clientX - rect.left) / rect.width;
    targetMouse.y = 1 - (e.clientY - rect.top) / rect.height;
    targetActive = 1;
  }
  function onLeave() {
    targetActive = 0;
  }

  resize();
  window.addEventListener('resize', resize, false);
  container.addEventListener('mousemove', onMove);
  container.addEventListener('mouseleave', onLeave);

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (t - lastT < 42) return;
    lastT = t;
    gl.uniform1f(uTimeLoc, t * 1e-3);
    gl.uniform1f(uStarSpeedLoc, (t * 1e-3 * opts.starSpeed) / 10);
    const k = 0.05;
    smoothMouse.x += (targetMouse.x - smoothMouse.x) * k;
    smoothMouse.y += (targetMouse.y - smoothMouse.y) * k;
    smoothActive += (targetActive - smoothActive) * k;
    gl.uniform2fv(uMouseLoc, new Float32Array([smoothMouse.x, smoothMouse.y]));
    gl.uniform1f(uMouseActiveFactorLoc, smoothActive);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  raf = requestAnimationFrame(loop);

  active = { raf, container, onResize: resize, onMove, onLeave };
}
