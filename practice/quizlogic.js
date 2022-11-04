
function getQuizParameter(parameterName) {
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName)
}

var subjectQ = getQuizParameter('subject')
var identQ = getQuizParameter('ident')
var nameQ = getQuizParameter('quizName')
var questionN = getQuizParameter('questionNo')

var directQ = subjectQ + "/" + identQ + "/" + nameQ + ".json"
console.log(directQ);


//this includes data for quiz length
var dataQuizLength;

//this array stores info of json file
var dataQA;

//all info to display
var questionDisplay = document.getElementById("quDisplay");
var o1 = document.getElementById("a1Display");
var o2 = document.getElementById("a2Display");
var o3 = document.getElementById("a3Display");
var o4 = document.getElementById("a4Display");
var ansNumber;
var ansExplain;
var checkButton = document.getElementById("checkButton")
var continueButton = document.getElementById("continueButton")
var continueDiv = document.getElementById("continueDiv")
var solutionDiv = document.getElementById("solutionDiv")
var feedbackText = document.getElementById("feedbackText")
var solutionExpand = document.getElementById("solutionExpand")
var questionNumber = document.getElementById("questionNumber")

//speedscore variable
var speedUpper;
var speedMidRange;
var speedLower;
var speedTimer = 0;
var speedPointsCount = 0;

//go to reuslts page with context for answer key
var ansSubject = subjectQ;
var ansIdent = identQ;
var ansName = nameQ;


//bool controls whether check or continue function is ran
var isContinue = false;
var isDone = false;

var selection = document.getElementById("multiplechoice");
var selectedValue = selection.value;
var ansValue;

//controls which question is loaded
var i = 0;

//right/wrong count
var corr = 0;
var inco = 0;

//finds json file and saves questions into a variable.
fetch(directQ)
    .then(response => response.json())
    .then(data => {
        dataQA = data["questionList"]
        dataQuizLength = data["quCountMinusOne"]
        //console log validates data is loading correctly for debugging.
        console.log(data)
        console.log(data.quizID)
        questionDisplay.textContent = dataQA[i]["qu"]
        o1.textContent = dataQA[i]["a1"]
        o2.textContent = dataQA[i]["a2"]
        o3.textContent = dataQA[i]["a3"]
        o4.textContent = dataQA[i]["a4"]
        ansValue = dataQA[i]["ans"]
        speedUpper = dataQA[i]["timeUpper"]
        speedMidRange = dataQA[i]["timeMid"]
        speedLower = dataQA[i]["timeLower"]
        questionNumber.innerHTML = "Question " + (i+1) + " of " + (dataQuizLength+1);
        console.log("Speed Upper Req:" + speedUpper)
       } )


checkButton.addEventListener('click', checkAnswer);
continueButton.addEventListener('click', loadNextQuestion);

setInterval(function() {speedTimer += 1; console.log("Tick:" + speedTimer)}, 1000);

function checkAnswer() {
    selectedValue = selection.value;
    checkButton.style.visibility = 'hidden';
    continueButton.style.visibility = 'visible';
    continueDiv.style.visibility = 'visible';
    solutionDiv.style.visibility = 'visible';
    clearInterval();
    console.log(speedTimer);

    if (selectedValue == ansValue) {
        console.log("correct")
        console.log(ansValue)
        console.log(selectedValue)
        console.log("Speed Upper Req:" + speedUpper)

        continueDiv.style.backgroundColor = '#d5ffd5';
        solutionDiv.style.backgroundColor = '#d5ffd5';
        feedbackText.style.color = '#348926';
        solutionExpand.style.color = '#348926';
        feedbackText.innerHTML = '&#10004; Great job!';
        continueButton.classList.remove('buttonStOr')
        continueButton.classList.add('buttonStGr')

        if (speedTimer < speedLower)
        {
            speedPointsCount +=3;
        }
        else {
        console.log("Not achieved")
        }
        if (speedTimer < speedMidRange)
        {
            speedPointsCount +=3;
        }
        else {
            console.log("Not achieved")
            }
        if (speedTimer < speedUpper)
        {
            speedPointsCount +=4;
        }
        else {
            console.log("Not achieved")
            }
        corr++;
        console.log("Speed timer:" + speedTimer);
        console.log("Total speed points:" + speedPointsCount);
        
    }
    else {console.log("wrong")
        console.log(ansValue)
        console.log(selectedValue)
        
        continueDiv.style.backgroundColor = '#ffeed0';
        solutionDiv.style.backgroundColor = '#ffeed0';
        feedbackText.style.color = '#8a5d16';
        solutionExpand.style.color = '#8a5d16';
        feedbackText.innerHTML = '&#33; Not quite.';
        continueButton.classList.remove('buttonStGr')
        continueButton.classList.add('buttonStOr')
        inco++;
        
    }
}

function loadNextQuestion() {

    //if question count is less than 10, load next question, otherwise go to results page with context
    if (i < dataQuizLength) {
    i++;
    console.log(i)
    questionNumber.innerHTML = "Question " + (i+1) + " of " + (dataQuizLength+1);
    questionDisplay.textContent = dataQA[i]["qu"]
    o1.textContent = dataQA[i]["a1"]
    o2.textContent = dataQA[i]["a2"]
    o3.textContent = dataQA[i]["a3"]
    o4.textContent = dataQA[i]["a4"]
    ansValue = dataQA[i]["ans"];
    speedUpper = dataQA[i]["timeUpper"]
    speedMidRange = dataQA[i]["timeMid"]
    speedLower = dataQA[i]["timeLower"]
    console.log("Speed Upper Req:" + speedUpper)
    continueButton.style.visibility = 'hidden';
    checkButton.style.visibility = 'visible';
    continueDiv.style.visibility = 'hidden';
    solutionDiv.style.visibility = 'hidden';
    speedTimer = 0;
    setInterval(function () {}, 1000);
    }
    else {
        let redirectPage = (corrWrong, speedPointsAvg, ansSubject, ansIdent, ansName) => {

            var url = "results.html" +
                "?quizPercent=" + corrWrong + "&speedScore=" + speedPointsAvg + "&ansSubject=" + ansSubject + "&ansIdent=" + ansIdent + "&ansName=" + ansName;

            window.location.href = url;
        }

        redirectPage(corr/(dataQuizLength+1)*100 + "%", speedPointsCount/(dataQuizLength+1)*10 + "%", subjectQ, identQ, nameQ)
    }
    
}



//onclick of the button, change the id to continue button and change text to continue
//onclick of the continue button, change it back to check, add 1 to i, so loop repeats
