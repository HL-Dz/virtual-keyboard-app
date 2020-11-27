import createNode from './create-node.js';


export let tasks = [];

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

    // todoWrapper
    this.todoWrapper = createNode('div', 'todo__wrapper', null, this.todo);
    
    // todoTitle
    this.todoTitlte = createNode('h1', 'todo__title',
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
    // item
      this.item = createNode('div', 'item', null, this.wrapList,
      ['elem', ind + 1]
    )
    
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
    this.itemText = createNode('span', 'item__text', el.todo, this.label);

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
  addNewItem(value){
    if(!value) {
      return;
    }

    let newItem = {
      todo: value,
      checked: false
    }

    const isFirstStart = !this.todos.length;

    if(isFirstStart) {
      this.emptyElem.classList.add('todo__empty_hidden');
    }

    this.todos.push(newItem);
    this.generateNewListItem(newItem, this.todos.length -1 );
  }
}