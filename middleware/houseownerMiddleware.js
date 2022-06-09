const jwt = require('jsonwebtoken');
const Houseowner = require('../models/Houseowner');


const houseownerPackageInfoAccess = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
      if (err) {
        // console.log(err)
        res.locals.user = null;
        // move on to next handler 
        next();
      } else {
        // console.log("decoded Token " + decodedToken.id);
        // user table obtained  via userTb
        let paymentResults = await Houseowner.getProofOfPayment(decodedToken.id);
        console.log("housewoner middleware")
        let housemaidPackage = "observer-package";
        console.log(paymentResults.length);
        if (paymentResults.length > 0) {
          if (paymentResults[0].paymentStatus == "verified")
            housemaidPackage = "consumer-package"
        }
        console.log(housemaidPackage)
        res.locals.housemaidPackage = housemaidPackage;
        next();
      }
    });
  } else {
    // user not logged in
    res.locals.user = null;
    next();
  }
};


module.exports = { houseownerPackageInfoAccess };