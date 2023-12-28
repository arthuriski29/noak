const usersModel = require('../../models/users.model');


const errorHandler = require('../../helpers/errorHandler.helper');

exports.getAllUsers = async (req, res) => {
  try {
    const {page, limit, search, sort, role, sortBy} = req.query;
    const user = await usersModel.findAll(page, limit, search, role, sort, sortBy);
    if(!user) {
      throw Error('user_not_found');
    }

    return res.json({
      success: true,
      message: 'List of All Users',
      results: user
    });

  } catch (err) {
    return errorHandler(res, err);
  }
};

exports.getOneUserById = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await usersModel.findOneById(id);
    if(!user) {
      throw Error('user_not_found');
    }
    return res.json({
      success: 'true',
      message: 'Users found !',
      results: user
    });

  } catch (err) {
    return errorHandler(res, err);
  }
};