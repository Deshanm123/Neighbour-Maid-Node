const { forEach } = require('lodash');
const Houseowner = require('../models/Houseowner');
const { search } = require('../routes/houseownerRoutes');





// getting userId,userName and profile pic of housmeaids
exports.getsimpleDashboardView = async (req, res) => {

  // let results = await Houseowner.viewAvialableMaids();
  // Promise.all(await results.map(async (maid) => {
  //   // console.log(maid);   
  //   let profileImg = await Houseowner.getMaidProfilebyId(maid.userId);
  //   // console.log(profileImg)  
  //   if (profileImg.length > 0) {
  //     maid['profileImg'] = profileImg[0].profileImg;
  //     // console.log("has images "+profileImg[0].profileImg);   
  //   } else {
  //     maid['profileImg'] = '';
  //   }
  //   return maid;
  // })).then(val => {
  //   res.status(200).render('houseowner/houseowner-dashboard', { housemaids: val });
  // });

  //new metthod
  try {
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page < 1) {
      res.status(200).redirect('/houseowner/?page=' + encodeURIComponent(1));
    } else {
      let results = await Houseowner.populateDashboard(page);
      res.status(200).render('houseowner/houseowner-dashboard', { housemaids: results.result, page: results.page, pageCount: results.numOfPages })
    }
  } catch (err) {
    console.log(err);
  }

}



// searching function
exports.getSearchResults = async (req, res) => {
  // console.log(req.query);
  const { searchInput } = req.query;
  console.log("searching  query term :" + searchInput);
  try {
    let searchResults = await Houseowner.searchOne(searchInput);
    console.log(searchResults);
    // res.status(200).send({ searchResults: searchResults });

    res.status(200).render('houseowner/houseowner-dashboard', { housemaids: searchResults, page: '', pageCount: '' })
    // res.status(200).send({ searchResults: searchResults });

  } catch (e) {
    console.log(e);
  }

}


exports.getRequirementSearchResults = async (req, res) => {

  // have to select values for each field it's a must
  const { maidGender, maidEmpNature, checkedSkills } = req.query;
  console.log(checkedSkills);

  let filteredFinalArr = [];
  let searchResults = await Houseowner.searchByGenderAndEmpConditions(maidGender, maidEmpNature);
  if (searchResults.length > 0) {

    searchResults.forEach(user => {
      // creating object to iterate
      let userSkillsObj = user.userSkills;
      // console.log(userSkillsObj)

      // extracting a single skill using loop
      Object.values(userSkillsObj).forEach(skill => {
        for (let i = 0; i < checkedSkills.length; i++) {
          // matching skills that donot belong to Other category
          // if at least one matches 
          let skillInLowerCase = skill.toLowerCase();
          if (checkedSkills[i].toLowerCase() == skillInLowerCase) {
            filteredFinalArr.push(user)
            break;
          };
          if (checkedSkills.includes('Other')) {
            if (checkedSkills[i].toLowerCase() !== 'cleaning' || checkedSkills[i].toLowerCase() !== 'laundering' || checkedSkills[i].toLowerCase() !== 'cooking') {
              filteredFinalArr.push(user)
              break;
            }
          }
        }

      });
      // console.log("user skills")
    });
    console.log("Final Filtered user Objects");
    console.log(filteredFinalArr);
    // res.status(200).render('houseowner/houseowner-dashboard', { housemaids: filteredFinalArr, page: '', pageCount: '' })
    res.send(filteredFinalArr);

  } else {
    res.send("no results");
  }

}
