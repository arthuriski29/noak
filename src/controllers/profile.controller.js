const errorHandler = require('../helpers/errorHandler.helper');
const usersModel = require('../models/users.model');

exports.getMyProfile = async (req, res) => {
  try {
    const {id} = req.user;
    if(!id){
      throw Error('unauthorized_account');
    }
    
    const myProfile = await usersModel.findOneByIdProfile(id);
    if(!myProfile){
      throw Error('user_not_found');
    }
    
    return res.json({
      success: true,
      message: 'Profile information result',
      results: myProfile
    });
  } catch (err) {
    return errorHandler(res, err);
  }

}; 