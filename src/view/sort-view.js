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

  constructor({sorts}) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }
}
