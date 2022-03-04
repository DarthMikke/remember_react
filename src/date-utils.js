
/**
 * Parses datetime in format dd.mm.yyyy HH:MM
 * @param from {string}
 * @returns {Date}
 */
export function parseDate(from) {
  let reg = /([0-9]{2})\.([0-9]{2})\.([0-9]{4})\s([0-9]{1,2})\.([0-9]{1,2})/g;
  let array = reg.exec(from);
  if (array === null) {
    return null;
  }
  let tzOffset = -(new Date().getTimezoneOffset());
  let hrsOffset = Math.floor(tzOffset/60);
  let minutesOffset = tzOffset % 60;
  let offsetPositive = tzOffset >= 0;
  let [_, day, month, year, hours ,minutes] = array;
  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  let offsetString = (offsetPositive ? "+" : "-") + String(hrsOffset).padStart(2, "0") + ":" + String(minutesOffset).padStart(2, "0");
  return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00.000${offsetString}`);
}

/**
 * @param {Date|string} from
 * @param {Date} to
 * @returns {number}
 * */
export function daysSince(from, to=new Date()) {
  let day = 24*3600*1000;
  if (typeof(from) === "string") {
    from = new Date(from);
  }
  let from_day = from.getTime() - from.getTime()%(day)
  let to_day = to.getTime() - to.getTime()%(day)
  let diff = to_day - from_day;
  return Math.floor(diff/(day));
}

/**
 * @param {Date|string} from
 * @param {Date} to
 * @returns {string}
 * */
export function verboseDaysSince(from, to) {
  let days = daysSince(from, to);
  if (days === 0) {
    return "i dag";
  }
  else if (days === 1) {
    return "i går";
  }
  return `${days} d. sidan`;
}
