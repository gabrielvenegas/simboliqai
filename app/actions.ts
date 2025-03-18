"use server";

import { createClient } from "@/lib/supabase/server";
import { createReplicate } from "@ai-sdk/replicate";
import { experimental_generateImage as generateImage } from "ai";
import { calm, elegant, playful } from "@/lib/fonts";

const fontsMap = {
  calm,
  playful,
  elegant,
  professional: [
    {
      name: "",
      url: "asdasd",
    },
  ],
  energetic: [
    {
      name: "",
      url: "",
    },
  ],
};

export type FontStyle = keyof typeof fontsMap;

const extraPrompts: Record<FontStyle, string> = {
  playful: "The playful style has thicker strokes and a more whimsical design.",
  elegant: "The elegant style has thinner strokes and a more minimal design.",
  professional:
    "The professional style has medium strokes and a more formal design.",
  calm: "The calm style has slightly thinner strokes and a more minimal design.",
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

async function getFont(fontStyle: FontStyle) {
  let fonts = fontsMap[fontStyle];

  if (!fonts || fonts.length === 0) {
    fonts = fontsMap["calm"];
  }

  const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
  const res = await fetch(`${process.env.APP_URL}/${randomFont.url}`);
  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return {
    name: randomFont.name,
    base64,
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

    const font = await getFont(fontStyle as FontStyle);

    const prompt = iconDescription.concat(
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
    const iconPathsOnly = iconSvgMarkup
      .replace(/<\?xml.*?>/g, "")
      .replace(/<!DOCTYPE.*?>/g, "")
      .replace(/<svg[^>]*>/, "")
      .replace(/<\/svg>/, "");

    const combinedSvg = {
      font: `<defs><style type="text/css">@font-face { font-family: '${font.name}'; src: url("data:font/ttf;base64,${font.base64}") format("truetype"); }</style></defs>`,
      icon: `<g id="icon">${iconPathsOnly}</g>`,
      text: `<text style="font-family: '${font.name}', sans-serif; fill: black;">${brandName}</text>`,
    };

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

    return { success: true, svg: combinedSvg, fontFamily: font.name };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to generate logo");
  }
}

export async function saveLogo(
  payload: {
    iconDescription: string;
    brandName: string;
    fontStyle: string;
    fontFamily?: string;
  },
  file: File,
) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (!data || !data.user) {
    throw new Error("User not found");
  }

  const uuid = crypto.randomUUID();

  console.log("Saving logo in storage");

  const { data: logoFile, error } = await supabase.storage
    .from("logos")
    .upload(`${uuid}.svg`, file, {
      upsert: true,
      cacheControl: "3600",
      contentType: "image/svg+xml",
    });

  if (error) {
    console.error("Upload error:", error);
    throw error;
  }

  console.log("Logo saved in storage");

  console.log("Saving history in database");
  try {
    const { error } = await supabase.from("logo_history").insert([
      {
        brand_name: payload.brandName,
        prompt: payload.iconDescription,
        font_style: payload.fontStyle,
        font_family: payload.fontFamily,
        user_id: data.user.id,
        url: logoFile?.fullPath,
      },
    ]);

    if (error) {
      console.error("Database error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false };
  }
}
