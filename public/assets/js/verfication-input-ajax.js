
const form = document.getElementById('verification-form');
const verificationInput = document.getElementById('verification-input');

const messageAlert = document.getElementById('message-alert');


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


// // Check required fields
// function checkRequired(inputArr) {
//   let arrResult = true;
//   inputArr.forEach((input) => {
//     if (input.value.trim() === '') {
//       showError(input, `${input.id} is required`);
//       arrResult = false;
//     } else {
//       showSuccess(input);
//     }
//   });
//   return arrResult;
// }

// $(document).ready(() => {
//   $('#message-alert').hide();
// });


// Event listeners
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let verificationCodeInput = verificationInput.value;
  let verificationCharacterCount = 7;
  var url = window.location.href;

  // alert(url);


  if (verificationCodeInput.length == verificationCharacterCount) {
    $.ajax({
      type: "POST",
      // url: "/user/verifyUser/",
      url: url,
      contentType: "application/json",
      data: JSON.stringify({
        verificationCodeInput: verificationCodeInput,
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
    })

  } else {
    showError(verificationInput, `please enter 7 digits code to verify  that`);
  }
});










