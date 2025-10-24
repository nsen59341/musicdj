# WebAppDJ

A web-based music app using Tone.js. Create, play, and experiment with musical patterns using an intuitive step sequencer.

## Features

### Synthesizers
- Bass (Square wave oscillator)
- Melody (Sine wave oscillator)
- Harmony (Triangle wave oscillator)
- Built-in reverb effect for rich sound

### Step Sequencer
- Interactive grid-based pattern editor
- Adjustable step count (4-16 steps)
- Visual step indicators
- Real-time pattern editing
- Instant sound preview when toggling steps

### Playback Controls
- Play/Pause and Stop functionality
- Tempo control (60-180 BPM)
- Visual tempo display
- Pattern looping

### Visual Feedback
- Color-coded instrument visualization
- Animated effects for active sounds
- Real-time step indication
- Clear instrument labeling

### Additional Features
- Pattern preset save/load system
- Keyboard shortcuts (A/S/D) for live play
- Responsive design for desktop and tablet
- User-friendly interface

## Setup
1. Open `index.html` in your browser
2. Click anywhere to initialize audio
3. No installation required - all dependencies load via CDN

## Usage
1. **Pattern Creation**:
   - Click grid buttons to toggle steps on/off
   - Each row represents a different instrument
   - Green buttons indicate active steps

2. **Playback**:
   - Press ▶ to start/pause
   - Use ⬛ to stop and reset
   - Adjust tempo using the slider
   - Watch the visualizer for feedback

3. **Save/Load**:
   - Save your patterns using the Save button
   - Load them back using the Load button

4. **Live Playing**:
   - Use A/S/D keys to play instruments manually
   - A = Bass, S = Melody, D = Harmony

## Technical Stack
- HTML5 for structure
- CSS3 for styling and animations
- JavaScript (ES6+) for logic
- Tone.js for audio synthesis and timing

## License
MIT
