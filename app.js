// WebAppDJ - Music App using Tone.js
// Core: Synths, Effects, Sequencer, UI Controls, Presets

// Synthesizer setup
const synths = [
  new Tone.Synth().toDestination(),
  new Tone.FMSynth().toDestination(),
  new Tone.MembraneSynth().toDestination()
];

// Effects
const reverb = new Tone.Reverb(2).toDestination();
const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();

// Connect synths to effects
synths.forEach(synth => {
  synth.connect(reverb);
  synth.connect(delay);
});

// Sequencer grid (basic)

const notes = ['C4', 'E4', 'G4', 'B4'];
let numSteps = 8;
let pattern = Array(numSteps).fill(0); // Default: all synth 0
let bpm = 120;
Tone.Transport.bpm.value = bpm;

// Pattern grid: 2D array [synth][step], true if synth plays at step
let patternGrid = Array(3).fill().map(() => Array(numSteps).fill(false));
patternGrid[0][0] = true; // Example: first synth plays first step

// Render pattern editor grid
function renderPatternGrid() {
  const grid = document.getElementById('pattern-grid');
  grid.innerHTML = '';
  for (let synthIdx = 0; synthIdx < 3; synthIdx++) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.marginBottom = '4px';
    for (let step = 0; step < numSteps; step++) {
      const btn = document.createElement('button');
      btn.textContent = patternGrid[synthIdx][step] ? '●' : '○';
      btn.style.margin = '2px';
      btn.style.width = '32px';
      btn.style.height = '32px';
      btn.style.background = patternGrid[synthIdx][step] ? '#ff4081' : '#333';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.borderRadius = '50%';
      btn.onclick = () => {
        patternGrid[synthIdx][step] = !patternGrid[synthIdx][step];
        renderPatternGrid();
      };
      row.appendChild(btn);
    }
    const label = document.createElement('span');
    label.textContent = ` Synth ${synthIdx + 1}`;
    label.style.marginLeft = '8px';
    row.appendChild(label);
    grid.appendChild(row);
  }
}

// Render sequencer grid
function renderSequencerGrid() {
  const grid = document.getElementById('sequencer-grid');
  grid.innerHTML = '';
  for (let i = 0; i < numSteps; i++) {
    const select = document.createElement('select');
    select.dataset.step = i;
    ['Synth 1', 'Synth 2', 'Synth 3'].forEach((label, idx) => {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = label;
      if (pattern[i] === idx) option.selected = true;
      select.appendChild(option);
    });
    select.onchange = e => {
      pattern[i] = parseInt(e.target.value);
    };
    grid.appendChild(select);
  }
}

// Sequencer controls
function renderSequencerControls() {
  const controls = document.getElementById('sequencer-controls');
  controls.innerHTML = '';
  const stepLabel = document.createElement('label');
  stepLabel.textContent = 'Steps: ';
  const stepInput = document.createElement('input');
  stepInput.type = 'number';
  stepInput.min = 4;
  stepInput.max = 16;
  stepInput.value = numSteps;
  stepInput.oninput = e => {
    numSteps = parseInt(e.target.value);
    pattern = Array(numSteps).fill(0);
    // Resize patternGrid
    patternGrid = Array(3).fill().map(() => Array(numSteps).fill(false));
    renderSequencerGrid();
    renderPatternGrid();
  };
  stepLabel.appendChild(stepInput);
  controls.appendChild(stepLabel);
}

// Initial render

renderSequencerGrid();
renderSequencerControls();
renderPatternGrid();



function playPattern() {
  let step = 0;
  Tone.Transport.cancel();
  Tone.Transport.scheduleRepeat(time => {
    for (let synthIdx = 0; synthIdx < 3; synthIdx++) {
      if (patternGrid[synthIdx][step % numSteps]) {
        synths[synthIdx].triggerAttackRelease(notes[step % notes.length], '8n', time);
        visualize(synthIdx);
      }
    }
    step++;
  }, '8n');
  Tone.Transport.start();
}

function stopPattern() {
  Tone.Transport.stop();
  Tone.Transport.cancel();
}

// UI Controls
const controls = document.getElementById('controls');
controls.innerHTML = `
  <button id="playBtn">Play</button>
  <button id="stopBtn">Stop</button>
  <label>BPM: <input type="number" id="bpmInput" value="120" min="60" max="200"></label>
`;
document.getElementById('playBtn').onclick = playPattern;
document.getElementById('stopBtn').onclick = stopPattern;
document.getElementById('bpmInput').oninput = e => {
  bpm = parseInt(e.target.value);
  Tone.Transport.bpm.value = bpm;
};

// Visualization
function visualize(synthIdx) {
  const visualizer = document.getElementById('visualizer');
  visualizer.innerHTML = `<div style='font-size:2rem;'>Playing Synth ${synthIdx + 1}</div>`;
}

// Preset Save/Load
let savedPreset = null;


document.getElementById('savePreset').onclick = () => {
  savedPreset = { pattern: [...pattern], bpm, numSteps, patternGrid: patternGrid.map(row => [...row]) };
  alert('Preset saved!');
};
document.getElementById('loadPreset').onclick = () => {
  if (savedPreset) {
    numSteps = savedPreset.numSteps;
    pattern = [...savedPreset.pattern];
    bpm = savedPreset.bpm;
    patternGrid = savedPreset.patternGrid.map(row => [...row]);
    document.getElementById('bpmInput').value = bpm;
    Tone.Transport.bpm.value = bpm;
    renderSequencerGrid();
    renderSequencerControls();
    renderPatternGrid();
    alert('Preset loaded!');
  } else {
    alert('No preset saved.');
  }
};

// Keyboard input for notes
window.addEventListener('keydown', e => {
  const keyMap = { 'a': 0, 's': 1, 'd': 2 };
  if (keyMap[e.key] !== undefined) {
    synths[keyMap[e.key]].triggerAttackRelease('C4', '8n');
    visualize(keyMap[e.key]);
  }
});
