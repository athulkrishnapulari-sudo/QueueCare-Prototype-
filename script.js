window.onload = () => {

    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn !== "true") {
        window.location.replace("index.html");
        return;
    }
    
    console.log("Page loaded");
    updateProfileIcon();
    profile_name1.innerHTML=localStorage.getItem('Name')
    profile_name2.innerHTML=localStorage.getItem('Name')
    UpdateHospitals();

};

// ====================================================
//               VARIABLES AND CONSTANTS
// ====================================================

let latitude;
let longitude;
const speed = 25; //for calculating time

// ====================================================

// =====================================================
//                         BUTTONS
// =====================================================

const profile_drop_btn = document.getElementById("profile_drop_btn");
const navMenu_toggle_button = document.getElementsByClassName("menu-toggle")[0];
const logout = document.getElementsByClassName('logout')[0];
const BookOp1 = document.getElementById('BookOp1');
const BookOp2 = document.getElementById('BookOp2');

// =====================================================

// =====================================================
//                      DROPDOWN MENU
// =====================================================

const profile_dropDown = document.getElementById("profile_dropDown");
const nav_menu = document.getElementsByClassName("mobile-nav")[0];

// =====================================================

// =====================================================
//                      DISPLAYS
// =====================================================

const hospital_display = document.getElementById("hospital_display");
const profile_name1 = document.getElementById('profile_name1');
const profile_name2 = document.getElementById('profile_name2');
const profile_avatar = document.getElementsByClassName('profile-avatar')[0];
const members = document.getElementById('members');

// =====================================================

// =====================================================
//                  INTIALIZE LOCAL STORAGE
// =====================================================
if (!localStorage.getItem("HospitalsSorted")) {
  localStorage.setItem("HospitalsSorted", "");
}

function showLoadingHospitals() {
  if (!hospital_display) return;

  hospital_display.innerHTML = `
    <div class="hospital-loading">
      <div class="hospital-loading__header">
        <div class="hospital-loading__spinner"></div>
        <div>
          <div class="hospital-loading__title">Looking for nearby hospitals</div>
          <div class="hospital-loading__subtitle">We’re checking live options around you...</div>
        </div>
      </div>

      <div class="hospital-loading__card">
        <div class="hospital-loading__line hospital-loading__line--short"></div>
        <div class="hospital-loading__line"></div>
        <div class="hospital-loading__line hospital-loading__line--short"></div>
      </div>

      <div class="hospital-loading__card">
        <div class="hospital-loading__line hospital-loading__line--short"></div>
        <div class="hospital-loading__line"></div>
        <div class="hospital-loading__line hospital-loading__line--short"></div>
      </div>
    </div>
  `;
}

// =====================================================

// =====================================================
//                     HELPER FUNCTIONS
// =====================================================

