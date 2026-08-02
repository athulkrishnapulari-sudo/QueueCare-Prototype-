// =====================================================
//                         BUTTONS
// =====================================================

const profile_drop_btn = document.getElementById('profile_drop_btn');
const navMenu_toggle_button = document.getElementsByClassName('menu-toggle')[0];

// =====================================================




// =====================================================
//                      DROPDOWN MENU
// =====================================================

const profile_dropDown = document.getElementById('profile_dropDown');
const nav_menu = document.getElementsByClassName('mobile-nav')[0];

// =====================================================



// =====================================================
//                  INTIALIZE LOCAL STORAGE 
// =====================================================


// =====================================================



// =====================================================
//                     HELPER FUNCTIONS
// =====================================================


// =====================================================



// =====================================================
//                       SHOW / HIDE 
// =====================================================

window.addEventListener('click', () => {  //window control
  profile_dropDown.classList.remove('active');
  nav_menu.classList.remove('active');
});


profile_drop_btn.addEventListener('click', (event) => {
  event.stopPropagation();
  profile_dropDown.classList.toggle('active');
});


navMenu_toggle_button.addEventListener('click',(event)=>{
    event.stopPropagation();
    nav_menu.classList.toggle('active');
})


// =====================================================