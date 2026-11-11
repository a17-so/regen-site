/**
 * Apple's universal-links file: tells iOS that links under /share/ on this
 * domain open the REGEN app (DeepLinkHandler.swift in regen-app turns
 * /share/<feature>/<id> into the app's own route). The app's entitlements
 * claim applinks:www.checkregen.app and applinks:checkregen.app, and Apple's
 * CDN fetches this file from each.
 *
 * Served as JSON with no redirect and no extension, as Apple requires. The
 * app ID is the team ID plus the bundle ID (REGEN.xcodeproj).
 */
const APP_ID = "D2A29W2UN7.com.swiftlabs.lifemaxxApp";

export const dynamic = "force-static";

export function GET() {
  return Response.json(
    {
      applinks: {
        // `apps` and `paths` are the pre-iOS 13 format, `appIDs` and
        // `components` the current one; both point at /share/ only.
        apps: [],
        details: [
          {
            appID: APP_ID,
            paths: ["/share/*"],
            appIDs: [APP_ID],
            components: [{ "/": "/share/*", comment: "Shared biomarkers, protocols and cards open in the app" }],
          },
        ],
      },
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
