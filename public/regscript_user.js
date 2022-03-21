
const form = document.getElementById('registration-form');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const cPassword = document.getElementById('cPassword');
const userType = document.getElementById('userType');


// alert 
const messageAlert = document.getElementById('message-alert')

let readyToSubmit = [];

// Show input error message
function showError(input, message) {
  input.classList.add('is-invalid');
  let x = input.parentNode.querySelector('.invalid-feedback')
  x.innerHTML = message;
}

// Show success outline
function showSuccess(input) {
  input.classList.add('is-valid')
}

// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
  if (re.test(input.value.trim())) {
    readyToSubmit.push(true);
    showSuccess(input);
  } else {
    readyToSubmit.push(false);
    showError(input, 'Email is not valid');
  }
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {

    if (input.value.trim() === '') {
      readyToSubmit.push(false);
      showError(input, `${getFieldName(input)} is required`);
    } else {
      readyToSubmit.push(true);
      showSuccess(input);
    }
  });
}

// // Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    readyToSubmit.push(false);
    showError(
      input,
      `${getFieldName(input)} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    readyToSubmit.push(false);
    showError(
      input,
      `${getFieldName(input)} must be less than ${max} characters`
    );
  } else {
    readyToSubmit.push(true);
    showSuccess(input);
  }
}

// // Check passwords match
function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    readyToSubmit.push(false);
    showError(input2, 'Passwords do not match');
  }
}

// Get fieldname
function getFieldName(input) {
  let nameStr;
  if (input.id == cPassword) {
    nameStr = "confirm password";
  }
  else if (input.id == userName) {
    str = "User Name";
  } else {
    nameStr = input.id
  }
  return nameStr;
}

$(document).ready(() => {
  $('#message-alert').hide();
})
// Event listeners
form.addEventListener('submit', function (e) {
  e.preventDefault();
  checkRequired([userName, email, password, cPassword, userType]);
  checkLength(userName, 3, 15);
  checkLength(password, 6, 25);
  checkEmail(email);
  checkPasswordsMatch(password, cPassword);
  let res = true;
  readyToSubmit.forEach(flag => {
    res = flag && res;
  });
  //resetting  
  readyToSubmit = [];


  // data



  if (res) {
    //allow form submission
    $.ajax({
      type: "POST",
      url: "/user/registerUser",
      contentType: "application/json",
      data: JSON.stringify({
        email: email.value,
        userName: userName.value,
        password: password.value,
        cPassword: cPassword.value,
        userType: userType.value
      }),
      success: (data) => {
        // resetting
        $('#message-alert').html('');
        
        const alertElement =
          ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
            id="alert-role" >
            <strong id="message-area">${data.msg}</strong>

            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>;
        `
        // 

        $('#message-alert').html(alertElement);
        $('#message-alert').show();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      // do errror hadnling
    })

  }


});










