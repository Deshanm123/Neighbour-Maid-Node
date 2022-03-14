
const updateForm = document.getElementById('maid-personal-update-form');


// const uId = document.getElementById('uId');
const uFName = document.getElementById('uFName');
const uLName = document.getElementById('uLName');
const uPAddress = document.getElementById('uPAddress');
const uPhone = document.getElementById('uPhone');
const uNIC = document.getElementById('uNIC');
const uGender = document.getElementById('uGender');
const uMaritalStatus = document.getElementById('uMaritalStatus ');
const uLanguage = document.getElementById('uLanguage');
const uRegion = document.getElementById('region');
const uCountry = document.getElementById('country');
const uState = document.getElementById('city_state');
const uOverview = document.getElementById('uOverview');


// let readyToSubmit = [];

// Show input error message
// function showError(input, message) {
//   input.classList.add('is-invalid');
//   let x = input.parentNode.querySelector('.invalid-feedback')
//   x.innerHTML = message;
// }

// // Show success outline
// function showSuccess(input) {
//   input.classList.add('is-valid')
// }


// // Check required fields
// function checkRequired(inputArr) {
//   inputArr.forEach(function (input) {

//     if (input.value.trim() === '') {
//       readyToSubmit.push(false);
//       showError(input, `${getFieldName(input)} is required`);
//     } else {
//       readyToSubmit.push(true);
//       showSuccess(input);
//     }
//   });
// }

// // // Check input length
// function checkLength(input, min, max) {
//   if (input.value.length < min) {
//     readyToSubmit.push(false);
//     showError(
//       input,
//       `${getFieldName(input)} must be at least ${min} characters`
//     );
//   } else if (input.value.length > max) {
//     readyToSubmit.push(false);
//     showError(
//       input,
//       `${getFieldName(input)} must be less than ${max} characters`
//     );
//   } else {
//     readyToSubmit.push(true);
//     showSuccess(input);
//   }
// }



// // Get fieldname
// function getFieldName(input) {
//   let nameStr;
//   if (input.id == cPassword) {
//     nameStr = "confirm password";
//   }
//   else if (input.id == userName) {
//     str = "User Name";
//   } else {
//     nameStr = input.id
//   }
//   return nameStr;
// }

// id regex =^([0-9]{9}[x|X|v|V]|[0-9]{12})$ //new and old


// checkbox

const languageTxtInput = document.getElementById('uLanguageTxtInput');



var languageCheckboxes = document.querySelectorAll("input[type=checkbox][name=uLanguage]");
languageCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', (e) => {
    if (e.target.id == 'uLanguage-other') {
      if (e.target.checked) {
        languageTxtInput.style.display = "block";

      } else {
        languageTxtInput.style.display = "none";
        // please donot make inputt ='' in here
      }
    }
  });
});


function getLanguages() {
  let checkedLanguages = [];
  languageCheckboxes.forEach((checkbox) => {
    if (checkbox.id == 'uLanguage-other') {
      let inputStr = languageTxtInput.value;
      let reParttern = /(.+?)(?:,|$)/g; //donot add quotation this REgexp Obj
      while (item = reParttern.exec(inputStr)) {
        checkedLanguages.push(item[1].trim());
      }
    } else {
      //   //collect information from other check boxes
      if (checkbox.checked) {
        checkedLanguages.push(checkbox.value);
      }
    }
  });
  return checkedLanguages;
}





$(document).ready(() => {

  $('#message').hide();

  // let languageTxtInput = document.getElementById('uLanguageTxtInput');
  // var languageCheckboxes = document.querySelectorAll("input[type=checkbox][name=uLanguage]");

  // languageCheckboxes.forEach((checkbox) => {
  //   checkbox.addEventListener('change', (e) => {
  //     if (e.target.id == 'uLanguage-other') {
  //       if (e.target.checked) {
  //         languageTxtInput.style.display = "block" ;
  //       }
  //     }
  //         // $('#uLanguageTxtInput').show();



  //   });
  // });





  updateForm.addEventListener('submit', function (e) {

    e.preventDefault();

    let checkedLanguages = getLanguages();
    let maritalStatus = $("input[type='radio'][name='uMaritalStatus']:checked").val();
    let gender = $("input[type='radio'][name='uGender']:checked").val();

    // getting values
    // console.log(checkedLanguages);
    // console.log(maritalStatus);
    // console.log(gender);

    // need reset after submit othervise repeatition occur

    // checkRequired([userName, email, password, cPassword]);
    // checkLength(userName, 3, 15);
    // checkLength(password, 6, 25);
    // checkEmail(email);
    // checkPasswordsMatch(password, cPassword);
    // let res = true;
    // readyToSubmit.forEach(flag => {
    //   res = flag && res;
    // });
    // //resetting  
    // readyToSubmit = [];

    // if (true) {
    // allow form submission
    $.ajax({
      type: "PUT",
      url: "/housemaid/myAccount/edit",
      contentType: "application/json",
      data: JSON.stringify({
        id: 222,
        uFName: uFName.value,
        uLName: uLName.value,
        uDOB: uDOB.value,
        uPAddress: uPAddress.value,
        uPhone: uPhone.value,
        uNIC: uNIC.value,
        uMaritalStatus: maritalStatus,
        uGender: gender,
        uLanguage: checkedLanguages,
        uOverview: uOverview.value
      }),
      success: (res) => {
        $('#message').show();
        $('#message-area').html(res.msg);
      }
    })
  });
  // });

});