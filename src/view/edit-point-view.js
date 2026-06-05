import {createElement} from '../render.js';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATIONS = ['Amsterdam', 'Geneva', 'Chamonix'];
const PHOTOS = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];

const EDIT_POINT = {
  type: 'flight',
  destination: 'Chamonix',
  startTime: '18/03/19 12:25',
  endTime: '18/03/19 13:35',
  price: '160',
  isDisabled: false,
  buttonText: 'Delete',
  offers: [
    {
      id: 'luggage',
      title: 'Add luggage',
      price: '50',
      isChecked: true,
    },
    {
      id: 'comfort',
      title: 'Switch to comfort',
      price: '80',
      isChecked: true,
    },
    {
      id: 'meal',
      title: 'Add meal',
      price: '15',
      isChecked: false,
    },
    {
      id: 'seats',
      title: 'Choose seats',
      price: '5',
      isChecked: false,
    },
    {
      id: 'train',
      title: 'Travel by train',
      price: '40',
      isChecked: false,
    },
  ],
  description: 'Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it\'s renowned for its skiing.',
};

function createEventTypeTemplate(eventType, checkedType) {
  const isChecked = eventType === checkedType ? ' checked' : '';

  return (
    `<div class="event__type-item">
      <input
        id="event-type-${eventType}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${isChecked}
      >
      <label
        class="event__type-label  event__type-label--${eventType}"
        for="event-type-${eventType}-1"
      >
        ${eventType}
      </label>
    </div>`
  );
}

function createDestinationOptionTemplate(destination) {
  return `<option value="${destination}"></option>`;
}

function createOfferTemplate(offer) {
  const isChecked = offer.isChecked ? ' checked' : '';

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.id}-1"
        type="checkbox"
        name="event-offer-${offer.id}"
        ${isChecked}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}

function createPhotoTemplate(photo) {
  return `<img class="event__photo" src="img/photos/${photo}" alt="Event photo">`;
}

function createEditPointTemplate(point) {
  const eventTypesTemplate = EVENT_TYPES
    .map((eventType) => createEventTypeTemplate(eventType, point.type))
    .join('');

  const destinationsTemplate = DESTINATIONS
    .map((destination) => createDestinationOptionTemplate(destination))
    .join('');

  const offersTemplate = point.offers
    .map((offer) => createOfferTemplate(offer))
    .join('');

  const photosTemplate = PHOTOS
    .map((photo) => createPhotoTemplate(photo))
    .join('');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img
                class="event__type-icon"
                width="17"
                height="17"
                src="img/icons/${point.type}.png"
                alt="Event type icon"
              >
            </label>
            <input
              class="event__type-toggle  visually-hidden"
              id="event-type-toggle-1"
              type="checkbox"
            >

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${point.type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${point.destination}"
              list="destination-list-1"
            >
            <datalist id="destination-list-1">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${point.startTime}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${point.endTime}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${point.price}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${point.buttonText}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${point.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosTemplate}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView {
  #element = null;

  getTemplate() {
    return createEditPointTemplate(EDIT_POINT);
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
