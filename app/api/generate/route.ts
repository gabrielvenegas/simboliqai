import { experimental_generateImage as generateImage } from "ai";
import { createReplicate } from "@ai-sdk/replicate";

export const config = {
  runtime: "nodejs",
};

export async function POST(req: Request) {
  try {
    const { iconDescription, sentiment, apiKey, brandName } = await req.json();

    const replicate = createReplicate({ apiToken: apiKey });

    const prompt = `Generate a ${iconDescription} icon with black strokes, a 6:5 aspect ratio, and a ${sentiment} style.`;

    const { image } = await generateImage({
      model: replicate.image("recraft-ai/recraft-20b-svg"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        replicate: {
          size: "1024x1024",
          style: "icon",
          prompt,
        },
      },
    });

    const iconSvgMarkup = Buffer.from(image.uint8Array).toString("utf8");
    const iconPathsOnly = iconSvgMarkup
      .replace(/<\?xml.*?>/g, "")
      .replace(/<!DOCTYPE.*?>/g, "")
      .replace(/<svg[^>]*>/, "")
      .replace(/<\/svg>/, "");

    const combinedSvg = `
<svg xmlns="http://www.w3.org/2000/svg"
    width="500"
    height="200"
    viewBox="0 0 500 200"
    preserveAspectRatio="xMidYMid meet">

  <g transform="translate(70,50) scale(0.05)">
    ${iconPathsOnly}
  </g>

  <text x="175" y="103"
      dominant-baseline="middle"
      text-anchor="start"
      style="font-family: 'Roboto', sans-serif; font-size: 54px; fill: black;">
    ${brandName}
  </text>
</svg>`;

    const modifiedBase64 = Buffer.from(combinedSvg).toString("base64");
    const dataUrl = `data:image/svg+xml;base64,${modifiedBase64}`;

    return new Response(JSON.stringify({ success: true, svgUrl: dataUrl }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 },
    );
  }
}
