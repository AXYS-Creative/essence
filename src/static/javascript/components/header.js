// import { path } from "../utility.js";

const headerLinks = document.querySelector(".header-links"),
  headerLinksIndicator = document.querySelector(
    ".header-links__hover-indicator"
  ),
  linkItems = headerLinks.querySelectorAll("li"),
  links = headerLinks.querySelectorAll("li a");

const moveUnderlineToLink = (link) => {
  const linkRect = link.getBoundingClientRect();
  const parentRect = headerLinks.getBoundingClientRect();
  const leftPosition = linkRect.left - parentRect.left;

  headerLinksIndicator.style.left = `${leftPosition}px`;
  headerLinksIndicator.style.width = `${linkRect.width}px`;
};

linkItems.forEach((link) => {
  link.addEventListener("mouseover", () => {
    moveUnderlineToLink(link);
    headerLinksIndicator.classList.add("show-indicator");
  });
  link.addEventListener("focusin", () => {
    moveUnderlineToLink(link);
    headerLinksIndicator.classList.add("show-indicator");
  });

  link.addEventListener("mouseleave", () => {
    headerLinksIndicator.classList.remove("show-indicator");
  });
  link.addEventListener("focusout", () => {
    headerLinksIndicator.classList.remove("show-indicator");
  });
});

// // Page specific logic, intended to highlight acive nav link/page
// links.forEach((link) => {
//   const href = link.getAttribute("href");
//   if (path.includes(href)) {
//     link.classList.add("active");
//   }
// });
