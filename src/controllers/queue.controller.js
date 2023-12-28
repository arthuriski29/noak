const errorHandler = require('../helpers/errorHandler.helper');
const consultModel = require('../models/consult.model');


exports.getAllQueue = async (req, res) => {
  try {
    const queue = await consultModel.findAllConsult();
    if(!queue){
      throw Error('queue_not_found');
    }
    
    return res.json({
      success: true,
      message: 'List of Queue',
      results: queue
    });
  } catch (err) {
    return errorHandler(res, err);
  }

}; 