import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

tripEventsElement.remove();

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFiltersElement,
  filterModel,
  pointsModel,
});

filterPresenter.init();

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  pointsModel,
  filterModel,
});

boardPresenter.init();
