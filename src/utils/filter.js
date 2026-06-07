import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.startDateTime).isAfter(dayjs())),
  [FilterType.PRESENT]: (points) => points.filter((point) => (
    dayjs(point.startDateTime).isBefore(dayjs()) && dayjs(point.endDateTime).isAfter(dayjs())
  )),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.endDateTime).isBefore(dayjs())),
};

export {filter};
