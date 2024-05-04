type SimpleTooltipOptions = {
  tooltipDiv: HTMLDivElement;
  paddingLeft?: number;
  paddingTop?: number;
};

export function simpleTooltip(node: SVGElement | HTMLElement, options: SimpleTooltipOptions) {
  const { tooltipDiv } = options;
  const paddingLeft = options.paddingLeft || 25;
  const paddingTop = options.paddingTop || 25;

  if (tooltipDiv) {
    tooltipDiv.style.position = 'fixed';
    tooltipDiv.style.zIndex = '100';
    tooltipDiv.style.border = '1px solid rgba(var(--theme-font-color-base))';
    tooltipDiv.style.padding = '5px';
    tooltipDiv.style.borderRadius = '5px';
    tooltipDiv.style.pointerEvents = 'none';
    tooltipDiv.style.display = 'none';
  }

  function updateTooltipPosition(event: MouseEvent) {
    const tooltipWidth = tooltipDiv.offsetWidth;
    const tooltipHeight = tooltipDiv.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let x = event.pageX + paddingLeft;
    let y = event.pageY + paddingTop;

    // Adjust horizontally - Check if the tooltip would go out of bounds
    if (x + tooltipWidth > screenWidth) {
      x = screenWidth - tooltipWidth; // Move tooltip to the left of the cursor
    }

    // Adjust vertically - Check if the tooltip would go out of bounds
    if (y + tooltipHeight > screenHeight) {
      y = event.pageY - tooltipHeight; // Move tooltip above the cursor
    }

    tooltipDiv.style.left = `${x}px`;
    tooltipDiv.style.top = `${y}px`;
  }

  function mouseOver(event: Event) {
    const mouseEvent = event as MouseEvent;
    tooltipDiv.innerHTML = node?.dataset.title || '';

    if (tooltipDiv.innerHTML !== '') {
      tooltipDiv.style.display = 'block';
      updateTooltipPosition(mouseEvent)
    }
  }

  function mouseMove(event: Event) {
    const mouseEvent = event as MouseEvent;
    updateTooltipPosition(mouseEvent)
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
