import { path, pageClasses } from "../utility.js";

const headerLinks = document.querySelector(".header-links"),
  headerLinksUnderline = document.querySelector(
    ".header-links__hover-indicator"
  ),
  linkItems = headerLinks.querySelectorAll("li"),
  links = headerLinks.querySelectorAll("li a");

const moveUnderlineToLink = (link) => {
  const linkRect = link.getBoundingClientRect();
  const parentRect = headerLinks.getBoundingClientRect();
  const leftPosition = linkRect.left - parentRect.left;

  headerLinksUnderline.style.left = `${leftPosition}px`;
  headerLinksUnderline.style.width = `${linkRect.width}px`;
};

linkItems.forEach((link) => {
  link.addEventListener("mouseover", () => {
    moveUnderlineToLink(link);
    headerLinksUnderline.classList.add("show-indicator");
  });
  link.addEventListener("focusin", () => {
    moveUnderlineToLink(link);
    headerLinksUnderline.classList.add("show-indicator");
  });

  link.addEventListener("mouseleave", () => {
    headerLinksUnderline.classList.remove("show-indicator");
  });
  link.addEventListener("focusout", () => {
    headerLinksUnderline.classList.remove("show-indicator");
  });
});

// Page specific logic
links.forEach((link) => {
  const href = link.getAttribute("href");
  if (path.includes(href)) {
    link.classList.add("active");
  }
});
