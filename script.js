       // Calculator state
        let currentOperand = '0';
        let previousOperand = '';
        let operation = null;
        let shouldResetScreen = false;

        // DOM elements
        const currentOperandElement = document.getElementById('current-operand');
        const previousOperandElement = document.getElementById('previous-operand');
        const clearButton = document.getElementById('clear');
        const backspaceButton = document.getElementById('backspace');
        const equalsButton = document.getElementById('equals');
        const decimalButton = document.getElementById('decimal');
        const numberButtons = document.querySelectorAll('.number');
        const operatorButtons = document.querySelectorAll('.operator');

        // Add ripple effect to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Event listeners
        clearButton.addEventListener('click', clear);
        backspaceButton.addEventListener('click', backspace);
        equalsButton.addEventListener('click', evaluate);
        decimalButton.addEventListener('click', appendDecimal);

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                appendNumber(button.textContent);
            });
        });

        operatorButtons.forEach(button => {
            if (button.id !== 'backspace') {
                button.addEventListener('click', () => {
                    chooseOperation(button.textContent);
                });
            }
        });

        // Keyboard support
        document.addEventListener('keydown', event => {
            if (event.key >= '0' && event.key <= '9') appendNumber(event.key);
            if (event.key === '.') appendDecimal();
            if (event.key === '=' || event.key === 'Enter') evaluate();
            if (event.key === 'Backspace') backspace();
            if (event.key === 'Escape') clear();
            if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                chooseOperation(event.key);
            }
        });

        // Calculator functions
        function appendNumber(number) {
            if (currentOperand === '0' || shouldResetScreen) {
                currentOperand = number;
                shouldResetScreen = false;
            } else {
                currentOperand += number;
            }
            updateDisplay();
        }

        function appendDecimal() {
            if (shouldResetScreen) {
                currentOperand = '0.';
                shouldResetScreen = false;
                return;
            }
            
            if (!currentOperand.includes('.')) {
                currentOperand += '.';
            }
            updateDisplay();
        }

        function chooseOperation(op) {
            if (currentOperand === '') return;
            
            if (previousOperand !== '') {
                evaluate();
            }
            
            operation = op;
            previousOperand = `${currentOperand} ${op}`;
            shouldResetScreen = true;
            updateDisplay();
        }

        function evaluate() {
            if (operation === null || shouldResetScreen) return;
            
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            let result;
            
            switch (operation) {
                case '+':
                    result = prev + current;
                    break;
                case '−':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        result = 'Error';
                        break;
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            currentOperand = result.toString();
            operation = null;
            previousOperand = '';
            shouldResetScreen = true;
            updateDisplay();
        }

        function clear() {
            currentOperand = '0';
            previousOperand = '';
            operation = null;
            updateDisplay();
        }

        function backspace() {
            if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
                currentOperand = '0';
            } else {
                currentOperand = currentOperand.slice(0, -1);
            }
            updateDisplay();
        }

        function updateDisplay() {
            currentOperandElement.textContent = currentOperand;
            previousOperandElement.textContent = previousOperand;
        }
    