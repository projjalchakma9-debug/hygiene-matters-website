gsap.registerPlugin(ScrollTrigger);

// ── LENIS SMOOTH SCROLL ───────────────────────────────────────────────────────
const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);


// ── THREE.JS BACKGROUND ──────────────────────────────────────────────────────
const bgCanvas = document.getElementById('bg-canvas');
const bgR = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true });
bgR.setPixelRatio(Math.min(window.devicePixelRatio, 2));
bgR.setSize(window.innerWidth, window.innerHeight);

const bgScene = new THREE.Scene();
const bgCam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
bgCam.position.z = 40;

// Particles
const pGeo = new THREE.BufferGeometry();
const pCount = 4000;
const pArr = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) pArr[i] = (Math.random() - 0.5) * 150;
pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
const bgParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.06, color: 0xc9a050, transparent: true, opacity: 0.35, sizeAttenuation: true
}));
bgScene.add(bgParticles);

// Floating wireframe shapes
const bgShapes = [];
const geoPool = [
    new THREE.OctahedronGeometry(2.2), new THREE.IcosahedronGeometry(1.8),
    new THREE.TetrahedronGeometry(2), new THREE.BoxGeometry(2.4, 2.4, 2.4),
];
for (let i = 0; i < 14; i++) {
    const mesh = new THREE.Mesh(geoPool[i % geoPool.length], new THREE.MeshBasicMaterial({
        color: 0xc9a050, wireframe: true, transparent: true,
        opacity: 0.03 + Math.random() * 0.04
    }));
    mesh.position.set((Math.random()-0.5)*110, (Math.random()-0.5)*75, (Math.random()-0.5)*45-10);
    mesh.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, 0);
    bgShapes.push({ mesh, speed: 0.05 + Math.random() * 0.1 });
    bgScene.add(mesh);
}

let mx = 0, my = 0;
window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
});


// ── TESTIMONIALS — REALISTIC "HYGIENE MATTERS" KIT BOX ───────────────────────

// Fast stroke-only normal map (no pixel loops)
function makeKraftNormal() {
    const S = 256;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const cx = cv.getContext('2d');
    cx.fillStyle = 'rgb(128,128,255)';
    cx.fillRect(0, 0, S, S);
    for (let i = 0; i < 180; i++) {
        const y  = Math.random() * S;
        const rV = 128 + (Math.random() > 0.5 ? 1 : -1) * (6 + Math.random() * 16);
        const gV = 128 + (Math.random() - 0.5) * 10;
        cx.strokeStyle = `rgba(${rV|0},${gV|0},230,${0.25 + Math.random()*0.4})`;
        cx.lineWidth   = 0.5 + Math.random() * 1.5;
        cx.beginPath(); cx.moveTo(0, y); cx.lineTo(S, y + (Math.random()-0.5)*4); cx.stroke();
    }
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
}

// Fast kraft texture — stroke-only, no pixel loops
function makeKraftTex(type) {
    const S = 512;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const cx = cv.getContext('2d');

    if (type === 'front') {
        // ── Branded retail product box front ──────────────────────────────
        // Cream base
        cx.fillStyle = '#f2ede4';
        cx.fillRect(0, 0, S, S);

        // Subtle paper texture
        for (let i = 0; i < 80; i++) {
            cx.strokeStyle = `rgba(180,165,140,${0.03 + Math.random()*0.04})`;
            cx.lineWidth = 0.5;
            const y = Math.random() * S;
            cx.beginPath(); cx.moveTo(0, y); cx.lineTo(S, y + (Math.random()-0.5)*4); cx.stroke();
        }

        // Top gold accent strip
        cx.fillStyle = '#c9a050';
        cx.fillRect(0, 0, S, 48);
        cx.fillStyle = '#f2ede4';
        cx.font = 'bold 13px Arial';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.letterSpacing = '4px';
        cx.fillText('PREMIUM TRAVEL HYGIENE', S/2, 24);

        // Brand name — large dark serif
        cx.fillStyle = '#1a1008';
        cx.font = 'bold 92px Georgia, serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'alphabetic';
        cx.letterSpacing = '2px';
        cx.fillText('HYGIENE', S/2, 170);

        cx.fillStyle = '#c9a050';
        cx.font = 'bold 88px Georgia, serif';
        cx.letterSpacing = '2px';
        cx.fillText('MATTERS', S/2, 265);

        // Dark teal accent band
        cx.fillStyle = '#1e2e2a';
        cx.fillRect(0, 285, S, 68);
        cx.fillStyle = '#e8dfc8';
        cx.font = '500 14px Arial';
        cx.letterSpacing = '3px';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText('STAY CLEAN · TRAVEL SMART', S/2, 319);

        // Product icons row (simple geometric shapes representing items)
        const icons = [
            { x: 72,  label: 'SANITIZER' },
            { x: 168, label: 'TISSUE' },
            { x: 264, label: 'SPRAY' },
            { x: 360, label: 'SOAP' },
            { x: 456, label: 'COVER' },
        ];
        icons.forEach(({ x, label }) => {
            // Icon circle
            cx.fillStyle = 'rgba(30,46,42,0.08)';
            cx.beginPath(); cx.arc(x, 400, 32, 0, Math.PI*2); cx.fill();
            cx.strokeStyle = '#c9a050';
            cx.lineWidth = 1.5;
            cx.beginPath(); cx.arc(x, 400, 32, 0, Math.PI*2); cx.stroke();
            // Icon dot
            cx.fillStyle = '#1e2e2a';
            cx.beginPath(); cx.arc(x, 400, 10, 0, Math.PI*2); cx.fill();
            // Label
            cx.fillStyle = '#5a4a2a';
            cx.font = '500 11px Arial';
            cx.letterSpacing = '1px';
            cx.textAlign = 'center';
            cx.textBaseline = 'top';
            cx.fillText(label, x, 440);
        });

        // Bottom strip
        cx.fillStyle = '#1a1008';
        cx.fillRect(0, 470, S, 42);
        cx.fillStyle = '#c9a050';
        cx.font = '500 12px Arial';
        cx.letterSpacing = '2px';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText('hygienematters.in  ·  7 ESSENTIALS', S/2, 491);

    } else if (type === 'top') {
        // Cream top with brand circle
        cx.fillStyle = '#ede8de';
        cx.fillRect(0, 0, S, S);

        cx.strokeStyle = '#c9a050';
        cx.lineWidth = 3;
        cx.beginPath(); cx.arc(S/2, S/2, 160, 0, Math.PI*2); cx.stroke();
        cx.strokeStyle = 'rgba(201,160,80,0.3)';
        cx.lineWidth = 1;
        cx.beginPath(); cx.arc(S/2, S/2, 148, 0, Math.PI*2); cx.stroke();

        cx.fillStyle = '#1a1008';
        cx.font = 'bold 150px Georgia, serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText('HM', S/2, S/2);

    } else if (type === 'side') {
        // Cream side panel
        cx.fillStyle = '#ede8de';
        cx.fillRect(0, 0, S, S);

        // Gold left edge stripe
        cx.fillStyle = '#c9a050';
        cx.fillRect(0, 0, 18, S);

        // Dark teal band matching front
        cx.fillStyle = '#1e2e2a';
        cx.fillRect(0, S*0.5 - 36, S, 72);

        // Rotated text
        cx.save();
        cx.translate(S/2, S/2);
        cx.rotate(-Math.PI/2);
        cx.fillStyle = '#e8dfc8';
        cx.font = 'bold 20px Arial';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.letterSpacing = '5px';
        cx.fillText('PRECISION DESIGNED KIT', 0, 0);
        cx.restore();

        // Brand text vertical on cream section
        cx.save();
        cx.translate(S/2, S*0.25);
        cx.rotate(-Math.PI/2);
        cx.fillStyle = '#1a1008';
        cx.font = 'bold 22px Georgia, serif';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.letterSpacing = '3px';
        cx.fillText('HYGIENE MATTERS', 0, 0);
        cx.restore();
    }

    return new THREE.CanvasTexture(cv);
}

