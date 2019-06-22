import * as d3 from 'd3';
import debounce from './debounce';

const handleSliderControl = (active, slider) => {
  const {pageX, pageY} = window.event;

  console.debug('slider', active, slider, pageX, pageY);
  d3.window(slider).attr('fill', 'blue');

  // slider.style.cursor = ? 'grab' : 'col-resize';

  debounce(() => {}, 25);
};

export default handleSliderControl;
