const form = document.getElementById('form-update-course');
const courseCoverPhoto = document.getElementById('course-cover-photo');
const courseIntro = document.getElementById('courseIntro');
const courseTitle = document.getElementById('courseTitle');


// affiliations
$("#addRow").click(() => {
  var html = '';
  html += '<div id="inputFormRow">';
  html += ' <hr/>'
  html += `<div class="d-flex">
            <h2 class="mr-auto p-2">Next Chapter</h2>'
            <button id="removeRow" type="button" class=" p-2 btn btn-danger">Delete this Chapter</button>
          </div>
  `;
  //  chapter description
  html += `
          <div class="form-group">
            <label for="courseDescription">Chapter Description:</label>
            <textarea class="form-control border border-secondary" rows="8" name="course-description"
               id="course-description" required ></textarea>
           </div>
          `;

  // video url
  html += `
          <div class="form-row">
                <label for="basic-url">Your vanity URL</label>
                  <div class="input-group mb-3">
                  <div class="input-group-prepend">
                        <span class="input-group-text border border-secondary" id="basic-addon3">chater video url</span>
                  </div>
                  <input type="text" class="form-control border border-secondary" name="course-video-description" id="course-video-description" aria-describedby="basic-addon3"></div>
          </div>
          `;

  html += '</div>';
  $('#newRow').append(html);
});

// remove row
$(document).on('click', '#removeRow', (e) => {
  e.target.parentNode.parentNode.remove();
});


function getChaptersObject() {
  const courseDescriptionInputs = document.querySelectorAll("#course-description");
  const courseVideoInputs = document.querySelectorAll("#course-video-description");

  // cousse description cannot be empty because  chapter description is a must 
  let chaptersObject = {};
  for (let i = 0; i < courseDescriptionInputs.length; i++) {

    let chaptercontentArr = [];
    chaptercontentArr.push(courseDescriptionInputs[i].value.trim());
    chaptercontentArr.push(courseVideoInputs[i].value.trim())
    chaptersObject[i] = chaptercontentArr;
    // Object.assign(,chaptercontentArr)
    // chaptersArr.push(courseVideoInputs[i].value);
  }
  return chaptersObject;
}




form.addEventListener('submit', (e) => {
  e.preventDefault();

  //use jquery to get the value  of select
  let courseCategoryValue = $('#courseCategory').val();
 
  let chaptersObj = getChaptersObject();
  console.log('chaptersObj')
  console.log(chaptersObj)


  let formData = new FormData();
  formData.append('courseCoverPhoto', courseCoverPhoto.files[0]);
  formData.append('courseTitle', courseTitle.value);
  formData.append('courseIntro', courseIntro.value);
  formData.append('courseCategory', courseCategoryValue);
  formData.append('chapters', JSON.stringify(chaptersObj));
 

  $.ajax({
    type: "PUT",
    // url: "/admin/courses/editCourse/",
    url: window.location.href,
    contentType: "application/json",
    data: formData,
    processData: false,
    contentType: false,

    // data:JSON.stringify({
    //   courseTitle :courseTitle.value,
    //   courseIntro: courseIntro.value,
    //   courseCategory: courseCategoryValue,
    //   chapters: JSON.stringify(chaptersObj)
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
    
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
