import createNode from './create-node.js';
import * as storage from './storage.js';
import language from './layouts/general.js'
import Key from './Key.js';


const main = createNode('main', 'content', null);
const container = createNode('div', 'container', null, main);

export default class Keyboard {
  constructor(linesOrder){
    this.linesOrder = linesOrder;
    this.keyPresssed = {};
    this.isCaps = false;
  }

  init(langCode){
    this.currentLayout = language[langCode];
    this.textarea = createNode('textarea', 'output-field', null, container,
      ['rows', 5],
      ['cols', 50],
      ['placeholder', 'Set focus here or press any key and start typing the task...'],
    );

    this.keyboard = createNode('div', 'keyboard keyboard_hidden', null, main, ['language', langCode]);
    document.body.prepend(main);
    return this;
  }

  generateKeyboardLayout() {
    this.keyButtons = [];
    this.linesOrder.forEach((line, i)=> {
      const lineElem = createNode('div', 'keyboard__line', null, this.keyboard, ['line', i + 1]);
      line.forEach(code => {
        const keyObj = this.currentLayout.find(key=> key.code === code);
        if(keyObj) {
          const keyElem = new Key(keyObj);
          this.keyButtons.push(keyElem);
          lineElem.append(keyElem.btn)
        }
      })
    })
    this.textarea.addEventListener('focus', this.openKeyboard.bind(this));
    document.addEventListener('keydown', this.handleEvent.bind(this));
    document.addEventListener('keyup', this.handleEvent.bind(this));
  }

  openKeyboard(){
    this.keyboard.classList.remove('keyboard_hidden');
  }

  handleEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    const {type,code} = e;
    const keyObj = this.keyButtons.find(key => key.code === code);
    if(!keyObj) return;
    this.textarea.focus();

    if(type.match(/keydown|mousedown/)) {
      if(type.match(/keydown/)) e.preventDefault();
      keyObj.btn.classList.add('keyboard__btn_active');
    } else if (type.match(/keyup|mouseup/gi)) {
      keyObj.btn.classList.remove('keyboard__btn_active');
    }
  }
}