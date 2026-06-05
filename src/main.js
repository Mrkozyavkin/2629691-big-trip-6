import {render} from './render.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.page-main .page-body__container');
const tripEventsElement = siteMainElement.querySelector('.trip-events');

tripEventsElement.remove();

render(new FilterView(), tripControlsFiltersElement);

const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
});

boardPresenter.init();
