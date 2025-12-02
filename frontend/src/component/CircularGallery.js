import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function createTextTexture(
  gl,
  text,
  font = "bold 28px Figtree",
  color = "white"
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = font;
  const width = ctx.measureText(text).width + 40;
  const height = parseInt(font, 10) * 1.8;

  canvas.width = width;
  canvas.height = height;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width, height };
}

class Title {
  constructor({ gl, plane, text, textColor, font }) {
    const { texture, width, height } = createTextTexture(
      gl,
      text,
      font,
      textColor
    );
    const geometry = new Plane(gl);

    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(tMap, vUv);
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(gl, { geometry, program });
    const aspect = width / height;

    const textH = plane.scale.y * 0.18;
    const textW = textH * aspect;

    this.mesh.scale.set(textW, textH, 1);
    this.mesh.position.y = -plane.scale.y * 0.6;
    this.mesh.setParent(plane);
  }
}

class Media {
  constructor(data) {
    Object.assign(this, data);
    this.load();
  }

  load() {
    const texture = new Texture(this.gl, { generateMipmaps: true });

    const img = new Image();
    img.crossOrigin = "anonymous"; // ✅ FIXED
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.width, img.height];
    };

    this.program = new Program(this.gl, {
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z += sin(p.y * 4. + uTime) * 0.25;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(tMap, vUv);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uTime: { value: Math.random() * 10 },
        uImageSizes: { value: [0, 0] },
      },
      transparent: true,
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.mesh.setParent(this.scene);

    this.title = new Title({
      gl: this.gl,
      plane: this.mesh,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });

    this.onResize();
  }

  onResize() {
    this.mesh.scale.y = this.viewport.height * 0.6;
    this.mesh.scale.x = this.mesh.scale.y * 1.3;
    this.width = this.mesh.scale.x + 1.3;
    this.x = this.width * this.index;
  }

  update(scroll) {
    this.mesh.position.x = this.x - scroll.current;
    this.program.uniforms.uTime.value += 0.03;
  }
}

class App {
  constructor(container, { items, textColor, font, scrollEase }) {
    this.container = container;
    this.scroll = { current: 0, target: 0, last: 0, ease: scrollEase };

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, textColor, font);
    this.update();
    this.addEvents();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.position.z = 12;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      widthSegments: 40,
      heightSegments: 40,
    });
  }

  createMedias(items, textColor, font) {
    this.items = items.concat(items); // infinite loop
    this.medias = this.items.map(
      (item, i) =>
        new Media({
          geometry: this.geometry,
          gl: this.gl,
          scene: this.scene,
          viewport: this.viewport,
          screen: this.screen,
          length: this.items.length,
          index: i,
          image: item.image,
          text: item.text,
          textColor,
          font,
        })
    );
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);

    const aspect = this.screen.width / this.screen.height;
    const height =
      2 *
      Math.tan((this.camera.fov * Math.PI) / 180 / 2) *
      this.camera.position.z;
    const width = height * aspect;
    this.viewport = { width, height };

    this.medias?.forEach((m) => m.onResize());
  }

  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );
    this.medias.forEach((m) => m.update(this.scroll));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    requestAnimationFrame(this.update.bind(this));
  }

  addEvents() {
    window.addEventListener("wheel", (e) => {
      this.scroll.target += e.deltaY * 0.002;
    });

    window.addEventListener("resize", () => this.onResize());
  }
}

export default function CircularGallery({
  items,
  textColor = "#ffffff",
  font = "bold 28px Figtree",
  scrollEase = 0.05,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const app = new App(ref.current, { items, textColor, font, scrollEase });
    return () => app?.renderer?.gl?.canvas?.remove();
  }, [items, textColor, font, scrollEase]);

  return <div ref={ref} className="w-full h-full overflow-hidden" />;
}
