import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface BrainSceneProps {
  activeScene: number;
  scrollProgress: number;
}

const MODEL_URL = "/models/brain.glb";
const TINTS = [
  0xd8d2ff, 0xd8d2ff, 0x70f5e5, 0xff4b3e, 0xff8a28, 0xff245f, 0x70f5e5,
].map(color => new THREE.Color(color));

export default function BrainScene({ activeScene }: BrainSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const brainRef = useRef<THREE.Group | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const frameRef = useRef(0);
  const clockRef = useRef(new THREE.Clock());
  const sceneIndexRef = useRef(activeScene);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    sceneIndexRef.current = activeScene;
  }, [activeScene]);

  const fitModel = (model: THREE.Group, pivot: THREE.Group) => {
    model.traverse(child => {
      if (child instanceof THREE.Points) child.visible = false;
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = false;
      child.receiveShadow = false;
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach(material => {
        if (
          material instanceof THREE.MeshStandardMaterial ||
          material instanceof THREE.MeshPhysicalMaterial
        ) {
          material.transparent = true;
          material.opacity = 0.78;
          material.side = THREE.DoubleSide;
          material.emissive = new THREE.Color(0x062826);
          material.emissiveIntensity = 0.12;
        }
      });
    });

    const box = new THREE.Box3();
    model.traverse(child => {
      if (child instanceof THREE.Mesh) box.expandByObject(child);
    });
    if (box.isEmpty()) box.setFromObject(model);

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    model.position.copy(center).multiplyScalar(-1);

    const maxAxis = Math.max(size.x, size.y, size.z);
    const baseScale = maxAxis > 0 ? 1.72 / maxAxis : 1;
    pivot.userData.baseScale = baseScale;
    pivot.scale.setScalar(baseScale);
    pivot.clear();
    pivot.add(model);
  };

  const createFallback = (pivot: THREE.Group) => {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.92, 5),
      new THREE.MeshPhysicalMaterial({
        color: 0x8ffff0,
        roughness: 0.48,
        transparent: true,
        opacity: 0.68,
        emissive: 0x063834,
        emissiveIntensity: 0.16,
      })
    );
    pivot.add(mesh);
    pivot.userData.baseScale = 1;
  };

  const createRings = () => {
    const group = new THREE.Group();
    group.position.set(0.92, 0.04, -0.12);
    [1.4, 1.78].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.007, 10, 120),
        new THREE.MeshBasicMaterial({
          color: 0x00d4aa,
          transparent: true,
          opacity: 0.05,
          depthWrite: false,
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = index * 0.8;
      group.add(ring);
    });
    return group;
  };

  const createStars = () => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0x7fffea,
        size: 0.008,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      })
    );
  };

  const init = useCallback(() => {
    if (!hostRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080d, 0.018);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      52,
      hostRef.current.clientWidth / hostRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.04, 5.05);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(hostRef.current.clientWidth, hostRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    hostRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0x8ffff0, 0.42));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(2.4, 2.5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x00d4aa, 1.05);
    rim.position.set(-3, 1.4, -2);
    scene.add(rim);

    const brain = new THREE.Group();
    brain.position.set(0.92, 0.08, 0);
    brainRef.current = brain;
    scene.add(brain);

    const rings = createRings();
    ringsRef.current = rings;
    scene.add(rings);

    const stars = createStars();
    starsRef.current = stars;
    scene.add(stars);

    new GLTFLoader().load(
      MODEL_URL,
      gltf => fitModel(gltf.scene, brain),
      undefined,
      () => createFallback(brain)
    );
  }, []);

  const animate = useCallback(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const time = clockRef.current.getElapsedTime();
    const tint = TINTS[sceneIndexRef.current] || TINTS[2];
    const brain = brainRef.current;

    if (brain) {
      const targetY =
        dragRef.current.ry + mouseRef.current.x * 0.1 + time * 0.065;
      const targetX = dragRef.current.rx + mouseRef.current.y * 0.045;
      brain.rotation.y += (targetY - brain.rotation.y) * 0.08;
      brain.rotation.x += (targetX - brain.rotation.x) * 0.08;
      brain.rotation.z = Math.sin(time * 0.35) * 0.006;
      brain.position.x += (0.92 - brain.position.x) * 0.08;
      brain.position.y += (0.08 - brain.position.y) * 0.08;
      brain.scale.setScalar(
        (brain.userData.baseScale || 1) * (1 + Math.sin(time) * 0.006)
      );
      brain.traverse(child => {
        if (!(child instanceof THREE.Mesh)) return;
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach(material => {
          if (
            material instanceof THREE.MeshStandardMaterial ||
            material instanceof THREE.MeshPhysicalMaterial
          ) {
            material.color.lerp(tint, 0.018);
            material.emissive.lerp(tint, 0.012);
          }
        });
      });
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = Math.sin(time * 0.25) * 0.045;
      ringsRef.current.children.forEach((child, index) => {
        child.rotation.z += index === 0 ? 0.001 : -0.0008;
        const material = (child as THREE.Mesh)
          .material as THREE.MeshBasicMaterial;
        material.color.lerp(tint, 0.018);
        material.opacity = 0.035 + Math.sin(time + index) * 0.012;
      });
    }

    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.006;
      (starsRef.current.material as THREE.PointsMaterial).color.lerp(
        tint,
        0.018
      );
    }

    const targetZ =
      sceneIndexRef.current >= 3 && sceneIndexRef.current <= 5 ? 4.85 : 5.05;
    cameraRef.current.position.z +=
      (targetZ - cameraRef.current.position.z) * 0.025;
    cameraRef.current.lookAt(0.78, 0.04, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      if (dragRef.current.active) {
        const dx = event.clientX - dragRef.current.x;
        const dy = event.clientY - dragRef.current.y;
        dragRef.current.ry += dx * 0.0028;
        dragRef.current.rx = THREE.MathUtils.clamp(
          dragRef.current.rx + dy * 0.0018,
          -0.42,
          0.42
        );
        dragRef.current.x = event.clientX;
        dragRef.current.y = event.clientY;
        return;
      }
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    const down = (event: MouseEvent) => {
      dragRef.current.active = true;
      dragRef.current.x = event.clientX;
      dragRef.current.y = event.clientY;
    };
    const up = () => {
      dragRef.current.active = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", up);
    };
  }, []);

  useEffect(() => {
    const resize = () => {
      if (!hostRef.current || !cameraRef.current || !rendererRef.current)
        return;
      const width = hostRef.current.clientWidth;
      const height = hostRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    init();
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      if (rendererRef.current && hostRef.current) {
        hostRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [animate, init]);

  return (
    <div
      ref={hostRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
