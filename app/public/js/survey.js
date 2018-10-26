const questions = [
    "A boss should be a friend first", 
    "Greed, for lack of a better word, is good", 
    "It is better to train a known worker, than to hire an unknown element",
    "A programmer's skill or speed is more valuable than their institutional knowledge",
    "It is better to do the wrong thing quickly and fix it, than to spend a long time doing it right once",
    "Employees work harder when they have a constant deadline over their head",
    "Preserving the maintainability of the code is better than writing faster code",
    "A manager should give their employees complete autonomy except when there is a problem",
    "Adding broken code is preferrable to adding no code",
    "Refactoring should be done throughout the process, not only when it is apparently needed"
];

const questioncontainer = $("#questioncontainer");
const nameinput = $("#nameinput");
const pictureinput = $("#pictureinput");
const error = $("#error");
const modalMatch = $("#modalMatch");
error.hide();
const radiotext = ["1 <span class='d-none d-lg-inline'>(Strongly Agree)</span>", 
"2 <span class='d-none d-lg-inline'>(Agree)</span>", 
"3", 
"4 <span class='d-none d-lg-inline'>(Disagree)</span>", 
"5 <span class='d-none d-lg-inline'>(Strongly Disagree)</span>"];
let employeeList = [];

const questionName = function(index) {
    return `Q${index+1}`;
}

for(let i = 0; i < questions.length; i++)
{
    let name = questionName(i);

    let questionheader = $(`
    <div class="row">
        <h4>${i+1}. ${questions[i]}</h4>
    </div>`)
    questioncontainer.append(questionheader)

    let questionradiorow = $(`<div class="row radio-row">`);
    for(let j = 0; j < 5; j++)
    {
        let radioname = name + `R${j+1}`;
        let column = $(`<div class="col">`);
        column.append(`<input type="radio" name="${name}" id="${radioname}" value="${j+1}">`);
        column.append(`<label class="label-area-fill" for="${radioname}">${radiotext[j]}</label>`);

        questionradiorow.append(column);
    }
    questioncontainer.append(questionradiorow);
    questioncontainer.append('<br>');
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
        let answervalue = parseInt($(`input[name="${questionName(i)}"]:checked`).val());
        if(!answervalue) 
        {
            submissionFailure();
            return false;
        }

        answers.push(answervalue);
    }

    if(answers.length != 10)
    {
        console.log('ERROR INCORRECT ANSWER ARRAY LENGTH');
    }

    error.hide();
    prepareSendAndMatch(name, picture, answers);
}

const submissionFailure = function() {
    error.show();
}

$("#submit").click(submitValues);

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
    let currentlowestdifference = calculateTotalDifference(answers, currentlowest);

    for(let i = 1; i < employeeList.length; i++)
    {
        let newdifference = calculateTotalDifference(answers, employeeList[i]);
        if(newdifference < currentlowestdifference)
        {
            currentlowest = employeeList[i];
            currentlowestdifference = newdifference;
        }
    }

    displayBestMatch(currentlowest);
}

const calculateTotalDifference = function(answers, employeetocheck) {
    let employeescores = employeetocheck.scores;

    let totalDifference = 0;
    for(let i = 0; i < answers.length; i++)
    {
        totalDifference += Math.abs(answers[i] - employeescores[i]);
    }

    return totalDifference;
}

const displayBestMatch = function(employee) {
    modalMatch.empty();
    
    modalMatch.html(`
    <h2>${employee.name}</h2>
    <img src="${employee.photo}" alt="NO PICTURE AVAILABLE" width="100%">
    `);

    $("#results-modal").modal('show');
}