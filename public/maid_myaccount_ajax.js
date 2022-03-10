
const form = document.getElementById('maid-personal-details-form');


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

// // Check email is valid
// function checkEmail(input) {
//   const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
//   if (re.test(input.value.trim())) {
//     readyToSubmit.push(true);
//     showSuccess(input);
//   } else {
//     readyToSubmit.push(false);
//     showError(input, 'Email is not valid');
//   }
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

// // // Check passwords match
// function checkPasswordsMatch(input1, input2) {
//   if (input1.value !== input2.value) {
//     readyToSubmit.push(false);
//     showError(input2, 'Passwords do not match');
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
// checkbox
const otherLanguagecheckElement = document.getElementById('other');
const languageTxtInput =document.getElementById('uLanguageTxtInput');

// listening to the other check box
otherLanguagecheckElement.addEventListener('change', (e) => {
  if (e.target.checked) {
    // console.log('clicked on other');
    languageTxtInput.style.display = 'block';
  }else{
    // console.log('this should be hidden');
    languageTxtInput.style.display = 'none';
    languageTxtInput.value= '';
  }
})





// Event listeners
form.addEventListener('submit', function (e) {
  e.preventDefault();

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


  // data


  // if (true) {
  //   //allow form submission
  //   $.ajax({
  //     type: "POST",
  //     url: "/register",
  //     contentType: "application/json",
  //     data: JSON.stringify({
  //       email: email.value,
  //       userName: userName.value,
  //       password: password.value,
  //       cPassword: cPassword.value,
  //     })

  //     // do errror hadnling
  //   })

  // }
  // $(document).ready(function () {
  //   $('#uLanguageTxtInput').hide();
  //   $(document).on('change', 'input[type="checkbox"]', function (e) {
  //     console.log(e)
  //     if (e.target.id == "uLanguageTxtInput" && e.target.checked) {
  //       $('#uLanguageTxtInput').show();
  //     } else {
  //       $('#uLanguageTxtInput').hide();
  //     }
  //   });




  console.log(uFName.value);
  console.log(uLName.value)
  console.log(uPAddress.value);
  console.log(uPhone.value);
  console.log(uNIC.value);
  console.log(uDOB.value);
  console.log($("input[type='radio'][name='uGender']:checked").val());
  console.log($("input[type='radio'][name='uMaritalStatus']:checked").val());


  let checkedLanguages = [];
  document.querySelectorAll('.uLanguage').forEach((input) => {
    if (input.checked) {
      if (input.id == 'other') {
        let inputStr = uLanguageTxtInput.value;
        let reParttern =/(.+?)(?:,|$)/g; //donot add quotation this REgexp Obj

        while (item = reParttern.exec(inputStr))
          checkedLanguages.push(item[1].trim());
      }
      // checking values excluding other
      if (input.id !== 'other') {
        checkedLanguages.push(input.value);

      }

    }
  });
  console.log(checkedLanguages);

  //okay
  // console.log(uLanguage.value);
  // console.log(uRegion.value);
  // console.log(uCountry.value)
  // console.log(uState.value);
  console.log(uOverview.value)




});