// Smooth cursor target for box
let tdCurX = 0, tdCurY = 0;

const testDropCanvas = document.getElementById('test-drop-canvas');
let testDropData = null;
if (testDropCanvas) {
    const W = window.innerWidth;
    const H = window.innerHeight * 0.9;
    const r = new THREE.WebGLRenderer({ canvas: testDropCanvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setSize(W, H);
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.1;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    const s = new THREE.Scene();
    const c = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    c.position.z = 9;

    // ── IBL environment map (warm dark studio) ─────────────────────────
    const pmrem = new THREE.PMREMGenerator(r);
    pmrem.compileEquirectangularShader();
    const envCv = document.createElement('canvas');
    envCv.width = 512; envCv.height = 256;
    const ec = envCv.getContext('2d');
    // Dark warm background
    const egr = ec.createLinearGradient(0, 0, 0, 256);
    egr.addColorStop(0, '#1e1408'); egr.addColorStop(0.45, '#120d04'); egr.addColorStop(1, '#060402');
    ec.fillStyle = egr; ec.fillRect(0, 0, 512, 256);
    // Key light hot spot upper-right
    const ek = ec.createRadialGradient(390, 48, 0, 390, 48, 190);
    ek.addColorStop(0, 'rgba(255,240,205,0.88)'); ek.addColorStop(1, 'rgba(0,0,0,0)');
    ec.fillStyle = ek; ec.fillRect(0, 0, 512, 256);
    // Warm rim left
    const er = ec.createRadialGradient(55, 128, 0, 55, 128, 130);
    er.addColorStop(0, 'rgba(201,160,80,0.42)'); er.addColorStop(1, 'rgba(0,0,0,0)');
    ec.fillStyle = er; ec.fillRect(0, 0, 512, 256);
    // Cool blue-grey fill from below
    const ef = ec.createRadialGradient(256, 240, 0, 256, 240, 160);
    ef.addColorStop(0, 'rgba(80,90,110,0.18)'); ef.addColorStop(1, 'rgba(0,0,0,0)');
    ec.fillStyle = ef; ec.fillRect(0, 0, 512, 256);
    const envTex = new THREE.CanvasTexture(envCv);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envMap = pmrem.fromEquirectangular(envTex).texture;
    s.environment = envMap;
    envTex.dispose(); pmrem.dispose();

    // ── Lights (work together with IBL) ────────────────────────────────
    s.add(new THREE.AmbientLight(0xfff0d0, 0.2));
    const key = new THREE.DirectionalLight(0xfff8e8, 2.2);
    key.position.set(5, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 30;
    key.shadow.radius = 8;
    s.add(key);
    const rim = new THREE.DirectionalLight(0xd4a84a, 1.4);
    rim.position.set(-6, 2, -3); s.add(rim);
    const fill = new THREE.PointLight(0xfff0e0, 0.6, 20);
    fill.position.set(-3, 4, 6); s.add(fill);

    // Outer group: scroll-driven
    const g = new THREE.Group();
    g.position.set(2.2, 9, 0);
    s.add(g);

    // Inner group: cursor-driven rotation
    const innerG = new THREE.Group();
    g.add(innerG);

    // ── Textures ────────────────────────────────────────────────────────
    const normalMap = makeKraftNormal();
    const frontTex  = makeKraftTex('front');
    const topTex    = makeKraftTex('top');
    const sideTex   = makeKraftTex('side');

    // Printed retail packaging material — smoother, slight sheen
    const phyMat = (map) => new THREE.MeshPhysicalMaterial({
        map,
        normalMap,
        normalScale: new THREE.Vector2(0.15, 0.15),
        roughness: 0.72,
        metalness: 0.0,
        clearcoat: 0.2,
        clearcoatRoughness: 0.55,
        envMapIntensity: 0.9,
    });
    const sidePlain = () => new THREE.MeshPhysicalMaterial({
        color: 0xede8de, roughness: 0.75, metalness: 0.0, clearcoat: 0.15, envMapIntensity: 0.8,
    });

    // ── Box geometry — [right, left, top, bottom, front, back] ─────────
    const BW = 3.1, BH = 2.2, BD = 2.0;
    const boxGeo = new THREE.BoxGeometry(BW, BH, BD);
    const boxMats = [
        phyMat(sideTex),  // right
        phyMat(sideTex),  // left
        phyMat(topTex),   // top
        sidePlain(),      // bottom
        phyMat(frontTex), // front
        sidePlain(),      // back
    ];
    const hmBox = new THREE.Mesh(boxGeo, boxMats);
    hmBox.castShadow = true;
    hmBox.receiveShadow = true;
    innerG.add(hmBox);

    // ── Thin gold border edges (retail box trim) ─────────────────────────
    const edgeMat = new THREE.MeshPhysicalMaterial({
        color: 0xc9a050, roughness: 0.25, metalness: 0.8,
        clearcoat: 0.6, clearcoatRoughness: 0.15,
    });
    // Top accent strip on front face
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(BW + 0.01, 0.22, 0.02), edgeMat);
    topStrip.position.set(0, BH/2 - 0.11, BD/2 + 0.01);
    innerG.add(topStrip);
    // Bottom accent strip on front face
    const botStrip = new THREE.Mesh(new THREE.BoxGeometry(BW + 0.01, 0.18, 0.02), edgeMat);
    botStrip.position.set(0, -BH/2 + 0.09, BD/2 + 0.01);
    innerG.add(botStrip);

    // ── Soft drop shadow plane ───────────────────────────────────────────
    const shCv = document.createElement('canvas');
    shCv.width = 256; shCv.height = 128;
    const shCx = shCv.getContext('2d');
    const shGr = shCx.createRadialGradient(128, 64, 4, 128, 64, 110);
    shGr.addColorStop(0,   'rgba(0,0,0,0.65)');
    shGr.addColorStop(0.45,'rgba(0,0,0,0.28)');
    shGr.addColorStop(1,   'rgba(0,0,0,0)');
    shCx.fillStyle = shGr; shCx.fillRect(0, 0, 256, 128);
    const shTex = new THREE.CanvasTexture(shCv);
    const shMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 3.2),
        new THREE.MeshBasicMaterial({ map: shTex, transparent: true, depthWrite: false, opacity: 0.85 })
    );
    shMesh.rotation.x = -Math.PI / 2;
    shMesh.position.y = -BH / 2 - 0.01;
    innerG.add(shMesh);

    // ── ScrollTrigger ────────────────────────────────────────────────────
    gsap.to(g.position, {
        y: -5.5, x: -1.0,
        scrollTrigger: { trigger: '#testimonials', start: 'top bottom', end: 'bottom top', scrub: 2.2 }
    });
    gsap.to(g.rotation, {
        z: 0.5, x: 0.25,
        scrollTrigger: { trigger: '#testimonials', start: 'top bottom', end: 'bottom top', scrub: 2.2 }
    });

    testDropData = { r, s, c, g, innerG };

    window.addEventListener('load', () => {
        const sec = document.getElementById('testimonials');
        if (!sec || !testDropData) return;
        const rW = sec.offsetWidth, rH = sec.offsetHeight;
        testDropData.r.setSize(rW, rH);
        testDropData.c.aspect = rW / rH;
        testDropData.c.updateProjectionMatrix();
    });
}

