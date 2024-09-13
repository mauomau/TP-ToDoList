import { createEle } from "../fonctions/dom.js";

/**
 * @typedef {object} Todo
 * @property {string} title
 * @property {number} id
 * @property {boolean} completed
 */
export class TodoList {
    /**
     * @type {Todo[]}
     * take every element from the list
     */
    #todos = [];
    /**
     * @type {HTMLUListElement}
     * represents the unordered list
     */
    #listElement = [];
    /**
     *
     * @param {Todo[]} todos
     */
    constructor(todos) {
        //retieve the list of elements of the todo list
        this.#todos = todos;
    }
    /**
     *
     * @param {HTMLElement} element
     */
    appendTo(element) {
        element.innerHTML = `
            <h2>Bienvenue sur la TodoList</h2>
            <p>Cette application vous permet de gérer vos tâches avec plus de souplesse et de pratique.</p>
            <form class="d-flex pb-4">
                <input required="" class="form-control" type="text" placeholder="Tâche à faire..." name="title" data-com.bitwarden.browser.user-edited="yes">
                <button class="btn btn-primary">Ajouter</button>
            </form>
            <main>
                <div class="d-flex justify-content-center mb-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-outline-primary active" data-filter="all">Toutes</button>
                        <button type="button" class="btn btn-outline-primary" data-filter="todo">À faire</button>
                        <button type="button" class="btn btn-outline-primary" data-filter="done">Faites</button>
                    </div>
                </div>

                <ul class="list-group"> 
                    <!--<li class="todo list-group-item d-flex align-items-center">
                        <input class="form-check-input" type="checkbox" id="todo-1">
                        <label class="ms-2 form-check-label" for="todo-1">
                            Tâche à faire 1
                        </label>
                        <label class="ms-auto btn btn-danger btn-sm">
                        <i class="bi-trash">
                        </i>
                        </label>
                    </li> -->
                </ul>
            </main>`;

        //get the list of tasks
        this.#listElement = element.querySelector(".list-group");
        // create a new todolisyitem for every element of this.#todos (line 14)
        for (let todo of this.#todos) {
            const t = new TodoListItem(todo);
            this.#listElement.prepend(t.element);
        }
        element
            .querySelector("form")
            .addEventListener("submit", (e) => this.#onSubmit(e));
            
        // add event listiner to the filter buttons
        element
            .querySelectorAll(".btn-group button")
            .forEach((button) =>
                button.addEventListener("click", (e) => this.#toggleFilter(e))
            );

        // remove tasks from local storage
        this.#listElement.addEventListener("delete", ({ detail: todo }) => {
            this.#todos = this.#todos.filter((t) => t !== todo);
            this.#onUpdate();
        });
        // toggle completed status of a task
        this.#listElement.addEventListener("toggle", ({ detail: todo }) =>{
            todo.completed = !todo.completed;
            this.#onUpdate();
        })
    }

    /**
     * @param {submitEvent} e
     * save the task in local storage and this.#todos
     */
    #onSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const title = new FormData(form).get("title").toString().trim();
        if (title === "") {
            return;
        }
        const todo = {
            id: Date.now(),
            title,
            completed: false,
        };
        const item = new TodoListItem(todo);
        this.#listElement.prepend(item.element);
        this.#todos.push(todo);
        this.#onUpdate();
        form.reset();
    }
    // update the todo item in the local storage
    #onUpdate() {
        localStorage.setItem("todos", JSON.stringify(this.#todos));
    }
    /**
     *
     * @param {PointerEvent} e
     * change the class of every filter button according to their status and the class of the this.#listElement
     */
    #toggleFilter(e) {
        e.preventDefault();
        const filter = e.currentTarget.getAttribute("data-filter");
        e.currentTarget.parentElement
            .querySelector(".active")
            .classList.remove("active");
        e.currentTarget.classList.add("active");
        if (filter === "todo") {
            this.#listElement.classList.add("hide-completed");
            this.#listElement.classList.remove("hide-todo");
        } else if (filter === "done") {
            this.#listElement.classList.remove("hide-completed");
            this.#listElement.classList.add("hide-todo");
        } else {
            this.#listElement.classList.remove("hide-todo");
            this.#listElement.classList.remove("hide-completed");
        }
    }
}

export class TodoListItem {
    #element;
    #todo
    /**
     * @type {Todo}
     * @param {*} todo
     */
    constructor(todo) {
        this.#todo = todo;
        const id = `todo-${todo.id}`;
        const li = createEle("li", {
            class: "todo list-group-item d-flex align-items-center",
        });
        this.#element = li; // get the li in the element

        const checkbox = createEle("input", {
            class: "form-check-input",
            type: "checkbox",
            id: id,
            checked: todo.completed ? "" : null, //to still set the checked attribute
        });

        const label = createEle("label", {
            class: "ms-2 form-check-label",
            for: id,
            id: id,
        });

        label.innerText = todo.title;
        const button = createEle("button", {
            class: "ms-auto btn btn-danger btn-sm",
        });

        button.innerHTML = `<i class="bi-trash"></i>`;
        li.append(checkbox);
        li.append(label);
        li.append(button);
        this.toggle(checkbox);
        console.log(li);

        button.addEventListener("click", (e) => this.remove(e));
        checkbox.addEventListener("change", (e) => {
            this.toggle(e.currentTarget);
        }
        );
    }

    /**
     *
     * @param {HTMLInputElement} checkbox
     * change state of checkbox
     */
    toggle(checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add("is-completed");
        } else {
            this.#element.classList.remove("is-completed");
        }
        const event = new CustomEvent("toggle", {
            detail: this.#todo,
            bubbles: true,
        });
        this.#element.dispatchEvent(event);
    }

    // the getter method get element() is used to return the private property #element
    /**
     * @return {HTMLElement}
     */
    get element() {
        return this.#element;
    }

    /**
     *
     * @param {PointerEvent} e
     */
    remove(e) {
        e.preventDefault();
        //create a custom event assigned to this function to handle remove action
        const event = new CustomEvent("delete", {
            detail: this.#todo,
            bubbles: true,
            cancelable: true
        });
        //dispatch the event on the parent element(TodoList)
        this.#element.dispatchEvent(event);
        this.#element.remove();
    }
}
