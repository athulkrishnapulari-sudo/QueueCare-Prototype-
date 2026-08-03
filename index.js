window.onload = () => {
  if (localStorage.getItem("loggedIn") == "true" && localStorage.getItem('FamilyDetails')=="") {
    window.location.replace("family.html");
  }
  else if(localStorage.getItem("loggedIn") == "true" && localStorage.getItem('FamilyDetails')!=""){
    window.location.replace("main.html");
  }
};
const signinFormCard = document.getElementById("signinFormCard");
const registerFormCard = document.getElementById("registerFormCard");
const authSwitches = document.querySelectorAll(".auth-switch");

const passwordToggle = document.getElementById("passwordToggle");
const passwordInput = document.getElementById("passwordInput");
const eyeIcon = document.getElementById("eyeIcon");
let showPassword = false;

const termsButton = document.getElementById("termsButton");
const termsCheck = termsButton.querySelector(".checkmark");
let termsAgreed = false;

// Switch forms based on URL hash or data target
function setActiveForm(target) {
  const isSignin = target === "signin";
  signinFormCard.classList.toggle("hidden", !isSignin);
  registerFormCard.classList.toggle("hidden", isSignin);
}

authSwitches.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.target;
    window.location.hash =
      target === "register" ? "registerFormCard" : "signinFormCard";
    setActiveForm(target);
  });
});

window.addEventListener("hashchange", () => {
  const target =
    window.location.hash === "#registerFormCard" ? "register" : "signin";
  setActiveForm(target);
});

// Password visibility toggle
passwordToggle.addEventListener("click", () => {
  showPassword = !showPassword;
  passwordInput.type = showPassword ? "text" : "password";
  eyeIcon.innerHTML = showPassword
    ? '<path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><path d="M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z" />'
    : '<path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />';
  passwordToggle.setAttribute(
    "aria-label",
    showPassword ? "Hide password" : "Show password",
  );
});

// Custom Checkbox toggle
termsButton.addEventListener("click", () => {
  termsAgreed = !termsAgreed;
  termsButton.classList.toggle("checked", termsAgreed);
  termsButton.setAttribute("aria-pressed", termsAgreed.toString());
  termsCheck.classList.toggle("hidden", !termsAgreed);
});

// Highlight input container on focus
document.querySelectorAll(".input-wrap input").forEach((input) => {
  const wrap = input.closest(".input-wrap");
  input.addEventListener("focus", () => wrap.classList.add("focused"));
  input.addEventListener("blur", () => wrap.classList.remove("focused"));
});

// Initial state
const initialTarget =
  window.location.hash === "#registerFormCard" ? "register" : "signin";
setActiveForm(initialTarget);
const registerForm = document.getElementById("registerForm");

ScriptUrl =
  "https://script.google.com/macros/s/AKfycbzSYWThnONVx23jECinjBmMCB5QKNKIzg-uBOIV4uGLK4VzP1_r6RZg2sAbSUy6AWgrNw/exec";

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    action: "register",

    Name: document.getElementById("nameInput").value,

    Phone: document.getElementById("mobileInput").value,

    Password: document.getElementById("passwordInput").value,
  };

  fetch(ScriptUrl, {
    method: "POST",

    body: JSON.stringify(data),

    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
    .then((res) => res.json())

    .then((result) => {
      console.log(result);

      if (result.status === "success") {
        alert("Account Created Successfully");

        registerForm.reset();
        setActiveForm("signin");
      }
    })

    .catch((err) => {
      console.log(err);

      alert("Error");
    });
});
const signIn = document.getElementById("signinForm");

signIn.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = document.getElementById("signinMobile").value.trim();
  const password = document.getElementById("signinPassword").value.trim();

  if (!phone || !password) {
    alert("Enter phone number and password");
    return;
  }

  try {
    const response = await fetch(
      `${ScriptUrl}?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`,
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("Phone", phone);
      localStorage.setItem("Name", data.name);
      localStorage.setItem("FamilyDetails",data.familyDetails);
      if(localStorage.getItem("FamilyDetails")===""){
            window.location.href = "family.html";
      }
      else{
            window.location.href = "main.html";
      }
      
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Server error");
  }
});
