gsap.registerPlugin(ScrollTrigger);

import { videoCursor } from "../core/mouseCursor.js";

export const videoSection = document.querySelector(".video-section"),
  videoPoster = document.querySelector(".video-section__poster"),
  videoDialog = document.querySelector(".video-section__dialog"),
  videoBtn = document.querySelector(".video-section__play-btn"),
  closeVideoDialogBtn = document.querySelector(
    ".video-section__dialog .dialog__close-btn"
  ),
  iframe = document.querySelector("iframe");

if (videoSection) {
  let iframeSrc = iframe.src;

  const playVideo = (e) => {
    videoDialog.showModal();
    document.body.style.overflow = "hidden";
    iframe.src = iframeSrc;
  };

  const closeVideo = (e) => {
    videoDialog.close();
    document.body.style.overflow = "auto";
    videoCursor.classList.remove("active");

    setTimeout(() => {
      iframe.src = "";

      // GAME CHANGER - Restore GSAP animations after video has been opened
      ScrollTrigger.getAll().forEach((st) => {
        st.refresh();
      });
    }, 750);
  };

  videoPoster.addEventListener("click", playVideo);
  videoBtn.addEventListener("click", playVideo);

  videoDialog.addEventListener("click", closeVideo);
  closeVideoDialogBtn.addEventListener("click", closeVideo);

  // Play button, track mouse with velocity rotation ADVANCED
  if (window.matchMedia("(pointer: fine) and (hover: hover)").matches) {
    let previousX = 0;
    let previousTime = Date.now();
    let inactivityTimeout;

    videoPoster.addEventListener("mousemove", (e) => {
      const rect = videoPoster.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const posterWidth = videoPoster.offsetWidth / 2;
      const posterHeight = videoPoster.offsetHeight / 2;

      const currentTime = Date.now();
      const timeDelta = currentTime - previousTime;
      const deltaX = x - previousX;
      const velocity = deltaX / timeDelta;

      previousX = x;
      previousTime = currentTime;

      const maxRotation = 24; // Maximum rotation angle
      const rotationAngle =
        Math.min(maxRotation, Math.abs(velocity) * maxRotation) *
        Math.sign(velocity);

      videoBtn.style.translate = `calc(${x - posterWidth}px - 50%) calc(${
        y - posterHeight
      }px - 50%)`;
      videoBtn.style.rotate = `${-rotationAngle}deg`;

      clearTimeout(inactivityTimeout);

      inactivityTimeout = setTimeout(() => {
        videoBtn.style.rotate = `0deg`;
      }, 100);
    });

    videoPoster.addEventListener("mouseleave", () => {
      videoBtn.style.translate = `-50% -50%`;
      videoBtn.style.rotate = `0deg`;
      previousX = 0;
      previousTime = Date.now();
    });
  }

  // Play button, track mouse SIMPLE
  // if (window.matchMedia("(pointer: fine)").matches) {
  //   videoPoster.addEventListener("mousemove", (e) => {
  //     const rect = videoPoster.getBoundingClientRect();
  //     const x = e.clientX - rect.left;
  //     const y = e.clientY - rect.top;
  //     const posterWidth = videoPoster.offsetWidth / 2;
  //     const posterHeight = videoPoster.offsetHeight / 2;
  //     videoBtn.style.translate = `calc(${x - posterWidth}px - 50%) calc(${
  //       y - posterHeight
  //     }px - 50%)`;
  //   });

  //   videoPoster.addEventListener("mouseleave", () => {
  //     videoBtn.style.translate = `-50% -50%`;
  //   });
  // }
}
