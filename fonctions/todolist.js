import { fetchJSON } from "./api.js";
import { TodoList } from "../class/classtodo.js";
import { createEle } from "./dom.js";
try {
// const todos = await fetchJSON(`https://jsonplaceholder.typicode.com/todos?_limit=5`);
const todosInStorage = localStorage.getItem('todos')?.toString();
let todos = [];
if(todosInStorage){
    // transform todos into usable JSON objects
    todos = JSON.parse(todosInStorage);
}
// create a todos object from the JSON object and append it to the section in todolist.html
let list = new TodoList(todos);
list.appendTo(document.querySelector("#todolist"));
} catch (e) {
    const alertElement =createEle('div',{
        'class': 'alert alert-danger m-2 text-center',
        'role': 'alert'  // bootstrap alert class
    });
    alertElement.innerText = 'Impossible de charger les elements ! Veuillez verifier votre connexion internet ! \n' + e.message;
    document.body.prepend(alertElement);
}