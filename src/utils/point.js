import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const EDIT_DATE_FORMAT = 'DD/MM/YY HH:mm';
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;

function getEventDate(date) {
  return dayjs(date).format(DATE_FORMAT).toUpperCase();
}

function getEventTime(date) {
  return dayjs(date).format(TIME_FORMAT);
}

function getEditDate(date) {
  return dayjs(date).format(EDIT_DATE_FORMAT);
}

function getEventDuration(dateFrom, dateTo) {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  if (durationInMinutes < MINUTES_IN_HOUR) {
    return `${durationInMinutes}M`;
  }

  if (durationInMinutes < MINUTES_IN_DAY) {
    const eventHours = Math.floor(durationInMinutes / MINUTES_IN_HOUR);
    const eventMinutes = durationInMinutes % MINUTES_IN_HOUR;

    return `${String(eventHours).padStart(2, '0')}H ${String(eventMinutes).padStart(2, '0')}M`;
  }

  const eventDays = Math.floor(durationInMinutes / MINUTES_IN_DAY);
  const eventDaysRemainder = durationInMinutes % MINUTES_IN_DAY;
  const eventDaysHours = Math.floor(eventDaysRemainder / MINUTES_IN_HOUR);
  const eventDaysMinutes = eventDaysRemainder % MINUTES_IN_HOUR;

  return `${String(eventDays).padStart(2, '0')}D ${String(eventDaysHours).padStart(2, '0')}H ${String(eventDaysMinutes).padStart(2, '0')}M`;
}

export {getEditDate, getEventDate, getEventDuration, getEventTime};
