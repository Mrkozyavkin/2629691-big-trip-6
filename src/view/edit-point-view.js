import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {getEditDate} from '../utils/point.js';

const FLATPICKR_DATE_FORMAT = 'd/m/y H:i';

function getDestinationByName(destinations, destinationName) {
  return destinations.find((destination) => destination.name === destinationName);
}

function createEventTypeTemplate(eventType, checkedType, pointId) {
  const isChecked = eventType === checkedType ? ' checked' : '';

  return (
    `<div class="event__type-item">
      <input
        id="event-type-${eventType}-${pointId}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType}"
        ${isChecked}
      >
      <label
        class="event__type-label  event__type-label--${eventType}"
        for="event-type-${eventType}-${pointId}"
      >
        ${eventType}
      </label>
    </div>`
  );
}

function createDestinationOptionTemplate(destination) {
  return `<option value="${destination.name}"></option>`;
}

function createOfferTemplate(offer, offerIds, pointId) {
  const isChecked = offerIds.includes(offer.id) ? ' checked' : '';

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.id}-${pointId}"
        type="checkbox"
        name="event-offer-${offer.id}"
        ${isChecked}
      >
      <label class="event__offer-label" for="event-offer-${offer.id}-${pointId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
}

function createPhotoTemplate(photo) {
  return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
}

function createEventTypesTemplate(point) {
  return point.eventTypes
    .map((eventType) => createEventTypeTemplate(eventType, point.type, point.id))
    .join('');
}

function createDestinationsTemplate(destinations) {
  return destinations
    .map((destination) => createDestinationOptionTemplate(destination))
    .join('');
}

function createOffersTemplate(point) {
  return point.offers
    .filter((offer) => offer.type === point.type)
    .map((offer) => createOfferTemplate(offer, point.offerIds, point.id))
    .join('');
}

function createPhotosTemplate(photos) {
  return photos
    .map((photo) => createPhotoTemplate(photo))
    .join('');
}

function createEditPointTemplate(point) {
  const eventTypesTemplate = createEventTypesTemplate(point);
  const destinationsTemplate = createDestinationsTemplate(point.destinations);
  const offersTemplate = createOffersTemplate(point);
  const photosTemplate = createPhotosTemplate(point.destination.photos);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${point.id}">
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
              id="event-type-toggle-${point.id}"
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
            <label class="event__label  event__type-output" for="event-destination-${point.id}">
              ${point.type}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${point.id}"
              type="text"
              name="event-destination"
              value="${point.destination.name}"
              list="destination-list-${point.id}"
            >
            <datalist id="destination-list-${point.id}">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${point.id}">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${point.id}"
              type="text"
              name="event-start-time"
              value="${getEditDate(point.startDateTime)}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${point.id}"
              type="text"
              name="event-end-time"
              value="${getEditDate(point.endDateTime)}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${point.id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${point.id}"
              type="number"
              min="0"
              name="event-price"
              value="${point.price}"
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
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
            <p class="event__destination-description">${point.destination.description}</p>

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

export default class EditPointView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor({point, onFormSubmit, onRollupClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    this.#destroyDatepickers();
  }

  _restoreHandlers() {
    this.#destroyDatepickers();

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);

    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  #setStartDatepicker() {
    this.#startDatepicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        dateFormat: FLATPICKR_DATE_FORMAT,
        defaultDate: this._state.startDateTime,
        enableTime: true,
        'time_24hr': true,
        onChange: this.#startDateChangeHandler,
      },
    );
  }

  #setEndDatepicker() {
    this.#endDatepicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        dateFormat: FLATPICKR_DATE_FORMAT,
        defaultDate: this._state.endDateTime,
        enableTime: true,
        'time_24hr': true,
        onChange: this.#endDateChangeHandler,
      },
    );
  }

  #destroyDatepickers() {
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #eventTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-input')) {
      return;
    }

    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offerIds: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const destination = getDestinationByName(this._state.destinations, evt.target.value);

    if (!destination) {
      return;
    }

    this.updateElement({
      destinationId: destination.id,
      destination,
    });
  };

  #priceInputHandler = (evt) => {
    this._setState({
      price: Number(evt.target.value),
    });
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      startDateTime: userDate.toISOString(),
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      endDateTime: userDate.toISOString(),
    });
  };

  static parsePointToState(point) {
    return {
      ...point,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.offers;
    delete point.destinations;
    delete point.eventTypes;
    delete point.destination;
    delete point.selectedOffers;

    return point;
  }
}
