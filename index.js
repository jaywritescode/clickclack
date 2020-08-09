export const Recording = (el, callback) => {
  const eventHistory = [];
  let startTime = null;

  const init = () => {
    el.addEventListener('input', doRecordEvent);
  }

  const destroy = () => {
    el.removeEventListener('input', doRecordEvent);
    startTime = null;
    eventHistory.length = 0;
  }

  function doRecordEvent(evt) {
    const { data, inputType } = evt;

    eventHistory.push(Object.assign({ data, inputType }, { timestamp: getTimestamp() }));
    if (typeof callback === 'function') {
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

  return { init, destroy };
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
export default function replay(parent, events) {
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