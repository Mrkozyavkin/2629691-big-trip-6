import {destinations, editPoint, eventTypes, newPoint, offers, points} from '../mock/point.js';

export default class PointsModel {
  #points = points;
  #offers = offers;
  #destinations = destinations;
  #eventTypes = eventTypes;
  #newPoint = newPoint;
  #editPoint = editPoint;

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
}
