

const searchForm = document.getElementById("searchForm");
// const searchByRequirementsForm = document.getElementById("searchByRequirementsForm");
const searchByRequirementsBtn = document.getElementById("searchByRequirementsFormBtn");
const searchInput = document.getElementById("searchInput");
const resultList = document.getElementId("result-list")



$(document).ready(() => {

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchInput = $('#searchInput').val();
    $.ajax({
      type: "GET",
      url: `/houseowner/search/`,
      contentType: "application/json",
      // data: JSON.stringify({ searchInput: searchInput }),
      data: ({ searchInput: searchInput }),
      success: (data) => {
        const { searchResults } = data;
        for (let i = 0; i < searchResults.length; i++) {
          console.log(searchResults[i]);
          // const li = `<li class="list-group-item">${searchResults[i].uFName} ${searchResults[i].uLName}</li>`;
          // resultList.append(li);
        }
        // window.href('/houseowner')
      }
    })
  });

  








  // searchInput.addEventListener('onkeyup',(e)=>{
  //   console.log(searchInput.value);
  // })



});