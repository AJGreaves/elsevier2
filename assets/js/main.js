/* Variables */

let activePage = 1;
let confident = 0;
let unsure = 0;
let numCorrect = 0;
let allQuestions = [];
let questionData = [];
let startTime;
let finishTime;
let progress = 0;

let formAnswer = document.querySelector('#formAnswer');


/**
 * Fetches question data from questions.json 
 */
fetch('assets/data/questions.json')
    .then(function (data) {
        return data.json();
    })
    .then(function (data) {
        allQuestions = data;
        questionData = getQuestion(allQuestions);
        displayQuestion(questionData);
        $('input').prop('checked', false);
    })
    .catch(err => console.log(err));

$('#start-btn').click(function () {
    startQuiz();
});


/**
 * Hides start page and displays question page. 
 * Gets current time to compare with finish time for
 * time taken to complete first question.
 */
function startQuiz() {
    $('#start-page').addClass('d-none');
    $('#formAnswer, #restart-quiz-btn').removeClass('d-none');
    startTime = Date.now();
    return;
}

$('.restart-quiz-btn').click(function () {
    restartQuiz();
});


/**
 * Resets all values, removes any checks on radio input fields,
 * the reloads the page so that the start page is visible again.
 */
function restartQuiz() {
    activePage = 1;
    confident = 0;
    unsure = 0;
    numCorrect = 0;
    progress = 0;
    $('input').prop('checked', false);
    document.location.href="/elsevier2/"; /* change to just "/" when working locally */

    return;
}

$('#acquisition-link').click(function() {
    activePage = 1;
    confident = 0;
    unsure = 0;
    numCorrect = 0;
    progress = 0;
    $('input').prop('checked', false);
    setTimeout(function(){ 
        document.location.href="/elsevier2/";; 
    }, 1000);

    return;
})

/**
 * Takes the full data from questions.json, finds and returns the object in it with the 
 * id number that matches the page that the user is on.
 * @param {array} allQuestions | full data from questions.json
 */
function getQuestion(allQuestions) {
    let question = allQuestions.find(x => x.id === activePage);
    return question;
}

/**
 * Takes the json object for the page the user is on. Adds the progressbar text, and 
 * applies the data to html to display the question and answer options on the screen.
 * @param {object} questionData | json object this page question.
 */
function displayQuestion(questionData) {

    let progressText = "Question " + activePage + " of 3";
    $('#progress-bar-text').text(progressText);

    /* Question */
    $('#questionIntro').text(questionData.questionIntro);
    $('#question').text(questionData.question);

    /* Options */
    $('#option1Label').text('A: ' + questionData.choices.option1).removeClass('d-none');
    $('#option2Label').text('B: ' + questionData.choices.option2).removeClass('d-none');
    $('#option3Label').text('C: ' + questionData.choices.option3).removeClass('d-none');
    $('#option4Label').text('D: ' + questionData.choices.option4).removeClass('d-none');
    $('#option5Label').text('E: ' + questionData.choices.option5).removeClass('d-none');

    return;
}

/**
 * Counts the number of clicks on the confident and unsure buttons
 * to be displayed on the screen at the end of the quiz.
 */
$('#confident-btn').click(function () {
    confident++;
    return;
});

$('#unsure-btn').click(function () {
    unsure++;
    return;
});


if (formAnswer != null) {
    /**
     * Listens for when the user clicks one of the two submit buttons for the form. 
     * Stops the submit button from reloading the page. Collects the time right now 
     * and applies it to finishTime. Increases the progress value. Gets the value of 
     * the checked radio and then calls the functions to display the response. 
     */
    formAnswer.addEventListener('submit', (event) => {
        // prevents default behaviour of submit button to refresh page
        event.preventDefault();

        finishTime = Date.now();
        progress++;
        const givenAnswer = $("input[type='radio'][name='radios']:checked").val();
        respondAnswer(questionData, givenAnswer);
        progressBar(progress);
        return;
    });
    /**
     * Listens for when the user clicks one of the two submit buttons for the form. 
     * Stops the submit button from reloading the page. Collects the time right now 
     * and applies it to finishTime. Increases the progress value. Gets the value of 
     * the checked radio and then calls the functions to display the response. 
     */
    formAnswer.addEventListener('submit', (event) => {
        // prevents default behaviour of submit button to refresh page
        event.preventDefault();

        finishTime = Date.now();
        progress++;
        const givenAnswer = $("input[type='radio'][name='radios']:checked").val();
        respondAnswer(questionData, givenAnswer);
        progressBar(progress);
        return;
    });
}


