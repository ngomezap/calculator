function add(n1, n2){
    return n1+n2;
}

function subtract(n1, n2){
    return n1-n2;
}

function multiply(n1, n2){
    return n1*n2;
}

function divide(n1, n2){
    return n1/n2;
}

function populate(e){     
    if(operation.eraseNext === 1){
        clear();
        display.textContent += e.target.innerText;
        operation.eraseNext = 0;
    }else{
        let count = 0;
        display.textContent.split("").forEach(function(character){
            if(character === "."){
                count ++;
            }
        })
        if(count > 0 && e.target.innerText === "."){
            return
        }
        display.textContent += e.target.innerText;
    }
    operation.previous_target = this;

    //Overflow check
    if (display.scrollWidth > display.offsetWidth) {
        display.textContent = 'ERROR';
        operation.eraseNext = 1;
    }
}

function store(e){
    if(Array.from(operators).includes(operation.previous_target)){
        return
    }
    if(display.textContent === "" || display.textContent.charAt(0) === "."){
        return
    }
    if(operation.num1 == null){
        operation.num1 = parseFloat(display.textContent);
        operation.operator = e.target.innerText;
        clear();
    }else if(operation.num2 == null && operation.previous_operator !== "="){
        operation.num2 = parseFloat(display.textContent);
        displayResult(e);
        operation.operator = e.target.innerText;
        operation.num1 = parseFloat(display.textContent);
        operation.num2 = null;
        operation.eraseNext = 1;
    }else{
        operation.previous_operator = null;
        operation.operator = e.target.innerText;
    }
    operation.previous_target = this;
}

function displayResult(){
    let result;
    if(parseInt(display.textContent) === NaN){
        return
    }
    if(operation.num2 === null){
        if(operation.previous_target === equal || display.textContent.charAt(0) === "." ||
        display.textContent === ""){
            return
        }else{
            operation.num2 = parseFloat(display.textContent);
            result = operate(operation);
            display.textContent = result;
            operation.num1 = result;
            operation.num2 = null;
            operation.previous_operator = "=";
            operation.previous_target = equal;
            operation.eraseNext = 1;
        }
    }else{
        result = operate(operation);
        display.textContent = result;
        operation.previous_target = "=";
    }
    //Overflow check
    if (display.scrollWidth > display.offsetWidth) {
        display.textContent = 'ERROR';
        operation.eraseNext = 1;
        operation.num1 = null;
        operation.num2 = null;
        operation.operator = null;
        operation.previous_operator = null;
    }
}

function operate(obj){
    let symbol = obj.operator;
    let n1 = obj.num1;
    let n2 = obj.num2;

    if(symbol === "+") {
        return add(n1, n2);
    }else if(symbol === "-"){
        return subtract(n1, n2);
    }else if(symbol === "x"){
        return multiply(n1, n2);
    }else{
        return divide(n1, n2);
    }
}

function reset(e){
    display.textContent = "";
    operation.num1 = null;
    operation.num2 = null;
    operation.operator = null;
    operation.previous_operator = null;
    operation.eraseNext = 0;
}

function clear(){
    display.textContent = "";
}

function click(e){
    numbers.forEach(function(number){
        if(e.key === number.innerText){
            number.click();
            return;
        }
    })
    operators.forEach(function(operator){
        if(e.key === operator.innerText){
            operator.click();
            return;
        }
    })
    if(e.key === "Enter"){
        equal.click();
    }else if(e.key === "Backspace" || e.key === "Delete"){
        erase.click();
    }else if(e.key === "*"){
        operators.item(2).click()
    }else if(e.key === "/"){
        operators.item(3).click()
    }
}

const numbers = document.getElementById("numbers").querySelectorAll("button");
const display = document.getElementById("display");
const operators = document.getElementById("operators").querySelectorAll("button");
const equal = document.getElementById("equal");
const erase = document.getElementById("erase");

const operation = {
    num1 : null,
    num2 : null,
    operator : null,
    previous_operator : null,
    previous_target : null,
    eraseNext: 0,
};

equal.addEventListener('click', displayResult);
erase.addEventListener('click', reset);
window.addEventListener('keydown', click);

numbers.forEach(function(number){
    number.addEventListener('click', populate);
})

operators.forEach(function(operator){
    operator.addEventListener('click', store)
})