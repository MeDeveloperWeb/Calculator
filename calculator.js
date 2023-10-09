const audio = new Audio('media/click.mp3');
const screen = document.querySelector(".operand-container");
const operators = document.querySelectorAll(".operators-container > span");


let ansHistory = [];
let operator, operand;

document.querySelector(".keys-container").addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        audio.play();
        handleButtons(e.target);
    }
});

function getDigitCount(num) {
    let digCount = 0;
    let numString = num.toString();
    for (let i = 0; i < numString.length; ++i) {
        if (!isNaN(numString[i])) digCount++;
    }
    return digCount;
}

function isUnderflow(num) {
    if (num < 0.000000000000001) return true;
    return false;
}

function isOverflow(num) {
    if (num > 9999999999999999n) return true;
    return false;
}

function handleButtons(btn) {
    if (+btn.id === 0 || +btn.id) {
        if (operator) {
            operand = evaluate(+operand, +screen.textContent, operator);
            operator = "";
            screen.textContent = "";
        }
        screen.textContent += btn.id;
    }
    else {
        switch (btn.id) {
            case "AC":
                ansHistory = [];
                screen.textContent = "";
                break;
            
            case "GT":
                let grandTotal = 0;
                ansHistory.forEach(num => grandTotal += num);
                screen.textContent = grandTotal;
                break;

            case "clear":
                screen.textContent = "";
                break;
            
            case "delete":
                screen.textContent = screen.textContent.slice(0, -1);

            case "plus-minus":
                if (screen.textContent[0] === '-') screen.textContent = screen.textContent.slice(1);
                else screen.textContent = '-' + screen.textContent;
                break;

            case "dec":
                if (!screen.textContent.includes('.')) screen.textContent += '.';
                break;

            case "equals":
                try {
                    screen.textContent = evaluate(+operand, +screen.textContent, operator);
                }
                catch (err){
                    screen.textContent = err;
                    return;
                }
                ansHistory.push(screen.textContent);
                operand = operator = "";
                break;
            
            case "sqrt":
                let sqrt = Math.sqrt(+screen.textContent);
                if (isUnderflow(sqrt)) {
                    screen.textContent = "underflow";
                    break;
                }
                if (getDigitCount(sqrt) > 16) sqrt = sqrt.toPrecision(16);
                screen.textContent = sqrt;
                break;

            default:
                operator = btn.id;
                operators.forEach(op => {
                    if (op.className === btn.id) op.style.visibility = "visible";
                    else op.style.visibility = "hidden";
                });
        }
    }
}

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
                throw Error("Math.exe stopped working");
            }
            return operand1 / operand2;
        
        case "perc":
            return operand1 * operand2 / 100;

    }
}