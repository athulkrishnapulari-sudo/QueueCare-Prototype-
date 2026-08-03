ScriptUrl =
  "https://script.google.com/macros/s/AKfycbzSYWThnONVx23jECinjBmMCB5QKNKIzg-uBOIV4uGLK4VzP1_r6RZg2sAbSUy6AWgrNw/exec";

// =====================================================
//                         FORMS
// =====================================================

const form_container = document.getElementById("form_container");

// =====================================================

// =====================================================
//                         BUTTONS
// =====================================================

const AddButton = document.getElementsByClassName("secondaryBtn")[0];
const SubmitButton = document.getElementById("submitBtn");
const deleteBtn = document.getElementById("deleteBtn");

// =====================================================

// ====================================================
//               VARIABLES AND CONSTANTS
// ====================================================

let i = 1;
const FamilyDetails = [];

// ====================================================
document.getElementById("Relationship1").value = "Self";
function setupRelationshipValidation(index) {
  const relationship = document.getElementById(`Relationship${index}`);
  const phone = document.getElementById(`PhoneNumberInput${index}`);
  const email = document.getElementById(`EmailAddress${index}`);

  relationship.addEventListener("change", () => {
    const value = relationship.value;

    const noContactNeeded = ["Son", "Daughter"].includes(value);

    if (noContactNeeded) {
      phone.required = false;
      email.required = false;

      phone.value = "";
      email.value = "";
    } else {
      phone.required = true;
      email.required = true;
    }
  });
}

AddButton.addEventListener("click", (e) => {
  e.preventDefault();
  i++;
  form_container.insertAdjacentHTML(
    "beforeend",
    `<form action="" id="person${i}">
        <div id="row">
          <span>Person ${i}</span>
          <button type="button" class="deleteBtn"><svg xmlns="http://www.w3.org/2000/svg"
     width="22"
     height="22"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">
  <path d="M3 6h18"/>
  <path d="M8 6V4h8v2"/>
  <path d="M19 6l-1 14H6L5 6"/>
  <path d="M10 11v6"/>
  <path d="M14 11v6"/>
</svg></button>
        </div>
        
        <div id="relationship" class="field">
    <label for="Relationship">Relationship</label>
    <select id="Relationship${i}" name="Relationship" required>
        <option value="" selected disabled>Select Relationship</option>
        <option value="Self">Self</option>
        <option value="Spouse">Spouse</option>
        <option value="Father">Father</option>
        <option value="Mother">Mother</option>
        <option value="Son">Son</option>
        <option value="Daughter">Daughter</option>
        <option value="Brother">Brother</option>
        <option value="Sister">Sister</option>
        <option value="Grandfather">Grandfather</option>
        <option value="Grandmother">Grandmother</option>
        <option value="Uncle">Uncle</option>
        <option value="Aunt">Aunt</option>
        <option value="Other">Other</option>
    </select>
</div>
        <div id="row">
          <div id="firstName" class="field">
            <label for="">First Name</label>
            <input type="text" id="FirstNameInput${i}" required/>
          </div>
          <div id="lastName" class="field">
            <label for="">Last Name</label>
            <input type="text" id="LastNameInput${i}" required/>
          </div>
        </div>
        <div id="phoneNumber" class="field">
          <label for="">Phone Number</label>
          <input type="tel" id="PhoneNumberInput${i}" required/>
        </div>
        <div id="email" class="field">
          <label for="">Email Address</label>
          <input type="email" id="EmailAddress${i}" required/>
        </div>
        <div id="row">
          <div id="dob">
            <label for="">Date of Birth</label>
            <input type="date" id="DOB${i}" required/>
          </div>
          <div id="blood">
            <label for="">Blood Group</label>
            <select id="BloodGroup${i}" name="BloodGroup" required>
              <option value="" selected disabled>Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div id="gender">
            <label for="">Gender</label>
            <select name="" id="GenderInput${i}" required>
              <option value="" selected disabled>Select Your Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </form>`,
  );

  setupRelationshipValidation(i);
});
form_container.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".deleteBtn");

  if (!deleteBtn) return;

  const form = deleteBtn.closest("form");

  form.remove();
});
SubmitButton.addEventListener("click", (e) => {
  e.preventDefault();
  FamilyDetails.length = 0;
  const forms = document.querySelectorAll("#form_container form");

  for (const form of forms) {
    if (!form.reportValidity()) {
      return;
    }
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let j = 1; j <= i; j++) {
    const dobInput = document.getElementById(`DOB${j}`);
    const dob = new Date(dobInput.value);
    dob.setHours(0, 0, 0, 0);

    if (dob > today) {
      alert(`Person ${j}: Date of Birth cannot be in the future.`);
      dobInput.focus();
      return;
    }
  }
  const selfDOB = new Date(document.getElementById("DOB1").value);
  for (let j = 2; j <= i; j++) {
    const relationship = document.getElementById(`Relationship${j}`).value;
    const memberDOB = new Date(document.getElementById(`DOB${j}`).value);

    if (
      ["Father", "Mother", "Grandfather", "Grandmother"].includes(relationship)
    ) {
      if (memberDOB >= selfDOB) {
        alert(`${relationship} must be older than Self.`);
        document.getElementById(`DOB${j}`).focus();
        return;
      }
    }

    if (["Son", "Daughter"].includes(relationship)) {
      if (memberDOB <= selfDOB) {
        alert(`${relationship} must be younger than Self.`);
        document.getElementById(`DOB${j}`).focus();
        return;
      }
    }
  }
  
  for (let j = 1; j <= i; j++) {
    const obj = {
      Relationship: document.getElementById(`Relationship${j}`).value,
      FirstName: document.getElementById(`FirstNameInput${j}`).value,
      LastName: document.getElementById(`LastNameInput${j}`).value,
      Phone: document.getElementById(`PhoneNumberInput${j}`).value,
      Email: document.getElementById(`EmailAddress${j}`).value,
      DOB: document.getElementById(`DOB${j}`).value,
      BloodGroup: document.getElementById(`BloodGroup${j}`).value,
      Gender: document.getElementById(`GenderInput${j}`).value,
    };

    FamilyDetails.push(obj);
  }
  console.log(FamilyDetails);
  const familyString = JSON.stringify(FamilyDetails);


  fetch(ScriptUrl, {
    method: "POST",
    body: JSON.stringify({
      action: "saveFamily",
      Phone: localStorage.getItem("Phone"),
      FamilyDetails: JSON.stringify(FamilyDetails)
    }),
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    }
  })
    .then(response => response.text())
    .then(result => {
      console.log(result);
      localStorage.setItem("FamilyDetails",familyString);
      window.location.href ="main.html";
    })
    .catch(error => {
      console.log(error);
    });

});
