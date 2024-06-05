export const navElements = ["backdrop__nav", "nav-img-container", "nav-img"]; // e.target to close the nav

export const mouseCursors = document.querySelectorAll(".mouse-cursor");

export const navCursor = document.querySelector(".mouse-cursor__original");
export const newsletterCursor = document.querySelector(
  ".mouse-cursor__newsletter"
);

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
});
