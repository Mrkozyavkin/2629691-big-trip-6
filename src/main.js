import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();

tripEventsElement.remove();

render(new FilterView(), tripControlsFiltersElement);

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  pointsModel,
});

boardPresenter.init();
