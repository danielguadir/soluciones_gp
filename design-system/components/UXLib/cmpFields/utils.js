const ICONS_FIELD = {
  CANCEL: "cancel-squared",
  SEARCH: "search",
  HAMBURGUER: "th-list",
  EDIT: "pencil",
  DELETE: "trash",
  ADD: "plus",
  CHECK: "ok",
  EYE: "eye",
  EYE_OFF: "eye-off",
  LIST_CHECK: "th-list-1",
  MAP_ICO_PIN: "map-pin",
  MAP_ICO_WATCH_POSITION: "flight",
  MAP_ICO_LOCATION: "location",
  MAP_TARGET_CURRENT_POSITION: "target-1",
  DATE_ICON: "calendar",
  LOCK: "apple",
};

const ICONS_SIZE = {
  SMALL: "12pt",
  MEDIUM: "15pt",
  LARGE: "20pt",
};

const dateToLong = (date) => {
  return date.getTime(); // Retorna el tiempo en milisegundos
};

const longToDate = (timestamp) => {
  return new Date(timestamp);
};

export { ICONS_FIELD, ICONS_SIZE };
export { dateToLong, longToDate };
