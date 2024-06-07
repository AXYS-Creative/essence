const headerLinks = document.querySelector(".header-links"),
  headerLinksUnderline = document.querySelector(".header-links__underline"),
  links = headerLinks.querySelectorAll("li");

const moveUnderlineToLink = (link) => {
  const linkRect = link.getBoundingClientRect();
  const parentRect = headerLinks.getBoundingClientRect();
  const leftPosition = linkRect.left - parentRect.left;

  headerLinksUnderline.style.left = `${leftPosition}px`;
  headerLinksUnderline.style.width = `${linkRect.width}px`;
};

links.forEach((link) => {
  link.addEventListener("mouseover", () => {
    moveUnderlineToLink(link);
    headerLinksUnderline.classList.remove("revert-underline");
  });
  link.addEventListener("focusin", () => {
    moveUnderlineToLink(link);
    headerLinksUnderline.classList.remove("revert-underline");
  });

  link.addEventListener("mouseleave", () => {
    headerLinksUnderline.classList.add("revert-underline");
  });
  link.addEventListener("focusout", () => {
    headerLinksUnderline.classList.add("revert-underline");
  });
});