/**
 * Compares correct answer with users response and calls the appropriate function 
 * to respond with correct/incorrect on screen. Then calls functions to display answer page.
 * @param {object} questionData | json object this page question.
 * @param {*} givenAnswer | users selected answer from input radios.
 */
function respondAnswer(questionData, givenAnswer) {

    if (givenAnswer == questionData.answer) {
        correctAnswer(questionData);
    } else {
        incorrectAnswer(questionData, givenAnswer);
    }

    displayOptionInfo(questionData);
    displayCircleIcons(questionData);
    deactivateRadios();
    displayDataInfo();
    hideSubmitShowNextBtns();
    showSideInfo();

    return;
}

/**
 * Function called with users answer is correct. Displays text on screen to tell user
 * they are correct. Increases count of numCorrect and adds the "correct" text under the option selected.
 * @param {object} questionData | json object this page question.
 */
function correctAnswer(questionData) {
    $('#question-response')
        .text('Your answer is correct.')
        .css('color', '#008000')
        .removeClass('d-none');

    numCorrect++;
    let correctMsg = '#' + questionData.answer + '-response-box .radio-response';
    $(correctMsg).text('Correct').css('color', '#015f06');
    return;
}

/**
 * Function called with users answer is incorrect. Displays text on the screen to tell user
 * they are incorrect. Displays cross icon next to answer they selected. Displays "incorrect"
 * text under option user selected, and "correct" text under the correct answer.
 * @param {object} questionData | json object this page question
 * @param {string} givenAnswer | value of answer user selected
 */
function incorrectAnswer(questionData, givenAnswer) {
    $('#question-response')
        .text('Your answer is incorrect.')
        .css('color', '#c20606')
        .removeClass('d-none');

    let incorrectCircle = '#circle-' + givenAnswer;
    $(incorrectCircle)
        .addClass('fa-times-circle')
        .removeClass('fa-check-circle')
        .parent().removeClass('d-none');

    let incorrect = '#' + givenAnswer + '-response-box .radio-response';
    let correct = '#' + questionData.answer + '-response-box .radio-response';
    $(incorrect).text('Incorrect').css('color', '#c20606');
    $(correct).text('Correct').css('color', '#015f06');
    return;
}

/**
 * Displays more info about each of the question options on the page, 
 * after the user has selected their answer.
 * @param {object} questionData | json object data for this question.
 */
function displayOptionInfo(questionData) {
    $('#option1-response-box .choice-response')
        .text(questionData.choiceResponses.option1)
        .removeClass('d-none');
    $('#option2-response-box .choice-response')
        .text(questionData.choiceResponses.option2)
        .removeClass('d-none');
    $('#option3-response-box .choice-response')
        .text(questionData.choiceResponses.option3)
        .removeClass('d-none');
    $('#option4-response-box .choice-response')
        .text(questionData.choiceResponses.option4)
        .removeClass('d-none');
    $('#option5-response-box .choice-response')
        .text(questionData.choiceResponses.option5)
        .removeClass('d-none');

    return;
}

/**
 * Displays icons to indicate correct / incorrect answer
 * @param {*} questionData | json object data for this question.
 */
function displayCircleIcons(questionData) {
    let correctCircle = '#circle-' + questionData.answer;
    $(correctCircle)
        .addClass('fa-check-circle')
        .removeClass('fa-times-circle')
        .parent().removeClass('d-none');
    return;
}