// ── PRODUCT SVG SILHOUETTES (used by CTA reveal + scatter) ───────────────────
const ITEM_SVGS = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 68"><defs><linearGradient id="sg0" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#2a1800"/><stop offset="35%" stop-color="#c9a050"/><stop offset="65%" stop-color="#e8c97a"/><stop offset="100%" stop-color="#1a1000"/></linearGradient><linearGradient id="sg0t" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1a1000"/><stop offset="50%" stop-color="#c9a050"/><stop offset="100%" stop-color="#2a1800"/></linearGradient></defs><rect x="8" y="20" width="16" height="44" rx="5" fill="url(#sg0)"/><rect x="11" y="11" width="10" height="11" rx="3" fill="url(#sg0t)"/><rect x="12" y="5" width="8" height="7" rx="3" fill="#c9a050" opacity=".6"/><rect x="11" y="32" width="3" height="18" rx="1.5" fill="#f0ebe0" opacity=".12"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 44"><defs><linearGradient id="sg1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e8c97a" stop-opacity=".9"/><stop offset="100%" stop-color="#2a1800" stop-opacity=".8"/></linearGradient></defs><ellipse cx="38" cy="34" rx="34" ry="9" fill="#1a1000" opacity=".7"/><path d="M4 28 Q16 6 38 6 Q60 6 72 28 Q60 36 38 36 Q16 36 4 28Z" fill="url(#sg1)"/><path d="M12 20 Q24 10 38 10 Q52 10 64 20" stroke="#f0ebe0" stroke-width="0.8" fill="none" opacity=".2"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 46"><defs><linearGradient id="sg2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1a1000"/><stop offset="40%" stop-color="#c9a050"/><stop offset="100%" stop-color="#2a1800"/></linearGradient></defs><rect x="3" y="34" width="46" height="7" rx="2" fill="#1a1000" opacity=".6"/><rect x="3" y="25" width="46" height="7" rx="2" fill="url(#sg2)" opacity=".7"/><rect x="3" y="16" width="46" height="7" rx="2" fill="url(#sg2)" opacity=".82"/><rect x="3" y="7" width="46" height="7" rx="2" fill="#e8c97a" opacity=".88"/><rect x="5" y="8" width="8" height="5" rx="1" fill="#f0ebe0" opacity=".15"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 72"><defs><linearGradient id="sg3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1a1000"/><stop offset="30%" stop-color="#c9a050"/><stop offset="70%" stop-color="#e8c97a"/><stop offset="100%" stop-color="#2a1800"/></linearGradient></defs><rect x="10" y="26" width="22" height="42" rx="7" fill="url(#sg3)"/><path d="M18 26 L18 17 L30 17 L35 9" stroke="#c9a050" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="35" cy="8" r="3.5" fill="#e8c97a" opacity=".9"/><rect x="13" y="36" width="3" height="14" rx="1.5" fill="#f0ebe0" opacity=".13"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 46"><defs><linearGradient id="sg4" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e8c97a" stop-opacity=".85"/><stop offset="50%" stop-color="#c9a050" stop-opacity=".75"/><stop offset="100%" stop-color="#2a1800" stop-opacity=".8"/></linearGradient></defs><rect x="3" y="5" width="64" height="36" rx="10" fill="url(#sg4)"/><rect x="10" y="12" width="50" height="20" rx="6" fill="#1a1000" opacity=".35"/><rect x="14" y="16" width="18" height="2" rx="1" fill="#f0ebe0" opacity=".2"/><rect x="14" y="21" width="12" height="1.5" rx="0.75" fill="#f0ebe0" opacity=".12"/></svg>`,
];

// ── CTA — CURSOR SPOTLIGHT REVEAL ────────────────────────────────────────────
function svgToImg(svgStr) {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const img  = new Image();
    img.src = URL.createObjectURL(blob);
    return img;
}

const ctaRevealCanvas = document.getElementById('cta-reveal-canvas');
let ctaRevealData = null;

if (ctaRevealCanvas) {
    const ctaSec = document.getElementById('cta-final');
    const rctx   = ctaRevealCanvas.getContext('2d');

    // Pre-load all 5 product SVGs as images
    const itemImgs = ITEM_SVGS.map(svgToImg);

    // Scatter 26 items at fixed normalised positions (seeded layout)
    const rng = (() => { let s = 42; return () => { s = (s*1664525+1013904223)&0xffffffff; return (s>>>0)/4294967296; }; })();
    const ctaItems = Array.from({ length: 26 }, (_, i) => ({
        img:      itemImgs[i % 5],
        x:        0.04 + rng() * 0.92,
        y:        0.04 + rng() * 0.92,
        rot:      (rng() - 0.5) * Math.PI * 1.8,
        size:     110 + rng() * 180,        // 110–290 px — large so they're dramatic
        depth:    rng(),
        speed:    0.25 + rng() * 0.45,
        phase:    rng() * Math.PI * 2,
        floatAmt: 8 + rng() * 20,
    }));

    let ctaCurX = 0, ctaCurY = 0, ctaActive = false;

    ctaSec.addEventListener('mouseenter', () => { ctaActive = true; });
    ctaSec.addEventListener('mouseleave', () => { ctaActive = false; });
    ctaSec.addEventListener('mousemove', e => {
        const rect = ctaSec.getBoundingClientRect();
        ctaCurX = e.clientX - rect.left;
        ctaCurY = e.clientY - rect.top;
    });

    function resizeCta() {
        const CW = ctaSec.offsetWidth  || window.innerWidth;
        const CH = ctaSec.offsetHeight || window.innerHeight;
        ctaRevealCanvas.width  = CW;
        ctaRevealCanvas.height = CH;
        if (ctaRevealData) { ctaRevealData.CW = CW; ctaRevealData.CH = CH; }
    }
    resizeCta();
    window.addEventListener('load',   resizeCta);
    window.addEventListener('resize', resizeCta);

    ctaRevealData = {
        canvas: ctaRevealCanvas, ctx: rctx,
        items: ctaItems,
        CW: ctaRevealCanvas.width, CH: ctaRevealCanvas.height,
        get curX() { return ctaCurX; },
        get curY() { return ctaCurY; },
        get active() { return ctaActive; },
    };
}

