
type SimpleTooltipOptions = {
  tooltipDiv: HTMLDivElement;
};

export function simpleTooltip(node: SVGElement, options: SimpleTooltipOptions) {
  const { tooltipDiv } = options;

  let x;
  let y;

  function mouseOver(event: MouseEvent) {
    x = event.pageX + 15;
    y = event.pageY + 15;
    tooltipDiv.innerHTML = node.dataset.title || '';
    tooltipDiv.style.left = x + 'px';
    tooltipDiv.style.top = y + 'px';
    tooltipDiv.style.display = 'block';
  }

  function mouseMove(event: MouseEvent) {
    x = event.pageX + 15;
    y = event.pageY + 15;
    tooltipDiv.style.left = x + 'px';
    tooltipDiv.style.top = y + 'px';
  }

  function mouseLeave() {
    tooltipDiv.innerHTML = '';
    tooltipDiv.style.display = 'none';
  }

  node.addEventListener('mouseover', mouseOver);
  node.addEventListener('mousemove', mouseMove);
  node.addEventListener('mouseleave', mouseLeave);

  return {
    destroy: () => {
      node.removeEventListener('mouseover', mouseOver);
      node.removeEventListener('mousemove', mouseMove);
      node.removeEventListener('mouseleave', mouseLeave);
    }
  };
}
