import { LitElement, html } from "lit-element";

import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/vaadin-radio-button/vaadin-radio-group";

const VisibilityFilters = {
  SHOW_ALL: "All",
  SHOW_ACTIVE: "Active",
  SHOW_COMPLETED: "Completed",
};

class TodoView extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
      filter: { type: String },
      task: { type: String },
    };
  }

  constructor() {
    super();

    this.todos = [];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = "";
  }

  render() {
    return html`
      <div class="input-layout" @keyup=${this.shortcutListener}>
        <vaadin-text-field
          placeholder="Task"
          value="${this.task}"
          @change=${this.updateTask}
        ></vaadin-text-field>
        <vaadin-button theme="primary" @click=${this.addTodo}
          >Add Todo</vaadin-button
        >
      </div>

      <div class="todo-list">
        ${this.applyFilter(this.todos).map(
          (todo) => html`
            <div class="todo-item">
              <vaadin-checkbox
                ?checked=${todo.complete}
                @change=${(e) => this.updateTodoStatus(todo, e.target.checked)}
              >
                ${todo.task}
              </vaadin-checkbox>
            </div>
          `,
        )}
      </div>

      <vaadin-radio-group
        class="visibility-filters"
        value=${this.filter}
        @value-changed=${this.filterChanged}
      >
        ${Object.values(VisibilityFilters).map((filter) => {
          return html`
            <vaadin-radio-button value=${filter}>
              ${filter}
            </vaadin-radio-button>
          `;
        })}
      </vaadin-radio-group>
    `;
  }

  filterChanged(e) {
    this.filter = e.target.value;
  }

  applyFilter(todos) {
    switch (this.filter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return todos.filter((todo) => !todo.complete);
      case VisibilityFilters.SHOW_COMPLETED:
        return todos.filter((todo) => todo.complete);
      default:
        return todos;
    }
  }

  updateTodoStatus(updatedTodo, complete) {
    this.todos.map((todo) => {
      return updatedTodo === todo ? { ...updatedTodo, complete } : todo;
    });
  }

  shortcutListener(e) {
    if (e.key === "Enter") {
      this.addTodo();
    }
  }

  updateTask(e) {
    this.task = e.target.value;
  }

  addTodo() {
    if (this.task) {
      this.todos = [
        ...this.todos,
        {
          task: this.task,
          completed: false,
        },
      ];

      this.task = "";
    }
  }
}

customElements.define("todo-view", TodoView);
