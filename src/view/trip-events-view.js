import {createElement} from '../render.js';

const TRIP_EVENTS_TEMPLATE = (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>`
);

export default class TripEventsView {
  #element = null;

  getTemplate() {
    return TRIP_EVENTS_TEMPLATE;
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

