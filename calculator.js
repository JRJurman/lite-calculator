const calcState = {
	value: '0',
	operator: '+',
	memory: '0',
	tape: [],
};

const calcTape = document.querySelector('calc-tape');
const calcDisplay = document.querySelector('calc-display');

define`
	<calc-display memory="0" operator="+" value="0" eval="0">
		<style>
			span[memory],
			span[preview] {
				opacity: 0.8;
			}
		</style>
		<span memory>${'memory'}</span>
		<span operator>${'operator'}</span>
		<span value>${'value'}</span>
		<span preview> = ${'eval'}</span>
	</calc-display>
`;

define`
	<calc-tape tape="[]">
		<style>
			section {
				text-align: end;
				opacity: 0.8;
			}
		</style>
		<section>
		</section>
	</calc-tape>
`;

const currentEval = () => {
	return eval(`${calcState.memory} ${calcState.operator} ${calcState.value}`);
};

const updateDisplay = () => {
	calcDisplay.setAttribute('value', calcState.value);
	calcDisplay.setAttribute('operator', calcState.operator);
	calcDisplay.setAttribute('memory', calcState.memory);
	calcDisplay.setAttribute('eval', currentEval());
	calcTape.setAttribute('tape', JSON.stringify(calcState.tape));
};

addAttributeListener(calcTape, 'tape', () => {
	const [tapeRoll] = queryAllDOM('section', calcTape);
	tapeRoll.innerHTML = '';
	const tape = JSON.parse(calcTape.getAttribute('tape'));
	tape.forEach((tapeRow) => tapeRoll.append(html`<div>${tapeRow}</div>`));
});

const onPressDigit = (num) => {
	calcState.value = `${parseFloat(calcState.value + num)}`;
	updateDisplay();
};

const onPressOperator = (operator) => {
	const result = currentEval();
	calcState.tape.push(`${calcState.memory} ${calcState.operator} ${calcState.value} = ${result}`);
	calcState.memory = result;
	calcState.operator = operator;
	calcState.value = '0';
	updateDisplay();
};

const onPressClear = () => {
	calcState.memory = '0';
	calcState.operator = '+';
	calcState.value = '0';
	updateDisplay();
};

const onPressBackspace = () => {
	calcState.value = '0';
	updateDisplay();
};

const onPressPoint = () => {
	if (calcState.value.includes('.')) {
		// do nothing
		return;
	}
	calcState.value = calcState.value + '.';
	updateDisplay();
};

document.addEventListener('keyup', (event) => {
	const key = event.key;
	if (key.match(/\d/)) {
		onPressDigit(key);
	}
	if (key.match(/[\+\-\/\*]/)) {
		onPressOperator(key);
	}
	if (key === '.') {
		onPressPoint();
	}
	if (key === 'Backspace') {
		onPressBackspace();
	}
	if (key === 'Escape') {
		onPressClear();
	}
	if (key === 'Enter') {
		onPressOperator('+');
	}
});
