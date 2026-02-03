import { RefObject, useEffect } from "react";

type LogoViewerProps = {
  svg: string;
  svgContainer: RefObject<HTMLDivElement | null>;
};

export default function LogoViewer({ svg, svgContainer }: LogoViewerProps) {
  useEffect(() => {
    const container = svgContainer.current;
    if (!container) return;

    container.innerHTML = svg || "";

    const svgEl = container.querySelector("svg");
    if (svgEl) {
      svgEl.removeAttribute("width");
      svgEl.removeAttribute("height");

      svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");

      svgEl.style.width = "100%";
      svgEl.style.height = "100%";
      svgEl.style.maxWidth = "100%";
      svgEl.style.maxHeight = "100%";
      svgEl.style.display = "block";

      if (!svgEl.getAttribute("viewBox")) {
        try {
          const bbox = (svgEl as SVGGraphicsElement).getBBox();
          svgEl.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);
        } catch (err) {}
      }
    }
  }, [svg, svgContainer]);

  return (
    <div className="w-full h-full">
      <div
        ref={svgContainer}
        className="my-svg-container w-full h-96 overflow-hidden"
      />
    </div>
  );
}
