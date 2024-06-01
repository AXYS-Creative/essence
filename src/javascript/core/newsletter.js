const dialog = document.querySelector("dialog"),
  cta = document.querySelector(".cta"),
  closeButton = document.querySelector("dialog button"),
  mouseCursor = document.querySelector(".mouse-cursor");

const dialogElems = dialog.querySelectorAll(
  "a, button, input, textarea, select"
);

const setTabIndex = (elements, value) => {
  elements.forEach((el) => el.setAttribute("tabindex", value));
};

const openModal = () => {
  dialog.showModal();
  document.body.style.overflow = "hidden";
  setTabIndex(dialogElems, "0");
};

const closeModal = () => {
  dialog.close();
  document.body.style.overflow = "auto";
  setTabIndex(dialogElems, "-1");
  mouseCursor.classList.remove("active");
};

cta.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

setTabIndex(dialogElems, "-1");

dialog.addEventListener("click", (e) => {
  if (e.target.classList.contains("backdrop")) {
    closeModal();
  }
});

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
