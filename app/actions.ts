"use server";

import { createClient } from "@/lib/supabase/server";
import { createReplicate } from "@ai-sdk/replicate";
import { experimental_generateImage as generateImage } from "ai";
import path from "path";
import fs from "fs";
import { calm, elegant, playful } from "@/lib/fonts";

const fontsMap = {
  calm,
  playful,
  elegant,
  professional: [
    {
      name: "",
      path: "",
    },
  ],
  energetic: [
    {
      name: "",
      path: "",
    },
  ],
};

export type FontStyle = keyof typeof fontsMap;

const extraPrompts: Record<FontStyle, string> = {
  playful: "The playful style has thicker strokes and a more whimsical design.",
  elegant: "The elegant style has thinner strokes and a more minimal design.",
  professional:
    "The professional style has medium strokes and a more formal design.",
  calm: "The calm style has thin strokes and a more minimal design.",
  energetic: "The energetic style has bold strokes and a more dynamic design.",
};

export async function signUp(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

function getFont(fontStyle: FontStyle) {
  let fonts = fontsMap[fontStyle];

  if (!fonts || fonts.length === 0) {
    fonts = fontsMap["calm"];
  }

  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
  const filePath = path.join(process.cwd(), randomFont.path);
  const fontBuffer = fs.readFileSync(filePath);

  return {
    name: randomFont.name,
    base64: fontBuffer.toString("base64"),
  };
}

export async function generateLogo(payload: {
  brandName: string;
  iconDescription: string;
  fontStyle: string;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data || !data.user) {
    throw new Error("User not found");
  }

  const { data: userCredits } = await supabase
    .from("user_credits")
    .select("credits")
    .single();

  if (!userCredits) {
    throw new Error("Unknown error");
  }

  if (userCredits.credits <= 0) {
    throw new Error("Insufficient credits");
  }

  try {
    const replicate = createReplicate({
      apiToken: process.env.REPLICATE_API_KEY,
    });

    const { brandName, iconDescription, fontStyle } = payload;

    let prompt = `Generate a ${iconDescription} icon with black strokes and a ${fontStyle} style. `;

    const font = getFont(fontStyle as FontStyle);

    prompt = prompt.concat(
      extraPrompts[fontStyle as keyof typeof extraPrompts],
    );

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
    // const iconSvgMarkup = "";
    const iconPathsOnly = iconSvgMarkup
      .replace(/<\?xml.*?>/g, "")
      .replace(/<!DOCTYPE.*?>/g, "")
      .replace(/<svg[^>]*>/, "")
      .replace(/<\/svg>/, "");

    // const combinedSvg = `
    //   <svg xmlns="http://www.w3.org/2000/svg"
    //        width="500"
    //        height="200"
    //        viewBox="0 0 500 200"
    //        preserveAspectRatio="xMidYMid meet">
    //     <defs>
    //       <style type="text/css">
    //         @font-face {
    //           font-family: '${font.name}';
    //           src: url("data:font/ttf;base64,${font.base64}") format("truetype");
    //         }
    //       </style>
    //     </defs>
    //     <g transform="translate(70,50) scale(0.05)">
    //       ${iconPathsOnly}
    //     </g>
    //     <text x="175" y="108"
    //           dominant-baseline="middle"
    //           text-anchor="start"
    //           style="font-family: '${font.name}', sans-serif; font-size: 54px; fill: black;">
    //       ${brandName}
    //     </text>
    //   </svg>`;
    //
    // get font size based on brand name length
    const fontSize = 76 - 2.75 * brandName.length;
    const symbolScale = 0.04 - 0.0003 * brandName.length;
    const translateOffset = 6 + 0.25 * brandName.length;

    // const combinedSvg = `
    //   <svg xmlns="http://www.w3.org/2000/svg"
    //        width="500"
    //        height="100"
    //        viewBox="0 0 500 100"
    //        preserveAspectRatio="xMidYMid meet">
    //     <defs>
    //       <style type="text/css">
    //         @font-face {
    //           font-family: '${font.name}';
    //           src: url("data:font/ttf;base64,${font.base64}") format("truetype");
    //         }
    //       </style>
    //     </defs>
    //     <g transform="translate(${translateOffset}, ${translateOffset}) scale(${symbolScale})">
    //       ${iconPathsOnly}
    //     </g>
    //     <text x="90" y="48"
    //           dominant-baseline="middle"
    //           text-anchor="start"
    //           style="font-family: '${font.name}', sans-serif; font-size: ${fontSize}px; fill: black;">
    //       ${brandName}
    //     </text>
    //   </svg>`;
    //
    const combinedSvg = {
      icon: `<g id="icon">${iconPathsOnly}</g>`,
      text: `<text style="font-family: '${font.name}', sans-serif; font-size: ${fontSize}px; fill: black;"> ${brandName}</text>`,
    };

    // const modifiedBase64 = Buffer.from(combinedSvg).toString("base64");
    // const svgUrl = `data:image/svg+xml;base64,${modifiedBase64}`;

    const { error } = await supabase.from("credit_transactions").insert([
      {
        transaction_type: "spend",
        amount: 1,
        description: "Logo generation",
        user_id: data.user.id,
      },
    ]);

    if (error) {
      console.log(`
            Error creating credit transaction: ${error.message}
            User ID: ${data.user.id}
            Date: ${new Date().toISOString()}
        `);
    }

    return { success: true, svgUrl: combinedSvg };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate logo");
  }
}
