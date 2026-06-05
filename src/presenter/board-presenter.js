import {render, replace} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventsView from '../view/trip-events-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

const POINTS_COUNT = 3;
const ESCAPE_KEY = 'Escape';

function getDestinationById(destinations, destinationId) {
  return destinations.find((destination) => destination.id === destinationId);
}

function getOffersByType(offers, type) {
  return offers.filter((offer) => offer.type === type);
}

function getSelectedOffers(offers, offerIds) {
  return offers.filter((offer) => offerIds.includes(offer.id));
}

function createPointData(point, destinations, offers) {
  const destination = getDestinationById(destinations, point.destinationId);

  return {
    ...point,
    destination,
    title: `${point.type} ${destination.name}`,
    selectedOffers: getSelectedOffers(offers, point.offerIds),
  };
}

function createFormData(point, destinations, offers, eventTypes) {
  const destination = getDestinationById(destinations, point.destinationId);

  return {
    ...point,
    destination,
    availableOffers: getOffersByType(offers, point.type),
    selectedOffers: getSelectedOffers(offers, point.offerIds),
    destinations,
    eventTypes,
  };
}

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #tripEventsComponent = new TripEventsView();
  #tripEventsListComponent = new TripEventsListView();

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    render(this.#tripEventsComponent, this.#boardContainer);
    render(new SortView(), this.#tripEventsComponent.element);
    render(this.#tripEventsListComponent, this.#tripEventsComponent.element);

    this.#renderPoints();
  }

  #renderPoint(point) {
    const pointData = createPointData(
      point,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
    );

    const formData = createFormData(
      point,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#pointsModel.eventTypes,
    );

    const pointComponent = new PointView({
      point: pointData,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', onEscKeydown);
      },
    });

    const editPointComponent = new EditPointView({
      point: formData,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      },
      onRollupClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      },
    });

    function replacePointToForm() {
      replace(editPointComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editPointComponent);
    }

    function onEscKeydown(evt) {
      if (evt.key === ESCAPE_KEY) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    }

    render(pointComponent, this.#tripEventsListComponent.element);
  }

  #renderPoints() {
    this.#pointsModel.points.slice(0, POINTS_COUNT).forEach((point) => {
      this.#renderPoint(point);
    });
  }
}
