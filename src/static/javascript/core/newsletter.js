import { newsletterCursor } from "./mouseCursor.js";
import { closeNav } from "../components/nav.js";
// import { lenis } from "./lenis.js";

const dialogNewsletter = document.querySelector(".newsletter-dialog"),
  cta = document.querySelector(".cta"),
  closeButton = document.querySelector(".newsletter-dialog button");

const dialogChildren = dialogNewsletter.querySelectorAll(
  "a, button, input, textarea, select"
);

const setTabIndex = (elements, value) => {
  elements.forEach((el) => el.setAttribute("tabindex", value));
};

const openModal = () => {
  closeNav();
  dialogNewsletter.showModal();
  setTabIndex(dialogChildren, "0");
  closeButton.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  // lenis.stop();
};

const closeModal = () => {
  dialogNewsletter.close();
  setTabIndex(dialogChildren, "-1");
  closeButton.setAttribute("aria-expanded", "false");
  newsletterCursor.classList.remove("active");
  document.body.style.overflow = "auto";
  // lenis.start();
};

cta.addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

setTabIndex(dialogChildren, "-1");

dialogNewsletter.addEventListener("click", (e) => {
  if (e.target.classList.contains("backdrop")) {
    closeModal();
  }
});

//
// Form Logic
//

const newsletterForm = document.querySelector(".newsletter-form"),
  statusMessage = document.querySelector(".status-message"),
  emailInput = document.querySelector(".email-input");

const errorClasses = ["error-message", "active"];
const successClasses = ["success-message", "active"];

if (newsletterForm) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const email = emailInput.value;
    let submittedEmails =
      JSON.parse(localStorage.getItem("submittedEmails")) || [];

    if (submittedEmails.includes(email)) {
      statusMessage.innerHTML = `
        <svg
          class="error-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="16"
          viewBox="0 0 512 512"
        >
          <path
            d="M18.3 448L0 480H36.9 475.1 512l-18.3-32L274.4 64.2 256 32 237.6 64.2 18.3 448zm438.6 0H55.1L256 96.5 456.9 448zM240 320v16h32V320 192H240V320zm40 96V368H232v48h48z"
          />
        </svg>
        Error! This email has already been submitted.
      `;
      statusMessage.classList.add(...errorClasses);

      setTimeout(function () {
        statusMessage.classList.remove("active");
      }, 8000);

      setTimeout(function () {
        statusMessage.innerHTML = "";
        statusMessage.classList.remove("error-message");
      }, 9000);

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
        statusMessage.innerHTML = `
        <svg
          class="success-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="14"
          viewBox="0 0 448 512"
        >
          <path
            opacity="1"
            fill="#1E3050"
            d="M448.1 118.2L437 129.7 173.6 404l-11.5 12-11.5-12L11.1 258.8 0 247.2l23.1-22.2 11.1 11.5L162.1 369.8 414 107.5 425 96l23.1 22.2z"
          />
        </svg>
        Subscription Confirmed! Thanks for joining our mailing list.
        `;
        statusMessage.classList.add(...successClasses);

        setTimeout(function () {
          statusMessage.classList.remove("active");
        }, 8000);

        setTimeout(function () {
          statusMessage.innerHTML = "";
          statusMessage.classList.remove("success-message");
        }, 9000);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert(error);
      });
  };

  newsletterForm.addEventListener("submit", handleSubmit);
}
