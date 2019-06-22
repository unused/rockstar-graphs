/**
 * Configuration
 **/
const FILL_OPACITY = 0.75;
const BEFORE = 60 * 60 * 4; // Time before an event
const AFTER = 60 * 60 * 8; // Time after an event
const mood_scale = d3
  .scaleLinear()
  .domain([-1.0, 0.0, 1.0])
  .range(['IndianRed', 'GoldenRod', 'ForestGreen']);

export {BEFORE, AFTER, mood_scale};
