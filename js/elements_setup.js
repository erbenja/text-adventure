import { ITEMS, DIRECTIONS, ENEMIES, NEUTRALS, ACTIONS, PREPOSITIONS } from './data_sets.js'

//--HTML ELEMENTS SETUP--
const TOUCH_INPUT_CONTAINER = document.querySelector('.touch-input-container');
const TOUCH_CATEGORY_TOGGLE_CONTAINER = document.querySelector('.category-toggle-container');
const TOUCH_INPUT_CHECKBOX = document.querySelector('#touch-checkbox-input');

const DIFFICULTY_SLIDER = document.querySelector('#difficulty-slider');
const PLAYER_INPUT = document.querySelector('#command-input');

//SLIDER EFFECT
DIFFICULTY_SLIDER.addEventListener('input', () => {
    document.documentElement.style
        .setProperty('--slider-value', ((1 + DIFFICULTY_SLIDER.value / 15) + 'rem'));
});

document.documentElement.style
    .setProperty('--slider-value', ((1 + DIFFICULTY_SLIDER.value / 15) + 'rem'));


//INIT TOUCH INPUTS
//checkbox scroll to element
TOUCH_INPUT_CHECKBOX.addEventListener('click', () => {
    if (TOUCH_INPUT_CHECKBOX.checked) {
        TOUCH_INPUT_CONTAINER.scrollIntoView();
    }
})

//add actions
const actionsContainer = document.createElement('div');
actionsContainer.classList.add('category-container');
TOUCH_INPUT_CONTAINER.insertBefore(actionsContainer, TOUCH_INPUT_CONTAINER.firstChild);
for (const item of ACTIONS) {
    const newEl = createTouchInput(item);
    actionsContainer.appendChild(newEl);
}

//add all categories touch-inputs
const allInputs = [
    { name: 'PREPOSITIONS', array: PREPOSITIONS },
    { name: 'ITEMS', array: Array.from(ITEMS.keys()) },
    { name: 'DIRECTIONS', array: Array.from(DIRECTIONS.keys()) },
    { name: 'ENEMIES', array: Array.from(ENEMIES.keys()) },
    { name: 'NEUTRALS', array: Array.from(NEUTRALS.keys()) }
];

for (const category of allInputs) {
    // console.log(category.name);
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('touch-input-category');
    categoryContainer.id = category.name;
    TOUCH_INPUT_CONTAINER.appendChild(categoryContainer);
    createCategoryToggle(category.name);
    for (const item of category.array) {
        categoryContainer.appendChild(createTouchInput(item));
    }
}

//select some list of other commands
const el = document.querySelector("[name='category-toggle']");
el.checked = true;

function createTouchInput(name) {
    const newEl = document.createElement('div');
    newEl.classList.add('touch-input');
    newEl.innerText = name;
    newEl.addEventListener('click', () => {
        PLAYER_INPUT.value += name + ' ';
    });
    return newEl;
}

function createCategoryToggle(name) {
    let styleEl = document.createElement('style');

    // Append <style> element to <head>
    document.head.appendChild(styleEl);

    // Grab style element's sheet
    let styleSheet = styleEl.sheet;

    styleSheet.insertRule(`#${name}` + '{display: none;}', 0);
    styleSheet.insertRule(`#${name}-toggle:checked ~ #${name}` + '{display: flex;}', 0);
    styleSheet.insertRule(`#${name}-toggle:checked ~ .category-toggle-container > #${name}-label` + '{background-color: var(--chosen-button);}', 0);


    // console.log(styleSheet.cssRules);

    // addStylesheetRules([
    //         [`#${name}`, ['display: none;']],
    //         [`#${name}-toggle:checked ~ #${name}`, ['display: block;']]
    //     ]
    // )
    const newRadio = document.createElement('input');
    newRadio.type = 'radio';
    newRadio.id = `${name}-toggle`;
    // newRadio.classList.add('category-toggle-radio');
    newRadio.name = 'category-toggle';
    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', newRadio.id);
    newLabel.innerText = name;
    newLabel.id = `${name}-label`;
    newLabel.classList.add('touch-input');
    TOUCH_INPUT_CONTAINER.insertBefore(newRadio, TOUCH_INPUT_CONTAINER.firstChild);
    TOUCH_CATEGORY_TOGGLE_CONTAINER.appendChild(newLabel);
}


//RUN DEL BUTTONS
const runDelContainer = document.createElement('div');
runDelContainer.classList.add('touch-execute-container');
TOUCH_INPUT_CONTAINER.appendChild(runDelContainer);

const newEl = document.createElement('div');
newEl.classList.add('touch-input');
newEl.innerText = 'RUN';
newEl.addEventListener('click', () => {
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    PLAYER_INPUT.focus();
    PLAYER_INPUT.dispatchEvent(event);
    PLAYER_INPUT.blur();
});
runDelContainer.appendChild(newEl);

const newDel = document.createElement('div');
newDel.classList.add('touch-input');
newDel.innerText = 'DEL';
newDel.addEventListener('click', () => {
    PLAYER_INPUT.value = '';
});
runDelContainer.appendChild(newDel);


//UNUSED ___ STYLE HELPER
function addStylesheetRules(rules) {
    let styleEl = document.createElement('style');

    // Append <style> element to <head>
    document.head.appendChild(styleEl);

    // Grab style element's sheet
    let styleSheet = styleEl.sheet;

    for (let i = 0; i < rules.length; i++) {
        let j = 1,
            rule = rules[i],
            selector = rule[0],
            propStr = '';
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Array.isArray(rule[1][0])) {
            rule = rule[1];
            j = 0;
        }

        for (let pl = rule.length; j < pl; j++) {
            let prop = rule[j];
            propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }

        // Insert CSS Rule
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
}