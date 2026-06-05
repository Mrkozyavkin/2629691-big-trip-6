import {render} from '../render.js';
import SortView from '../view/sort-view.js';
import TripEventsView from '../view/trip-events-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/new-point-view.js';

const POINTS = [
  {
    type: 'taxi',
    title: 'Taxi Amsterdam',
    date: 'MAR 18',
    dateTime: '2019-03-18',
    startTime: '10:30',
    endTime: '11:00',
    startDateTime: '2019-03-18T10:30',
    endDateTime: '2019-03-18T11:00',
    duration: '30M',
    price: '20',
    isFavorite: true,
    selectedOffers: [
      {
        title: 'Order Uber',
        price: '20',
      },
    ],
  },
  {
    type: 'flight',
    title: 'Flight Chamonix',
    date: 'MAR 18',
    dateTime: '2019-03-18',
    startTime: '12:25',
    endTime: '13:35',
    startDateTime: '2019-03-18T12:25',
    endDateTime: '2019-03-18T13:35',
    duration: '01H 10M',
    price: '160',
    isFavorite: false,
    selectedOffers: [
      {
        title: 'Add luggage',
        price: '50',
      },
      {
        title: 'Switch to comfort',
        price: '80',
      },
    ],
  },
  {
    type: 'drive',
    title: 'Drive Chamonix',
    date: 'MAR 18',
    dateTime: '2019-03-18',
    startTime: '14:30',
    endTime: '16:05',
    startDateTime: '2019-03-18T14:30',
    endDateTime: '2019-03-18T16:05',
    duration: '01H 35M',
    price: '160',
    isFavorite: true,
    selectedOffers: [
      {
        title: 'Rent a car',
        price: '200',
      },
    ],
  },
];

const POINTS_COUNT = 3;

export default class BoardPresenter {
  #boardContainer = null;
  #tripEventsComponent = new TripEventsView();
  #tripEventsListComponent = new TripEventsListView();

  constructor({boardContainer}) {
    this.#boardContainer = boardContainer;
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
    render(new EditPointView(), this.#tripEventsListComponent.getElement());
  }

  #renderNewPoint() {
    render(new NewPointView(), this.#tripEventsListComponent.getElement());
  }

  #renderPoint(point) {
    render(new PointView(point), this.#tripEventsListComponent.getElement());
  }

  #renderPoints() {
    POINTS.slice(0, POINTS_COUNT).forEach((point) => {
      this.#renderPoint(point);
    });
  }
}
