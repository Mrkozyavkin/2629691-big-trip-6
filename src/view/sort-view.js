import AbstractView from '../framework/view/abstract-view.js';

function createSortItemTemplate(sort) {
  const checkedAttribute = sort.isChecked ? ' checked' : '';
  const disabledAttribute = sort.isDisabled ? ' disabled' : '';

  return (
    `<div class="trip-sort__item  trip-sort__item--${sort.type}">
      <input
        id="sort-${sort.type}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sort.type}"
        data-sort-type="${sort.type}"
        ${checkedAttribute}
        ${disabledAttribute}
      >
      <label class="trip-sort__btn" for="sort-${sort.type}">
        ${sort.name}
      </label>
    </div>`
  );
}

function createSortTemplate(sorts) {
  const sortItemsTemplate = sorts
    .map((sort) => createSortItemTemplate(sort))
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sorts = null;
  #handleSortTypeChange = null;

  constructor({sorts, onSortTypeChange}) {
    super();
    this.#sorts = sorts;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('trip-sort__input')) {
      return;
    }

    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