// ── CORPORATE CANVAS — premium kraft box stack ────────────────────────────────

// Branded corporate box front face
function makeCorpBoxFace(kitName, subtitle, hasIcons) {
    const W = 512, H = 256;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const cx = cv.getContext('2d');

    // Cream base
    cx.fillStyle = '#f2ede4';
    cx.fillRect(0, 0, W, H);

    // Subtle paper grain
    for (let i = 0; i < 60; i++) {
        const y = Math.random() * H;
        cx.strokeStyle = `rgba(180,165,140,${0.025 + Math.random()*0.035})`;
        cx.lineWidth = 0.5;
        cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y + (Math.random()-0.5)*3); cx.stroke();
    }

    // Top gold brand strip
    cx.fillStyle = '#c9a050';
    cx.fillRect(0, 0, W, 38);
    cx.fillStyle = '#f2ede4';
    cx.font = 'bold 11px Arial';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.letterSpacing = '4px';
    cx.fillText('HYGIENE MATTERS', W / 2, 19);

    // Kit name — large dark serif
    cx.fillStyle = '#1a1008';
    cx.font = 'bold 54px Georgia, serif';
    cx.textAlign = 'center';
    cx.textBaseline = 'alphabetic';
    cx.letterSpacing = '1px';
    cx.fillText(kitName, W / 2, 118);

    // Dark teal accent band
    cx.fillStyle = '#1e2e2a';
    cx.fillRect(0, 128, W, 44);
    cx.fillStyle = '#e8dfc8';
    cx.font = '500 11px Arial';
    cx.letterSpacing = '2.5px';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(subtitle, W / 2, 150);

    // Bottom info row
    if (hasIcons) {
        cx.fillStyle = '#5a4a2a';
        cx.font = '10px Arial';
        cx.letterSpacing = '1px';
        cx.textAlign = 'center';
        cx.textBaseline = 'middle';
        cx.fillText('sanitizer · tissue · spray · soap · cover', W / 2, 205);
    }

    // Bottom thin gold rule
    cx.strokeStyle = '#c9a050';
    cx.lineWidth = 1.5;
    cx.beginPath(); cx.moveTo(20, 228); cx.lineTo(W - 20, 228); cx.stroke();

    cx.fillStyle = '#8a6820';
    cx.font = '9px Arial';
    cx.letterSpacing = '2px';
    cx.fillText('PREMIUM TRAVEL KIT', W / 2, 244);

    return new THREE.CanvasTexture(cv);
}

// Cream side texture for non-front faces
function makeCorpKraftTex() {
    const S = 256;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const cx = cv.getContext('2d');
    // Cream base matching front
    cx.fillStyle = '#ede8de';
    cx.fillRect(0, 0, S, S);
    // Subtle paper grain
    for (let i = 0; i < 60; i++) {
        const y = Math.random() * S;
        cx.strokeStyle = `rgba(175,160,135,${0.03 + Math.random()*0.04})`;
        cx.lineWidth = 0.5;
        cx.beginPath(); cx.moveTo(0, y); cx.lineTo(S, y + (Math.random()-0.5)*2); cx.stroke();
    }
    // Gold left edge
    cx.fillStyle = '#c9a050';
    cx.fillRect(0, 0, 12, S);
    // Teal band in middle matching front
    cx.fillStyle = '#1e2e2a';
    cx.fillRect(0, S * 0.5 - 20, S, 40);
    // Rotated brand text in teal band
    cx.save();
    cx.translate(S / 2, S / 2);
    cx.rotate(-Math.PI / 2);
    cx.fillStyle = '#e8dfc8';
    cx.font = 'bold 13px Arial';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.letterSpacing = '4px';
    cx.fillText('HYGIENE MATTERS', 0, 0);
    cx.restore();
    return new THREE.CanvasTexture(cv);
}

