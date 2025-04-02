"use server";

import { getUser } from "@/lib/auth-session";
import db from "@/lib/prisma";

import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function createVideo() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [{ generated_subtitles: [{ language_code: "en", name: "English" }] }],
      },
      cors_origin: "*", // In production, set this to your domain
    });

    const video = await db.video.create({
      data: {
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      },
    });

    return { video, url: upload.url };
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("Failed to create video");
  }
}
