import createNode from '../create-node.js';
import generateCurrentTime from '../current-time.js';


export let tasks = [];

if(localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

export class Todolist {
  constructor(todos){
    this.todos = todos;
  }

  // Todolist initialization
  init(){
    // overlay
    this.overlay = createNode('div', 'overlay', null);

    // todo
    this.todo = createNode('div', 'todo', null, this.overlay);

    // closeBtn
    this.closeBtn = createNode('div', 'todo__close', null, this.todo, ['title', 'Close']);
    this.closeIcon = createNode('div', 'todo__close-icon', null, this.closeBtn);

    // todoWrapper
    this.todoWrapper = createNode('div', 'todo__wrapper', null, this.todo);
    
    // todoTitle
    this.todoTitle = createNode('h1', 'todo__title',
      [createNode('span', 'todo__title_mod',  'TODO'), 'List'], this.todoWrapper);

    // wrapList 
    this.wrapList = createNode('div', 'wrapper__list', null, this.todoWrapper);
    
    // items
    if(this.todos.length) {
      this.renderListItems();
    } else {
      let str = 'No tasks...'
      // emptyElem
      this.emptyElem = createNode('div', 'todo__empty', str, this.todoWrapper);
    }
    document.body.prepend(this.overlay);
    this.hideTodolist();
    this.closeBtn.onclick = this.hideTodolist;
    this.wrapList.onchange =  this.completeTask;
    return this;
  }

  // First render of list items
  renderListItems = () => {
    this.todos.forEach((el,ind) => {
      this.generateNewListItem(el,ind);
    })
  }

  // Rendering a new list item
  generateNewListItem = (el,ind) => {
    const { time, date } = el.startTime;
    // item
      this.item = createNode('div', 'item', null, this.wrapList,
      ['elem', ind + 1]
    )

    // item Period
    this.itemPeriod = createNode('div', 'item__period', null, this.item);
      // itemStart
      this.itemStart = createNode('div', 'item__start', null, this.itemPeriod);
        this.startItemTime = createNode('div', 'item__start-time', time, this.itemStart);
        this.startItemDate = createNode('div', 'item__start-date', date,  this.itemStart);
      // itemFinish
      this.itemFinish = createNode('div', `${el.checked ? 'item__finish item__finish_display': 'item__finish'}`, null, this.itemPeriod);
        this.finishItemTime = createNode('div', 'item__finish-time', el.endTime.time, this.itemFinish);
        this.finistItemDate = createNode('div', 'item__finish-date', el.endTime.date, this.itemFinish);

    
    // label
    this.label = createNode('label', 'item__label', null, this.item,
      ['for', ind + 1]
    )
    this.checkboxItem = createNode('input', 'item__input', null, this.label,
      ['type', 'checkbox'],
      ['id', ind + 1],
      el.checked ? ['checked', ''] : ['checked', 'false'],
    )
    this.additional = createNode('span', 'additional', null, this.label);
    this.itemText = createNode('span', `${el.checked ? 'item__text item__text_inactive' : 'item__text'}`, el.todo, this.label);

    // removeItem
    this.removeItem = createNode('div', 'item__remove', 
      createNode('img', 'item__remove-img', null, null, ['src', './img/delete.png'], ['alt', 'Delete']),
    this.item, ['remove', ind + 1])
  }

  // Hide todoList
  hideTodolist = () => {
    this.overlay.classList.add('overlay_hide');
  }

  // Show todoList
  openTodolist = () => {
    this.overlay.classList.remove('overlay_hide');
  }

  // Add a new list item
  addNewTask(value){
    if(!value) {
      return;
    }

    let newItem = {
      todo: value,
      checked: false,
      startTime: generateCurrentTime(),
      endTime: ''
    }

    const isFirstStart = !this.todos.length;

    if(isFirstStart) {
      this.emptyElem.classList.add('todo__empty_hidden');
    }

    this.todos.push(newItem);
    localStorage.setItem("tasks", JSON.stringify(this.todos));
    this.generateNewListItem(newItem, this.todos.length - 1);
  }

  completeTask = (e) => {
    let target = e.target.closest('.item__label');
    if(target) {
      let forLabel = target.getAttribute('for');
      let inputId = target.firstElementChild.getAttribute('id');
      let finishElem = target.previousSibling.lastElementChild;
      let finishTime = finishElem.firstElementChild;
      let finishDate = finishElem.lastElementChild;
      if(forLabel == inputId) {
        let text = target.lastElementChild.textContent;
        this.todos.forEach(elem => {
          if(elem.todo === text) {
            elem.checked = !elem.checked;
            elem.endTime = generateCurrentTime();
            if(elem.checked) {
              finishTime.innerHTML = elem.endTime.time;
              finishDate.innerHTML = elem.endTime.date;
              finishElem.classList.add('item__finish_display');
              target.querySelector('.item__text').classList.add('item__text_inactive');
            } else {
              elem.endTime = '' ;
              finishElem.classList.remove('item__finish_display');
              target.querySelector('.item__text').classList.remove('item__text_inactive');
            }
            localStorage.setItem("tasks", JSON.stringify(this.todos));
          }
        })
      }
    }
  }
}