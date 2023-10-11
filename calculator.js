const audio = new Audio('media/click.mp3');
const screen = document.querySelector(".operand-container");
const operators = document.querySelectorAll(".operators-container > span");


let ansHistory = [];
let operator, operand;

// know if the operand has already been calculated
let operandIsResult = false;

/**
 * Play button sound
 * link buttons to specified functions
 */
document.querySelector(".keys-container").addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        audio.play();
        handleButtons(e.target);
    }
});

/**
 * 
 * @param {number} num 
 * @returns {number} digits in given number
 */
function getDigitCount(num) {
    let digCount = 0;
    let numString = num.toString();
    for (let i = 0; i < numString.length; ++i) {
        if (!isNaN(numString[i])) digCount++;
    }
    return digCount;
}

/**
 * 
 * @param {number} operand1 
 * @param {number} operand2 
 * @param {string} operator 
 * @returns evaluates given expression
 * @throws Error("Math.exe crashed") on division by 0
 */
function evaluate(operand1, operand2, operator) {
    switch (operator) {
        case "plus":
            return operand1 + operand2;
        
        case "minus":
            return operand1 - operand2;

        case "mult":
            return operand1 * operand2;
        
        case "div":
            if (operand2 === 0) {
                throw Error("Math.exe crashed");
            }
            return operand1 / operand2;
        
        case "perc":
            return operand1 * operand2 / 100;

        case "sqrt":
            return Math.sqrt(operand1);

        default:
            return operand2;

    }
}

/**
 * 
 * @param {number} operand1 
 * @param {number} operand2 
 * @param {string} operator 
 * @returns evaluated expression having digits less than 16
 * @throws caught error from 'evaluate'
 */
function getFormattedEvaluation(operand1, operand2, operator) {
    try {
        let result = evaluate(operand1, operand2, operator).toPrecision(15);

        // For exponent result setting digits after decimal of normalizer to 8
        if (result.includes('e')) return (+result).toExponential(8);
        // If the no. of digit are still greater than 15 then,
        // number is in the form '0.something'
        // Fixing the number of digit after decimal point to make result have digits < 16
        else if (getDigitCount(result) > 15) return (+result).toFixed(14);

        return +result;
    }
    catch (err) {
        throw err;
    }
}

/**
 * Implements basic calculator logic
 * @param {HTMLButtonElement} btn 
 */
function handleButtons(btn) {
    if (+btn.id === 0 || +btn.id || btn.id === 'dec') {
        if (operandIsResult || isNaN(screen.textContent)) {
            // Reset the input if the result is displayed
            if (operator === "equals") {
                operator = "";
                // Remove equal sign from the screen
                operators.forEach(op => op.style.visibility = "hidden");
            }
            // - is NaN but we don't want to remove it
            if (screen.textContent !== "-") screen.textContent = "";
        }

        operandIsResult = false;

        // Input number
        if (getDigitCount(+screen.textContent) < 15) {

            if (btn.id === 'dec') {
                if (screen.textContent === "") screen.textContent = "0."
                else if (!screen.textContent.includes('.')) screen.textContent += '.';
            }
            else screen.textContent += btn.id;
        }
    }
    else {
        switch (btn.id) {
            case "AC":
                ansHistory = [];
                screen.textContent = operand = operator = "";
                operandIsResult = false;
                operators.forEach(op => op.style.visibility = "hidden");
                break;

            case "clear":
                screen.textContent = "";
                break;
            
            case "delete":
                // Delete number 1 by 1
                if (!operandIsResult || !isNaN(screen.textContent)) {
                    screen.textContent = screen.textContent.slice(0, -1);
                    break;
                }
                // if error or result is shown on screen
                screen.textContent = "";
                break;
                

            case "plus-minus":
                // Remove content from screen
                if (operandIsResult || isNaN(screen.textContent)) screen.textContent = "";
                // Add or remove - to/from screen
                if (screen.textContent[0] === '-') screen.textContent = screen.textContent.slice(1);
                else screen.textContent = '-' + screen.textContent;
                break;
            
            case "sqrt":
                if (operandIsResult) break; 
                let sqrt = getFormattedEvaluation(+screen.textContent, '', 'sqrt');
                screen.textContent = sqrt;
                break;

            case "GT":
                let grandTotal = 0;
                ansHistory.forEach(num => grandTotal += num);
                screen.textContent = grandTotal;
                operator = "equals";

                operators.forEach(op => {
                    if (op.className === "equals") op.style.visibility = "visible";
                    else op.style.visibility = "hidden";
                });
                break;

            // An operator is clicked
            default:
                try {
                    // Evaluate previous operation
                    if(!operandIsResult || operator === "equals")
                        screen.textContent = operand = getFormattedEvaluation(+operand, +screen.textContent, operator);

                    operandIsResult = true;
                    // Store new operator
                    operator = btn.id;

                    if (operator === "equals") {
                        ansHistory.push(operand);
                        operand = "";
                    }
                }
                catch (err) {
                    // Math Error
                    // Breaking functioning in between
                    // Same functioning when equal is clicked
                    operand = "";
                    operator = "equals";
                    operandIsResult = false;
                    screen.textContent = err.toString().slice(6);
                }

                // Show the clicked operator, Hide all other
                operators.forEach(op => {
                    if (op.className === btn.id) op.style.visibility = "visible";
                    else op.style.visibility = "hidden";
                });
        }
    }
}