const corpCanvas = document.getElementById('corp-canvas');
let corpData = null;
if (corpCanvas) {
    const W = 560, H = 500;
    const r = new THREE.WebGLRenderer({ canvas: corpCanvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setSize(W, H);
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    const s = new THREE.Scene();
    const c = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    c.position.set(1.2, 1.5, 7.5);
    c.lookAt(0, -0.2, 0);

    // IBL environment (warm dark studio same approach as testimonials)
    const cPmrem = new THREE.PMREMGenerator(r);
    cPmrem.compileEquirectangularShader();
    const cEnvCv = document.createElement('canvas');
    cEnvCv.width = 512; cEnvCv.height = 256;
    const ce = cEnvCv.getContext('2d');
    const cGr = ce.createLinearGradient(0, 0, 0, 256);
    cGr.addColorStop(0, '#1a1206'); cGr.addColorStop(0.5, '#0e0a04'); cGr.addColorStop(1, '#050302');
    ce.fillStyle = cGr; ce.fillRect(0, 0, 512, 256);
    const ck = ce.createRadialGradient(380, 45, 0, 380, 45, 200);
    ck.addColorStop(0, 'rgba(255,240,200,0.85)'); ck.addColorStop(1, 'rgba(0,0,0,0)');
    ce.fillStyle = ck; ce.fillRect(0, 0, 512, 256);
    const cr = ce.createRadialGradient(60, 130, 0, 60, 130, 120);
    cr.addColorStop(0, 'rgba(201,160,80,0.45)'); cr.addColorStop(1, 'rgba(0,0,0,0)');
    ce.fillStyle = cr; ce.fillRect(0, 0, 512, 256);
    const cEnvTex = new THREE.CanvasTexture(cEnvCv);
    cEnvTex.mapping = THREE.EquirectangularReflectionMapping;
    const cEnvMap = cPmrem.fromEquirectangular(cEnvTex).texture;
    s.environment = cEnvMap;
    cEnvTex.dispose(); cPmrem.dispose();

    // Lights
    s.add(new THREE.AmbientLight(0xfff0d0, 0.18));
    const cKey = new THREE.DirectionalLight(0xfff8e8, 2.4);
    cKey.position.set(5, 9, 6);
    cKey.castShadow = true;
    cKey.shadow.mapSize.set(1024, 1024);
    cKey.shadow.radius = 10;
    s.add(cKey);
    const cRim = new THREE.DirectionalLight(0xd4a84a, 1.5);
    cRim.position.set(-5, 2, -3); s.add(cRim);
    const cFill = new THREE.PointLight(0xfff0e0, 0.5, 18);
    cFill.position.set(-2, 3, 6); s.add(cFill);

    const g = new THREE.Group();

    // Shared plain kraft texture
    const kraftTex = makeCorpKraftTex();

    // Helper — build a box with labeled front face
    function corpBox(W3, H3, D3, kitName, subtitle, hasIcons, posY, rotY) {
        const frontTex = makeCorpBoxFace(kitName, subtitle, hasIcons);
        const sideMat = () => new THREE.MeshPhysicalMaterial({
            map: kraftTex, roughness: 0.72, metalness: 0.0,
            clearcoat: 0.15, clearcoatRoughness: 0.6, envMapIntensity: 0.85,
        });
        const mats = [
            sideMat(), sideMat(), sideMat(), sideMat(),
            new THREE.MeshPhysicalMaterial({ map: frontTex, roughness: 0.70, metalness: 0.0, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.9 }),
            sideMat(),
        ];
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(W3, H3, D3), mats);
        mesh.position.set(0, posY, 0);
        mesh.rotation.y = rotY;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        g.add(mesh);
        return mesh;
    }

    // Box 1 — bottom (largest): Standard Travel Kit
    corpBox(3.4, 1.0, 2.1, 'STANDARD', 'TRAVEL KIT', true, -1.5, 0.20);
    // Box 2 — middle: Hygiene Matters branded
    corpBox(2.85, 0.95, 1.8, 'HYGIENE', 'MATTERS', false, -0.42, -0.10);
    // Box 3 — top (smallest): Premium Travel Kit
    corpBox(2.2, 0.88, 1.4, 'PREMIUM', 'TRAVEL KIT', true, 0.60, 0.18);

    // Dark circular platform disc
    const discMat = new THREE.MeshStandardMaterial({ color: 0x0d0a06, roughness: 0.7, metalness: 0.1 });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.12, 64), discMat);
    disc.position.y = -2.07;
    disc.receiveShadow = true;
    g.add(disc);

    // Concentric gold rings on platform
    const ringMat = (op) => new THREE.MeshBasicMaterial({ color: 0xc9a050, transparent: true, opacity: op });
    [
        { r: 2.5, t: 0.022, op: 0.60 },
        { r: 1.85, t: 0.014, op: 0.38 },
        { r: 1.2,  t: 0.010, op: 0.22 },
    ].forEach(({ r, t, op }) => {
        const torus = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 100), ringMat(op));
        torus.rotation.x = Math.PI / 2;
        torus.position.y = -2.00;
        g.add(torus);
    });

    // Soft shadow blob beneath disc
    const sCv = document.createElement('canvas');
    sCv.width = 256; sCv.height = 256;
    const sCx = sCv.getContext('2d');
    const sGr = sCx.createRadialGradient(128, 128, 0, 128, 128, 115);
    sGr.addColorStop(0, 'rgba(0,0,0,0.55)');
    sGr.addColorStop(0.5, 'rgba(0,0,0,0.20)');
    sGr.addColorStop(1, 'rgba(0,0,0,0)');
    sCx.fillStyle = sGr; sCx.fillRect(0, 0, 256, 256);
    const shMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(6.5, 6.5),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sCv), transparent: true, depthWrite: false, opacity: 0.9 })
    );
    shMesh.rotation.x = -Math.PI / 2;
    shMesh.position.y = -2.14;
    g.add(shMesh);

    // Floating gold dust
    const dGeo = new THREE.BufferGeometry();
    const dArr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
        dArr[i*3] = (Math.random()-0.5)*12; dArr[i*3+1] = (Math.random()-0.5)*8; dArr[i*3+2] = (Math.random()-0.5)*6;
    }
    dGeo.setAttribute('position', new THREE.BufferAttribute(dArr, 3));
    s.add(new THREE.Points(dGeo, new THREE.PointsMaterial({ size: 0.03, color: 0xc9a050, transparent: true, opacity: 0.28 })));

    s.add(g);
    corpData = { r, s, c, g };
}


// ── HERO FRAME SCRUB ─────────────────────────────────────────────────────────
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
const FRAME_COUNT = 81;
const frames = [];
let framesLoaded = 0;
let heroReady = false;
let currentFrame = 0;

if (heroCanvas && heroCtx) {
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;

    const hlBar = document.querySelector('.hl-bar');

    function drawFrame(idx) {
        const img = frames[idx];
        if (!img || !img.complete) return;
        const cW = heroCanvas.width, cH = heroCanvas.height;
        const iW = img.naturalWidth  || cW;
        const iH = img.naturalHeight || cH;
        const scale = Math.max(cW / iW, cH / iH);
        const w = iW * scale, h = iH * scale;
        heroCtx.clearRect(0, 0, cW, cH);
        heroCtx.drawImage(img, (cW - w) / 2, (cH - h) / 2, w, h);
    }

    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const num = String(i).padStart(3, '0');
        img.src = `assets/frames/ezgif-frame-${num}.png`;
        img.onload = () => {
            framesLoaded++;
            if (hlBar) hlBar.style.width = (framesLoaded / FRAME_COUNT * 100) + '%';
            // Show hero as soon as frame 1 is ready — don't block on all 81
            if (i === 1 && !heroReady) {
                heroReady = true;
                drawFrame(0);
                const loader = document.getElementById('hero-loader');
                if (loader) gsap.to(loader, { opacity: 0, duration: 0.5, delay: 0.1, onComplete: () => loader.style.display = 'none' });
            }
        };
        frames.push(img);
    }

    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
            if (!heroReady) return;
            const target = Math.min(Math.floor(self.progress * FRAME_COUNT), FRAME_COUNT - 1);
            // Fall back to nearest already-loaded frame when scrolling fast
            let idx = target;
            while (idx > 0 && frames[idx] && !frames[idx].complete) idx--;
            if (idx !== currentFrame) { currentFrame = idx; drawFrame(idx); }
        }
    });

    // Fade text out as user scrolls into the frames
    gsap.to('.hero-content-wrap', {
        scrollTrigger: { trigger: '#hero', start: '12% top', end: '38% top', scrub: 1 },
        opacity: 0, y: -50
    });
    gsap.to(['.hero-badge', '.hero-scroll-hint'], {
        scrollTrigger: { trigger: '#hero', start: '8% top', end: '22% top', scrub: 1 },
        opacity: 0
    });

    window.addEventListener('resize', () => {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
        if (heroReady) drawFrame(currentFrame);
    });
}

