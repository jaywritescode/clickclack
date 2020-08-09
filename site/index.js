import replay, { Recording } from '../index';

document.addEventListener('DOMContentLoaded', () => {
  var codemirror = CodeMirror.fromTextArea(document.getElementById('output'), {
    mode: 'json',
    readOnly: true,
    lineNumbers: true,
    lineWrapping: true,
  });

  const recorder = Recording(document.getElementById('typing-area'), (history) => {
    codemirror.setValue(JSON.stringify(history, null, '  '));
  });
  recorder.init();

  document.querySelector('#replay-area button').addEventListener('click', () => {
    const parent = document.querySelector('#replay-area .text-holder');
    const events = JSON.parse(codemirror.getValue());

    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    replay(parent, events);
  });
});
