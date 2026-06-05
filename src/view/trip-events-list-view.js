import {createElement} from '../render.js';

const TRIP_EVENTS_LIST_TEMPLATE = '<ul class="trip-events__list"></ul>';

export default class TripEventsListView {
  #element = null;

  getTemplate() {
    return TRIP_EVENTS_LIST_TEMPLATE;
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
