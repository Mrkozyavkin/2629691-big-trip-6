import AbstractView from '../framework/view/abstract-view.js';

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

function createOfferTemplate(offer, selectedOffers, pointId) {
  const hasSelectedOffer = selectedOffers.some((selectedOffer) => selectedOffer.id === offer.id);
  const isChecked = hasSelectedOffer ? ' checked' : '';

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
  return point.availableOffers
    .map((offer) => createOfferTemplate(offer, point.selectedOffers, point.id))
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
              value="${point.startTime}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${point.id}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${point.id}"
              type="text"
              name="event-end-time"
              value="${point.endTime}"
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
              type="text"
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

export default class EditPointView extends AbstractView {
  #point = null;
  #handleFormSubmit = null;
  #handleRollupClick = null;

  constructor({point, onFormSubmit, onRollupClick}) {
    super();
    this.#point = point;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createEditPointTemplate(this.#point);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };
}