// ── HERO TITLE LINE WRAP ──────────────────────────────────────────────────────
document.querySelectorAll('.h1-line').forEach(line => {
    const txt = line.textContent;
    const isGold = line.querySelector('.italic-gold');
    if (isGold) {
        line.innerHTML = `<span class="italic-gold">${txt}</span>`;
    } else {
        line.innerHTML = `<span>${txt}</span>`;
    }
});

// ── GSAP: HERO ────────────────────────────────────────────────────────────────
const htl = gsap.timeline({ delay: 0.8 });
htl
    .to('.hero-eyebrow',      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
    .to('.h1-line span',      { y: '0%', opacity: 1, stagger: 0.18, duration: 1.1, ease: 'power4.out' }, '-=0.6')
    .to('.hero-sub',          { opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.5')
    .to('.hero-down',         { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('.hero-badge',        { opacity: 1, duration: 0.7 }, '-=0.4')
    .to('.hero-scroll-hint',  { opacity: 1, duration: 0.7 }, '-=0.4');

// ── GSAP: MANIFESTO ───────────────────────────────────────────────────────────
gsap.to('.mani-label', {
    scrollTrigger: { trigger: '#manifesto', start: 'top 80%' },
    opacity: 1, duration: 0.9, ease: 'power3.out'
});
gsap.to('.mani-line', {
    scrollTrigger: { trigger: '#manifesto', start: 'top 75%' },
    opacity: 1, y: 0, stagger: 0.16, duration: 1.1, ease: 'power3.out'
});
gsap.to('.mani-foot', {
    scrollTrigger: { trigger: '#manifesto', start: 'top 60%' },
    opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.9
});

// ── GSAP: ZOOM IN / ZOOM OUT ──────────────────────────────────────────────────
// Each kit wrapper is 400vh. The card zooms in as you enter, reveals content, zooms out as you leave.
const kitWrappers = [
    { wrapper: '#wrap-standard', card: '#card-standard', items: '#wrap-standard .detail-item' },
    { wrapper: '#wrap-premium',  card: '#card-premium',  items: '#wrap-premium .detail-item' },
    { wrapper: '#wrap-women',    card: '#card-women',    items: '#wrap-women .detail-item' },
    { wrapper: '#wrap-kids',     card: '#card-kids',     items: '#wrap-kids .detail-item' },
];

kitWrappers.forEach(({ wrapper, card, items }) => {
    const wEl = document.querySelector(wrapper);
    const cEl = document.querySelector(card);
    if (!wEl || !cEl) return;

    const scrollArea = cEl.querySelector('.items-scroll-area');

    // Gold progress bar on right edge of items area
    const progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:absolute;top:0;right:0;width:2px;height:0%;background:linear-gradient(to bottom,rgba(201,160,80,0),rgba(201,160,80,0.8));transition:height 0.1s linear;z-index:3;pointer-events:none';
    if (scrollArea) scrollArea.style.position = 'relative', scrollArea.appendChild(progressBar);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.8,
            onUpdate: self => {
                if (scrollArea) {
                    // Scroll items list during 30%–75% of section, after items are fully revealed
                    const p = Math.max(0, Math.min(1, (self.progress - 0.3) / 0.45));
                    const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
                    scrollArea.scrollTop = p * maxScroll;
                    progressBar.style.height = (p * 100) + '%';
                }
            }
        }
    });

    // Zoom in
    tl.fromTo(cEl,
        { scale: 0.55, opacity: 0, filter: 'blur(12px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 2 },
        0
    );

    // Items reveal — fast stagger early, all visible before scroll-sync starts (position 2.4 = ~30% progress)
    tl.fromTo(items,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.08, ease: 'power2.out', duration: 0.6 },
        1.0
    );

    // Zoom out
    tl.to(cEl,
        { scale: 0.55, opacity: 0, filter: 'blur(12px)', ease: 'power2.in', duration: 2 },
        6
    );
});

// ── GSAP: FEATURES — HORIZONTAL SCROLL ───────────────────────────────────────
const featTrack = document.querySelector('.feat-h-track');
const featSlides = document.querySelectorAll('.feat-slide');
if (featTrack && featSlides.length) {
    // Init first slide as active
    gsap.set(featSlides[0], { scale: 1, opacity: 1 });
    featSlides.forEach((s, i) => { if (i > 0) gsap.set(s, { scale: 0.86, opacity: 0.45 }); });

    ScrollTrigger.create({
        trigger: '#features',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: self => {
            const maxX = featTrack.scrollWidth - window.innerWidth;
            gsap.set(featTrack, { x: -maxX * self.progress });

            // Find slide closest to viewport center
            const vCenter = window.innerWidth / 2;
            let closest = null, minDist = Infinity;
            featSlides.forEach(slide => {
                const rect = slide.getBoundingClientRect();
                const dist = Math.abs(rect.left + rect.width / 2 - vCenter);
                if (dist < minDist) { minDist = dist; closest = slide; }
            });

            // Animate each slide directly with GSAP (no CSS class conflict)
            featSlides.forEach(slide => {
                const isActive = slide === closest;
                gsap.to(slide, {
                    scale: isActive ? 1 : 0.86,
                    opacity: isActive ? 1 : 0.45,
                    duration: 0.35, ease: 'power2.out', overwrite: 'auto'
                });
                const img = slide.querySelector('img');
                if (img) gsap.to(img, {
                    scale: isActive ? 1.1 : 1,
                    duration: 0.45, ease: 'power2.out', overwrite: 'auto'
                });
                const imgWrap = slide.querySelector('.feat-slide-img');
                if (imgWrap) {
                    imgWrap.style.borderColor = isActive ? 'rgba(201,160,80,0.85)' : 'rgba(201,160,80,0.12)';
                    imgWrap.style.borderStyle = isActive ? 'solid' : 'solid';
                }
            });
        }
    });

    // Fade in side text
    gsap.from('.feat-side-text > *', {
        scrollTrigger: { trigger: '#features', start: 'top 80%' },
        opacity: 0, x: -30, stagger: 0.15, duration: 1, ease: 'power3.out'
    });
}

// ── GSAP: STATS COUNTER ───────────────────────────────────────────────────────
document.querySelectorAll('.snum').forEach(el => {
    const target = +el.dataset.t;
    ScrollTrigger.create({
        trigger: '.stats-bar', start: 'top 85%',
        onEnter: () => {
            gsap.to({ v: 0 }, {
                v: target, duration: 2.2, ease: 'power2.out',
                onUpdate: function() { el.textContent = Math.round(this.targets()[0].v); }
            });
        }
    });
});

// ── GSAP: COMPARE ─────────────────────────────────────────────────────────────
gsap.from('.cmp-header > *', {
    scrollTrigger: { trigger: '#compare', start: 'top 80%' },
    opacity: 0, y: 30, stagger: 0.15, duration: 0.9, ease: 'power3.out'
});
gsap.from('.cmp-table tbody tr', {
    scrollTrigger: { trigger: '.cmp-table', start: 'top 80%' },
    opacity: 0, x: -16, stagger: 0.04, duration: 0.55, ease: 'power3.out'
});

// ── GSAP: CORPORATE ───────────────────────────────────────────────────────────
['.corp-h2', '.corp-divider', '.corp-range', '.corp-desc', '.corp-feats', '.corp-btn'].forEach((sel, i) => {
    gsap.to(sel, {
        scrollTrigger: { trigger: '#corporate', start: 'top 75%' },
        opacity: 1, x: 0, duration: 0.95, ease: 'power3.out', delay: i * 0.1
    });
});

// ── GSAP: TESTIMONIALS ────────────────────────────────────────────────────────
gsap.from('.test-header > *', {
    scrollTrigger: { trigger: '#testimonials', start: 'top 80%' },
    opacity: 0, y: 30, stagger: 0.15, duration: 0.9, ease: 'power3.out'
});
gsap.to('.test-card', {
    scrollTrigger: { trigger: '.test-grid', start: 'top 78%' },
    opacity: 1, y: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out'
});

// ── GSAP: CTA ─────────────────────────────────────────────────────────────────
const ctaTL = gsap.timeline({
    scrollTrigger: { trigger: '#cta-final', start: 'top 75%' }
});
ctaTL
    .to('.cta-h2',      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
    .to('.cta-sub',     { opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.6')
    .to('.cta-wa-btn',  { opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .to('.cta-kit-row', { opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4');

// Also animate label-tag in cta
gsap.to('#cta-final .label-tag', {
    scrollTrigger: { trigger: '#cta-final', start: 'top 80%' },
    opacity: 1, duration: 0.9
});

// ── SCATTER ITEMS — ITEM_SVGS defined above near CTA reveal section ───────────

const scatterItems = [];
let scMX = 0, scMY = 0;

window.addEventListener('mousemove', e => {
    scMX = e.clientX / window.innerWidth  - 0.5;
    scMY = e.clientY / window.innerHeight - 0.5;
});

function createSVGItem(container, opts) {
    const wrap = document.createElement('div');
    const svgStr = ITEM_SVGS[opts.srcIdx % ITEM_SVGS.length];
    wrap.innerHTML = svgStr;
    const svg = wrap.firstChild;
    svg.style.cssText = `
        position:absolute;
        width:${opts.size}px;height:auto;
        left:${opts.left}%;top:${opts.top}%;
        opacity:${opts.opacity};
        filter:drop-shadow(0 5px 18px rgba(0,0,0,0.5));
        pointer-events:none;will-change:transform;display:block;
    `;
    container.appendChild(svg);
    return svg;
}

// ── CTA scatter disabled — using image background ─────────────────────────────
const ctaParticles = null;
if (ctaParticles) {
    for (let i = 0; i < 24; i++) {
        // vary size to create depth illusion — far items small, near items larger
        const depthFactor = Math.random();
        const size    = 22 + depthFactor * 52;       // 22–74 px
        const left    = 2 + Math.random() * 96;
        const top     = 2 + Math.random() * 96;
        const rot     = (Math.random() - 0.5) * 70;
        const depth   = 0.2 + depthFactor * 2.0;
        const opacity = 0.10 + depthFactor * 0.30;  // far=faint, near=visible
        const blur    = depthFactor < 0.35 ? 1.2 : 0; // far items slightly blurred
        const fSpeed  = 0.3 + Math.random() * 0.5;
        const fAmt    = 4 + Math.random() * 10;
        const fOff    = Math.random() * Math.PI * 2;

        const el = createSVGItem(ctaParticles, { srcIdx: i, size, left, top, opacity });
        if (blur > 0) el.style.filter = `drop-shadow(0 4px 12px rgba(0,0,0,0.7)) blur(${blur}px)`;
        scatterItems.push({ el, depth, rot, ox: 0, oy: 0, fSpeed, fAmt, fOff });
    }
}

// ── Manifesto + Features background items (CSS animation only) ────────────────
function populateBgItems(containerId, count) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    for (let i = 0; i < count; i++) {
        const size    = 20 + Math.random() * 40;
        const left    = Math.random() * 100;
        const top     = Math.random() * 100;
        const rot     = (Math.random() - 0.5) * 50;
        const dur     = 5 + Math.random() * 6;
        const delay   = -(Math.random() * 8);
        const opacity = 0.04 + Math.random() * 0.06;

        const el = createSVGItem(wrap, { srcIdx: i, size, left, top, opacity });
        el.style.filter = 'blur(1px) drop-shadow(0 4px 14px rgba(0,0,0,0.3))';
        el.style.setProperty('--r', `${rot}deg`);
        el.style.animation = `bgFloat ${dur}s ${delay}s ease-in-out infinite`;
        el.style.transform = `rotate(${rot}deg)`;
    }
}
// bg section items disabled — keeping background clean

// ── SCROLL PROGRESS BAR ───────────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
}, { passive: true });

// ── KIT INDICATOR ─────────────────────────────────────────────────────────────
const kitIndicator = document.getElementById('kit-indicator');
const kiLabel = document.getElementById('ki-label');
const kiDots = document.querySelectorAll('.ki-dot');
const kitLabels = ['Standard — ₹99', 'Premium — ₹199', "Women's — ₹179", 'Kids — ₹149'];
const kitWrapEls = ['#wrap-standard','#wrap-premium','#wrap-women','#wrap-kids'].map(s => document.querySelector(s));

function updateKitIndicator() {
    const scrollY = window.scrollY + window.innerHeight * 0.5;
    let activeKit = -1;
    kitWrapEls.forEach((el, i) => {
        if (!el) return;
        const top = el.offsetTop;
        const bot = top + el.offsetHeight;
        if (scrollY >= top && scrollY <= bot) activeKit = i;
    });
    if (activeKit >= 0) {
        kitIndicator.classList.add('visible');
        kiDots.forEach((d, i) => d.classList.toggle('active', i === activeKit));
        kiLabel.textContent = kitLabels[activeKit];
    } else {
        kitIndicator.classList.remove('visible');
    }
}
window.addEventListener('scroll', updateKitIndicator, { passive: true });
kiDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        kitWrapEls[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});

// ── NAV SCROLL BEHAVIOUR ──────────────────────────────────────────────────────
ScrollTrigger.create({
    start: 'top -60',
    onUpdate: self => {
        document.getElementById('nav').style.background =
            self.progress > 0 ? 'rgba(6,6,12,0.97)' : '';
    }
});

// ── LAZY-PLAY KIT VIDEOS ──────────────────────────────────────────────────────
const kitVideos = document.querySelectorAll('.kit-bg-video');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) { v.play(); } else { v.pause(); }
    });
}, { threshold: 0.1 });
kitVideos.forEach(v => videoObserver.observe(v));

