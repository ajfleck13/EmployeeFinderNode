let questions = [
    "Do you like cheese?", 
    "Pizza is good", 
    "Annie are you okay, are you okay annie",
    "Cause this is thriller, thriller night"
];

let questioncontainer = $("#questioncontainer");
let nameinput = $("#nameinput");
let pictureinput = $("#pictureinput");
let radiotext = ["1 (Strongly Agree)", "2 (Agree)", "3", "4 (Disagree)", "5 (Strongly Disagree)"];
let employeeList = [];

const questionName = function(index) {
    return `Q${index+1}`;
}

for(let i = 0; i < questions.length; i++)
{
    let name = questionName(i);

    let questionheader = $(`
    <div class="row">
        <h1>${questions[i]}</h1>
    </div>`)
    questioncontainer.append(questionheader)

    let questionradiorow = $(`<div class="row radio-row">`);
    for(let j = 0; j < 5; j++)
    {
        let radioname = name + `R${j+1}`;
        let column = $(`<div class="col-sm">`);
        column.append(`<input type="radio" name="${name}" id="${radioname}" value="${j+1}">`);
        column.append(`<label class="label-area-fill" for="${radioname}">${radiotext[j]}</label>`);

        questionradiorow.append(column);
        // console.log(column);
    }
    questioncontainer.append(questionradiorow);
    // console.log(questioncontainer);
    // console.log("appended");
}

const submitValues = function() {
    if(!nameinput.val())
    {
        submissionFailure();
        return;
    }

    let name = nameinput.val();

    if(!pictureinput.val())
    {
        submissionFailure();
        return;
    }

    let picture = pictureinput.val();

    let answers = [];

    for(let i = 0; i < questions.length; i++) {
        let answervalue = $(`input[name="${questionName(i)}"]:checked`).val();
        if(!answervalue) 
        {
            submissionFailure();
            return false;
        }

        answers.push(answervalue);
    }

    if(answers.length != 10)
    {
        console.log('ERROR INCORRECT ANSWER LENGTH');
    }

    prepareSendAndMatch(name, picture, answers);
}

const prepareSendAndMatch = function(name, picture, answers) {
    $.ajax({
        url: '/api/employees',
        method: 'GET'
    }).then(function(response) {
        employeeList = response;
        sendValuesAndMatch(name, picture, answers);
    });
}

const sendValuesAndMatch = function(name, picture, answers) {
    let objectToSend = {
        name: name,
        photo: picture,
        scores: answers
    };

    $.ajax({
        url: '/api/employees',
        method: 'POST',
        data: objectToSend
    }).then(function(response) {
        findNearestMatch(answers);
    })
}

const findNearestMatch = function(answers) {
    let currentlowest = employeeList[0];
    let currentlowestdifference = findDifference(answers, currentlowest);

    for(let i = 1; i < employeeList.length; i++)
    {
        let newdifference = findDifference(answers, employeeList[i]);
        if(newdifference < currentlowestdifference)
        {
            currentlowest = employeeList[i];
            currentlowestdifference = newdifference;
        }
    }
}
