
const form = document.getElementById('service-category-update-form');
const serviceCategoryName = document.getElementById('serviceCategoryName');
const color = document.getElementById('color');


form.addEventListener('submit', (e) => {
  let formAction = $("#service-category-remove-form").attr('action');
  e.preventDefault();
  $.ajax({
    type: "PUT",
    url: formAction,
    contentType: "application/json",
    data: JSON.stringify({
      serviceCategoryName: serviceCategoryName.value,
      color: color.value
    }),
    success: (data) => {
      window.location = '/admin/services/serviceCategory';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  })


});

serviceCategoryDeleteForm.addEventListener('submit', (e) => {
  let formAction = $("#service-category-remove-form").attr('action');
  console.log(formAction);

  e.preventDefault();
  $.ajax({
    type: "DELETE",
    url: formAction,
    contentType: "application/json",
    data: JSON.stringify({
      serviceCategoryId: formAction.slice(-36)
    }),
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  })


});
