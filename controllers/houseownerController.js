const Houseowner = require('../models/Houseowner');





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
      res.status(200).redirect('/houseowner/?page='+encodeURIComponent(1));
    }else{
      let results = await Houseowner.populateDashboard(page);
      res.status(200).render('houseowner/houseowner-dashboard', { housemaids: results.result, page: results.page, pageCount: results.numOfPages })
    }

  } catch (err) {
    console.log(err);
  }

}



// searching function
exports.getSearchResults = async (req, res) => {
  console.log(req.params);

}
