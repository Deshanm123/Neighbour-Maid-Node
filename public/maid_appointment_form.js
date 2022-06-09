
const appointmentDescription = document.getElementById('appointmentDescription');
const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');
// alert(housemaidId);

document.getElementById('appointmentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "/houseowner/makeHousmaidInterviewAppointment/",
    contentType: "application/json",
    data: JSON.stringify({
      housemaidId: housemaidId,
      appointmentDescription: appointmentDescription.value,
      appointmentDate: appointmentDate.value,
      appointmentTime: appointmentTime.value,
    }),
    success: (data) => {
      console.log("success");
      // $('#message-alert').html('');
      console.log(data);
      alert(`SuccessFull:${data.msg}`);
      // const alertElement =
      //   ` <div class=" alert alert-${data.msgType} alert-dismissible fade show py-3 text-center" role="alert"
      //  id="alert-role" >
      //  <strong id="message-area">${data.msg}</strong>
      //  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      //  <span aria-hidden="true">&times;</span>
      //  </button>
      //  </div>
      //  `;
      // $('#message-alert').html(alertElement);
      // $('#message-alert').show();
    },
    error: (data) => {
      alert(`Error:${data.msg}`);

    }
  })

})