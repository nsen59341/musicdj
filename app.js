// WebAppDJ - Music App using Tone.js
// Initialize audio context when user interacts
document.addEventListener('click', async () => {
    await Tone.start();
});

// Synthesizer setup with simpler synths
const synths = [
    new Tone.Synth({ oscillator: { type: 'square' } }).toDestination(),  // Bass
    new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination(),    // Melody
    new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination() // Harmony
];

// Simple effects chain
const reverb = new Tone.Reverb(1.5).toDestination();
synths.forEach(synth => synth.connect(reverb));

// Sequencer setup
const notes = ['C4', 'E4', 'G4', 'B4'];
const numSteps = 8;
const synthNames = ['Bass', 'Melody', 'Harmony'];
let currentStep = 0;
let isPlaying = false;
let bpm = 120;

// Initialize pattern grid (which synth plays at which step)
let pattern = Array(3).fill().map(() => Array(numSteps).fill(false));

// Set initial tempo
Tone.Transport.bpm.value = bpm;

// Render the step sequencer grid
function renderSequencer() {
    const grid = document.getElementById('step-grid');
    const labels = document.getElementById('synth-labels');
    grid.innerHTML = '';
    labels.innerHTML = '';

    // Create synth labels
    synthNames.forEach((name, index) => {
        const label = document.createElement('div');
        label.className = 'synth-label';
        label.textContent = name;
        labels.appendChild(label);
    });

    // Add step numbers row
    const stepNumbersRow = document.createElement('div');
    stepNumbersRow.className = 'step-numbers';
    for (let step = 0; step < numSteps; step++) {
        const stepNumber = document.createElement('div');
        stepNumber.className = 'step-number';
        stepNumber.textContent = (step + 1).toString();
        stepNumber.style.padding = '0 0 0 3px';
        stepNumber.style.color = '#fff';
        stepNumbersRow.appendChild(stepNumber);
    }
    grid.appendChild(stepNumbersRow);

    // Create step buttons
    synthNames.forEach((name, synthIndex) => {
        const row = document.createElement('div');
        row.className = 'step-row';
        
        // Add instrument name label
        const nameLabel = document.createElement('div');
        nameLabel.className = 'row-label';
        nameLabel.textContent = name;
        row.appendChild(nameLabel);
        
        // Create buttons for each step
        for (let step = 0; step < numSteps; step++) {
            const button = document.createElement('button');
            button.className = 'step-button';
            button.classList.toggle('active', pattern[synthIndex][step]);
            button.title = `${name} - Beat ${step + 1}`; // Tooltip
            
            button.onclick = () => {
                pattern[synthIndex][step] = !pattern[synthIndex][step];
                button.classList.toggle('active');
                // Preview sound when toggling
                if (pattern[synthIndex][step]) {
                    synths[synthIndex].triggerAttackRelease('C4', '8n');
                }
            };
            
            row.appendChild(button);
        }
        grid.appendChild(row);
    });
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
    
    // Create container for settings
    const settingsContainer = document.createElement('div');
    settingsContainer.className = 'settings-grid';
    
    // Steps control
    const stepsControl = document.createElement('div');
    stepsControl.className = 'control-group';
    const stepLabel = document.createElement('label');
    stepLabel.textContent = 'Steps: ';
    const stepInput = document.createElement('input');
    stepInput.type = 'number';
    stepInput.min = 4;
    stepInput.max = 16;
    stepInput.value = numSteps;
    stepInput.className = 'number-input';
    stepInput.oninput = e => {
        const newSteps = parseInt(e.target.value);
        if (newSteps >= 4 && newSteps <= 16) {
            numSteps = newSteps;
            pattern = Array(3).fill().map(() => Array(numSteps).fill(false));
            renderSequencer();
        }
    };
    stepsControl.appendChild(stepLabel);
    stepsControl.appendChild(stepInput);
    
    // Add controls to container
    settingsContainer.appendChild(stepsControl);
    controls.appendChild(settingsContainer);
    
    // Add styles for settings
    const style = document.createElement('style');
    style.textContent = `
        .settings-grid {
            display: grid;
            gap: 1rem;
            padding: 1rem;
        }
        .control-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .number-input {
            width: 60px;
            padding: 4px 8px;
            border: 1px solid #444;
            border-radius: 4px;
            background: #333;
            color: white;
        }
        .control-group label {
            min-width: 80px;
        }
    `;
    document.head.appendChild(style);
}

// Initialize the application
function initializeApp() {
    setupControls();
    renderSequencer();
    renderSequencerControls();
    initializeVisualizer();
    
    // Set up initial visual state
    updateStepIndicator(-1);
}

