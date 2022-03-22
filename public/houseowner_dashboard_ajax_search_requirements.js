

const searchForm = document.getElementById("searchForm");
// const searchByRequirementsForm = document.getElementById("searchByRequirementsForm");
const requirementsBtn = document.getElementById("requirementsBtn");
const genderRadioBtns = document.querySelectorAll(`input[type="radio"][name=uGender]`);
const empNatureRadioBtns = document.querySelectorAll(`input[type="radio"][name=uEmpNature]`);
const skillsCheckBoxes = document.querySelectorAll(`input[type="checkbox"][name=skillsCheckBox]`);


// function getRadioValue(input) {
//   let result;
//   input.forEach((radioBtn)=>{
//     if (radioBtn.checked) {
//       maidGender = radioBtn.value;
//     }
//   });
//   return result;
// }
function getGender() {
  let maidGender;
  genderRadioBtns.forEach((genderRadioBtn) => {
    if (genderRadioBtn.checked) {
      maidGender = genderRadioBtn.value;
    }
  });
  return maidGender;
}

function getEmpNature() {
  let maidEmpNature;
  empNatureRadioBtns.forEach((empNatureRadioBtn) => {
    if (empNatureRadioBtn.checked) {
      maidEmpNature = empNatureRadioBtn.value;
    }
  });
  return maidEmpNature;
}

//get SKills array
function getSkills() {
  let checkedSkills = [];
  skillsCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedSkills.push(checkbox.value);
    }
  });
  return checkedSkills;
}

function displayAlert(msg) {
  document.getElementById("message").innerHTML =
    `
        <div class="alert alert-danger alert-dismissible fade show py-3 text-center" role="alert" id="alert-role"
              id="message">
              <strong id="message-area">${msg}s</strong>

              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
        `
}


requirementsBtn.addEventListener('click', (e) => {

  e.preventDefault();
  let maidGender = getGender();
  let maidEmpNature = getEmpNature();
  let checkedSkills = getSkills();
  // $('#message').hide();
  if (maidGender == undefined || maidEmpNature == undefined || checkedSkills.length == 0) {
    displayAlert('please select all the categeroies');

  } else {
    $.ajax({
      type: "POST",
      url: `/houseowner/searchByRequirements/`,
      contentType: "application/json",
      // data: JSON.stringify({ searchInput: searchInput }),
      data: JSON.stringify({
        maidGender: maidGender,
        maidEmpNature: maidEmpNature,
        checkedSkills: checkedSkills
      }),
      success: (data) => {

        const layout = document.createElement("div");
        layout.className = "container-fluid";
        const table = document.createElement('table')

        table.className = " table bg-white";
        table.innerHTML = `<thead class="bg-light">
                        <tr>
                          <th>Name</th>
                          <th>Marital Status</th>
                          <th>City</th>
                          <th>Mobile</th>
                          <th>Actions</th>
                        </tr>
                      </thead>`;
        //  const tr = document.creatElement('tr');
        //     // console.log(data)
        data.forEach(housemaid => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
                      <tr>
                          <td><p>${housemaid.uFName} ${housemaid.uLName}<p> </td>
                          <td><p>${housemaid.uMaritalStatus}<p> </td>
                          <td><p>${housemaid.uFName} ${housemaid.uLName}<p> </td>
                          <td><p>${housemaid.uMobile}<p> </td>
                          <td>
                          <p><span class="badge badge-pill badge-success">Message</span><p> 
                          <p><span class="badge badge-pill badge-primary">
                             <a href="/houseowner/${housemaid.userId}" class="btn btn-primary stretched-link">View Portifolio</a>
                          </span><p> 
                          </td>
                      </tr>
                      `;

          table.append(tr);
        });
        layout.append(table);


        //           <td>
        //             <div class="d-flex ">
        //               <img
        //                   src="https://mdbootstrap.com/img/new/avatars/8.jpg"
        //                   alt=""
        //                   style="width: 45px; height: 45px"
        //                   class="rounded-circle"
        //                   />
        //               <div class="ms-3">
        //                 <p class="fw-bold mb-1">John Doe</p>
        //                 <p class="text-muted mb-0">john.doe@gmail.com</p>
        //               </div>
        //             </div>
        //           </td>

        //           <td>
        //             <p class="fw-normal mb-1 text-center">Software engineer</p>
        //             <p class="text-muted mb-0 text-center">IT department</p>
        //           </td>

        //           <td>
        //             <span class="badge badge-success rounded-pill d-inline text-center">Active</span>
        //           </td>

        //           <td>Senior</td>

        //           <td>
        //             <button type="button" class="btn btn-link btn-sm btn-rounded text-center">
        //               Edit
        //             </button>
        //           </td>

        //         </tr>

        //       </tbody>
        // </table>


        //       `;





        console.log(layout)



        // window.location.assign('/houseowner/');
        // window.location.href = data;
        // console.log('data')

        $('#maidsBoard').html(layout);

      },
      error: (error) => {
        const { responseJSON } = error;
        displayAlert(responseJSON.error);
      }

    })

  }

});