function getLocation() {
  return new Promise((resolve, reject) => {
    console.log("Requesting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("Location received:", latitude, longitude);
        resolve([latitude, longitude]);
      },
      (error) => {
        console.log("Location error:", error.message);
        reject(error);
      },
    );
  });
}
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return Number(
    (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2),
  );
}
function filterGovernmentHospitals(hospitals) {
    const keywords = [
        "govt",
        "government",
        "thaluk",
        "taluk",
        "district",
        "general"
    ];

    return hospitals.filter(hospital => {
        const name = hospital.name.toLowerCase();

        return keywords.some(keyword => 
            name.includes(keyword)
        );
    });
}
async function getNearbyHospitals(lat, lon) {
  console.log("Searching hospitals near:", lat, lon);

  const query = `
  [out:json][timeout:15];
  node["amenity"="hospital"](around:10000,${lat},${lon});
  out;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: query,
    });

    const data = await response.json();

    Hospitals = data.elements.map((hospital) => {
      return {
        name: hospital.tags.name || "Unknown Hospital",
        latitude: hospital.lat,
        longitude: hospital.lon,
        address: hospital.tags["addr:full"],
        distance: calculateDistance(lat, lon, hospital.lat, hospital.lon),
      };
    });

    // Sort nearest first
    Hospitals.sort((a, b) => a.distance - b.distance);
    const governmentHospitals = filterGovernmentHospitals(Hospitals);
    console.log("Sorted Hospitals:", governmentHospitals);
    localStorage.setItem("HospitalsSorted", JSON.stringify(governmentHospitals));
    return governmentHospitals;
  } catch (error) {
    console.log("API Error:", error);
    return [];
  }
}
function UpdateHospitals() {
  const Hospital = localStorage.getItem("HospitalsSorted");

  if (!Hospital || Hospital.trim() === "") {
    showLoadingHospitals();
    return;
  }

  try {
    Hospitals = JSON.parse(Hospital);
  } catch (error) {
    console.warn("Invalid hospital data saved locally.", error);
    showLoadingHospitals();
    return;
  }

  if (!Array.isArray(Hospitals) || Hospitals.length === 0) {
    showLoadingHospitals();
    return;
  }

  hospital_display.innerHTML="";
  const firstThree = Hospitals.slice(0, 3);
  firstThree.map((item) => {
    hospital_display.innerHTML += `<div class="list-item">
                <div class="list-item__content">
                  <div class="list-item__title-row">
                    <span class="list-item__title">${item.name}</span>
                    <span class="badge badge--recommended">Recommended</span>
                  </div>
                  <div class="list-item__meta">Thiruvananthapuram</div>
                  <div class="meta-row">
                    <div class="meta-pill">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      ${Math.round((item.distance / speed) * 60)} mins
                    </div>
                    <div class="meta-pill">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                        <circle cx="12" cy="9" r="2.5"></circle>
                      </svg>${item.distance} km
                    </div>
                  </div>
                </div>
                <button class="book-btn" type="button">Book</button>
              </div>`;
  });
}
function updateProfileIcon(){
  const family = localStorage.getItem('FamilyDetails')
  const family_data = JSON.parse(family)
  const FirstName = family_data[0].FirstName;
  const LastName = family_data[0].LastName;
  console.log(family_data)
  console.log("First Name : ",FirstName)
  console.log("Last Name : ",LastName)
  const profile_icon = FirstName[0]+LastName[0];
  console.log(profile_icon)
  profile_avatar.innerHTML=""
  profile_avatar.innerHTML=profile_icon;
}


BookOp1.addEventListener('click', () => {
            window.location.href="Book.html"
})
BookOp2.addEventListener('click', () => {
            window.location.href="Book.html"
})
// =====================================================

// =====================================================
// CONTINIOUS RUNNING FUNCTIONS
// =====================================================

setInterval(() => {}, 1000);

// =====================================================

// =====================================================
//                       SHOW / HIDE
// =====================================================

window.addEventListener("click", () => {
  //window control
  profile_dropDown.classList.remove("active");
  nav_menu.classList.remove("active");
});

profile_drop_btn.addEventListener("click", (event) => {
  event.stopPropagation();
  profile_dropDown.classList.toggle("active");
});

navMenu_toggle_button.addEventListener("click", (event) => {
  event.stopPropagation();
  nav_menu.classList.toggle("active");
});

// =====================================================

// =====================================================
// MAIN FUNCTION
// =====================================================

async function main() {
  showLoadingHospitals();

  try {
    
    const location = await getLocation();
    Hospitals = await getNearbyHospitals(location[0], location[1]);
    UpdateHospitals();
    console.log(Hospitals);
  } catch (error) {
    // console.log(error);
  }
}

main();




// =====================================================



// =====================================================
//                          LOGOUT 
// =====================================================

logout.addEventListener('click',()=>{
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("Phone");
    localStorage.removeItem("Name");
    localStorage.removeItem("FamilyDetails");
    window.location.replace("index.html");
})