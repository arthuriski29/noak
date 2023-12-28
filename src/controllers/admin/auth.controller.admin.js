const usersModel = require('../../models/users.model');
const doctorsModel = require('../../models/doctors.model');


const jwt = require('jsonwebtoken');
const {APP_SECRET} = process.env;
const argon = require('argon2');
const errorHandler = require('../../helpers/errorHandler.helper');

//REGISTER PATIENT ONLY
exports.register = async (req, res) => {
  try {
    const {role} = req.user;
    if(role !== 1) {
      throw Error('unauthorized_user');
    }

    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword) {
      throw Error('password_unmatch');
    }
    const hash = await argon.hash(password);
    const dataUser = {
      ...req.body,
      password: hash
    };
    const user = await usersModel.insert(dataUser); //insert ke table users
    console.log(user);

    

    const dataDoctor = {
      users_id: user.id,
      doctor_status_id: 2
    };

  
    const doctor = await doctorsModel.insertDefault(dataDoctor); //insert ke table doctors
    console.log(doctor);

    // const doctorDur = await doctorsModel.insertIdToDuration(user.id);
    // console.log(doctorDur);
    
    const token = jwt.sign({id: user.id, role: user.role_id}, APP_SECRET);
    return res.json({
      success: true,
      message: 'Register success!',
      results: {token}
    });
  } catch (err){
    return errorHandler(res, err);
  }
};