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

//
// Form Logic
//

const newsletterForm = document.querySelector(".newsletter-form"),
  successMessage = document.querySelector(".success-message"),
  errorMessage = document.querySelector(".error-message"),
  emailInput = document.querySelector(".email-input");

if (newsletterForm) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = emailInput.value;
    let submittedEmails =
      JSON.parse(localStorage.getItem("submittedEmails")) || [];

    if (submittedEmails.includes(email)) {
      newsletterForm.classList.add("active");
      errorMessage.classList.add("active");
      errorMessage.setAttribute("aria-hidden", false);

      setTimeout(function () {
        newsletterForm.classList.remove("active");
        errorMessage.classList.remove("active");
        errorMessage.setAttribute("aria-hidden", true);
      }, 5000);

      return;
    } else {
      submittedEmails.push(email);
      localStorage.setItem("submittedEmails", JSON.stringify(submittedEmails));
    }

    const myForm = event.target;
    const formData = new FormData(myForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        newsletterForm.classList.add("active");
        successMessage.classList.add("active");
        successMessage.setAttribute("aria-hidden", false);

        setTimeout(function () {
          newsletterForm.classList.remove("active");
          successMessage.classList.remove("active");
          successMessage.setAttribute("aria-hidden", true);
        }, 5000);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert(error);
      });
  };

  newsletterForm.addEventListener("submit", handleSubmit);
}
