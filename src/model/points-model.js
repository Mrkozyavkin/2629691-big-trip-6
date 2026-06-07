import {filters} from '../mock/filter.js';
import {destinations, editPoint, eventTypes, newPoint, offers, points} from '../mock/point.js';
import {sorts} from '../mock/sort.js';

export default class PointsModel {
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
}
