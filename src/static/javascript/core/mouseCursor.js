import { isSafari } from "../utility.js";
import { videoSection } from "../components/video.js";

export const navElements = [
  "backdrop__nav",
  "backdrop__nav-abstract",
  "nav-img-container",
  "nav-img",
]; // e.target to close the nav

export const mouseCursors = document.querySelectorAll(".mouse-cursor");

export const navCursor = document.querySelector(".mouse-cursor__original");
export const newsletterCursor = document.querySelector(
  ".mouse-cursor__newsletter"
);
export const videoCursor = document.querySelector(".mouse-cursor__video");

document.addEventListener("mousemove", (e) => {
  mouseCursors.forEach((el) => {
    el.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  });

  if (e.target.classList.contains("backdrop__newsletter")) {
    newsletterCursor.classList.add("active");
  } else {
    newsletterCursor.classList.remove("active");
  }

  if (navElements.some((className) => e.target.classList.contains(className))) {
    navCursor.classList.add("active");
  } else {
    navCursor.classList.remove("active");
  }

  if (videoSection) {
    if (e.target.classList.contains("video-section__dialog")) {
      videoCursor.classList.add("active");
    } else {
      videoCursor.classList.remove("active");
    }
  }
});

// Safari - glitchy transition on mouseCursor
if (isSafari()) {
  mouseCursors.forEach((el) => (el.style.transition = "none"));
}
