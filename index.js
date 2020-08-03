const ClickClackReceiver = (el, callback) => {
  const eventHistory = [];
  let startTime = null;

  el.addEventListener('input', (evt) => recordEvent(evt, callback));

  function recordEvent(evt, callback) {
    const { data, inputType } = evt;

    eventHistory.push(Object.assign({ data, inputType }, { timestamp: getTimestamp() }));
    if (typeof callback == 'function') {
      callback(eventHistory);
    }
  }

  function getTimestamp() {
    if (startTime === null) {
      startTime = Date.now();
      return 0;
    }

    return Date.now() - startTime;
  }
};