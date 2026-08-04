scriptURL =
    "https://script.google.com/macros/s/AKfycbyxXpiSyxRrgHkkcFDnNAce0ojyjZQfzv_1NcQTHFv2GoREKkVnApHk8H5ep_SSG19p/exec";

window.onload = () => {
    console.log("Page Loaded");
    overlay.style.display = "flex";
    membersSelectAreaUpdate();
    const phone = localStorage.getItem("Phone");
    fetch(`${scriptURL}?phone=${phone}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            localStorage.setItem("OP", JSON.stringify(data.appointments));
        });
};
const profile_avatar = document.getElementsByClassName("profile-avatar")[0];
function updateProfileIcon() {
  const family = localStorage.getItem("FamilyDetails");
  const family_data = JSON.parse(family);
  const FirstName = family_data[0].FirstName;
  const LastName = family_data[0].LastName;
  console.log(family_data);
  console.log("First Name : ", FirstName);
  console.log("Last Name : ", LastName);
  const profile_icon = FirstName[0] + LastName[0];
  console.log(profile_icon);
  profile_avatar.innerHTML = "";
  profile_avatar.innerHTML = profile_icon;
}
const profile_drop_btn1 = document.getElementById("profile_drop_btn");
const nav_menu = document.getElementsByClassName("mobile-nav")[0];
const navMenu_toggle_button1 =
    document.getElementsByClassName("menu-toggle")[0];
window.addEventListener("click", () => {
    //window control
    profile_dropDown.classList.remove("active");
    nav_menu.classList.remove("active");
});

profile_drop_btn1.addEventListener("click", (event) => {
    event.stopPropagation();
    profile_dropDown.classList.toggle("active");
});

navMenu_toggle_button1.addEventListener("click", (event) => {
    event.stopPropagation();
    nav_menu.classList.toggle("active");
});
const overlay = document.getElementById("overlay");

function membersSelectAreaUpdate() {
    const family = localStorage.getItem("FamilyDetails");
    const family_data = JSON.parse(family);
    family_data.forEach((element, index) => {
        const name = `${element.FirstName} ${element.LastName}`;
        console.log(name);
        members.innerHTML += `
      <label class="memberTile">
                <input type="radio" name="patient" value="${index + 1}">

                <div class="memberInfo">
                    <span class="memberName">${name}</span>
                    <span class="memberRelation">${element.Relationship}</span>
                </div>
        </label>
    `;
    });

    members.innerHTML += `<label class="memberTile other">
            <input type="radio" name="patient" value="other">

            <div class="memberInfo">
                <span class="memberName">Other Patient</span>
                <span class="memberRelation">Register New Patient</span>
            </div>
        </label>`;
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

const data = {};

const ContinueBtn = document.getElementById("continueBtn");

ContinueBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="patient"]:checked');

    if (!selected) {
        alert("Please select a patient");
        return;
    }
    console.log(selected.value);
    overlay.style.display = "none";
    const family = localStorage.getItem("FamilyDetails");
    const family_data = JSON.parse(family);
    data.Phone = family_data[0].Phone
    family_data.forEach((element, index) => {
        if (String(index + 1) == selected.value) {
            const name = `${element.FirstName} ${element.LastName}`;
            data.Name = name;
            data.Gender = element.Gender;
            data.Age = calculateAge(element.DOB);
        }
    });
    console.log(data);
});
let token;

const form = document.getElementById("appointmentForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedTime = document.querySelector(
        'input[name="timeSlot"]:checked'
    );

    if (!selectedTime) {
        alert("Please select a time slot");
        return;
    }

    data.Hospital = document.getElementById("hospital").value;
    data.district = document.getElementById("district").value;
    data.Department = document.getElementById("department").value;
    data.Doctor = document.getElementById("doctor").value;
    data.Date = document.getElementById("appointmentDate").value;
    data.Time = selectedTime.value;
    data.OPNo = "abcdefghijklmno";

    fetch(scriptURL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
    })
        .then(response => response.text())
        .then(result => {

            const responseData = JSON.parse(result);

            console.log(responseData);

            if (responseData.status === "success") {

                token = responseData.token;



                generateOPTicket(data, token)
                    .then(() => {
                        window.location.href = "main.html";
                    });
            }

        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        });



});



function generateOPTicket(data, token) {
    console.log("Generating PDF started");
    const html = `<!DOCTYPE html>
<html>
<head>
<style>
@page {
    size: A4;
    margin: 20mm;
}

body {
    width: 170mm;
    height: 257mm;
    margin: auto;
    font-family: Arial, sans-serif;
    border:1px solid black;
}

#row1{
    height:10%;
    border:1px solid black;
    margin:0.2mm 5mm;
    margin-top:5mm;
}

#row1 h3{
    font-size:3.2mm;
    text-align:center;
}
    #row1 .row1 h3{
        font-size:3.2mm;
        position:absolute;
        left:40%;
        right:40%;
    }

.row1{
    display:flex;
    position:relative;
}

#row1 span{
    font-size:2.5mm;
    margin-top:4.3mm;
    margin-left:2mm;
}

#row2{
    border:1px solid black;
    margin:0.7mm 5mm;
    padding:2mm 0;
}

.row2{
    display:grid;
    grid-template-columns:1fr 1fr;
}

.row2 span{
    padding:2px 12px;
    font-size:12px;
}


#row3{
    height:180mm;
    width:180mm;
    border:1px solid black;
    margin:0.7mm 5mm;
}

.row3{
    display:flex;
    width:100%;
    height:100%;
}

.column1{
    width:31.9mm;
    height:100%;
    border-right:1px solid black;
}

.column2{
    width:127.6mm;
    height:100%;
}

#row4{
    font-size:12px;
}

</style>
</head>

<body>

<div id="row1">
<h3>Department of Health & Family Welfare</h3>
<h3>${data.Hospital}</h3>

<div class="row1">
<span>CR No : 213456788909989</span>
<h3>OPD CARD</h3>
</div>

</div>


<div id="row2">

<div class="row2">
<span>Patient Name : ${data.Name}</span>
<span>Age : ${data.Age} Yr</span>
</div>

<div class="row2">
<span>Sex : ${data.Gender}</span>
<span>Mobile Number : ${data.Phone}</span>
</div>

<div class="row2">
<span>Department : ${data.Department}</span>
<span>Appointment Date : ${data.Date}</span>
</div>

<div class="row2">
<span>Appointment Time : ${data.Time}</span>
<span>Token No : ${token}</span>
</div>

</div>


<div id="row3">
<div class="row3">
<div class="column1"></div>
<div class="column2"></div>
</div>
</div>


<div id="row4">
<ul>
<li>This OPD Ticket is generated through online</li>
<li>Not Valid for casualty</li>
<li>Something</li>
</ul>
</div>


</body>
</html>`;


    


    return html2pdf()
        .set({
            filename: "QueueCare_OP_Ticket.pdf",
            margin: 10,
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        })
        .from(html)
        .save()
        .then(() => {
            
        });
}