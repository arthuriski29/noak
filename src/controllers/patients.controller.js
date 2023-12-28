const errorHandler = require('../helpers/errorHandler.helper');
const patientsModel = require('../models/patients.model');
const doctorsModel = require('../models/doctors.model');
const usersModel = require('../models/users.model');
const consultModel = require('../models/consult.model');

exports.getAllPatients = async (req, res) => {
  try {
    const {page, limit, search, sort, sortBy} = req.query;
    
    const patients = await patientsModel.findAll(page, limit, search, sort, sortBy);
    if(!patients){
      throw Error('user_not_found');
    }
    
    return res.json({
      success: true,
      message: 'List of patients',
      results: patients
    });
  } catch (err) {
    return errorHandler(res, err);
  }

}; 
// exports.getAllDoctorsAvailable = async (req, res) => {
//   try {
//     const {page, limit, search, sort, sortBy} = req.query;
    
//     const doctors = await doctorsModel.findAllAvailable(page, limit, search, sort, sortBy);
//     if(!doctors){
//       throw Error('user_not_found');
//     }
    
//     return res.json({
//       success: true,
//       message: 'List of Doctors',
//       results: doctors
//     });
//   } catch (err) {
//     return errorHandler(res, err);
//   }

// }; 

exports.updateConsultQueue = async (req, res) => {
  try {
    const {id, role} = req.user;
    // const doctorRole = 2;
    if(role !== 3) {
      throw Error('unauthorized_role');
    }

    const checkPatients = await usersModel.findByIdAndRole(id, role);
    console.log(checkPatients);
    if(!checkPatients) {
      throw Error('unauthorized_role');
    }
    //harusnya insert ngga sih??

    const {statusValue} = req.body;
    const status = await patientsModel.update(id, statusValue);
    console.log(status);
    if(!status) {
      throw Error('cannot_update_status');
    }

    const doctorsAvail = await doctorsModel.findAllAvailableSortCurrent(1);
    console.log('doctor Sorting by updated at', doctorsAvail);

    if(doctorsAvail) {

      const durationNull = null;
      const statusDuty = 1;
      const updateDutyData = {
        users_id: id,
        duration: durationNull,
        doctor_duty_status_id: statusDuty
      };
      console.log('dataDuty:', updateDutyData);

      const updateDoctor = await doctorsModel.update(updateDutyData); //change isOnDuty
      console.log(updateDoctor);
      if(!doctorsAvail.isOnDuty) {
        throw Error('update_duty_status_error');
      }
      const dataConsult = {
        doctor_id: doctorsAvail.users_id,
        patients_id: id
      };
      const makeConsult = await consultModel.insert(dataConsult);  //insert to consultation_activity
      console.log(makeConsult);

      // const {page, limit, search, sort, sortBy} = req.body;
      const consultActivity = await consultModel.findAllConsult();

      return res.json({
        success: true,
        message: 'List of Doctors',
        results: consultActivity
      });
    }
    // jika doktor

    // banyak data keluarannya harus, dipilih satu dari yang terurut

    // const {users_id, averageDuration} = doctorsAvail
    
    // const queue = await queueModel.insert(id, users_id, averageDuration);
   

    return res.json({
      success: true,
      message: 'List of Doctors',
      results: [status, doctorsAvail]
    });
    
  } catch (err) {
    return errorHandler(res, err);
  }
};


