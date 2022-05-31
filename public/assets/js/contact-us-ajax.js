const contactForm = document.getElementById('contact-form');
const contactNameInput = document.getElementById('form-name');
const contactMobileInput = document.getElementById('form-phone');
const contactEmailInput = document.getElementById('form-email');
const contactSubjectInput = document.getElementById('form-subject');
const contactMessageInput = document.getElementById('form-message');

// const messageAlert = document.getElementById('message-alert');


// Show input error message
function showError(input, message) {
  input.classList.add('is-invalid');
  let x = input.parentNode.querySelector('.invalid-feedback')
  x.innerHTML = message;
}

// phone number validation
function validatePhoneNumber(mobileNo) {
  var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(mobileNo);
}
// Check email is valid
function checkEmail(input) {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;
  if (re.test(input.value.trim())) {
    showSuccess(input);
    return true;
  } else {
    showError(input, 'Email is not valid');
    return false;
  }
}
// // Check required fields
function checkRequired(inputArr) {
  let arrResult = true
  inputArr.forEach(function (input) {
    if (input.value.trim() === '') {
      showError(input, ` is required`);
      arrResult = false;
    // } else {
    //   showSuccess(input);
    }
  });
  return arrResult;
}

// $(document).ready(() => {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
   
    if (contactMobileInput.value !== '' && !(validatePhoneNumber(contactMobileInput.value)) ){
      
      showError(contactMobileInput, `please enter valid contact no in form of xxx-xxx-xxxx`)
    }

    let requiredStatus = checkRequired([ contactEmailInput, contactSubjectInput, contactMessageInput]);
    console.log(requiredStatus)
    //important-"g-recaptcha-response" is not on the htmll body but its a part of API
    //get the value from recaptcha-response  
    const captcha = document.querySelector('#g-recaptcha-response').value;

    $.ajax({ 
      type: 'POST',
      contentType:'application/json' ,
      data: JSON.stringify({
        name: contactNameInput.value,
        phone: contactMobileInput.value,
        email: contactMobileInput.value,
        subject: contactSubjectInput.value,
        message: contactMessageInput.value,
        captcha: captcha
      }),
      success: (data) => {

        $('#message-alert').html('');

        const alertElement =
          ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
           id="alert-role" >
           <strong id="message-area">${xhr.status}:${data.msg}</strong>
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>
        `;

        $('#message-alert').html(alertElement);
        $('#message-alert').show();

      },
      error: (xhr) => {
        let data = xhr.responseJSON;
        $('#message-alert').html('');

        const alertElement =
          ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
           id="alert-role" >
           <strong id="message-area">${xhr.status}:${data.msg}</strong>
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>
        `;

        $('#message-alert').html(alertElement);
        $('#message-alert').show();
      }
    });
  });

// });

  