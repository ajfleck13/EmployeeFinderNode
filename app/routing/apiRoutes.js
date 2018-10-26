const employeeList = require('../data/employee.js');

module.exports = function(app) {
  app.get('/api/employees', function(req, res) {
    res.json(employeeList);
  });

  app.post('/api/employees', function(req, res) {
    console.log(req.body);
    let validatedData = ValidateEmployeeData(req.body);
    
    if(validatedData)
    {
      employeeList.push(validatedData);
      res.json({success: true});
    }
    else
    {
      res.json({error: "Data Invalid"});
    }
  });
};

const ValidateEmployeeData = function(data) {
  if(!data.name || !(typeof data.name === 'string'))
  {
    return false;
  }

  if(!data.photo || !(typeof data.photo === 'string'))
  {
    return false;
  }

  if(!data.scores || !Array.isArray(data.scores) || data.scores.length != 10)
  {
    return false;
  }

  let validatedData = {
    name: data.name,
    photo: data.photo,
    scores: data.scores,
  }

  return validatedData;
}