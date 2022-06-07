
const form = document.getElementById('service-category-add-form');
const serviceCategoryDeleteForm = document.getElementById('service-category-remove-form');

const serviceCategoryName = document.getElementById('serviceCategoryName');
const color = document.getElementById('color');


function addCategory(serviceCategoryId, serviceCategoryName, serviceCategoryColor) {
  const tableRow = `
  <tr>
    <!-- name -->
    <td>
      ${serviceCategoryName}
    </td>
    <!-- color -->
    <td>
       <span class="dot" data-color=" ${serviceCategoryColor}"
                            id=" ${serviceCategoryId}"></span>
    </td>
    <td class="text-end">

      <a href="/admin/courses/editCourse/${serviceCategoryId}" type="btn"
        class="btn btn-light btn-small"><i class="bi bi-pencil">edit</i></a>
      <!-- courses/editCourse/<1%=course.courseId%>" -->
      <!-- delete action -->
      <form id="remove-course-form" method="POST"
        action="/admin/courses/${serviceCategoryId}?_method=DELETE" class="d-inline">
        <button type="submit" class="btn btn-light btn-small">
          <i class="bi bi-person-x"></i>
          delete
        </button>
      </form>
    </td>
  </tr>
  `;
  $('#service-table-body').append(tableRow);
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/admin/services/serviceCategory",
    contentType: "application/json",
    data: JSON.stringify({
      serviceCategoryName: serviceCategoryName.value,
      color: color.value
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
      addCategory(service.serviceCategoryId, service.serviceCategoryName, service.serviceCategoryColor)
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