/**
 * Deactivates radios so they can't be clicked, and changes selected radio 
 * to grey after user clicks button to submit answer.
 */
function deactivateRadios() {
    $('.radio-orange').addClass('radio-grey').removeClass('radio-orange');
    $('.radio-label').css('pointer-events', 'none');
}

/**
 * Returns number of seconds user took to answer a question
 */
function getTime() {
    return Math.round((finishTime - startTime) / 1000);
}

/**
 * Adds data to side info bar in html
 */
function displayDataInfo() {
    $('#percent-correct').text(questionData.percentCorrect);
    $('#timerResult').text(getTime() + ' sec.');
    $('#key-concept').text(questionData.keyConcept);
    return;
}

/**
 * When user confirms their answer this function changes the column width 
 * of the questions column to make room to display the side info bar.
 */
function showSideInfo() {
    $('#question-column').removeClass('col-12').addClass('col-9');
    $('#side-info-bar').removeClass('d-none');
    return;
}

/**
 * Changes visible buttons when user submits an answer
 */
function hideSubmitShowNextBtns() {
    $('#confident-btn, #unsure-btn').addClass('d-none');
    $('#next-btn').removeClass('d-none');
    return;
}

/**
 * Displays score data on side info box once user has completed the quiz.
 */
function finalScore() {
    $('#num-confident').text(confident);
    $('#num-unsure').text(unsure);
    $('#num-correct').text(numCorrect + " out of 3.");
    return;
}

$('#next-btn').click(function () {
    nextBtn();
    return;
});

/**
 * Increases active page and progress numbers, then checks which page the
 * user is on. If quiz is not finished yet then loads the next question.
 * If quiz is complete, reset the progress number to 0, calls the function 
 * to display the final score. Then hides the question page and shows the 
 * email signup page.
 */
function nextBtn() {
    activePage++;
    progress++;
    if (activePage <= 3) {
        loadNextQuestion();
    } else if (activePage == 4) {
        progress = 0;
        finalScore();
        $('#formAnswer').addClass('d-none');
        $('#email-signup-page').removeClass('d-none');
    } else {
        $('#email-signup-page').addClass('d-none');
        $('#acquisition-form-invite').removeClass('d-none');
    }
    return;
}

/**
 * Removes all data from previous questions,  calls functions to get next question
 * and display it on the screen, then gets new start time.
 */
function loadNextQuestion() {
    $('.radio-label').css('pointer-events', 'auto');
    $('.circle-wrapper, .radio-response, .choice-response, #question-response')
        .addClass('d-none');

    $('#confident-btn, #unsure-btn').removeClass('d-none');
    $('#next-btn').addClass('d-none');

    $('input').prop('checked', false);

    $('.radio-grey').addClass('radio-orange').removeClass('radio-grey');

    $('#question-column').removeClass('col-9').addClass('col-12');
    $('#side-info-bar').addClass('d-none');

    questionData = getQuestion(allQuestions);
    displayQuestion(questionData);

    startTime = Date.now();

    return;
}

/**
 * Updates the progress bar above questions to show user where they are
 * in the quiz.
 * @param {int} progress | int that marks the users progress through the quiz
 */
function progressBar(progress) {
    switch (progress) {
        case 1:
            $('.progress-bar').css('width', "33.33%").attr('aria-valuenow', '33.33');
            break;
        case 3:
            $('.progress-bar').css('width', "66.66%").attr('aria-valuenow', '66.66');
            break;
        case 5:
            $('.progress-bar').css('width', "100%").attr('aria-valuenow', '100');
            break;
        default:
            break;
    }
    return;
}

document.addEventListener("DOMContentLoaded", function () {
    hideLoading();
    return;
});

/**
 * Shows loading spinner
 */
function showLoading() {
    $("#spinner-background").css("visibility", "visible");
    return;
}

/**
 * Hides loading spinner
 */
function hideLoading() {
    $("#spinner-background").css("visibility", "hidden");
    return;
}