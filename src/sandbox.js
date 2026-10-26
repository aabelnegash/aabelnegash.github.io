export const recordedOutput = Object.freeze({
  source: 'Recorded validation report',
  rows: 4812,
  columns: 20,
  validation_failures: 0,
});

const bindings = new WeakMap();

/** Display saved report values; this example does not execute a pipeline. */
export function initValidationExample() {
  const showButton = document.getElementById('show-output');
  const resetButton = document.getElementById('reset-output');
  const status = document.getElementById('output-status');
  const output = document.getElementById('validation-output');
  if (!showButton || !resetButton || !status || !output) {
    throw new Error('The recorded validation example is missing a required element.');
  }
  if (bindings.has(output)) return bindings.get(output);

  const initialOutput = output.textContent;
  const initiallyHidden = output.hidden;
  const initialStatus = status.textContent || 'Recorded output is hidden.';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  function show() {
    output.hidden = false;
    output.textContent = JSON.stringify(recordedOutput, null, 2);
    output.dataset.state = 'recorded';
    status.textContent = 'Recorded report output shown.';
    showButton.disabled = true;
    resetButton.disabled = false;
  }

  function reset() {
    output.hidden = initiallyHidden;
    output.textContent = initialOutput;
    output.dataset.state = 'idle';
    status.textContent = initialStatus;
    showButton.textContent = 'Show recorded output';
    showButton.disabled = false;
    resetButton.disabled = true;
  }

  function dispose() {
    showButton.removeEventListener('click', show);
    resetButton.removeEventListener('click', reset);
    bindings.delete(output);
  }

  showButton.addEventListener('click', show);
  resetButton.addEventListener('click', reset);
  bindings.set(output, dispose);
  reset();
  return dispose;
}
