const themeSlider = document.querySelector('.themes__slider');
const body = document.querySelector('body');
const numberAndOperationKeys = document.querySelectorAll('.calculator__key:not(.calculator__key--equals, .calculator__key--del, .calculator__key--reset)');
const calculatorScreen = document.querySelector('.calculator__screen input');
const resetBtn = document.querySelector('.calculator__key--reset');
const delBtn = document.querySelector('.calculator__key--del');
const equalsBtn = document.querySelector('.calculator__key--equals');



let exp = ['0'];
themeSlider.addEventListener('input', function changeTheme() {
  ['theme-1', 'theme-2', 'theme-3'].forEach(c => body.classList.remove(c));
  body.classList.add(`theme-${this.value}`)
});

for (let key of numberAndOperationKeys) {
  key.addEventListener('click', addToScreen);
}

resetBtn.addEventListener('click', resetExpToZero);
delBtn.addEventListener('click', deleteLastElement);
equalsBtn.addEventListener('click', evaluateExpression);

function addToScreen() {
  const value = this.textContent;
  const lastIndex = exp.length-1;
  
  if (['/','x', '+'].includes(value) && ['/','x','+','-','.'].includes(exp[lastIndex])) exp[lastIndex] = value
  // Overwrite zero if there is only zero in expression OR if zero is first and last element after some operation AND we are not overwriting with div, mul or addition
  else if ((exp.length === 1 && exp[0] === '0'
  ||  (exp[lastIndex] === '0' && ['/','x','+','-','.'].includes(exp[lastIndex-1])) 
  ) && !['/', 'x', '+'].includes(value)) exp[exp.length-1] = value
  else if ((value === '-' && exp[lastIndex] === '+') 
          || (value === '+' && exp[lastIndex] === '-')) exp[lastIndex] = value
  else if (['-'].includes(value) && ['-','.'].includes(exp[lastIndex])) return
  else {
    // check if dot is already part of number and if it is we dont want to  add it
    if (value === '.') {
      let i = exp.length-1;
      while (i >= 0 && !['/', 'x', '+', '-'].includes(exp[i])) {
        if (exp[i] === '.') return
        i--;
      };
    }

    exp.push(value)
  }

  displayToScreen(exp);
};

function displayToScreen(exp) {
  calculatorScreen.value = exp.join('');
}

function resetExpToZero() {
  exp  = ['0'];
  displayToScreen(exp);
}

function deleteLastElement() {
  if (exp.length > 1) exp.pop();
  else exp = ['0'];
  displayToScreen(exp);
}


function evaluateExpression() {
  const lastIndex = exp.length-1;
  let i = exp.length-1;
  while (exp.length > 1 && ['/', 'x', '.', '+', '-'].includes(exp[i])) {
    exp.pop();
    i--;
  };
  if (['/','x','+'].includes(exp[0])) exp.shift();

  const numbers  = [];
  const signs  = [];

  let currNumber = '';
  i = 0;

  // In first iteration i go trough and calculate all numbers that have to multiple or divide and store them
  while (i < exp.length) {
      // find number till sign and if sign is / or x do that with last number in numbers and keep going
    while (!['/', 'x', '+', '-'].includes(exp[i])) {
      currNumber += exp[i];
      i++;
      if (i === exp.length) break;;
    }
    numbers.push(Number(currNumber));
    currNumber = ''


    if (exp[i] === 'x' || exp[i] === '/') {
      let idemo = divideAndMultiply(numbers[numbers.length-1], i+1, exp[i]);
      numbers[numbers.length-1] = idemo[0]
      i = idemo[1];
    };
    signs.push(exp[i]);

    i++;
  };
  signs.pop();


  i = 0;
  let sum = numbers[i];
  while (signs.length > 0) {
    i++;
    sign = signs.shift();
    
    if (sign === '+') sum += numbers[i];
    else sum -= numbers[i];
  };

  exp = sum.toFixed(2).split('');

  if (exp[exp.length-1] === '0' && exp[exp.length-2] === '0') exp = exp.slice(0, -3);
  displayToScreen(exp);
};


function divideAndMultiply(sum, index, sign) {
  let nextNumber = '';
  while (!['/', 'x', '+', '-'].includes(exp[index])) {
    nextNumber += exp[index];
    index++;
    if (index === exp.length) break;
  };
  if (sign === 'x') sum *= Number(nextNumber);
  else sum /= Number(nextNumber);

  if (exp[index] === 'x' || exp[index] === '/') {
    [sum, index] = divideAndMultiply(sum, index+1, exp[index]);
  } 
  return [sum, index];
}