// ── VISIBILITY GATES FOR THREE.JS RENDERS ────────────────────────────────────
let corpVisible = false, testVisible = false, ctaVisible = false;

if (document.getElementById('corporate')) {
    new IntersectionObserver(e => { corpVisible = e[0].isIntersecting; }, { threshold: 0.05 })
        .observe(document.getElementById('corporate'));
}
if (document.getElementById('testimonials')) {
    new IntersectionObserver(e => { testVisible = e[0].isIntersecting; }, { threshold: 0.05 })
        .observe(document.getElementById('testimonials'));
}
if (document.getElementById('cta-final')) {
    new IntersectionObserver(e => { ctaVisible = e[0].isIntersecting; }, { threshold: 0.05 })
        .observe(document.getElementById('cta-final'));
}

// ── ANIMATION LOOP ────────────────────────────────────────────────────────────
const clk = new THREE.Clock();

(function tick() {
    requestAnimationFrame(tick);
    const t = clk.getElapsedTime();

    // BG canvas hidden — skip rendering

    // Corporate — only render when section is visible
    if (corpData && corpVisible) {
        corpData.g.rotation.y = t * 0.28;
        corpData.g.position.y = Math.sin(t * 0.5) * 0.22;
        corpData.r.render(corpData.s, corpData.c);
    }

    // CTA — cursor spotlight reveal — only when visible
    if (ctaRevealData && ctaVisible) {
        const { ctx, items, CW, CH, curX, curY, active } = ctaRevealData;

        ctx.clearRect(0, 0, CW, CH);

        // Dark base
        ctx.fillStyle = '#080808';
        ctx.fillRect(0, 0, CW, CH);

        if (active) {
            // ── PASS 1: huge atmospheric glow — fills most of viewport ──
            const spotR = Math.max(CW, CH) * 0.72;
            const spotGr = ctx.createRadialGradient(curX, curY, 0, curX, curY, spotR);
            spotGr.addColorStop(0,    'rgba(110,75,20,0.82)');
            spotGr.addColorStop(0.18, 'rgba(80,52,12,0.55)');
            spotGr.addColorStop(0.42, 'rgba(45,30,6,0.28)');
            spotGr.addColorStop(0.72, 'rgba(16,10,2,0.10)');
            spotGr.addColorStop(1,    'rgba(0,0,0,0)');
            ctx.fillStyle = spotGr;
            ctx.fillRect(0, 0, CW, CH);

            // ── PASS 2: items — dim base pass everywhere ────────────────
            items.forEach(item => {
                const ix = item.x * CW;
                const iy = item.y * CH + Math.sin(t * item.speed + item.phase) * item.floatAmt;
                ctx.save();
                ctx.globalAlpha = 0.04 + item.depth * 0.03;
                ctx.translate(ix, iy);
                ctx.rotate(item.rot + t * 0.01 * (item.depth - 0.5));
                if (item.img.complete) ctx.drawImage(item.img, -item.size/2, -item.size/2, item.size, item.size);
                ctx.restore();
            });

            // ── PASS 3: items lit by spotlight — proximity-based glow ───
            items.forEach(item => {
                const ix   = item.x * CW;
                const iy   = item.y * CH + Math.sin(t * item.speed + item.phase) * item.floatAmt;
                const dist = Math.hypot(curX - ix, curY - iy);
                const prox = Math.max(0, 1 - dist / (spotR * 0.85));
                if (prox < 0.01) return;

                ctx.save();
                ctx.globalAlpha = 0.12 + prox * 0.88; // up to full opacity near cursor
                ctx.shadowColor = '#e8c050';
                ctx.shadowBlur  = 20 + prox * 100;    // 20–120px glow
                ctx.translate(ix, iy);
                ctx.rotate(item.rot + t * 0.01 * (item.depth - 0.5));
                // Scale items up slightly near cursor (oryzo-style "emerging")
                const sc = 1 + prox * 0.22;
                ctx.scale(sc, sc);
                if (item.img.complete) ctx.drawImage(item.img, -item.size/2, -item.size/2, item.size, item.size);
                ctx.restore();
            });

            // ── PASS 4: hot bright core at cursor tip ───────────────────
            const coreGr = ctx.createRadialGradient(curX, curY, 0, curX, curY, 160);
            coreGr.addColorStop(0,    'rgba(255,220,100,0.55)');
            coreGr.addColorStop(0.25, 'rgba(220,170,60,0.22)');
            coreGr.addColorStop(0.6,  'rgba(160,110,20,0.07)');
            coreGr.addColorStop(1,    'rgba(0,0,0,0)');
            ctx.fillStyle = coreGr;
            ctx.fillRect(0, 0, CW, CH);

            // ── PASS 5: outer halo ring at spotlight edge ───────────────
            const haloR = spotR * 0.78;
            const haloGr = ctx.createRadialGradient(curX, curY, haloR * 0.88, curX, curY, haloR * 1.05);
            haloGr.addColorStop(0,   'rgba(0,0,0,0)');
            haloGr.addColorStop(0.5, 'rgba(201,160,80,0.07)');
            haloGr.addColorStop(1,   'rgba(0,0,0,0)');
            ctx.fillStyle = haloGr;
            ctx.fillRect(0, 0, CW, CH);

        } else {
            // No cursor — items completely invisible (true dark, like oryzo)
            items.forEach(item => {
                const ix = item.x * CW;
                const iy = item.y * CH + Math.sin(t * item.speed + item.phase) * item.floatAmt;
                ctx.save();
                ctx.globalAlpha = 0.008 + item.depth * 0.008; // practically invisible
                ctx.translate(ix, iy);
                ctx.rotate(item.rot + t * 0.006);
                if (item.img.complete) ctx.drawImage(item.img, -item.size/2, -item.size/2, item.size, item.size);
                ctx.restore();
            });
        }
    }

    // Testimonials — only render when visible
    if (testDropData && testVisible) {
        // Very slow idle Y drift so the box gently presents itself
        testDropData.innerG.rotation.y = Math.sin(t * 0.18) * 0.22;

        // Cursor-follow tilt — smooth lerp, subtle range
        tdCurX += (mx * 0.28 - tdCurX) * 0.055;
        tdCurY += (my * 0.20 - tdCurY) * 0.055;
        testDropData.innerG.rotation.x += (tdCurY - testDropData.innerG.rotation.x) * 0.08;
        testDropData.innerG.rotation.z += (-tdCurX * 0.4 - testDropData.innerG.rotation.z) * 0.08;

        testDropData.r.render(testDropData.s, testDropData.c);
    }

})();

// ── RESIZE ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    const W = window.innerWidth, H = window.innerHeight;

    bgCam.aspect = W / H;
    bgCam.updateProjectionMatrix();
    bgR.setSize(W, H);

    if (heroCanvas) { heroCanvas.width = W; heroCanvas.height = H; }

});
