// import { 
//     VideoAssetCreatedWebhookEvent,
//     VideoAssetDeletedWebhookEvent,
//     VideoAssetErroredWebhookEvent,
//     VideoAssetReadyWebhookEvent,
//     VideoAssetTrackReadyWebhookEvent,
// } from "@mux/mux-node/resources/webhooks.mjs"; 
// import { headers } from "next/headers";
// import { mux } from "@/lib/mux";
// import db from "@/lib/prisma";
// import { UTApi } from "uploadthing/server";

// const SIGNIN_SECRET = process.env.MUX_WEBHOOK_SECRET!;

// type WebhookEvent = 
// | VideoAssetCreatedWebhookEvent
// | VideoAssetErroredWebhookEvent
// | VideoAssetReadyWebhookEvent
// | VideoAssetDeletedWebhookEvent
// | VideoAssetTrackReadyWebhookEvent;

// export const POST = async (request: Request) => {
//     if (!SIGNIN_SECRET) {
//         throw new Error("MUX_WEBHOOK_SECRET is not set");
//     }

//     const headersPayload = await headers();
//     const muxSignature = headersPayload.get("mux-signature");

//     if (!muxSignature) {
//         return new Response("No signature found", { status: 401 });
//     }

//     const payload = await request.json();
//     const body = JSON.stringify(payload);

//     mux.webhooks.verifySignature(
//         body,
//         { "mux-signature": muxSignature },
//         SIGNIN_SECRET,
//     );

//     switch (payload.type as WebhookEvent["type"]) {
//         case "video.asset.created": {
//             const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

//             if (!data.upload_id) {
//                 return new Response("No upload ID found", { status: 400 });
//             }

//             await db.video.updateMany({
//                 where: { muxUploadId: data.upload_id },
//                 data: {
//                     muxAssetId: data.id,
//                     muxStatus: data.status,
//                 },
//             });

//             break;
//         }

//         case "video.asset.ready": {
//             const data = payload.data as VideoAssetReadyWebhookEvent["data"];
//             const playbackId = data.playback_ids?.[0]?.id;

//             if (!data.upload_id) {
//                 return new Response("Missing upload ID", { status: 400 });
//             }
//             if (!playbackId) {
//                 return new Response("Missing playback ID", { status: 400 });
//             }

//             const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
//             const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
//             const duration = data.duration ? Math.round(data.duration * 1000) : 0;

//             const utapi = new UTApi();
//             const [uploadedThumbnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
//                 tempThumbnailUrl,
//                 tempPreviewUrl
//             ]);

//             if (!uploadedThumbnail.data || !uploadedPreview.data) {
//                 return new Response("Failed to upload thumbnail or preview", { status: 500 });
//             }

//             const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
//             const { key: previewKey, url: previewUrl } = uploadedPreview.data;

//             await db.video.updateMany({
//                 where: { muxUploadId: data.upload_id },
//                 data: {
//                     muxStatus: data.status,
//                     muxPlaybackId: playbackId,
//                     muxAssetId: data.id,
//                     thumbnailUrl,
//                     thumbnailKey,
//                     previewUrl,
//                     previewKey,
//                     duration,
//                 },
//             });

//             break;
//         }

//         case "video.asset.errored": {
//             const data = payload.data as VideoAssetErroredWebhookEvent["data"];

//             if (!data.upload_id) {
//                 return new Response("No upload ID found", { status: 400 });
//             }

//             await db.video.updateMany({
//                 where: { muxUploadId: data.upload_id },
//                 data: { muxStatus: data.status },
//             });

//             break;
//         }

//         case "video.asset.deleted": {
//             const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

//             if (!data.upload_id) {
//                 return new Response("No upload ID found", { status: 400 });
//             }

//             await db.video.deleteMany({
//                 where: { muxUploadId: data.upload_id },
//             });

//             break;  
//         }

//         case "video.asset.track.ready": {
//             const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & { asset_id: string };

//             console.log("Track ready");

//             if (!data.asset_id) {
//                 return new Response("No asset ID found", { status: 400 });
//             }

//             await db.video.updateMany({
//                 where: { muxAssetId: data.asset_id },
//                 data: {
//                     muxTrackId: data.id,
//                     muxTrackStatus: data.status,
//                 },
//             });

//             break;  
//         }
//     }

//     return new Response("Webhook received", { status: 200 });
// };
