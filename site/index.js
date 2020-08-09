import replay, { Recording } from '../index';

document.addEventListener('DOMContentLoaded', () => {
  const codemirror = CodeMirror.fromTextArea(document.getElementById('output'), {
    mode: 'json',
    readOnly: true,
    lineNumbers: true,
    lineWrapping: true,
  });

  const typingElement = document.querySelector('#typing-area textarea');
  const replayElement = document.querySelector('#replay-area .text-holder');

  const recorder = Recording(typingElement, (history) => {
    codemirror.setValue(JSON.stringify(history, null, '  '));
  });
  recorder.init();

  document.querySelector('#typing-area button').addEventListener('click', () => {
    recorder.destroy();

    typingElement.value = null;
    clearReplay();

    recorder.init();
  });

  document.querySelector('#replay-area button').addEventListener('click', () => {
    replay(replayElement, JSON.parse(codemirror.getValue()));
  });

  function clearReplay() {
    while (replayElement.firstChild) {
      replayElement.removeChild(replayElement.firstChild);
    }
  }
});
