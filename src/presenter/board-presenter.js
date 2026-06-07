import {remove, render} from '../framework/render.js';
import {UpdateType, UserAction} from '../const.js';
import {filter} from '../utils/filter.js';
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
  #filterModel = null;

  #tripEventsComponent = new TripEventsView();
  #tripEventsListComponent = new TripEventsListView();
  #sortComponent = null;
  #noPointComponent = null;

  #pointPresenters = new Map();
  #points = [];
  #currentSortType = SortType.DAY;

  constructor({boardContainer, pointsModel, filterModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#points = this.#getFilteredPoints();

    render(this.#tripEventsComponent, this.#boardContainer);

    this.#renderBoard();
  }

  #getFilteredPoints() {
    const filterType = this.#filterModel.filter;

    return filter[filterType](this.#pointsModel.points);
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

  #getSorts() {
    return this.#pointsModel.sorts.map((sort) => ({
      ...sort,
      isChecked: sort.type === this.#currentSortType,
    }));
  }

  #renderBoard() {
    if (this.#points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sorts: this.#getSorts(),
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#tripEventsComponent.element);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView();
    render(this.#noPointComponent, this.#tripEventsComponent.element);
  }

  #renderPointsList() {
    render(this.#tripEventsListComponent, this.#tripEventsComponent.element);
    this.#renderPoints();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointContainer: this.#tripEventsListComponent.element,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      eventTypes: this.#pointsModel.eventTypes,
      onDataChange: this.#handleViewAction,
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

  #clearBoard() {
    this.#clearPoints();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#tripEventsListComponent);

    this.#tripEventsListComponent = new TripEventsListView();
  }

  #handleViewAction = (actionType, updateType, updatedPoint) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, updatedPoint);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, updatedPoint);
        break;
    }
  };

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#clearBoard();
        this.#points = this.#getFilteredPoints();
        this.#renderBoard();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#points = this.#getFilteredPoints();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#currentSortType = SortType.DAY;
        this.#points = this.#getFilteredPoints();
        this.#renderBoard();
        break;
    }
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
    this.#clearBoard();
    this.#renderBoard();
  };
}
