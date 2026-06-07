import Observable from '../framework/observable.js';
import {EVENT_TYPES, UpdateType} from '../const.js';
import {filters} from '../mock/filter.js';
import {sorts} from '../mock/sort.js';

export default class PointsModel extends Observable {
  #points = [];
  #offers = [];
  #destinations = [];
  #eventTypes = EVENT_TYPES;
  #filters = filters;
  #sorts = sorts;
  #tripApiService = null;

  constructor({tripApiService}) {
    super();
    this.#tripApiService = tripApiService;
  }

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

  get filters() {
    return this.#filters;
  }

  get sorts() {
    return this.#sorts;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#tripApiService.points,
        this.#tripApiService.destinations,
        this.#tripApiService.offers,
      ]);

      this.#points = points;
      this.#destinations = destinations;
      this.#offers = offers;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    const response = await this.#tripApiService.updatePoint(updatedPoint);

    this.#points = [
      ...this.#points.slice(0, index),
      response,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, response);
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
