const errorHandler = require('../helpers/errorHandler.helper');
const doctorsModel = require('../models/doctors.model');
const usersModel = require('../models/users.model');

exports.getAllDoctors = async (req, res) => {
  try {
    const {page, limit, search, sort, sortBy} = req.query;
    
    const doctors = await doctorsModel.findAll(page, limit, search, sort, sortBy);
    if(!doctors){
      throw Error('user_not_found');
    }
    
    return res.json({
      success: true,
      message: 'List of Doctors',
      results: doctors
    });
  } catch (err) {
    return errorHandler(res, err);
  }

}; 
exports.getAllDoctorsAvailable = async (req, res) => {
  try {
    const {page, limit, search, sort, sortBy} = req.query;
    
    const doctors = await doctorsModel.findAllAvailable(page, limit, search, sort, sortBy);
    if(!doctors){
      throw Error('user_not_found');
    }
    
    return res.json({
      success: true,
      message: 'List of Doctors',
      results: doctors
    });
  } catch (err) {
    return errorHandler(res, err);
  }

}; 

exports.updateDoctors = async (req, res) => {
  try {
    const {id, role} = req.user;
    // const doctorRole = 2;
    if(role !== 2) {
      throw Error('unauthorized_role');
    }

    console.log('req usernya bosqu', req.user);
    console.log('req body object nya', req.body);
    const checkDoctor = await usersModel.findByIdAndRole(id, role);
    console.log(checkDoctor);
    if(!checkDoctor) {
      throw Error('unauthorized_role');
    }

    const duration = parseInt(req.body.durationValue);
    const durationIntv = duration ? `${duration} m` : null;
    const status = req.body.statusValue;

    console.log(`status nya dalam integer, data type: ${typeof status}, status: ${status}`);
    console.log(`duration nya dalam integer, data type: ${typeof duration}, duration: ${duration}`);
    console.log(`durationIntv nya dalam string, data type: ${typeof durationIntv}, durationIntv: ${duration}`);

    const update = await doctorsModel.update(id, durationIntv, status);
    console.log(update);
    if(!update.duration) {
      throw Error('update_duration_error');
    }
    if(!update.doctor_status_id) {
      throw Error('update_status_error');
    }

    const doctors = await doctorsModel.findOneByUserId(id);

    return res.json({
      success: true,
      message: 'List of Doctors',
      results: doctors
    });
    
  } catch (err) {
    return errorHandler(res, err);
  }
};