
const appointmentDescription = document.getElementById('appointmentDescription');
const appointmentDate = document.getElementById('appointmentDate');
const appointmentTime = document.getElementById('appointmentTime');
// alert(housemaidId);

document.getElementById('appointmentForm').addEventListener('submit', (e) => {
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
    success: (res) => {

      // $('#message').show();
      // $('#message-area').html(res.msg);
    }
  })

  e.preventDefault();
})