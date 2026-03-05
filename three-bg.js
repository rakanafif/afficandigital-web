// Three.js via CDN module - if it fails, canvas stays as gradient.
(async function(){
  const canvas = document.getElementById("bg3d");
  if (!canvas) return;

  try{
    const THREE = await import("https://unpkg.com/three@0.160.0/build/three.module.js");

    const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    // soft lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 0.7);
    key.position.set(3, 2, 5);
    scene.add(key);

    // geometry
    const geo = new THREE.IcosahedronGeometry(2.2, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b0f1a,
      roughness: 0.25,
      metalness: 0.25,
      emissive: 0x000000
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // glowing particles
    const pts = 1200;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pts * 3);
    for(let i=0;i<pts;i++){
      const r = 5 + Math.random()*6;
      const a = Math.random()*Math.PI*2;
      const b = (Math.random()-0.5)*Math.PI;
      pos[i*3+0] = Math.cos(a)*Math.cos(b)*r;
      pos[i*3+1] = Math.sin(b)*r;
      pos[i*3+2] = Math.sin(a)*Math.cos(b)*r;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.03,
      transparent: true,
      opacity: 0.65,
      color: 0x3fa9f5
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // gold ring
    const ringGeo = new THREE.TorusGeometry(3.0, 0.05, 10, 200);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf4a62a,
      emissive: 0xf4a62a,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.45
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = 0.7;
    ring.rotation.y = 0.2;
    scene.add(ring);

    const onResize = ()=>{
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth/innerHeight;
      camera.updateProjectionMatrix();
    };
    addEventListener("resize", onResize);

    let t = 0;
    const animate = ()=>{
      t += 0.005;
      mesh.rotation.x += 0.002;
      mesh.rotation.y += 0.003;
      ring.rotation.z += 0.003;
      points.rotation.y -= 0.0009;

      // soft color drift between blue and gold
      const mix = (Math.sin(t)+1)/2;
      pMat.color.setHex(mix < 0.5 ? 0x3fa9f5 : 0xf4a62a);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }catch(err){
    // fallback: leave CSS gradient
    console.log("3D background fallback:", err?.message || err);
  }
})();