const ClickClackReceiver = (el) => {
  const eventHistory = [];
  let startTime = null;

  el.addEventListener('input', recordEvent);

  function recordEvent(evt, callback) {
    const { data, inputType } = evt;

    eventHistory.push(Object.assign({ data, inputType }, { timestamp: getTimestamp() }));
    callback(eventHistory);
  }

  function getTimestamp() {
    if (startTime === null) {
      startTime = Date.now();
      return 0;
    }

    return Date.now() - startTime;
  }
};