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

const InputTypes = {
  INSERT: 'insertText',
  DELETE: 'deleteContentBackward',
};

/**
 * 
 * @param {Node} parent - the node we're quote-unquote typing in 
 * @param {Object[]} events - a list of clickclack events 
 */
const replay = (parent, events) => {
  if (!events.length) {
    return;
  }

  const currentNode = document.createTextNode('');
  parent.appendChild(currentNode);

  const actions = {
    [InputTypes.INSERT]: appendText,
    [InputTypes.DELETE]: chopText,
  };

  function appendText(text) {
    currentNode.textContent += text;
  }

  function chopText() {
    currentNode.textContent = currentNode.textContent.slice(0, -1);
  }

  function applyEvent({ data, inputType }) {
    actions[inputType].call(null, data);
  }

  (function doReplay(_events) {
    const [current, next, ...rest] = _events;
    if (!current) {
      return;
    }

    applyEvent(current);
    if (next) {
      setTimeout(() => doReplay([next, ...rest]), next.timestamp - current.timestamp);
    }
  })(events);
};