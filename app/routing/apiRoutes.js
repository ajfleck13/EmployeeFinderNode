const employeeList = require('../data/employee.js');

module.exports = function(app) {
  app.get('/api/employees', function(req, res) {
    console.log(employeeList);
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
  //Verify name is valid
  if(!data.name || !(typeof data.name === 'string'))
  {
    return false;
  }

  //Verify photo is valid
  if(!data.photo || !(typeof data.photo === 'string'))
  {
    return false;
  }

  //Make sure scores is an array holding 10 values
  if(!data.scores || !Array.isArray(data.scores) || data.scores.length != 10)
  {
    return false;
  }

  //Make sure scores array is holding 10 integers between 1 and 5
  for(let i = 0; i < data.scores.length; i++)
  {
    let value = parseInt(data.scores[i]);
    if(!value || value < 1 || value > 5)
    {
      return false;
    }
  }

  //Ensure duplicate entries are not entered into our list
  for(let i = 0; i < employeeList; i++)
  {
    if(data.name === employeeList.name && data.photo === employeeList.photo)
    {
      return false
    }
  }

  let validatedData = {
    name: data.name,
    photo: data.photo,
    scores: data.scores,
  }

  return validatedData;
}