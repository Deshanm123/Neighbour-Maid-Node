const paymentUploadForm = document.getElementById('houseowner-proof-of-payment-upload-form');
const paymentInput = document.getElementById('payment-input');

const paymentName = document.getElementById("payment-name");
const paymentStatus = document.getElementById("payment-status");

paymentUploadForm.addEventListener('submit',  (e)=> {
  e.preventDefault();
  console.log("form  called")
  // representing formdata
  let formData = new FormData();
  // get the file  friom input
let paymentFile = paymentInput.files[0];
  console.log(paymentInput.files[0]);
// should be same as input file name in te form
  formData.append('payment', paymentFile)
  


  $.ajax({
    type: "POST",
    url: "/houseowner/upgradePackage",
    contentType: "multipart/form-data",
    data: formData, //donot stringify the formdat
    contentType: false,
    processData: false,
    success: (data) => {
      $('#message-alert').html('');
      const alertElement =
        ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
                id="alert-role" >
                <strong id="message-area">${data.msg}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>;
             `;
             $('#message-alert').html(alertElement);
             $('#message-alert').show();
             paymentName.innerHTML = data.file;
             paymentStatus.innerHTML = 'pending';
             paymentInput.value = '';
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
              </div>;
            `;
      $('#message-alert').html(alertElement);
      $('#message-alert').show();
    }

  })
})




// const deleteCvForm = document.getElementById("remove-cv-form");
// deleteCvForm.addEventListener('submit', (e) => {
//   console.log("ajax");
//   e.preventDefault();
//   $.ajax({
//     type: "DELETE",
//     url: "/citizen/nid/cv",
//     contentType: "multipart/form-data",
//     contentType: false,
//     processData: false,
//     success: (data) => {
//       console.log(data);
//       $('#message-alert').html('');
//       const alertElement =
//         ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
//                 id="alert-role" >
//                 <strong id="message-area">${data.msg}</strong>
//                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                   <span aria-hidden="true">&times;</span>
//                 </button>
//               </div>;
//              `;
//       $('#message-alert').html(alertElement);
//       $('#message-alert').show();
//       certificateName.innerHTML = '';
//       certificateStatus.innerHTML = '';
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     },
//     error: (data) => {
    
//       $('#message-alert').html('');
//       const alertElement =
//         ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
//                 id="alert-role" >
//                 <strong id="message-area">${data.msg}</strong>
//                 <button type="button" class="close" data-dismiss="alert" aria-label="Close">
//                   <span aria-hidden="true">&times;</span>
//                 </button>
//               </div>;
//             `;
//       $('#message-alert').html(alertElement);
//       $('#message-alert').show();
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }

//   })

// })

