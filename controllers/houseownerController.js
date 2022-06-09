const Houseowner = require('../models/Houseowner');
const Housemaid = require('../models/Housemaid');
const moment = require('moment');

// mongoose
// const mongoose = require('mongoose');
// const uri = 'mongodb+srv://deshanm123:YdG5JMjZ9AE2Hvr6@cluster0.ufsym.mongodb.net/neighbourMaidChat?retryWrites=true&w=majority';
const Appointment = require('../models/Appointment');
// mongoose




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
exports.getMaidPortiolioView = async (req, res) => {
  try {
    console.log("RES LOCLS")
    console.log(res.locals)
    let currenthouseOwnerId = res.locals.user.userId;
    let currenthouseOwnerPackage = res.locals.housemaidPackage;
    console.log('houseowner package' + currenthouseOwnerPackage);
    if (currenthouseOwnerPackage == 'consumer-package') {

      // console.log(currenthouseOwnerId);
      const { maidId } = req.params;
      console.log(maidId);
      let searchResults = await Housemaid.getMaidPortfolioDetails(maidId);
      console.log(searchResults);

      //   // res.status(200).send({ searchResults: searchResults });

      res.status(200).render('houseowner/maid-my_Portifolio', { portifolioDetails: searchResults, currenthouseOwnerId: currenthouseOwnerId })
      //   // res.status(200).send({ searchResults: searchResults });
    } else {
      console.log("direct to upgrade")
      res.status(200).redirect('/houseowner/upgradePackage');
    }

  } catch (e) {
    console.log(e);
  }

}


// exports.getRequirementSearchResults = async (req, res) => {

//   // // have to select values for each field it's a must
//   const { maidGender, maidEmpNature, checkedSkills } = req.query;
//   // console.log(checkedSkills);

//   let filteredFinalArr = [];
//   let searchResults = await Houseowner.searchByGenderAndEmpConditions(maidGender, maidEmpNature);
//   if (searchResults.length > 0) {
//     searchResults.forEach(user => {
//       // creating object to iterate
//       let userSkillsObj = user.userSkills;
//       console.log(userSkillsObj)

//       // extracting a single skill using loop
//       Object.values(userSkillsObj).forEach(skill => {
//         for (let i = 0; i < checkedSkills.length; i++) {
//           // matching skills that donot belong to Other category
//           // if at least one matches 
//           let skillInLowerCase = skill.toLowerCase();
//           if (checkedSkills[i].toLowerCase() == skillInLowerCase) {
//             filteredFinalArr.push(user)
//             break;
//           };
//           if (checkedSkills.includes('Other')) {
//             if (checkedSkills[i].toLowerCase() !== 'cleaning' || checkedSkills[i].toLowerCase() !== 'laundering' || checkedSkills[i].toLowerCase() !== 'cooking') {
//               filteredFinalArr.push(user)
//               break;
//             }
//           }
//         }

//       });
//     });
//     //   console.log("Final Filtered user Objects");
//     //   console.log(filteredFinalArr);
//     res.status(200).render('houseowner/houseowner-dashboard', { housemaids: searchResults, page: '', pageCount: '' });
//     // res.send(filteredFinalArr);

//   } else {
//     res.send("no results");
//   }

// }





exports.postRequirementSearchResults = async (req, res) => {

  // // have to select values for each field it's a must
  const { maidGender, maidEmpNature, checkedSkills } = req.body;
  try {

    let searchResults = await Houseowner.searchByGenderAndEmpConditions(maidGender, maidEmpNature);
    let filteredFinalArr = [];
    //  console.log(searchResults)
    if (searchResults.length > 0) {
      searchResults.forEach(user => {
        //     // creating object to iterate
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
      });
      //   //   //   console.log("Final Filtered user Objects");
      console.log(filteredFinalArr);
      // res.status(200).render('houseowner/houseowner-dashboard', {
      //   housemaids: result , page: '', pageCount: ''
      // });
      res.status(200).send(filteredFinalArr);
    } else {
      // res.status(400).send({ error: 'Something failed!' });
      res.status(400).json({ error: 'No data' });
    }
  } catch (e) {
    console.log(e);
  }

}


