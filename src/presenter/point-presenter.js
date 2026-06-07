import {remove, render, replace} from '../framework/render.js';
import {UpdateType, UserAction} from '../const.js';
import {getEventDate, getEventDuration, getEventTime} from '../utils/point.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

const ESCAPE_KEY = 'Escape';

function getDestinationById(destinations, destinationId) {
  return destinations.find((destination) => destination.id === destinationId);
}

function getSelectedOffers(offers, offerIds) {
  return offers.filter((offer) => offerIds.includes(offer.id));
}

function createPointData(point, destinations, offers) {
  const destination = getDestinationById(destinations, point.destinationId);

  return {
    ...point,
    destination,
    date: getEventDate(point.startDateTime),
    dateTime: point.startDateTime,
    startTime: getEventTime(point.startDateTime),
    endTime: getEventTime(point.endDateTime),
    duration: getEventDuration(point.startDateTime, point.endDateTime),
    title: `${point.type} ${destination.name}`,
    selectedOffers: getSelectedOffers(offers, point.offerIds),
  };
}

function createFormData(point, destinations, offers, eventTypes) {
  const destination = getDestinationById(destinations, point.destinationId);

  return {
    ...point,
    destination,
    offers,
    selectedOffers: getSelectedOffers(offers, point.offerIds),
    destinations,
    eventTypes,
  };
}

export default class PointPresenter {
  #pointContainer = null;
  #destinations = null;
  #offers = null;
  #eventTypes = null;

  #pointComponent = null;
  #editPointComponent = null;
  #point = null;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({pointContainer, destinations, offers, eventTypes, onDataChange, onModeChange}) {
    this.#pointContainer = pointContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#eventTypes = eventTypes;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const previousPointComponent = this.#pointComponent;
    const previousEditPointComponent = this.#editPointComponent;

    const pointData = createPointData(
      this.#point,
      this.#destinations,
      this.#offers,
    );

    const formData = createFormData(
      this.#point,
      this.#destinations,
      this.#offers,
      this.#eventTypes,
    );

    this.#pointComponent = new PointView({
      point: pointData,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editPointComponent = new EditPointView({
      point: formData,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
    });

    if (previousPointComponent === null || previousEditPointComponent === null) {
      render(this.#pointComponent, this.#pointContainer);
      return;
    }

    if (this.#pointContainer.contains(previousPointComponent.element)) {
      replace(this.#pointComponent, previousPointComponent);
    }

    if (this.#pointContainer.contains(previousEditPointComponent.element)) {
      replace(this.#pointComponent, previousEditPointComponent);
    }

    remove(previousPointComponent);
    remove(previousEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  resetView() {
    if (this.#pointContainer.contains(this.#editPointComponent.element)) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #handleEditClick = () => {
    this.#handleModeChange();
    this.#replacePointToForm();
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      updatedPoint,
    );
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite,
      },
    );
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === ESCAPE_KEY) {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
