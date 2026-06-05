import {render} from '../render.js';
import SortView from '../view/sort-view.js';
import TripEventsView from '../view/trip-events-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/new-point-view.js';

const POINTS_COUNT = 3;

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
    render(new SortView(), this.#tripEventsComponent.getElement());
    render(this.#tripEventsListComponent, this.#tripEventsComponent.getElement());

    this.#renderEditPoint();
    this.#renderNewPoint();
    this.#renderPoints();
  }

  #renderEditPoint() {
    const editPoint = createFormData(
      this.#pointsModel.editPoint,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#pointsModel.eventTypes,
    );

    render(new EditPointView(editPoint), this.#tripEventsListComponent.getElement());
  }

  #renderNewPoint() {
    const newPoint = createFormData(
      this.#pointsModel.newPoint,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
      this.#pointsModel.eventTypes,
    );

    render(new NewPointView(newPoint), this.#tripEventsListComponent.getElement());
  }

  #renderPoint(point) {
    const pointData = createPointData(
      point,
      this.#pointsModel.destinations,
      this.#pointsModel.offers,
    );

    render(new PointView(pointData), this.#tripEventsListComponent.getElement());
  }

  #renderPoints() {
    this.#pointsModel.points.slice(0, POINTS_COUNT).forEach((point) => {
      this.#renderPoint(point);
    });
  }
}