// chat
exports.getChat = async (req, res) => {
  try {
    console.log("RES LOCLS")
    console.log(res.locals)
    let currenthouseOwnerId = res.locals.user.userId;
    let currenthouseOwnerPackage = res.locals.housemaidPackage;
    console.log('houseowner package' + currenthouseOwnerPackage);
    if (currenthouseOwnerPackage == 'consumer-package') {

      // console.log(currenthouseOwnerId);



      //   // res.status(200).send({ searchResults: searchResults });

      res.status(200).render('houseowner/chat-interface');
      //   // res.status(200).send({ searchResults: searchResults });
    } else {
      console.log(" observer package direct to upgrade")
      res.status(200).redirect('/houseowner/upgradePackage');
    }

  } catch (e) {
    console.log(e);
  }

}
// vide chat
exports.getVideoChat = (req, res) => {
  try {
    console.log("RES LOCLS")
    console.log(res.locals)
    let currenthouseOwnerId = res.locals.user.userId;
    let currenthouseOwnerPackage = res.locals.housemaidPackage;
    console.log('houseowner package' + currenthouseOwnerPackage);
    if (currenthouseOwnerPackage == 'consumer-package') {

      let currentId = res.locals.user.userId;
      let housemaidId = req.params.housemaidId;


      res.status(200).render('houseowner/chat-interface');
      //   // res.status(200).send({ searchResults: searchResults });
    } else {
      console.log(" observer package direct to upgrade")
      res.status(200).redirect('/houseowner/upgradePackage');
    }

  } catch (e) {
    console.log(e);
  }




}












// make housemaid interview appointment
exports.postInterviewAppointment = (req, res) => {


  let utcDatetime = req.body.appointmentDate + " " + req.body.appointmentTime
  let localDatetime = moment(utcDatetime + '+00:00').utc().format('YYYY-MM-DD HH:mm:ss');

  const appointment = new Appointment({
    housemaidId: req.body.housemaidId,
    houseownerId: res.locals.user.userId,
    appointmentDescription: req.body.appointmentDescription,
    appointmentDateandTime: localDatetime
    // appointmentDateandTime: date
  });

  appointment.save(function (err, doc) {
    if (err) return console.error(err);
    console.log("Document inserted succussfully");
    // utc stores get current time 
    // console.log(doc.appointmentDateandTime.toLocaleString());
  });

}

exports.getUpgradePackage = async (req, res) => {
  try {
    let user = res.locals.user;
    let results = await Houseowner.getProofOfPayment(user.userId)
    console.log(results)
    if (results.length > 0) {
      res.render('houseowner/houseowner-upgrade-package', { payment: results[0] })
    } else {
      res.render('houseowner/houseowner-upgrade-package', { payment: '' })
    }
  } catch (err) {
    console.log(err)
  }
}

exports.postUpgradePackage = async (req, res) => {
  try {
    console.log("upload proof of paymnt")
    let user = res.locals.user;
    console.log(user)
    console.log(req.file);
    let fileName = req.file.filename;

    let result = await Houseowner.uploadProofOfPayment(user.userId, fileName, 'pending')
    console.log(result)
    if (result.affectedRows > 0) {
      console.log("submiited");
      res.status(201).send({ msgType: "success", msg: `Congratulations! your  PAYMENT  has successfully uploaded `, file: fileName });
    } else {
      console.log(" not submiited");
      // not acceptable 
      res.status(406).send({ msgType: "danger", msg: `PAYMENT UPLOAD FAIL : your PAYMENT is not uploaded.` });
    }
  } catch (err) {
    console.log(err);
    if (err.code === 'ER_DUP_ENTRY') {
      // duplicate entry handled by 304 :not modified status code
      res.status(406).send({ msgType: "danger", msg: `PAYMENT UPLOAD FAIL : ERROR PAYMENT is already uploaded` });

    } else {
      // conflict -not sure
      res.status(409).send({ msgType: "danger", msg: `PAYMENT UPLOAD FAIL :ERROR ${err.message}` });
    }
  }
}












