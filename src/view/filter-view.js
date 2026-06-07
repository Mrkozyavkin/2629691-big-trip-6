import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter) {
  const checkedAttribute = filter.isChecked ? ' checked' : '';
  const disabledAttribute = filter.isDisabled ? ' disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"
        ${checkedAttribute}
        ${disabledAttribute}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.type}">
        ${filter.name}
      </label>
    </div>`
  );
}

function createFilterTemplate(filters) {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterTypeChange = null;

  constructor({filters, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #filterTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('trip-filters__filter-input')) {
      return;
    }

    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
