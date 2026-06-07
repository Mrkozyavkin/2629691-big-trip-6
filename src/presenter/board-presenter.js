import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripEventsView from '../view/trip-events-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';

const POINTS_COUNT = 3;

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

function getPointDuration(point) {
  return new Date(point.endDateTime) - new Date(point.startDateTime);
}

function sortPointsByDay(firstPoint, secondPoint) {
  return new Date(firstPoint.startDateTime) - new Date(secondPoint.startDateTime);
}

function sortPointsByTime(firstPoint, secondPoint) {
  return getPointDuration(secondPoint) - getPointDuration(firstPoint);
}

function sortPointsByPrice(firstPoint, secondPoint) {
  return secondPoint.price - firstPoint.price;
}

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #tripEventsComponent = new TripEventsView();
  #tripEventsListComponent = new TripEventsListView();
  #pointPresenters = new Map();
  #points = [];
  #currentSortType = SortType.DAY;

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    render(this.#tripEventsComponent, this.#boardContainer);

    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    render(
      new SortView({
        sorts: this.#pointsModel.sorts,
        onSortTypeChange: this.#handleSortTypeChange,
      }),
      this.#tripEventsComponent.element,
    );

    render(this.#tripEventsListComponent, this.#tripEventsComponent.element);

    this.#renderPoints();
  }

  #getSortedPoints() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#points].sort(sortPointsByTime);
      case SortType.PRICE:
        return [...this.#points].sort(sortPointsByPrice);
      case SortType.DAY:
      default:
        return [...this.#points].sort(sortPointsByDay);
    }
  }

  #renderNoPoints() {
    render(new NoPointView(), this.#tripEventsComponent.element);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointContainer: this.#tripEventsListComponent.element,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      eventTypes: this.#pointsModel.eventTypes,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#getSortedPoints().slice(0, POINTS_COUNT).forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = this.#points.map((point) => (
      point.id === updatedPoint.id ? updatedPoint : point
    ));

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };
}
