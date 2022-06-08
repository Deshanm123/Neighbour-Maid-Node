

const serviceCategoryDeleteForm = document.getElementById('service-category-remove-form');



serviceCategoryDeleteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let formAction = $("#service-category-remove-form").attr('action');
  console.log(formAction.slice(-36));
 
  $.ajax({
    type: "DELETE",
    // url: formAction.slice,
    url: formAction,
    contentType: "application/json",
    // data: JSON.stringify({
    //   serviceCategoryId: formAction.slice(-36)
    // }),
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
      let service = data.service;
      console.log(service);

    },
    error: (data) => {

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  })


});
