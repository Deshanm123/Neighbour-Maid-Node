
const form = document.getElementById('login-form');
const email = document.getElementById('email');
const password = document.getElementById('password');


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
    showError(input, 'Email format is not valid');
  }
}

// Check required fields
function checkRequired(inputArr) {
  inputArr.forEach(function (input) {
    if (input.value.trim() === '') {
      readyToSubmit.push(false);
      showError(input, `${input.id} is required`);
    } else {
      readyToSubmit.push(true);
      showSuccess(input);
    }
  });
}
// function resetFields(inputArr) {
//   inputArr.forEach(function (input) {
//     if (input.classList.contains('is-invalid')) {
//       console.log('reset invalid')
//       let x = input.parentNode.querySelector('.invalid-feedback');
//       x.innerHTML = '';
//       inputArr.classList.remove('is-invalid');
//     }
//     if (input.classList.contains('is-valid')) {
//       inputArr.classList.contains('is-valid');
//       console.log('reset valid');
//     }
//   });
//   console.log('reset');
// }

// // Check input length
function checkLength(input, min, max) {
  if (input.value.length < min) {
    readyToSubmit.push(false);
    showError(
      input,
      `${input.id} must be at least ${min} characters`
    );
  } else if (input.value.length > max) {
    readyToSubmit.push(false);
    showError(
      input,
      `${input.id} must be less than ${max} characters`
    );
  } else {
    readyToSubmit.push(true);
    showSuccess(input);
  }
}



// Event listeners
form.addEventListener('submit', function (e) {
  e.preventDefault();
  // resetFields([email, password]);
  checkRequired([email, password]);
  checkLength(password, 6, 25);
  checkEmail(email);

  let res = true;
  readyToSubmit.forEach(flag => {
    res = flag && res;
  });
  //resetting  
  readyToSubmit = [];

  if (res) {
    //allow form submission
    $.ajax({
      type: "POST",
      url: "/user/loginUser",
      contentType: "application/json",
      data: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
      success: (data) => {

        let url;
        if (data.userType.toLowerCase() == 'housemaid') {
          url = '/housemaid/';
        }
        else if (data.userType.toLowerCase() == 'houseowner') {
          url = '/houseowner/';
        } else {
          url = ''
        }

        console.log("url  value is " + url);
        url != '' ? window.location.assign(url) : console.log("Invalid url")
        // window.location.assign(`/${JSON.parse(data).userType}/`);


        // }
        // if (JSON.parse(data).userType == 'houseowner'){
        // window.location.assign('/houseowner/');
        // }
        // if (userRole == 'housemaid') {
        //   console.log("housemaid login")
        // }else if(userRole == 'houseowner'){
        // }else{
        //   console.log(data);

      }
      // do errror hadnling
    })

    // fetch('/user/loginUser', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // your expected POST request payload goes here
    //     email: email.value,
    //     password: password.value,
    //   })
    // })
    //   .then((data) => {
    //     data.json();
    //   })
    //   .then((e) => {
    //     console.log(e);
    //   })




  }


});










