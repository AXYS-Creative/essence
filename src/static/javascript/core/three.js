const waveImgWrapper = document.querySelectorAll(".wave-img-wrapper");
const waveImg = document.querySelectorAll(".wave-img");

const effectOne = (() => {
  const ANIMATION_CONFIG = {
    transitionSpeed: 0.03,
    baseIntensity: 0.005,
    hoverIntensity: 0.009,
  };

  const vertexShader = `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `;

  const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_intensity;
      uniform sampler2D u_texture;
      varying vec2 vUv;
  
      void main() {
          vec2 uv = vUv;
          float wave1 = sin(uv.x * 10.0 + u_time * 0.5 + u_mouse.x * 5.0) * u_intensity;
          float wave2 = sin(uv.y * 12.0 + u_time * 0.8 + u_mouse.y * 4.0) * u_intensity;
          float wave3 = cos(uv.x * 8.0 + u_time * 0.5 + u_mouse.x * 3.0) * u_intensity;
          float wave4 = cos(uv.y * 9.0 + u_time * 0.7 + u_mouse.y * 3.5) * u_intensity;
  
          uv.y += wave1 + wave2;
          uv.x += wave3 + wave4;
          
          gl_FragColor = texture2D(u_texture, uv);
      }
  `;

  class WaveEffect {
    constructor(img, wrapper) {
      this.img = img;
      this.wrapper = wrapper;

      this.currentState = {
        mousePosition: { x: 0, y: 0 },
        waveIntensity: 0.005,
      };
      this.targetState = {
        mousePosition: { x: 0, y: 0 },
        waveIntensity: 0.005,
      };

      this.initializeScene(new THREE.TextureLoader().load(img.src));
    }

    initializeScene(texture) {
      // camera setup
      this.camera = new THREE.PerspectiveCamera(
        80,
        this.img.offsetWidth / this.img.offsetHeight,
        0.01,
        10
      );
      this.camera.position.z = 1;

      // scene creation
      this.scene = new THREE.Scene();

      // uniforms
      this.shaderUniforms = {
        u_time: { type: "f", value: 1.0 },
        u_mouse: { type: "v2", value: new THREE.Vector2() },
        u_intensity: { type: "f", value: this.currentState.waveIntensity },
        u_texture: { type: "t", value: texture },
      };

      // create a plane mesh with materials
      this.planeMesh = new THREE.Mesh(
        // new THREE.PlaneGeometry(2, 2),
        new THREE.PlaneGeometry(1.4, 1.8), // Adjust the aspect ratio of the images (width and height)
        new THREE.ShaderMaterial({
          uniforms: this.shaderUniforms,
          vertexShader,
          fragmentShader,
        })
      );

      // add mesh to the scene
      this.scene.add(this.planeMesh);

      // render
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(this.img.offsetWidth, this.img.offsetHeight);

      // create a canvas
      this.wrapper.appendChild(this.renderer.domElement);

      // event listeners
      this.wrapper.addEventListener(
        "mousemove",
        this.handleMouseMove.bind(this),
        false
      );
      this.wrapper.addEventListener(
        "mouseover",
        this.handleMouseOver.bind(this),
        false
      );
      this.wrapper.addEventListener(
        "mouseout",
        this.handleMouseOut.bind(this),
        false
      );

      this.animateScene();
    }

    animateScene() {
      const animate = () => {
        requestAnimationFrame(animate);

        this.currentState.mousePosition.x = this.updateValue(
          this.targetState.mousePosition.x,
          this.currentState.mousePosition.x,
          ANIMATION_CONFIG.transitionSpeed
        );

        this.currentState.mousePosition.y = this.updateValue(
          this.targetState.mousePosition.y,
          this.currentState.mousePosition.y,
          ANIMATION_CONFIG.transitionSpeed
        );

        this.currentState.waveIntensity = this.updateValue(
          this.targetState.waveIntensity,
          this.currentState.waveIntensity,
          ANIMATION_CONFIG.transitionSpeed
        );

        const uniforms = this.planeMesh.material.uniforms;

        uniforms.u_intensity.value = this.currentState.waveIntensity;
        uniforms.u_time.value += 0.005;
        uniforms.u_mouse.value.set(
          this.currentState.mousePosition.x,
          this.currentState.mousePosition.y
        );

        this.renderer.render(this.scene, this.camera);
      };

      animate();
    }

    updateValue(targetState, current, transitionSpeed) {
      return current + (targetState - current) * transitionSpeed;
    }

    handleMouseMove(event) {
      const rect = this.wrapper.getBoundingClientRect();
      this.targetState.mousePosition.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.targetState.mousePosition.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    handleMouseOver() {
      this.targetState.waveIntensity = ANIMATION_CONFIG.hoverIntensity;
    }

    handleMouseOut() {
      this.targetState.waveIntensity = ANIMATION_CONFIG.baseIntensity;
      this.targetState.mousePosition = { x: 0, y: 0 };
    }
  }

  waveImg.forEach((img, index) => {
    const wrapper = waveImgWrapper[index];
    new WaveEffect(img, wrapper);
  });

  // Initialize only when in view

  const initializeWaveEffect = (img, wrapper) => {
    new WaveEffect(img, wrapper);
  };

  // Set up IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("we can see the magic");
          const img = entry.target.querySelector(".wave-img");
          const wrapper = entry.target;
          initializeWaveEffect(img, wrapper); // Initialize the Three.js effect

          // Stop observing this element after initialization
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  ); // Trigger when 10% of the element is in view

  // Start observing the wave-img-wrapper elements
  waveImgWrapper.forEach((wrapper) => observer.observe(wrapper));
})();
