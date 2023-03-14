const displayBG = document.querySelector('.display');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');

// Buttons
const numberButton = document.querySelectorAll('[data-number]');
const operatorButtons  = document.querySelectorAll('[data-operator]');
const allClearButton = document.querySelector('[data-all-clear]');
const deleteButton = document.querySelector('[data-delete]');
const equalsButton = document.querySelector('[data-equals]');
const Buttons = [allClearButton, deleteButton, numberButton, operatorButtons, equalsButton]

//constructor
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;

        this,this.allClear();
    }
    allClear(){
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = undefined;

        displayBG.classList.add('flash');
        setTimeout(() => { displayBG.classList.remove('flash') }, 200);
    }
    deleteDigit(){
        this.currentOperand = this.currentOperand.slice(0, -1)

    }
    appendDigit(digit){
        if ( digit === '.' && this.currentOperand.includes('.')) return;
        
        // if digit is zero, do not allow multiple initial zeroes
        if ( digit === '0' && this.currentOperand === '0' ) return;

        // if digit is zero and a number is added, remove the zero
        if ( this.currentOperand === '0' && digit !== '0' && digit != '.') {
            this.currentOperand = '';
        }

        // if digit is '.' and there are no prior digits, add a zero
        if ( digit === '.' && this.currentOperand === '' ) this.currentOperand = '0';

        // clean unnecessary zeroes when appending
        this.currentOperand += digit;
    }
    selectOperation(operation) {
        if (this.currentOperand === '' && operation === '-') {
            this.appendDigit(operation);
            return;
        } 

        if (this.currentOperand === '') return;

        if (this.previousOperand !== '') this.equal();
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    equal(){
        let result;
        const previous = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(previous) || isNaN(current)) return;
        
        switch (this.operation) {
            case '÷':
                result = previous / current;
                break;
            case 'x':
                result = previous * current;
                break;
            case '+':
                result = previous + current;
                break;
            case '-':
                result = previous - current;
                break;
            default:
                return
            }
            this.currentOperand = result.toString();
            this.operation = undefined;
            this.previousOperand = '';
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.formatAsNumber(this.currentOperand);
        if (this.operation !== undefined) {
            this.previousOperandTextElement.innerText = `${this.formatAsNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';}
    }


    
    formatAsNumber(numberAsString) {
        if (numberAsString === '') return '0';
        
        let formattedString = '';
        const integerDigits = parseFloat(numberAsString.split('.')[0]);
        const decimalDigitsAsString = numberAsString.split('.')[1];

        if (decimalDigitsAsString === undefined) {
            formattedString = integerDigits.toLocaleString('en-us');
        } else {
            formattedString = `${integerDigits.toLocaleString('en-us')}.${decimalDigitsAsString}`;
        }

        return formattedString;
    }

    animateButton(buttonValue) {
        const buttons = Buttons.find(button => button.innerText === buttonValue );

        buttons.classList.add('key-pressed');
        setTimeout(() => { buttons.classList.remove('key-pressed') }, 200);
    }
}


//Se crea al objeto
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)


allClearButton.addEventListener('click', button => {
    calculator.allClear();
    calculator.updateDisplay();
})

deleteButton.addEventListener('click', () => {
    calculator.deleteDigit();
    calculator.updateDisplay();
})

numberButton.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendDigit(button.innerText);
        calculator.updateDisplay();
    })
})

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.selectOperation(button.innerText)
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', () => {
    calculator.equal();
    calculator.updateDisplay();
})

window.addEventListener('keyup', (print) => {
    switch (print.key){
        case 'Escape': case 'Delete':
            calculator.allClear();
            break;
        case 'Backspace':
            calculator.deleteDigit();
            break;
        case '1': case '2': case '3': case '4': case '5': case '6':
        case '7': case '8': case '9': case '0': case '.':
            calculator.appendDigit(print.key);
            break
        case '/':
            calculator.selectOperation('÷');
            break;
        case '*':
            calculator.selectOperation('x');
            break;
        case '+': case '-':
            calculator.selectOperation(print.key)
            break;
        case 'Enter':
            calculator.equal();
            break;
            default:
                break
        }   
        calculator.updateDisplay();
})