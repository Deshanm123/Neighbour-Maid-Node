
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
  html += '<input type="text" name="title[]" class="form-control m-input border-info new-skill-input" placeholder="Enter title" autocomplete="off" >';
  html += '<div class="input-group-append">';
  html += '<button id="removeRow" type="button" class="btn btn-danger" >Remove</button>';
  html += '</div>';
  html += '</div>';

  $('#newRow').append(html);
});

// remove row

$(document).on('click', '#removeRow', (e) => {
  console.log("remove clicked")
  // update function different than add
  const selectedInputIdForm = e.target.parentNode.parentNode;
  selectedInputIdForm.querySelector('.skill-input').value = '';
  selectedInputIdForm.remove();

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


function getNewSkills() {
  const newSkillInputs = document.querySelectorAll('.new-skill-input');
  let newArr = [];
  // skills
  newSkillInputs.forEach((input) => {
    if (input.value.trim() !== "") {
      newArr.push(input.value);
    }
  })
  return newArr;

}

$(document).ready(() => {
  $('#message').hide();
  getLocation()



  $("#maid-service-update").submit((e) => {

    e.preventDefault();

    let skillArr = getSkills();

    let newSkillsArr = getNewSkills();
    // new array with duplications
    let filteredSkillArray = [...new Set([...skillArr, ...newSkillsArr])];
    // console.log(filteredSkillArray);

    // // user region
    let cityState = $('#txtplacename').text().trim().split(',');
    let city = cityState[0];
    let country = cityState[1];




    $.ajax({
      type: "PUT",
      url: "/housemaid/myService/edit",
      contentType: "application/json",
      data: JSON.stringify({
        userEmpService: $('#employment-nature').val(),
        userSkills: filteredSkillArray,
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


