export const domain = {
  dev: "dev.panelist.lukger.dev",
  prod: "panelist.lukger.dev",
}[$app.stage]!;

export const zone = cloudflare.getZoneOutput({
  zoneId: "2506294a3328c1fa1464e2563295a705",
});
