import Observable from '../framework/observable.js';
import {filters} from '../mock/filter.js';
import {destinations, editPoint, eventTypes, newPoint, offers, points} from '../mock/point.js';
import {sorts} from '../mock/sort.js';

export default class PointsModel extends Observable {
  #points = points;
  #offers = offers;
  #destinations = destinations;
  #eventTypes = eventTypes;
  #newPoint = newPoint;
  #editPoint = editPoint;
  #filters = filters;
  #sorts = sorts;

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get eventTypes() {
    return this.#eventTypes;
  }

  get newPoint() {
    return this.#newPoint;
  }

  get editPoint() {
    return this.#editPoint;
  }

  get filters() {
    return this.#filters;
  }

  get sorts() {
    return this.#sorts;
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPointData) {
    this.#points = [
      newPointData,
      ...this.#points,
    ];

    this._notify(updateType, newPointData);
  }

  deletePoint(updateType, deletedPoint) {
    const index = this.#points.findIndex((point) => point.id === deletedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, deletedPoint);
  }
}
