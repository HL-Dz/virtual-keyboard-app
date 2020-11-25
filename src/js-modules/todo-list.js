import createNode from './create-node.js';

export default class Todolist {
  constructor(todos){
    this.todos = todos;
  }

  generateTodoList(){
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
      this.todos.forEach((el,ind) => {

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
        
      })
    } else {
      let str = 'No tasks...'
      
      // emptyElem
      this.emptyElem = createNode('div', 'todo__empty', str, this.todoWrapper);
    }
    document.body.prepend(this.overlay);
    // this.hideTodolist();
    return this;
  }

  // hide todoList
  hideTodolist = () => {
    this.overlay.classList.add('overlay_hide');
  }

  // show todoList
  openTodolist = () => {
    this.overlay.classList.remove('overlay_hide');
  }
}