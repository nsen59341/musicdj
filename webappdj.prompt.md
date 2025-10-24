---
mode: agent
model: Claude Sonnet 3.5
---

## Objective
Create an interactive web-based step sequencer using Tone.js that enables users to create musical patterns with multiple synthesizers. The application should feature an intuitive grid-based interface with real-time visual feedback and pattern editing capabilities.

## Requirements

### Technical Stack
- HTML5 for structure and layout
- CSS3 for styling and animations
- JavaScript (ES6+) for application logic
- Tone.js library for audio synthesis and sequencing

### Functional Requirements
1. Step Sequencer Interface
   - Grid-based pattern editor with numbered steps
   - 3 distinct synthesizer tracks (Bass, Melody, Harmony)
   - Adjustable step count (4-16 steps)
   - Visual indication of current playing step
   - Clear labeling for all controls and instruments

2. Sound Generation
   - Bass: Square wave oscillator for punchy bass sounds
   - Melody: Sine wave oscillator for smooth lead sounds
   - Harmony: Triangle wave oscillator for supporting tones
   - Built-in reverb effect for spatial enhancement
   - Preview sounds when toggling steps

3. Playback Controls
   - Play/Pause and Stop functionality
   - Tempo control (60-180 BPM) with visual display
   - Pattern looping with automatic restart
   - Individual step triggering for pattern creation

4. Visual Feedback
   - Color-coded instrument visualization
   - Animated effects for active sounds
   - Clear step numbering and instrument labeling
   - Current step indicator during playback

5. User Interactions
   - Click/tap interface for step toggling
   - Keyboard shortcuts (A/S/D) for live playing
   - Pattern preset save/load system
   - Responsive layout for desktop and tablet use

## Implementation Details

### Core Components
1. Audio Engine
   - Initialize Tone.js context on user interaction
   - Configure synthesizer instances with specific waveforms
   - Set up reverb effect chain
   - Implement proper audio scheduling

2. Step Sequencer
   - Pattern data structure for multiple tracks
   - Step toggle system with state management
   - Timing engine for accurate playback
   - Pattern storage and recall system

3. User Interface
   - Transport controls with clear icons
   - Interactive step grid with visual feedback
   - Tempo control slider with BPM display
   - Instrument labels and step numbers
   - Color-coded visual elements

### Technical Considerations
- Initialize audio context only after user interaction
- Implement precise timing using Tone.js Transport
- Handle pattern data persistence for presets
- Ensure responsive design across devices
- Provide clear visual feedback for all actions

## Deliverables

1. Application Structure
   - index.html with proper semantic markup
   - style.css with responsive design
   - app.js with modular organization
   - README.md with setup and usage instructions

2. Core Features
   - Functioning step sequencer grid
   - Three distinct synthesizer tracks
   - Working playback system
   - Pattern preset functionality
   - Real-time visualizations

3. User Interface
   - Clean, modern design
   - Intuitive control layout
   - Clear visual feedback
   - Responsive grid system
   - Animated elements

4. Documentation
   - Setup instructions
   - User guide with examples
   - Code documentation
   - Pattern creation tutorial

5. Testing
   - Browser compatibility verification
   - Mobile/tablet responsiveness
   - Audio timing accuracy
   - User interaction testing