// Add step indicator update function
function updateStepIndicator(step) {
    const buttons = document.querySelectorAll('.step-button');
    buttons.forEach(btn => btn.classList.remove('current'));
    if (step >= 0) {
        document.querySelectorAll('.step-row').forEach(row => {
            row.children[step].classList.add('current');
        });
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);



// Sequencer playback functions
function startSequencer() {
    if (!isPlaying) {
        isPlaying = true;
        currentStep = 0;
        
        // Schedule the pattern
        Tone.Transport.scheduleRepeat((time) => {
            // Play active notes for current step
            pattern.forEach((row, synthIndex) => {
                if (row[currentStep]) {
                    synths[synthIndex].triggerAttackRelease('C4', '8n', time);
                    visualize(synthIndex);
                }
            });
            
            // Update current step indicator
            updateStepIndicator(currentStep);
            currentStep = (currentStep + 1) % numSteps;
        }, '8n');
        
        Tone.Transport.start();
        document.getElementById('playBtn').textContent = '⏸ Pause';
    } else {
        Tone.Transport.pause();
        isPlaying = false;
        document.getElementById('playBtn').textContent = '▶ Play';
    }
}

function stopSequencer() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    isPlaying = false;
    currentStep = 0;
    document.getElementById('playBtn').textContent = '▶ Play';
    updateStepIndicator(-1); // Clear step indicator
}

// Setup transport controls
function setupControls() {
    const transportControls = document.getElementById('transport-controls');
    const tempoControl = document.getElementById('tempo-control');
    
    // Play/Stop controls
    transportControls.innerHTML = `
        <button id="playBtn" class="control-button">▶ Play</button>
        <button id="stopBtn" class="control-button">⬛ Stop</button>
    `;
    
    // Tempo control
    tempoControl.innerHTML = `
        <label>
            Tempo: <input type="range" id="tempoSlider" min="60" max="180" value="120">
            <span id="tempoValue">120 BPM</span>
        </label>
    `;

    // Event handlers
    document.getElementById('playBtn').onclick = startSequencer;
    document.getElementById('stopBtn').onclick = stopSequencer;
    document.getElementById('tempoSlider').oninput = (e) => {
        const tempo = parseInt(e.target.value);
        document.getElementById('tempoValue').textContent = `${tempo} BPM`;
        Tone.Transport.bpm.value = tempo;
    };
}

// Visualization
function visualize(synthIdx) {
    const visualizer = document.getElementById('visual-display');
    
    // Create visualization effect
    const effect = document.createElement('div');
    effect.className = 'visual-effect';
    effect.style.backgroundColor = getColorForSynth(synthIdx);

    // Hide placeholder on first visualization
    document.getElementById('visual-placeholder').style.display = 'none';
    
    // Show instrument name
    const label = document.createElement('div');
    label.className = 'visual-label';
    label.textContent = synthNames[synthIdx];
    
    effect.appendChild(label);
    visualizer.appendChild(effect);
    
    // Animate and remove after animation
    setTimeout(() => {
        effect.classList.add('fade-out');
        setTimeout(() => effect.remove(), 500);
    }, 100);
}

// Get color for each synth
function getColorForSynth(synthIdx) {
    const colors = [
        '#4CAF50', // Bass - Green
        '#2196F3', // Melody - Blue
        '#FF9800'  // Harmony - Orange
    ];
    return colors[synthIdx];
}

// Initialize visualizer
function initializeVisualizer() {
    const visualizer = document.getElementById('visual-display');
    visualizer.innerHTML = '<div class="visual-placeholder" id="visual-placeholder">Music Visualizer - Press Play to Start</div>';
    
    // Add visualizer styles
    const style = document.createElement('style');
    style.textContent = `
        #visual-display {
            position: relative;
            min-height: 150px;
            background: #1a1a1a;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 20px;
            justify-content: center;
            align-items: center;
        }
        
        .visual-effect {
            padding: 20px;
            border-radius: 50%;
            animation: pulse 0.5s ease-out;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 5px;
        }
        
        .visual-label {
            color: white;
            font-size: 14px;
            text-shadow: 0 0 4px rgba(0,0,0,0.5);
        }
        
        .visual-placeholder {
            color: #666;
            font-size: 1.2rem;
        }
        
        @keyframes pulse {
            0% { transform: scale(0.5); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 0; }
        }
        
        .fade-out {
            opacity: 0;
            transition: opacity 0.5s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Preset Save/Load
let savedPreset = null;

document.getElementById('savePreset').onclick = () => {
    savedPreset = {
        pattern: pattern.map(row => [...row]), // Save a deep copy of the pattern
        bpm,
        numSteps
    };
    alert('Preset saved!');
};

document.getElementById('loadPreset').onclick = () => {
    if (savedPreset) {
        bpm = savedPreset.bpm;
        numSteps = savedPreset.numSteps;
        pattern = savedPreset.pattern.map(row => [...row]); // Load a deep copy of the pattern
        
        // Update tempo
        document.getElementById('tempoValue').textContent = `${bpm} BPM`;
        document.getElementById('tempoSlider').value = bpm;
        Tone.Transport.bpm.value = bpm;
        
        // Update UI
        renderSequencer();
        renderSequencerControls();
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
