import makerjs from "makerjs";

type FillRule = "nonzero" | "evenodd";

interface GenerateTextSVGOptions {
  union?: boolean;
  kerning?: boolean;
  bezierAccuracy?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeNonScaling?: boolean;
  fillRule?: FillRule;
}

export function generateTextSVG(
  font: opentype.Font,
  text: string,
  size: number,
  options?: GenerateTextSVGOptions,
): string {
  const {
    union = true,
    kerning = true,
    bezierAccuracy = 0.1,
    fill,
    stroke,
    strokeWidth,
    strokeNonScaling = false,
    fillRule,
  } = options || {};

  // Create the text model with Maker.js using the provided font and text.
  const textModel = new makerjs.models.Text(
    font,
    text,
    size,
    union,
    false, // The parameter for "separate" outlines; set to false for a single combined model.
    bezierAccuracy,
    { kerning },
  );

  // Export the model to SVG with the desired styling.
  const svg = makerjs.exporter.toSVG(textModel, {
    fill: fill || undefined,
    stroke: stroke || undefined,
    strokeWidth: strokeWidth || undefined,
    fillRule: fillRule || undefined,
    scalingStroke: !strokeNonScaling,
  });

  return svg;
}
