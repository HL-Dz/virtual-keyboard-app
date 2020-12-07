import createNode from '../create-node.js';
import generateCurrentTime from '../current-time.js';
import generateId from '../generate-id.js';


export let tasks = [];

if(localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}

const isElems = JSON.parse(localStorage.getItem("tasks")) || [];

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

    // emptyElem
    let str = 'No tasks...';
    this.emptyElem = createNode('div', `${isElems.length == 0 ? 'todo__empty' : 'todo__empty todo__empty_hidden'}`, str, this.todoWrapper);
    
    // items
    if(this.todos.length) {
      this.renderListItems();
    }

    document.body.prepend(this.overlay);
    this.hideTodolist();
    this.closeBtn.onclick = this.hideTodolist;
    this.wrapList.addEventListener('change', this.completeTask);
    this.wrapList.addEventListener('click', this.deleteTask);
    document.addEventListener('keydown', this.hideTodoByEscape);
    return this;
  }

  // First render of list items
  renderListItems = () => {
    this.todos.forEach(elem => {
      this.createNewListItem(elem);
    })
  }

  // Rendering a new list item
  createNewListItem = elem => {
    const { time, date } = elem.startTime;
    // item
      this.item = createNode('div', 'item', null, this.wrapList,
      ['elem', elem.id]
    )

    // item Period
    this.itemPeriod = createNode('div', 'item__period', null, this.item);
      // itemStart
      this.itemStart = createNode('div', 'item__start', null, this.itemPeriod);
        this.itemStartInfo = createNode('div', 'item__start-popup', `Task added: ${time} ${date}`, this.itemStart);
        this.itemStartTriangle = createNode('div', 'item__start-triangle', '', this.itemStartInfo);
        this.startItemTime = createNode('div', 'item__start-time', time, this.itemStart);
        this.startItemDate = createNode('div', 'item__start-date', date,  this.itemStart);
      // itemFinish
      this.itemFinish = createNode('div', `${elem.checked ? 'item__finish item__finish_display': 'item__finish'}`, null, this.itemPeriod);
        // let complteStrResult = `Task completed: ${elem.endTime.time} ${elem.endTime.date}`;
        this.itemFinishInfo = createNode('div', 'item__finish-popup', `Task completd: ${elem.endTime.time} ${elem.endTime.date}`, this.itemFinish);
        this.itemFinishTriangle = createNode('div', 'item__finish-triangle', '', this.itemFinishInfo);
        this.finishItemTime = createNode('div', 'item__finish-time', elem.endTime.time, this.itemFinish);
        this.finistItemDate = createNode('div', 'item__finish-date', elem.endTime.date, this.itemFinish);

    
    // label
    this.label = createNode('label', 'item__label', null, this.item,
      ['for', elem.id]
    )
    this.checkboxItem = createNode('input', 'item__input', null, this.label,
      ['type', 'checkbox'],
      ['id', elem.id],
      elem.checked ? ['checked', ''] : ['checked', 'false'],
    )
    this.additional = createNode('span', 'additional', null, this.label);
    this.itemText = createNode('span', `${elem.checked ? 'item__text item__text_inactive' : 'item__text'}`, elem.todo, this.label);

    // removeItem
    this.removeItem = createNode('div', 'item__remove', 
      createNode('img', 'item__remove-img', null, null, ['src', './img/delete.png'], ['alt', 'Delete']),
    this.item, ['remove', elem.id])
  }

  // Hide todoList
  hideTodolist = () => {
    this.overlay.classList.add('overlay_hide');
  }

  // Hide todolist by pressing
  hideTodoByEscape = (e) => {
    if(e.code === 'Escape') {
      this.hideTodolist();
    }
  }

  // Show todoList
  openTodolist = () => {
    this.overlay.classList.remove('overlay_hide');
  }

  // Add new task
  addNewTask(value){
    if(!value) {
      return;
    }

    let newItem = {
      id: generateId(),
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
    this.createNewListItem(newItem);
  }

  // Complete the task
  completeTask = (e) => {
    let target = e.target.closest('.item__label');
    if(target) {
      let forLabel = target.getAttribute('for');
      let inputId = target.firstElementChild.getAttribute('id');
      let finishElem = target.previousSibling.lastElementChild;
      let finishTime = finishElem.querySelector('.item__finish-time');
      let finishDate = finishElem.querySelector('.item__finish-date');
      let finishPopup = finishElem.querySelector('.item__finish-popup');
      if(forLabel == inputId) {
        let text = target.lastElementChild.textContent;
        this.todos.forEach(elem => {
          if(elem.todo === text) {
            elem.checked = !elem.checked;
            elem.endTime = generateCurrentTime();
            if(elem.checked) {
              finishTime.innerHTML = elem.endTime.time;
              finishDate.innerHTML = elem.endTime.date;
              finishPopup.innerHTML = `Task completed: ${elem.endTime.time} ${elem.endTime.date}`;
              finishPopup.append(this.itemFinishTriangle);
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

  // Delete the task
  deleteTask = (e) => {
    let target = e.target;
    let removeBtn = target.closest('.item__remove');
    
    if(removeBtn) {
      let item = removeBtn.closest('.item');
      let removeId = removeBtn.dataset.remove;
      item.classList.add('item_hidden');
      setTimeout(() => {
        this.todos.forEach((elem,ind) => {
          if(elem.id == removeId) {
            this.todos.splice(ind, 1);
            item.remove();
            localStorage.setItem("tasks", JSON.stringify(this.todos));

            if(!this.todos.length) {
              this.emptyElem.classList.remove('todo__empty_hidden');
            }
          }
        })
      }, 1000);
    }
  }
}