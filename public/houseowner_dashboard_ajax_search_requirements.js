

const searchForm = document.getElementById("searchForm");
// const searchByRequirementsForm = document.getElementById("searchByRequirementsForm");
const requirementsBtn = document.getElementById("requirementsBtn");
const genderRadioBtns = document.querySelectorAll(`input[type="radio"][name=uGender]`);
const empNatureRadioBtns = document.querySelectorAll(`input[type="radio"][name=uEmpNature]`);
const skillsCheckBoxes = document.querySelectorAll(`input[type="checkbox"][name=skillsCheckBox]`);


// function getRadioValue(input) {
//   let result;
//   input.forEach((radioBtn)=>{
//     if (radioBtn.checked) {
//       maidGender = radioBtn.value;
//     }
//   });
//   return result;
// }
function getGender() {
  let maidGender;
  genderRadioBtns.forEach((genderRadioBtn) => {
    if (genderRadioBtn.checked) {
      maidGender = genderRadioBtn.value;
    }
  });
  return maidGender;
}

function getEmpNature() {
  let maidEmpNature;
  empNatureRadioBtns.forEach((empNatureRadioBtn) => {
    if (empNatureRadioBtn.checked) {
      maidEmpNature = empNatureRadioBtn.value;
    }
  });
  return maidEmpNature;
}

//get SKills array
function getSkills() {
  let checkedSkills = [];
  skillsCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedSkills.push(checkbox.value);
    }
  });
  return checkedSkills;
}


requirementsBtn.addEventListener('click', (e) => {

  e.preventDefault();
  let maidGender = getGender();
  let maidEmpNature = getEmpNature();
  let checkedSkills = getSkills();

  if (maidGender == undefined || maidEmpNature == undefined || checkedSkills.length == 0) {
    alert("please fill all the categeroies");
  } else {
    $.ajax({
      type: "GET",
      url: `/houseowner/searchByRequirements/`,
      contentType: "application/json",
      // data: JSON.stringify({ searchInput: searchInput }),
      data: ({
        maidGender: maidGender,
        maidEmpNature: maidEmpNature,
        checkedSkills: checkedSkills
      }),
      success: (data) => {
        console.log("Ajax")
        console.log(data);
      }

    })

  }

});

