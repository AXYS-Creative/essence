const webGlBlock = () => {
  const params = {
    webGLCanvasID: "canvas",
    planeElementID: "fullwidth-image",
    pointerSize: 0.25, // size of the effect (0: no effect, 1: full window)
    opacitySpeed: 0.0125, // how much to increase/decrease opacity on each frame
    velocityStrength: 0.25, // strength of the velocity of the mouse effect
    displacementStrength: 0.25, // the bigger the more displacement
    canvasScale: 0.125, // does not change anything visually, but the smaller the scale the better the performance
  };

  class MouseEffect {
    constructor(params) {
      this.init(params);
    }

    init(params) {
      this.curtains = new Curtains({ container: params.webGLCanvasID });
      this.plane = null;
      this.planeElement = document.getElementById(params.planeElementID);
      this.pixelRatio = this.curtains.pixelRatio || 1;
      this.mouse = { position: { x: 0, y: 0 }, attributes: [] };
      this.params = {
        pointerSize: params.pointerSize,
        opacitySpeed: params.opacitySpeed,
        velocityStrength: params.velocityStrength,
        displacementStrength: params.displacementStrength,
        canvasScale: params.canvasScale,
      };
      this.canvas = null;
      this.canvasContext = null;

      if (!this.planeElement) {
        console.warn(
          "You must specify a valid ID for the WebGL canvas and the plane element"
        );
        return false;
      }
    }

    resize() {
      if (this.canvas && this.canvasContext) {
        const width =
          this.planeElement.clientWidth *
          this.pixelRatio *
          this.params.canvasScale;
        const height =
          this.planeElement.clientHeight *
          this.pixelRatio *
          this.params.canvasScale;

        [this.canvas.width, this.canvasContext.width] = [width, width];
        [this.canvas.height, this.canvasContext.height] = [height, height];

        this.canvasContext.scale(
          this.pixelRatio / this.params.canvasScale,
          this.pixelRatio / this.params.canvasScale
        );
      }
    }

    handleMovement(e) {
      this.mouse.position.x = e.clientX || e.targetTouches?.[0].clientX || 0;
      this.mouse.position.y = e.clientY || e.targetTouches?.[0].clientY || 0;

      if (this.planeElement && this.plane) {
        const mouseAttributes = {
          x: this.mouse.position.x * this.params.canvasScale ** 2,
          y: this.mouse.position.y * this.params.canvasScale ** 2,
          scale: 0.05,
          opacity: 1,
          velocity: { x: 0, y: 0 },
        };

        mouseAttributes.initialPosition = { ...mouseAttributes };

        if (this.mouse.attributes.length > 0) {
          const lastMouseAttr =
            this.mouse.attributes[this.mouse.attributes.length - 1];
          mouseAttributes.velocity = {
            x: Math.max(
              -this.params.canvasScale * 1.25,
              Math.min(
                this.params.canvasScale * 1.25,
                mouseAttributes.initialPosition.x -
                  lastMouseAttr.initialPosition.x
              )
            ),
            y: Math.max(
              -this.params.canvasScale * 1.25,
              Math.min(
                this.params.canvasScale * 1.25,
                mouseAttributes.initialPosition.y -
                  lastMouseAttr.initialPosition.y
              )
            ),
          };
        }

        if (this.mouse.attributes.length === 0) {
          this.curtains.enableDrawing();
        }

        this.mouse.attributes.push(mouseAttributes);
        const mouseCoords = this.plane.mouseToPlaneCoords(
          this.mouse.position.x,
          this.mouse.position.y
        );
        this.plane.uniforms.mousePosition.value = [
          mouseCoords.x,
          mouseCoords.y,
        ];
      }
    }

    drawGradientCircle(pointerSize, circleAttributes) {
      this.canvasContext.beginPath();

      const gradient = this.canvasContext.createRadialGradient(
        circleAttributes.x,
        circleAttributes.y,
        0,
        circleAttributes.x,
        circleAttributes.y,
        pointerSize * circleAttributes.scale * this.params.canvasScale
      );

      gradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${circleAttributes.opacity})`
      );
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      this.canvasContext.fillStyle = gradient;
      this.canvasContext.arc(
        circleAttributes.x,
        circleAttributes.y,
        pointerSize * circleAttributes.scale * this.params.canvasScale,
        0,
        2 * Math.PI,
        false
      );
      this.canvasContext.fill();
      this.canvasContext.closePath();
    }

    animateCanvas() {
      const pointerSize = Math.floor(
        (window.innerWidth > window.innerHeight
          ? this.canvas.height
          : this.canvas.width) * this.params.pointerSize
      );

      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvasContext.fillStyle = "black";
      this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.mouse.attributes.forEach((attr) =>
        this.drawGradientCircle(pointerSize, attr)
      );
    }

    handlePlane() {
      this.plane
        .onReady(() => {
          window.addEventListener("resize", () => this.resize());
          document.body.addEventListener("mousemove", (e) =>
            this.handleMovement(e)
          );
          document.body.addEventListener(
            "touchmove",
            (e) => this.handleMovement(e),
            { passive: true }
          );
          this.curtains.disableDrawing();
          this.curtains.needRender();
        })
        .onRender(() => {
          this.mouse.attributes = this.mouse.attributes.filter((attr) => {
            attr.opacity -= this.params.opacitySpeed;
            attr.x += attr.velocity.x * this.params.velocityStrength;
            attr.y += attr.velocity.y * this.params.velocityStrength;
            attr.scale +=
              attr.opacity >= 0.5
                ? this.params.opacitySpeed * 2
                : -this.params.opacitySpeed;

            return attr.opacity > 0;
          });

          if (this.mouse.attributes.length === 0) {
            this.curtains.disableDrawing();
          }

          this.animateCanvas();
        });
    }

    removePlane() {
      window.removeEventListener("resize", this.resize);
      document.body.removeEventListener("mousemove", this.handleMovement);
      document.body.removeEventListener("touchmove", this.handleMovement);
      this.curtains.removePlane(this.plane);
      this.plane = null;
      this.canvas = null;
      this.canvasContext = null;
    }

    addPlane() {
      this.planeParams = {
        vertexShaderID: "mouse-displacement-vs",
        fragmentShaderID: "mouse-displacement-fs",
        imageCover: true,
        uniforms: {
          mousePosition: {
            name: "uMousePosition",
            type: "2f",
            value: [this.mouse.position.x, this.mouse.position.y],
          },
          mouseEffect: {
            name: "uDisplacementStrength",
            type: "1f",
            value: this.params.displacementStrength,
          },
        },
      };

      this.plane = this.curtains.addPlane(this.planeElement, this.planeParams);

      if (this.plane) {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("data-sampler", "canvasTexture");
        this.canvasContext = this.canvas.getContext("2d", { alpha: false });
        this.plane.loadCanvases([this.canvas]);
        this.resize();
        this.handlePlane();
      }
    }
  }

  window.onload = () => {
    const mouseEffect = new MouseEffect(params);
    mouseEffect.curtains.onError(() => document.body.classList.add("no-webgl"));
    mouseEffect.addPlane();
  };
};

webGlBlock();

// See shaders, lib, and cnd script tags in src > _includes > app.html
// See Martin Laxenaire's code pen for samples
