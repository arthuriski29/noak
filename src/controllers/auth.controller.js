const usersModel = require('../models/users.model');
const patientsModel = require('../models/patients.model');


const jwt = require('jsonwebtoken');
const {APP_SECRET} = process.env;
const argon = require('argon2');
const errorHandler = require('../helpers/errorHandler.helper');

// LOGIN FOR ALL ROLES
exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await usersModel.findOneByEmail(email);
    if(!user){
      throw Error('wrong_credentials');
    }
    const verify = await argon.verify(user.password, password);
    if(!verify){
      throw Error('wrong_credentials');
    }
    const token = jwt.sign({id: user.id, role: user.role_id}, APP_SECRET);
    return res.json({
      success: true,
      message: 'Login success!',
      results: {token}
    });
  } catch (err) {
    return errorHandler(res, err);
  }
};

//REGISTER PATIENT ONLY
exports.register = async (req, res) => {
  try {
    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword) {
      throw Error('password_unmatch');
    }
    const hash = await argon.hash(password);
    const patient = 3;
    const dataUsers = {
      ...req.body,
      role_id: patient,
      password: hash
    };
    

    const user = await usersModel.insert(dataUsers); //insert ke table users
    console.log({user});

    const dataPatients = {
      users_id: user.id,
      patient_status_id: 2
    }; 
    const patients = patientsModel.insert(dataPatients); //insert ke table patients
    console.log(patients);

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