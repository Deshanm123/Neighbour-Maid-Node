
// const languageTxtInput = document.getElementById('uLanguageTxtInput');



// var languageCheckboxes = document.querySelectorAll("input[type=checkbox][name=uLanguage]");
// languageCheckboxes.forEach((checkbox) => {
//   checkbox.addEventListener('change', (e) => {
//     if (e.target.id == 'uLanguage-other') {
//       if (e.target.checked) {
//         languageTxtInput.style.display = "block";

//       } else {
//         languageTxtInput.style.display = "none";
//         languageTxtInput.value = '';
//       }
//     }
//   });
// });


// function getLanguages() {
//   let checkedLanguages = [];
//   languageCheckboxes.forEach((checkbox) => {
//     if (checkbox.id == 'uLanguage-other') {
//       let inputStr = languageTxtInput.value;
//       let reParttern = /(.+?)(?:,|$)/g; //donot add quotation this REgexp Obj
//       while (item = reParttern.exec(inputStr)) {
//         checkedLanguages.push(item[1].trim());
//       }
//     } else {
//       //   //collect information from other check boxes
//       if (checkbox.checked) {
//         checkedLanguages.push(checkbox.value);
//       }
//     }
//   });
//   return checkedLanguages;
// }


$("#addRow").click(() => {
  var html = '';
  html += '<div id="inputFormRow">';
  html += '<div class="input-group mb-3">';
  html += '<input type="text" name="title[]" class="form-control m-input border-info skill-input" placeholder="Enter title" autocomplete="off">';
  html += '<div class="input-group-append">';
  html += '<button id="removeRow" type="button" class="btn btn-danger" >Remove</button>';
  html += '</div>';
  html += '</div>';

  $('#newRow').append(html);
});

// remove row

$(document).on('click', '#removeRow', (e) => {
  e.target.parentNode.parentNode.remove();
});

const skillInputs = document.querySelectorAll('.skill-input');
function getSkills() {
  let skillArr = [];
  // skills
  skillInputs.forEach((input) => {
    if (input.value.trim() !== "") {
      skillArr.push(input.value);
    }
  })
  return skillArr;

}

$(document).ready(() => {
  $('#message').hide();
  // map
  getLocation();


  $("#maid-service").submit((e) => {

    e.preventDefault();
    let skillArr = getSkills();

    // // user region
    let cityState = $('#txtplacename').text().trim().split(',');
    let city = cityState[0];
    let country = cityState[1];
    // console.log(city);
    // console.log(country);

    $.ajax({
      type: "POST",
      url: "/housemaid/myService/",
      contentType: "application/json",
      data: JSON.stringify({
        userEmpService: $('#employment-nature').val(),
        userSkills: skillArr,
        userLocContinent: $('#txtregion').text(),
        userLocCity: city,
        userLocCountry: country,
        userLatCoords: $('#lat').text(),
        userLongCoords: $('#long').text()

      }),
      success: (res) => {
        $('#message').show();
        $('#message-area').html(res.msg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    })

    //scroll to top


  });


});




    // let checkedLanguages = getLanguages();
    // let maritalStatus = $("input[type='radio'][name='uMaritalStatus']:checked").val();
    // let gender = $("input[type='radio'][name='uGender']:checked").val();


