const dialog = document.querySelector("dialog"),
  showButton = document.querySelector(".cta"),
  closeButton = document.querySelector("dialog button"),
  mouseCursor = document.querySelector(".mouse-cursor");

const dialogElems = dialog.querySelectorAll(
  "a, button, input, textarea, select"
);

const setTabIndex = (elements, value) => {
  elements.forEach((el) => el.setAttribute("tabindex", value));
};

showButton.addEventListener("click", () => {
  dialog.showModal();
  document.body.style.overflow = "hidden";
  setTabIndex(dialogElems, "0");
});

closeButton.addEventListener("click", () => {
  dialog.close();
  document.body.style.overflow = "auto";
  setTabIndex(dialogElems, "-1");
  mouseCursor.classList.remove("active");
});

setTabIndex(dialogElems, "-1");

dialog.addEventListener("click", (e) => {
  if (e.target.classList.contains("backdrop")) {
    dialog.close();
    document.body.style.overflow = "auto";
    mouseCursor.classList.remove("active");
  }
});

const matchInputWidthToHeading = () => {
  const heading = document.querySelector(".dialog__form h2");
  const dialogForm = document.querySelector(".dialog__form");

  const headingWidth = heading.offsetWidth;

  dialogForm.style.width = `${headingWidth + 96}px`;
};

matchInputWidthToHeading();

window.addEventListener("resize", matchInputWidthToHeading);

//
// Mouse Cursor
//

document.addEventListener("mousemove", (e) => {
  mouseCursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;

  if (e.target.classList.contains("backdrop")) {
    mouseCursor.classList.add("active");
  } else {
    mouseCursor.classList.remove("active");
  }
});
