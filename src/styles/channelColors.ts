// Shared channel → color mapping for campaign bars and legends
export type CampaignChannel = "postcard" | "email" | "text";

export const CHANNEL_BAR_CLASS: Record<CampaignChannel, string> = {
  postcard: "bg-sky-400",    // Postcard (blue)
  email: "bg-emerald-400",   // Email (green)
  text: "bg-indigo-400",     // Text Message (purple)
};

export const CHANNEL_LABELS: Record<CampaignChannel, string> = {
  postcard: "Postcard",
  email: "Email",
  text: "Text Message",
};

// Parse a channel string like "Postcard + Email + Text" into array of channels
export function parseChannels(channelStr: string): CampaignChannel[] {
  const channels: CampaignChannel[] = [];
  const lower = channelStr.toLowerCase();
  
  if (lower.includes("postcard")) channels.push("postcard");
  if (lower.includes("email")) channels.push("email");
  if (lower.includes("text")) channels.push("text");
  
  return channels;
}

// Get the primary channel color for single-channel touch points
export function getPrimaryChannelClass(channelStr: string): string {
  const channels = parseChannels(channelStr);
  if (channels.length === 1) {
    return CHANNEL_BAR_CLASS[channels[0]];
  }
  // For multi-channel, return first channel color as fallback
  return channels.length > 0 ? CHANNEL_BAR_CLASS[channels[0]] : "bg-slate-400";
}
