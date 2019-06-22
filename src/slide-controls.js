import * as d3 from 'd3';

const PARTIALS = 8; // minimal partial width
const ts = () => new Date().getTime(); // timestamp shorthand

/**
 * DragContext calculates the current horizontal drag context.
 *
 * ts ... represents the current activation timestamp or zero if deactivated.
 * x ... is the current mouse position
 * lastX ... is the last mouse position
 * active ... describes the drag context state
 * activate/deactive ... update the drag context state
 * move ... updates current position and returns path width
 **/
class DragContext {
  constructor() {
    this.ts = 0;
  }

  _update() {
    this.lastX = this.x;
  }

  get x() {
    return window.event.pageX;
  }

  get active() {
    return this.ts !== 0;
  }

  get click() {
    return ts() - this.ts <= 300; // 300ms duration is our click detection
  }

  activate() {
    this.ts = ts();
    this._update();
  }

  deactivate() {
    this.ts = 0;
  }

  move() {
    const path = this.lastX - this.x;
    this._update();
    return 0 - path;
  }
}

/**
 * Move the sliding window with respect for current border limits.
 *
 * TODO: The path given is handled using pixel however the scalable graph is
 * not so this might need to get scaled at some point.
 **/
const dragMove = (ctx, slider, {min, max}) => {
  const path = ctx.move();
  const current = parseInt(slider.attr('x'), 10);
  const limit = min + max - parseInt(slider.attr('width'), 10);
  return Math.max(min, Math.min(limit, current + path));
};

/**
 * Handle Slider Control
 *
 * TODO: This controls lack of keyboard support - add a tabindex and provide
 * keyboard commands to interact or show a native html range slider instead.
 **/
const handleSliderControl = (histogram, graph, opts, notify) => {
  const partialWidth = Math.floor(opts.width / PARTIALS); // minimal width partial
  const ctx = new DragContext(); // drag context (active flag, x movement)
  const borders = {min: opts.margin + 1, max: opts.width};

  const updateSlider = (x, width) => {
    slider.attr('x', x).attr('width', width || slider.attr('width'));

    // Notify about slider updates.
    const max = borders.max - borders.min;
    const start = Math.floor(
      ((parseInt(slider.attr('x'), 10) - borders.min) / max) * 100,
    );
    const range = Math.ceil(
      (parseInt(slider.attr('width') - 1, 10) / max) * 100,
    );
    notify({start, range});
  };

  histogram.select('rect.slider').remove();
  const slider = histogram
    .append('rect')
    .attr('class', 'slider')
    .attr('x', borders.min) // move to right not to overlap axis
    .attr('width', borders.max);

  console.debug('x', slider.attr('x'));

  slider
    .on('change', () => console.debug('change'))
    .on('mousedown', () => ctx.activate())
    .on('mouseup', () => {
      // Update the sliding window if the mouse action was a click rather than
      // a drag (press mouse button down, move pointer and release).
      if (ctx.click) {
        const currentWidth = slider.attr('width');
        updateSlider(
          borders.min,
          currentWidth >= partialWidth * 1.25
            ? currentWidth - partialWidth
            : opts.width,
        );
      }
      ctx.deactivate();
    })
    .on('mouseleave', () => ctx.deactivate())
    .on('mousemove', () => {
      if (!ctx.active) {
        return;
      }
      updateSlider(dragMove(ctx, slider, borders));
    });
};

export default handleSliderControl;
