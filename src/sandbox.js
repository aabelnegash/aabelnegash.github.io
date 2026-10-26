export const sampleOutput = Object.freeze({
  mode: 'simulation',
  status: 'success',
  rows: 4812,
  columns: 20,
  validation_failures: 0,
});

const sandboxBindings = new WeakMap();

export function initSandbox() {
  const consolePanel = document.getElementById('sandbox-console');
  const runButton = document.getElementById('run-pipeline');
  const runLabel = document.getElementById('run-label');
  const spinner = document.getElementById('pipeline-spinner');
  const resetButton = document.getElementById('reset-pipeline');
  const status = document.getElementById('pipeline-status');
  const output = document.getElementById('pipeline-output');
  const terminalStatus = document.getElementById('terminal-status');

  if (
    !consolePanel || !runButton || !runLabel || !spinner ||
    !resetButton || !status || !output || !terminalStatus
  ) {
    throw new Error('The pipeline simulation is missing a required element.');
  }

  if (sandboxBindings.has(consolePanel)) {
    return sandboxBindings.get(consolePanel);
  }

  const idleOutput = output.textContent;
  let completionTimer = null;
  let runVersion = 0;

  function cancelCompletion() {
    runVersion += 1;
    if (completionTimer !== null) {
      window.clearTimeout(completionTimer);
      completionTimer = null;
    }
  }

  function reset() {
    cancelCompletion();
    runButton.disabled = false;
    resetButton.disabled = true;
    spinner.hidden = true;
    runLabel.textContent = 'Run Pipeline';
    status.textContent = 'Ready to simulate';
    terminalStatus.textContent = 'IDLE';
    output.textContent = idleOutput;
    output.dataset.state = 'idle';
    consolePanel.setAttribute('aria-busy', 'false');
  }

  function run() {
    if (completionTimer !== null) return;

    cancelCompletion();
    const thisRun = runVersion;
    runButton.disabled = true;
    resetButton.disabled = false;
    spinner.hidden = false;
    runLabel.textContent = 'Validating schemas…';
    status.textContent = 'Simulation running · no Python is executed';
    terminalStatus.textContent = 'SIMULATING';
    output.dataset.state = 'running';
    output.textContent = [
      '> Simulation started',
      '> Validating schemas…',
      '> Checking the recorded report values…',
      '> No Python is executed in this preview.',
    ].join('\n');
    consolePanel.setAttribute('aria-busy', 'true');

    completionTimer = window.setTimeout(() => {
      if (thisRun !== runVersion) return;

      completionTimer = null;
      output.textContent = JSON.stringify(sampleOutput, null, 2);
      output.dataset.state = 'success';
      runLabel.textContent = 'Run again';
      runButton.disabled = false;
      spinner.hidden = true;
      status.textContent = 'Simulation complete · recorded report values';
      terminalStatus.textContent = 'SUCCESS';
      consolePanel.setAttribute('aria-busy', 'false');
    }, 1400);
  }

  function dispose() {
    cancelCompletion();
    runButton.removeEventListener('click', run);
    resetButton.removeEventListener('click', reset);
    sandboxBindings.delete(consolePanel);
  }

  runButton.addEventListener('click', run);
  resetButton.addEventListener('click', reset);
  sandboxBindings.set(consolePanel, dispose);
  reset();

  return dispose;
}
