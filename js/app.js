// ============================================================
// Vinalhaven Trail Guide — Property Data
// ============================================================
// Each property's folder name is the authoritative name.
// "folder" must match the exact folder name inside Properties/.

// App version — BUMP THIS on every change you deploy. It's shown at the
// bottom of the Resources page so you can confirm the phone loaded the
// latest code (also keep the ?v= query on the script tags in index.html
// in sync to defeat browser caching).
const APP_VERSION = "1.7.13";

const properties = [
    {
        name: "A.W. Smith Preserve\n(Fox Rocks)",
        folder: "A.W. Smith Preserve (Fox Rocks)",
        photo: "photo-a-w-smith-preserve.webp",
        description: "description-a-w-smith-preserve.rtf",
        trail: "trail-a-w-smith-preserve.kml",
        connectors: ["trail-a-w-smith-preserve-connector.kml"],
        adjacent: ["Middle Mountain Town Park", "Perry Creek North Preserve"],
        boundary: {
            parcels: [
                "boundary-a-w-smith-preserve-folder/anchor-parcel-boundary.kml",
                "boundary-a-w-smith-preserve-folder/dyer-day-perry-creek (1).kml",
                "boundary-a-w-smith-preserve-folder/perry-creek-aw-smith-preserve (2).kml",
                "boundary-a-w-smith-preserve-folder/roberts-perry-creek-to-sanft (2).kml",
            ],
        },
        parking: [],
        sharedParking: "Middle Mountain Town Park",
    },
    {
        name: "Armbrust Hill Town Park",
        folder: "Armbrust Hill Town Park",
        photo: "photo-armbrust-hill-town-park.webp",
        description: "description-armbrust-hill-town-park.rtf",
        owner: "town",
        trail: "trail-armbrust-hill-town-park-1.kml",
        connectors: [
            "trail-armbrust-hill-town-park-2.kml",
            "trail-armbrust-hill-town-park-3.kml",
            "trail-armbrust-hill-town-park-4.kml",
            "trail-armbrust-hill-town-park-5.kml",
        ],
        boundary: "boundary-armbrust-hill-town-park.kml",
        parking: ["parking-armbrust-hill-town-park.kml"],
    },
    {
        name: "Barney's Point Preserve",
        folder: "Barney's Point Preserve",
        photo: "photo-barneys-point-preserve.png",
        owner: "mcht",
        trail: null,
        connectors: [],
        boundary: null,
        parking: [],
    },
    {
        name: "Barton's Quarry Preserve",
        folder: "Barton's Quarry Preserve",
        photo: "photo-bartons-quarry-preserve.webp",
        description: "description-bartons-quarry-preserve.rtf",
        trail: "trail-bartons-quarry.kml",
        connectors: [],
        boundary: "boundary-bartons-quarry-preserve.kml",
        parking: ["landing-bartons-quarry.kml"],
        parkingType: "boat",
    },
    {
        name: "Basin Preserve\n(Platform Trail)",
        folder: "Basin Preserve (Platform Trail)",
        photo: "photo-basin-preserve.jpeg",
        description: "description-basin-preserve.rtf",
        owner: "mcht",
        trail: "trail-basin-preserve.kml",
        connectors: [],
        boundary: "boundary-basin-preserve.kml",
        parking: ["parking-basin-preserve.kml"],
    },
    {
        name: "Carrying Place Preserve",
        folder: "Carrying Place Preserve",
        photo: "photo-carrying-place-preserve.webp",
        description: "description-carrying-place-preserve.rtf",
        owner: "mcht",
        trail: "trail-carrying-place-preserve.kml",
        connectors: [],
        boundary: "boundary-carrying-place-preserve.kml",
        parking: ["parking-carrying-place-preserve.kml"],
        adjacent: ["Lower Mill River Preserve (Fishhook & Overlook)", "Round Pond Trail"],
    },
    {
        name: "Eleanor L. Campbell Preserve\n(Polly Cove)",
        cardName: "Eleanor Campbell\nPreserve (Polly Cove)",
        folder: "Eleanor L. Campbell Preserve (Polly Cove)",
        photo: "photo-eleanor-l-campbell-preserve.png",
        description: "description-eleanor-l-campbell-preserve.rtf",
        trail: "trail-eleanor-l-campbell-preserve.kml",
        connectors: [],
        boundary: "boundary-eleanor-l-campbell-preserve.kml",
        parking: [
            "parking-eleanor-l-campbell-preserve-upper.kml",
            "parking-eleanor-l-campbell-preserve-lower.kml",
        ],
    },
    {
        name: "Granite Island Preserve\n& Story Book Trail",
        folder: "Granite Island Preserve & Story Book Trail",
        photo: "photo-granite-island-preserve.jpeg",
        description: "description-granite-island-preserve.rtf",
        trail: "trail-granite-island-preserve.kml",
        connectors: [],
        boundary: "boundary-granite-island-preserve.kml",
        parking: ["parking-granite-island-preserve.kml"],
    },
    {
        name: "Grimes Park",
        folder: "Grimes Park",
        photo: "photo-grimes-park.png",
        trail: "trail-grimes-park.kml",
        connectors: [],
        boundary: "boundary-grimes-park.kml",
        parking: ["parking-grimes-park.kml"],
        comingSoon: true,
    },
    {
        name: "Huber Preserve",
        folder: "Huber Preserve",
        photo: "photo-huber-preserve.webp",
        description: "description-huber-preserve.rtf",
        owner: "mcht",
        trail: "trail-huber-preserve.kml",
        connectors: [],
        boundary: "boundary-huber-preserve.kml",
        parking: ["parking-huber-preserve.kml"],
    },
    {
        name: "Lane's Island Preserve",
        folder: "Lane's Island Preserve",
        photo: "photo-lanes-island-preserve.jpg",
        description: "description-lanes-island-preserve.rtf",
        owner: "mcht",
        trail: "trail-lanes-island-preserve.kml",
        connectors: [
            "trail-interior-1-lanes-island-preserve.kml",
            "trail-interior-2-lanes-island-preserve.kml",
            "trail-interior-3-lanes-island-preserve.kml",
        ],
        boundary: "boundary-lanes-island-preserve.kml",
        parking: ["parking-lanes-island-preserve.kml"],
    },
    {
        name: "Lower Mill River Preserve\n(Fishhook & Overlook)",
        folder: "Lower Mill River Preserve (Fishhook & Overlook)",
        photo: "photo-lower-mill-river-preserve.jpg",
        description: "description-lower-mill-river.rtf",
        trail: "trail-lower-mill-river-preserve",
        connectors: ["trail-lower-mill-river-vinal-cove-connector.kml"],
        boundary: "boundary-lower-mill-river-preserve",
        parking: ["parking-lower-mill-river-main.kml"],
        adjacent: ["Carrying Place Preserve", "Round Pond Trail"],
    },
    {
        name: "Marcuse Wetland Preserve",
        folder: "Marcuse Wetland Preserve",
        photo: "photo-marcuse-wetland-preserve.png",
        description: "description-marcuse-wetland-preserve.rtf",
        trail: "trail-marcuse-wetland-preserve.kml",
        connectors: [],
        boundary: "boundary-marcuse-wetland-preserve.kml",
        parking: ["parking-marcuse-wetland.kml"],
    },
    {
        name: "Middle Mountain Town Park",
        folder: "Middle Mountain Town Park",
        photo: "photo-middle-mountain-town-park.jpeg",
        description: "description-middle-mountain-town-park.rtf",
        owner: "town",
        coOwner: "vlt",
        trail: "trail-middle-mountain-town-park.kml",
        connectors: [],
        boundary: "boundary-middle-mountain-park.kml",
        parking: ["parking-middle-mountain-town-park.kml"],
        adjacent: ["Perry Creek North Preserve", "A.W. Smith Preserve (Fox Rocks)"],
    },
    {
        name: "Perry Creek North Preserve",
        folder: "Perry Creek North Preserve",
        photo: "photo-perry-creek-north-preserve.png",
        description: "description-perry-creek-north-preserve.rtf",
        trail: "trail-perry-creek-north.kml",
        connectors: ["trail-perry-creek-north-connector.kml"],
        boundary: {
            parcels: [
                "boundary-perry-creek-north-preserve-folder/pcca-day-lot (1).kml",
                "boundary-perry-creek-north-preserve-folder/pcca-jenkins-parcel (1).kml",
                "boundary-perry-creek-north-preserve-folder/pcca-terry-parcel (1).kml",
                "boundary-perry-creek-north-preserve-folder/saltonstall-reservation (1).kml",
            ],
        },
        parking: ["parking-perry-creek-north.kml"],
        adjacent: ["Middle Mountain Town Park", "A.W. Smith Preserve (Fox Rocks)"],
    },
    {
        name: "Round Pond Trail",
        folder: "Round Pond Trail",
        photo: "photo-round-pond-trail.png",
        description: "description-round-pond-trail.rtf",
        trail: "trail-round-pond-preserve.kml",
        connectors: ["trail-round-pond-vinal-cove-connector.kml"],
        boundary: "boundary-round-pond.kml",
        parking: ["parking-round-pond-preserve.kml"],
        adjacent: ["Lower Mill River Preserve (Fishhook & Overlook)", "Carrying Place Preserve"],
    },
    {
        name: "Starboard Rock Sanctuary",
        folder: "Starboard Rock Sanctuary",
        photo: "photo-starboard-rock-sanctuary.png",
        description: "description-starboard-rock-sanctuary.rtf",
        trail: "trail-starboard-rock-sanctuary.kml",
        connectors: [],
        boundary: "boundary-starboard-rock-sanctuary",
        parking: ["parking-starboard-rock.kml"],
    },
    {
        name: "State Beach Town Park",
        folder: "State Beach Town Park",
        photo: "photo-state-beach-town-park.webp",
        owner: "town",
        trail: null,
        connectors: [],
        boundary: null,
        parking: [],
    },
    {
        name: "Tip Toe Mountain Park",
        folder: "Tip Toe Mountain Park",
        photo: "photo-tip-toe-mountain-park.webp",
        description: "description-tip-toe-mountain-park.rtf",
        owner: "vlt",
        coOwner: "town",
        trail: "trail-tip-toe-mountain-park.kml",
        connectors: ["trail-little-tip-toe-mountain-town-park"],
        boundary: {
            parcels: [
                "boundary-tip-toe-mountain-park.kml",
                "little-tip-toe-mountain-town-park.kml",
            ],
        },
        parking: ["parking-tip-toe-mountain-park.kml"],
    },
    {
        name: "Watershed Preserve\n& Wetland Point Trail",
        folder: "Watershed Preserve & Wetland Point Trail",
        photo: "photo-watershed-preserve.jpeg",
        description: "description-watershed-preserve.rtf",
        owner: "vlt",
        coOwner: "town",
        trail: "trail-watershed-preserve.kml",
        connectors: ["trail-middle-route-watershed-preserve.kml"],
        boundary: "boundary-watershed-preserve.kml",
        parking: ["parking-watershed-preserve.kml"],
    },
    {
        name: "Whitmore Pond Sanctuary",
        folder: "Whitmore Pond Sanctuary",
        photo: "photo-whitmore-pond-preserve.jpg",
        description: "description-whitmore-pond-sanctuary.rtf",
        trail: "trail-whitmore-pond-sanctuary.kml",
        connectors: [],
        boundary: "boundary-whitmore-pond-sanctuary.kml",
        parking: ["parking-whitmore-pond-sanctuary.kml"],
    },
    {
        name: "Williams Preserve",
        folder: "Williams Preserve",
        photo: "photo-williams-preserve.webp",
        description: "description-williams-preserve.rtf",
        owner: "mcht",
        trail: "trail-williams-preserve.kml",
        connectors: [],
        boundary: "boundary-williams-preserve.kml",
        parking: ["parking-williams-preserve.kml"],
    },
];

// ============================================================
// Trail Info Data
// ============================================================
const TRAIL_INFO = {
    "A.W. Smith Preserve (Fox Rocks)": {
        lengthMi: 2.75, routeType: "loop",
        difficulty: ["challenging"],
        features: ["steep", "uneven", "not-shaded", "scenic-views", "shoreline"],
    },
    "Armbrust Hill Town Park": {
        lengthMi: 1.1, routeType: "multi-loop",
        difficulty: ["easy"],
        features: ["steep", "uneven", "shaded", "scenic-views", "historic", "benches"],
    },
    "Barton's Quarry Preserve": {
        lengthMi: 0.5, routeType: "loop",
        difficulty: ["challenging"],
        features: ["steep", "scenic-views", "shoreline", "historic", "quarry", "boat-access-only"],
    },
    "Basin Preserve (Platform Trail)": {
        lengthMi: 2.6, routeType: "two-loop",
        difficulty: ["intermediate"],
        features: ["wet", "shaded", "scenic-views", "shoreline", "benches"],
    },
    "Carrying Place Preserve": {
        lengthMi: 0.4, routeType: "loop",
        difficulty: ["easy"],
        features: ["shaded", "scenic-views", "shoreline", "benches"],
        timeEstimate: "15 min",
    },
    "Eleanor L. Campbell Preserve (Polly Cove)": {
        lengthMi: 0.5, routeType: "loop",
        difficulty: ["intermediate"],
        features: ["steep", "uneven", "scenic-views", "shoreline", "beach", "historic", "swimming"],
        timeEstimate: "30 min",
    },
    "Granite Island Preserve & Story Book Trail": {
        lengthMi: 1.3, routeType: "two-loop",
        difficulty: ["easy"],
        features: ["shaded", "scenic-views", "shoreline", "historic", "quarry", "benches", "swimming"],
    },
    "Huber Preserve": {
        lengthMi: 2.1, routeType: "loop",
        difficulty: ["intermediate"],
        features: ["wet", "shaded", "scenic-views", "shoreline"],
    },
    "Lane's Island Preserve": {
        lengthMi: 1.0, routeType: "multi-loop",
        difficulty: ["easy"],
        features: ["uneven", "not-shaded", "scenic-views", "shoreline", "beach", "historic", "benches", "swimming"],
    },
    "Lower Mill River Preserve (Fishhook & Overlook)": {
        lengthMi: 1.6, routeType: "multi-loop",
        difficulty: ["intermediate"],
        features: ["steep", "wet", "shaded", "scenic-views", "shoreline", "benches", "swimming"],
    },
    "Marcuse Wetland Preserve": {
        lengthMi: 1.0, routeType: "loop",
        difficulty: ["intermediate"],
        features: ["wet", "shaded", "historic", "benches"],
    },
    "Middle Mountain Town Park": {
        lengthMi: 1.5, routeType: "two-loop",
        difficulty: ["challenging"],
        features: ["steep", "uneven", "not-shaded", "scenic-views", "historic"],
    },
    "Perry Creek North Preserve": {
        lengthMi: 4.0, routeType: "two-loop",
        difficulty: ["challenging"],
        features: ["steep", "uneven", "wet", "shaded", "scenic-views", "shoreline"],
    },
    "Round Pond Trail": {
        lengthMi: 1.0, routeType: "loop",
        difficulty: ["intermediate"],
        features: ["steep", "shaded", "scenic-views", "benches"],
    },
    "Starboard Rock Sanctuary": {
        lengthMi: 2.0, routeType: "out-and-back",
        difficulty: ["challenging"],
        features: ["steep", "uneven", "scenic-views", "benches", "no-dogs"],
        timeEstimate: "1 hr",
    },
    "Tip Toe Mountain Park": {
        lengthMi: 1.0, routeType: "multi-loop",
        difficulty: ["intermediate"],
        features: ["steep", "uneven", "not-shaded", "scenic-views", "shoreline", "beach", "swimming"],
        timeEstimate: "1 hr",
    },
    "Watershed Preserve & Wetland Point Trail": {
        lengthMi: 1.4, routeType: "two-loop",
        difficulty: ["intermediate"],
        features: ["steep", "wet", "shaded", "benches"],
        timeEstimate: "1 hr",
    },
    "Whitmore Pond Sanctuary": {
        lengthMi: 1.4, routeType: "loop",
        difficulty: ["easy"],
        features: ["shaded", "scenic-views", "shoreline", "historic", "benches", "no-dogs"],
    },
    "Williams Preserve": {
        lengthMi: 1.8, routeType: "loop",
        difficulty: ["intermediate"],
        features: ["steep", "uneven", "shaded", "scenic-views", "shoreline", "historic"],
    },
};

// ============================================================
// Trail Rendering System — Icons, Metadata, Helpers
// ============================================================

const DIFFICULTY_META = {
    "easy":              { label: "Easy",             color: "#2a9d50" },  // green
    "intermediate":      { label: "Moderate",         color: "#2563eb" },  // blue
    "challenging":       { label: "Challenging",      color: "#111111" },  // black
    "very-challenging":  { label: "Very Challenging", color: "#dc2626" },  // red
};

// Ski-trail difficulty symbols: green circle (easy), blue diamond (moderate),
// black diamond (challenging), double black diamond (very challenging).
const SKI_SHAPE_COLOR = { "easy": "#2a9d50", "intermediate": "#2563eb", "challenging": "#111111", "very-challenging": "#111111" };
function skiShapeSVG(diff, opts) {
    opts = opts || {};
    const s = opts.size || 14;
    const fill = opts.color || SKI_SHAPE_COLOR[diff] || "#111111";
    const diamond = (cx) => `<rect x="${cx - 4.5}" y="3.5" width="9" height="9" rx="1.2" transform="rotate(45 ${cx} 8)" fill="${fill}"/>`;
    if (diff === "easy") {
        return `<svg class="ski-shape" width="${s}" height="${s}" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="${fill}"/></svg>`;
    }
    if (diff === "intermediate") {
        return `<svg class="ski-shape" width="${s}" height="${s}" viewBox="0 0 16 16" aria-hidden="true"><rect x="2.8" y="2.8" width="10.4" height="10.4" rx="1.4" fill="${fill}"/></svg>`;
    }
    if (diff === "challenging") {
        return `<svg class="ski-shape" width="${s}" height="${s}" viewBox="0 0 16 16" aria-hidden="true">${diamond(8)}</svg>`;
    }
    if (diff === "very-challenging") {
        return `<svg class="ski-shape ski-shape-double" width="${s * 1.7}" height="${s}" viewBox="0 0 28 16" aria-hidden="true">${diamond(8)}${diamond(20)}</svg>`;
    }
    return "";
}

const ROUTE_LABELS = {
    "loop":         "Loop",
    "out-and-back": "Out & Back",
    "two-loop":     "Two Loops",
    "multi-loop":   "Multi-Loop",
};

/* SVG icon strings (viewBox 0 0 16 16) */
const IC = {
    // Stats row
    dist:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="3" cy="8" r="1.5"/><line x1="4.5" y1="8" x2="11.5" y2="8"/><circle cx="13" cy="8" r="1.5"/></svg>`,
    loop:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8a6 6 0 11-6-6"/><path d="M11 1.5l3 1-1 3"/></svg>`,
    outback:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 7h12M11 4l3 3-3 3"/><path d="M14 9H2M5 6L2 9l3 3"/></svg>`,
    multiloop: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5.5" cy="8" r="4"/><circle cx="10.5" cy="8" r="4"/></svg>`,
    clock:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2.5 2"/></svg>`,
    // Terrain
    steep:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14h3v-3h3v-3h3v-3h3"/></svg>`,
    wet:       `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 2c0 4.5-5 6-5 9a5 5 0 0010 0c0-3-5-4.5-5-9z"/></svg>`,
    tree:      `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 14V12L2 12 4 6 3 6 5 1 7 6 6 6 8 12H4z"/><path d="M9 14V12L7.5 12 9 7 8 7 10 3 12 7 11 7 12.5 12H9z" opacity="0.7"/></svg>`,
    sun:       `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.6 3.6l1.5 1.5M10.9 10.9l1.5 1.5M12.4 3.6l-1.5 1.5M5.1 10.9l-1.5 1.5"/></svg>`,
    uneven:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 9.5c2-3.5 3-1.5 4.5-2.5S8 4 10 4s3 3.5 4.5 2.5"/></svg>`,
    // Highlights
    mountain:  `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 14L6 5l3 4 2-3 4 8H1z"/></svg>`,
    waves:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 7c1.5-2.5 2.5-2.5 4 0s2.5 2.5 4 0 2.5-2.5 4 0M1 11c1.5-2.5 2.5-2.5 4 0s2.5 2.5 4 0 2.5-2.5 4 0"/></svg>`,
    beach:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 12c2-3.5 5.5-4.5 8-1.5s5 3 6 1.5"/><line x1="1" y1="14" x2="15" y2="14"/><circle cx="12" cy="5" r="2"/></svg>`,
    waterfall: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 2v6c0 2.5 1.5 4.5 3 5M11 2v4.5c0 3-2 5.5-3 6.5"/></svg>`,
    historic:  `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1.5L2 5h12L8 1.5z"/><line x1="2" y1="14" x2="14" y2="14"/><line x1="4.5" y1="5.5" x2="4.5" y2="13"/><line x1="8" y1="5.5" x2="8" y2="13"/><line x1="11.5" y1="5.5" x2="11.5" y2="13"/></svg>`,
    quarry:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="5" height="4"/><rect x="8" y="4" width="5" height="6"/><rect x="4" y="11" width="8" height="3"/></svg>`,
    tidal:     `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M1 8c1.5-2 2.5-2 4 0s2.5 2 4 0 2.5-2 4 0"/><path d="M8 3v2M8 11v2"/><path d="M5.5 3.5l1 1.5M10.5 3.5l-1 1.5"/></svg>`,
    // Amenities
    bench:     `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="1.5" y="6.25" width="13" height="2" rx="0.75"/><rect x="1" y="4.5" width="14" height="1.5" rx="0.5" opacity="0.55"/><rect x="3" y="8.25" width="1.75" height="4.75" rx="0.875"/><rect x="11.25" y="8.25" width="1.75" height="4.75" rx="0.875"/></svg>`,
    swim:      `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="4" r="1.5"/><path d="M9.5 5.5L4 9l3 1 4-2 3 2"/><path d="M1 13c2-2.5 3.5-2.5 5 0s3.5 2.5 5 0"/></svg>`,
    // Restrictions
    nodogs:    `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6.5"/><line x1="4" y1="4" x2="12" y2="12"/></svg>`,
    boat:      `<span style="font-size:12px;line-height:1">⚓</span>`,
};

const FEATURE_META = {
    "steep":             { label: "Steep",                  cat: "terrain",      icon: IC.steep    },
    "uneven":            { label: "Uneven Footing",         cat: "terrain",      icon: IC.uneven   },
    "wet":               { label: "Wet Ground",             cat: "terrain",      icon: IC.wet      },
    "not-shaded":        { label: "Sun Exposed",            cat: "terrain",      icon: IC.sun      },
    "scenic-views":      { label: "Scenic Views",           cat: "highlight",    icon: IC.mountain },
    "shoreline":         { label: "Shoreline",              cat: "highlight",    icon: IC.waves    },
    "beach":             { label: "Beach",                  cat: "highlight",    icon: IC.beach    },
    "waterfall":         { label: "Waterfall",              cat: "highlight",    icon: IC.waterfall},
    "quarry":            { label: "Quarry",                 cat: "highlight",    icon: IC.quarry   },
    "no-dogs":           { label: "No Dogs",                cat: "restriction",  icon: IC.nodogs   },
    "boat-access-only":  { label: "Boat Access Only",       cat: "restriction",  icon: IC.boat     },
};

function estimateTime(lengthMi, difficulties) {
    const paceMin = { "easy": 24, "intermediate": 30, "challenging": 40, "very-challenging": 50 };
    const maxPace = difficulties.reduce((acc, d) => Math.max(acc, paceMin[d] || 30), 0);
    const total = Math.round(lengthMi * maxPace);
    if (total < 60) {
        return `~${Math.max(5, Math.round(total / 5) * 5)} min`;
    }
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (m < 15) return `~${h} hr`;
    if (m < 45) return `~${h} hr 30 min`;
    return `~${h + 1} hr`;
}

function renderTrailStats(prop, container) {
    const info = TRAIL_INFO[prop.folder];
    container.innerHTML = "";
    if (!info) return;
    const { lengthMi, routeType, difficulty, features, timeEstimate } = info;

    // ── Stats row ──
    const routeIconMap = { "loop": IC.loop, "out-and-back": IC.outback, "two-loop": IC.multiloop, "multi-loop": IC.multiloop };
    const routeIcon  = routeIconMap[routeType] || IC.loop;
    const routeLabel = ROUTE_LABELS[routeType] || routeType;
    const timeStr    = timeEstimate || estimateTime(lengthMi, difficulty);

    const statsRow = document.createElement("div");
    statsRow.className = "ts-stats-row";

    const diffPillsHTML = difficulty.map(d => {
        const meta = DIFFICULTY_META[d];
        if (!meta) return "";
        return `<span class="ts-diff-item"><span class="ts-diff-pill" style="background:${meta.color}">${meta.label}</span>${skiShapeSVG(d, { size: 15 })}</span>`;
    }).join("");

    statsRow.innerHTML =
        `<span class="ts-diff-group">${diffPillsHTML}</span>` +
        `<span class="ts-sep">·</span>` +
        `<span class="ts-stat">${IC.dist}<span>${lengthMi} mi</span></span>` +
        `<span class="ts-sep">·</span>` +
        `<span class="ts-stat">${routeIcon}<span>${routeLabel}</span></span>` +
        `<span class="ts-sep">·</span>` +
        `<span class="ts-stat">${IC.clock}<span>${timeStr}</span></span>`;
    container.appendChild(statsRow);

    // ── Feature chips ──
    const allFeatures = Array.isArray(features) ? features : [
        ...(features.terrain      || []),
        ...(features.highlights   || []),
        ...(features.wildlife     || []),
        ...(features.amenities    || []),
        ...(features.restrictions || []),
    ];
    if (allFeatures.length > 0) {
        const chipsRow = document.createElement("div");
        chipsRow.className = "ts-chips";
        for (const key of allFeatures) {
            const meta = FEATURE_META[key];
            if (!meta) continue;
            const chip = document.createElement("span");
            chip.className = `ts-chip ts-chip-${meta.cat}`;
            chip.innerHTML = meta.icon + `<span>${meta.label}</span>`;
            chipsRow.appendChild(chip);
        }
        container.appendChild(chipsRow);
    }
}

// ============================================================
// State
// ============================================================
let map = null;
let trailLayer = null;
let locationMarker = null;
let watchId = null;
let allMap = null;
// Cache of preserve boundary polygons on the island map, for the "My Location"
// button's point-in-polygon test (snap into the trail you're standing in).
let boundaryPolygons = [];   // [{ prop, geojson }]
let allTrailsLoaded = false;
let boundaryLayerSingle = null;
let parkingLayerSingle = null;

// ============================================================
// Styles & Icons
// ============================================================
// Boundary styles by owner
const boundaryStyles = {
    vlt: {
        color: "#3d8b6f",
        weight: 1,
        opacity: 0.4,
        fillColor: "#4a9e4a",
        fillOpacity: 0.35,
    },
    mcht: {
        color: "#1a5fa8",
        weight: 1,
        opacity: 0.4,
        fillColor: "#3a8fd4",
        fillOpacity: 0.35,
    },
    town: {
        color: "#a07800",
        weight: 1,
        opacity: 0.4,
        fillColor: "#f0c030",
        fillOpacity: 0.35,
    },
};

function boundaryStyle(prop) {
    return boundaryStyles[prop.owner || "vlt"];
}

// Organization info — logo paths and website URLs
const orgInfo = {
    vlt:  { logo: "Logos/VLTLOGO.webp",   url: "https://www.vinalhavenlandtrust.org" },
    mcht: { logo: "Logos/MCHT_logo.webp", url: "https://www.mcht.org" },
    town: { logo: "Logos/TOV_logo.png",   url: "https://www.townofvinalhaven.org" },
};

// ── RTF Parser (for macOS TextEdit .rtf files) ──
function parseRTF(rtf) {
    let text = rtf;
    // Strip outermost document braces first
    text = text.replace(/^\s*\{/, "").replace(/\}\s*$/, "");
    // Remove nested groups (font tables, color tables, etc.)
    for (let i = 0; i < 10; i++) {
        const prev = text;
        text = text.replace(/\{[^{}]*\}/g, "");
        if (text === prev) break;
    }
    // Replace RTF hex escapes: \'92 → ', \'93/94 → ", etc.
    text = text.replace(/\\'92/g, "\u2019");
    text = text.replace(/\\'93/g, "\u201C");
    text = text.replace(/\\'94/g, "\u201D");
    text = text.replace(/\\'96/g, "\u2013");
    text = text.replace(/\\'97/g, "\u2014");
    text = text.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
    );
    // RTF line break: backslash at end of line
    text = text.replace(/\\\r?\n/g, "\n");
    // Remove all control words (\word123 )
    text = text.replace(/\\[a-zA-Z]+[-]?\d*\s?/g, "");
    // Remove remaining braces and stray backslashes
    text = text.replace(/[{}\\]/g, "");
    // Clean whitespace
    text = text.replace(/\n{3,}/g, "\n").trim();
    return text;
}

// Parse structured description fields from plain text
function parseDescriptionFields(text) {
    const result = {};
    const lines = text.split("\n");
    let inDesc = false;
    const descParts = [];
    const warnings = [];
    for (const line of lines) {
        if (inDesc) {
            if (line.trim()) descParts.push(line.trim());
        } else {
            const m = line.match(/^(Length|Difficulty|Organization|Description):\s*(.*)/i);
            if (m) {
                const key = m[1].toLowerCase();
                if (key === "description") {
                    inDesc = true;
                    if (m[2].trim()) descParts.push(m[2].trim());
                } else {
                    result[key] = m[2].trim();
                }
            } else if (line.trim()) {
                warnings.push(line.trim());
            }
        }
    }
    if (descParts.length) result.description = descParts;
    if (warnings.length) result.warnings = warnings;
    return result;
}

const parkingIcon = L.divIcon({
    className: "parking-marker",
    html: '<div style="background:#3366cc;border:2px solid white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;">P</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const boatIcon = L.divIcon({
    className: "parking-marker",
    html: '<div style="background:#3366cc;border:2px solid white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;">⚓</div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// ============================================================
// Helpers
// ============================================================

// Build the path for a file inside a property folder
function propPath(prop, file) {
    return "Properties/" + prop.folder + "/" + file;
}

// Small pre-generated 512×384 WebP thumbnail of the main photo, used on the
// list-view cards (the full-res original is only needed for the detail banner,
// online). This is what gets cached for offline use — see computeAllTrailAssetUrls.
function cardThumbPath(prop) {
    return "Properties/" + prop.folder + "/card-thumb.webp";
}

// Load and parse a KML file (accepts full relative path)
async function loadKml(path) {
    const res = await fetch(path);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/xml");
    return toGeoJSON.kml(doc);
}

// Load a boundary — single file or multi-parcel merge
async function loadBoundary(prop) {
    const b = prop.boundary;
    if (!b) return null;

    // Single file boundary
    if (typeof b === "string") {
        return await loadKml(propPath(prop, b));
    }

    // Multi-parcel: load all, merge with turf.union
    const geoJsons = await Promise.all(
        b.parcels.map((p) => loadKml(propPath(prop, p)))
    );
    let merged = null;
    for (const gj of geoJsons) {
        for (const feature of gj.features) {
            if (!merged) {
                merged = feature;
            } else {
                try {
                    merged = turf.union(
                        turf.featureCollection([merged, feature])
                    );
                } catch (e) {
                    console.warn("Union failed for", prop.name, e);
                }
            }
        }
    }
    return merged
        ? { type: "FeatureCollection", features: [merged] }
        : geoJsons[0];
}

// Add boundary for a single property to a map
async function addBoundary(targetMap, prop, opts = {}) {
    if (!prop.boundary) return null;
    // When `opts.interactive === false`, the boundary is purely decorative and
    // map clicks pass through it (needed for pin-drop mode on the detail map).
    const interactive = opts.interactive !== false;
    const group = L.layerGroup().addTo(targetMap);
    try {
        const b = prop.boundary;

        // Handle multi-parcel boundaries separately to apply different styles
        if (typeof b === "object" && b.parcels) {
            for (const parcelFile of b.parcels) {
                const geoJson = await loadKml(propPath(prop, parcelFile));
                if (geoJson) {
                    // Determine style based on filename
                    let style = boundaryStyle(prop); // default to property owner
                    if (parcelFile.includes("little-tip-toe")) {
                        style = boundaryStyle({ owner: "town" }); // gold for town areas
                    }
                    const layer = L.geoJSON(geoJson, { style, interactive });
                    if (interactive) layer.bindPopup(prop.name.replace(/\n/g, " "));
                    layer.addTo(group);
                }
            }
        } else {
            // Single file boundary (original behavior)
            const geoJson = await loadBoundary(prop);
            if (geoJson) {
                const layer = L.geoJSON(geoJson, { style: boundaryStyle(prop), interactive });
                if (interactive) layer.bindPopup(prop.name.replace(/\n/g, " "));
                layer.addTo(group);
            }
        }
    } catch (err) {
        console.error("Failed to load boundary:", prop.folder, err);
    }
    return group;
}

// Add adjacent property layers (dimmed) to a map — does not affect fitBounds
async function loadAdjacentLayers(map, adjProp) {
    // Boundary at reduced opacity. interactive:false so these never intercept
    // pin-drop taps on the detail map (the fill would otherwise swallow clicks).
    if (adjProp.boundary) {
        try {
            const geoJson = await loadBoundary(adjProp);
            if (geoJson) {
                const s = boundaryStyle(adjProp);
                L.geoJSON(geoJson, {
                    style: { ...s, fillOpacity: s.fillOpacity * 0.35, opacity: s.opacity * 0.4 },
                    interactive: false,
                }).addTo(map);
            }
        } catch (e) {}
    }
    // Trail + connectors at reduced opacity, dashed
    const adjTrailStyle = { color: "#ff4444", weight: 2.5, opacity: 0.35, dashArray: "6, 5" };
    const adjFilter = (f) => f.geometry.type !== "Point";
    if (adjProp.trail) {
        try {
            const geoJson = await loadKml(propPath(adjProp, adjProp.trail));
            L.geoJSON(geoJson, { style: adjTrailStyle, filter: adjFilter, interactive: false }).addTo(map);
        } catch (e) {}
    }
    for (const conn of (adjProp.connectors || [])) {
        try {
            const geoJson = await loadKml(propPath(adjProp, conn));
            L.geoJSON(geoJson, { style: adjTrailStyle, filter: adjFilter, interactive: false }).addTo(map);
        } catch (e) {}
    }
}

// Add all boundaries to a map
async function addAllBoundaries(targetMap) {
    const group = L.layerGroup().addTo(targetMap);
    boundaryPolygons = [];
    for (const prop of properties) {
        if (!prop.boundary) continue;
        try {
            const b = prop.boundary;

            // Handle multi-parcel boundaries separately to apply different styles
            if (typeof b === "object" && b.parcels) {
                for (const parcelFile of b.parcels) {
                    const geoJson = await loadKml(propPath(prop, parcelFile));
                    if (geoJson) {
                        boundaryPolygons.push({ prop, geojson: geoJson });
                        // Determine style based on filename
                        let style = boundaryStyle(prop); // default to property owner
                        if (parcelFile.includes("little-tip-toe")) {
                            style = boundaryStyle({ owner: "town" }); // gold for town areas
                        }
                        L.geoJSON(geoJson, {
                            style: style,
                            onEachFeature: function (feature, layer) {
                                layer.bindTooltip(prop.name.replace(/\n/g, " "), {
                                    sticky: true,
                                    className: "trail-tooltip",
                                });
                                layer.on("click", function () {
                                    navigateToPropertyFromAllTrails(prop);
                                });
                            },
                        }).addTo(group);
                    }
                }
            } else {
                // Single file boundary (original behavior)
                const geoJson = await loadBoundary(prop);
                if (geoJson) {
                    boundaryPolygons.push({ prop, geojson: geoJson });
                    L.geoJSON(geoJson, {
                        style: boundaryStyle(prop),
                        onEachFeature: function (feature, layer) {
                            layer.bindTooltip(prop.name.replace(/\n/g, " "), {
                                sticky: true,
                                className: "trail-tooltip",
                            });
                            layer.on("click", function () {
                                navigateToPropertyFromAllTrails(prop);
                            });
                        },
                    }).addTo(group);
                }
            }
        } catch (err) {
            console.error("Failed to load boundary:", prop.folder, err);
        }
    }
    return group;
}

// Add parking markers for a specific property
async function addParkingForProp(targetMap, prop) {
    const group = L.layerGroup().addTo(targetMap);

    // Collect parking files — own + shared
    const parkingEntries = [];
    if (prop.parking.length > 0) {
        parkingEntries.push({
            files: prop.parking,
            folder: prop.folder,
            type: prop.parkingType || null,
        });
    }
    if (prop.sharedParking) {
        const shared = properties.find(
            (p) => p.name === prop.sharedParking || p.folder === prop.sharedParking
        );
        if (shared && shared.parking.length > 0) {
            parkingEntries.push({
                files: shared.parking,
                folder: shared.folder,
                type: shared.parkingType || null,
            });
        }
    }

    for (const entry of parkingEntries) {
        const icon = entry.type === "boat" ? boatIcon : parkingIcon;
        const label = entry.type === "boat" ? "Boat Access" : "Parking Area";
        for (const file of entry.files) {
            try {
                const geoJson = await loadKml(
                    "Properties/" + entry.folder + "/" + file
                );
                addParkingMarkers(geoJson, icon, label, group);
            } catch (err) {
                console.error("Failed to load parking:", file, err);
            }
        }
    }
    return group;
}

// Add all parking to a map
async function addAllParking(targetMap) {
    const group = L.layerGroup().addTo(targetMap);
    for (const prop of properties) {
        if (prop.parking.length === 0) continue;
        const icon =
            prop.parkingType === "boat" ? boatIcon : parkingIcon;
        const label =
            prop.parkingType === "boat" ? "Boat Access" : "Parking Area";
        for (const file of prop.parking) {
            try {
                const geoJson = await loadKml(propPath(prop, file));
                addParkingMarkers(geoJson, icon, label, group);
            } catch (err) {
                console.error("Failed to load parking:", file, err);
            }
        }
    }
    return group;
}

// Extract point from GeoJSON and add markers
function addParkingMarkers(geoJson, icon, label, group) {
    for (const feature of geoJson.features) {
        if (feature.geometry.type === "Point") {
            const coords = feature.geometry.coordinates;
            L.marker([coords[1], coords[0]], { icon })
                .bindPopup(label)
                .addTo(group);
        } else if (feature.geometry.type === "Polygon") {
            const coords = feature.geometry.coordinates[0];
            let lat = 0,
                lon = 0;
            for (const [l, la] of coords) {
                lon += l;
                lat += la;
            }
            lat /= coords.length;
            lon /= coords.length;
            L.marker([lat, lon], { icon })
                .bindPopup(label)
                .addTo(group);
        }
    }
}

// ============================================================
// Build Photo Grid
// ============================================================

// Placeholder colors by owner — used when no photo is present
const ownerPlaceholder = {
    vlt:  {
        bg: "linear-gradient(145deg, #2c5f2d 0%, #1a3d1e 100%)",
        iconFill: "rgba(255,255,255,0.18)",
    },
    mcht: {
        bg: "linear-gradient(145deg, #1a5fa8 0%, #0f3d70 100%)",
        iconFill: "rgba(255,255,255,0.18)",
    },
    town: {
        bg: "linear-gradient(145deg, #8a6700 0%, #5c4400 100%)",
        iconFill: "rgba(255,255,255,0.18)",
    },
};

// Simple nature SVG icon for placeholder cards
function placeholderSVG(fill) {
    return `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 42 L18 18 L26 30 L32 20 L46 42 Z" fill="${fill}"/>
      <circle cx="38" cy="12" r="7" fill="${fill}"/>
    </svg>`;
}

// Per-card photo filters — designed to enhance vibrancy while keeping natural look
const CARD_FILTERS = {
    "A.W. Smith Preserve (Fox Rocks)":               "saturate(1.35) contrast(1.05) brightness(1.04)",
    "Armbrust Hill Town Park":                        "saturate(1.25) contrast(1.03) brightness(1.02)",
    "Barney's Point Preserve":                        "saturate(1.25) contrast(1.08) hue-rotate(2.5deg)",
    "Barton's Quarry Preserve":                       "saturate(1.30) contrast(1.05) hue-rotate(-4deg) brightness(1.03)",
    "Basin Preserve (Platform Trail)":                "saturate(1.25) contrast(1.06) brightness(1.03)",
    "Carrying Place Preserve":                        "saturate(1.30) contrast(1.05) hue-rotate(-2.5deg)",
    "Eleanor L. Campbell Preserve (Polly Cove)":      "saturate(1.25) contrast(1.08)",
    "Granite Island Preserve & Story Book Trail":     "saturate(1.80) contrast(1.15) brightness(1.20)",
    "Grimes Park":                                    "saturate(1.35) contrast(1.10) brightness(1.05)",
    "Huber Preserve":                                 "saturate(1.25) contrast(1.05) hue-rotate(1.5deg)",
    "Lane's Island Preserve":                         "saturate(1.20) contrast(1.05) brightness(1.03)",
    "Lower Mill River Preserve (Fishhook & Overlook)":"saturate(1.30) contrast(1.05) brightness(0.99)",
    "Marcuse Wetland Preserve":                       "saturate(1.25) contrast(1.06) brightness(0.98)",
    "Middle Mountain Town Park":                      "saturate(1.30) contrast(1.10)",
    "Perry Creek North Preserve":                     "saturate(1.30) contrast(1.05) hue-rotate(-2.5deg) brightness(1.02)",
    "Round Pond Trail":                               "saturate(1.25) contrast(1.05)",
    "Starboard Rock Sanctuary":                       "saturate(1.25) contrast(1.08) hue-rotate(1.5deg)",
    "State Beach Town Park":                          "saturate(1.20) contrast(1.04) brightness(1.03)",
    "Tip Toe Mountain Park":                          "saturate(1.28) contrast(1.08) hue-rotate(-1.5deg)",
    "Watershed Preserve & Wetland Point Trail":       "saturate(1.25) contrast(1.04) brightness(0.98)",
    "Whitmore Pond Sanctuary":                        "saturate(1.20) contrast(1.05) brightness(1.03)",
    "Williams Preserve":                              "saturate(1.30) contrast(1.03) brightness(0.99)",
};

// ── Front-page trail difficulty filter ──
const DIFFICULTY_RANK = { "easy": 1, "intermediate": 2, "challenging": 3, "very-challenging": 4 };

function buildTrailCard(prop) {
    const owner = prop.owner || "vlt";
    const palette = ownerPlaceholder[owner];

    const card = document.createElement("div");
    card.className = "trail-card" + (!prop.trail || prop.comingSoon ? " no-trail" : "");

    // ── Placeholder background (always rendered underneath) ──
    const placeholder = document.createElement("div");
    placeholder.className = "trail-card-placeholder";
    placeholder.style.background = palette.bg;
    placeholder.innerHTML = placeholderSVG(palette.iconFill);
    card.appendChild(placeholder);

    // ── Photo (only added when the property has one) ──
    if (prop.photo) {
        const img = document.createElement("img");
        img.className = "trail-card-photo";
        img.alt = "";
        img.src = cardThumbPath(prop);
        const cardFilter = CARD_FILTERS[prop.name.replace(/\n/g, " ")];
        img.onload = () => { img.style.display = "block"; if (cardFilter) img.style.filter = cardFilter; };
        // If the small thumbnail is ever missing, fall back to the full-res photo.
        img.onerror = () => {
            if (img.src.indexOf("card-thumb.webp") !== -1) img.src = propPath(prop, prop.photo);
        };
        card.appendChild(img);
    }

    const info = TRAIL_INFO[prop.folder];

    // ── Name label (with length when available) ──
    const label = document.createElement("div");
    label.className = "trail-card-label";
    let labelHTML = '<span class="trail-card-name">' + (prop.cardName || prop.name).replace(/\n/g, "<br>") + '</span>';
    if (info && typeof info.lengthMi === "number" && prop.trail && !prop.comingSoon) {
        labelHTML += '<span class="trail-card-len"> · ' + info.lengthMi + ' mi</span>';
    }
    label.innerHTML = labelHTML;
    if (!prop.trail || prop.comingSoon) {
        label.innerHTML += '<span class="coming-soon-badge">Coming Soon</span>';
    }
    card.appendChild(label);

    // ── Ski difficulty mark (top-right) — uses the trail's hardest rating ──
    if (info && Array.isArray(info.difficulty) && info.difficulty.length) {
        const hardest = info.difficulty.slice().sort((a, b) => (DIFFICULTY_RANK[b] || 0) - (DIFFICULTY_RANK[a] || 0))[0];
        const ski = document.createElement("div");
        ski.className = "trail-card-ski";
        ski.innerHTML = skiShapeSVG(hardest, { size: 15 });
        card.appendChild(ski);
    }

    // ── Tap action ──
    if (prop.trail && !prop.comingSoon) {
        // Opened from the trail list → Back should return to the list.
        card.addEventListener("click", () => { cameFromAllTrails = false; showProperty(prop); });
    }
    return card;
}

let trailFilterDiff = "all";    // 'all' or a difficulty key
function trailMatchesFilter(p) {
    if (trailFilterDiff === "all") return true;
    const info = TRAIL_INFO[p.folder];
    return !!(info && Array.isArray(info.difficulty) && info.difficulty.includes(trailFilterDiff));
}
function renderTrailGrid() {
    const gridEl = document.getElementById("trail-grid");
    if (!gridEl) return;
    gridEl.innerHTML = "";
    const list = properties.filter(trailMatchesFilter);
    if (list.length === 0) {
        const empty = document.createElement("div");
        empty.className = "trail-grid-empty";
        empty.textContent = "No trails at this difficulty.";
        gridEl.appendChild(empty);
        return;
    }
    for (const prop of list) gridEl.appendChild(buildTrailCard(prop));
}

// Build the difficulty filter pills (mirrors the trail-description pills).
const TRAIL_FILTER_DEFS = [
    { diff: "all", label: "All" },
    { diff: "easy", label: "Easy" },
    { diff: "intermediate", label: "Moderate" },
    { diff: "challenging", label: "Challenging" },
];
(function buildTrailFilterBar() {
    const bar = document.getElementById("trail-sort-bar");
    if (!bar) return;
    const filters = TRAIL_FILTER_DEFS.map((f) => {
        const shape = f.diff === "all" ? "" : skiShapeSVG(f.diff, { size: 11, color: "currentColor" });
        const active = f.diff === "all" ? " active" : "";
        return `<button class="tf-diff-pill diff-${f.diff}${active}" data-diff="${f.diff}" type="button">${shape}<span>${f.label}</span></button>`;
    }).join("");
    bar.innerHTML = filters;
})();

renderTrailGrid();

document.querySelectorAll("#trail-sort-bar .tf-diff-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
        if (pill.classList.contains("active")) return;
        document.querySelectorAll("#trail-sort-bar .tf-diff-pill").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        trailFilterDiff = pill.dataset.diff;
        renderTrailGrid();
        document.getElementById("list-view")?.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// Stamp the version onto the Resources page so the loaded build is verifiable.
const versionEl = document.getElementById("app-version");
if (versionEl) versionEl.textContent = "Version " + APP_VERSION;

// ============================================================
// Property Detail View (split: info top, map bottom)
// ============================================================
let detailMap = null;
let mapExpanded = false;
let cameFromAllTrails = false;
let currentDetailProp = null;

function toggleMapExpand() {
    const detailView = document.getElementById("detail-view");
    mapExpanded = !mapExpanded;
    if (mapExpanded) {
        detailView.classList.add("map-expanded");
    } else {
        detailView.classList.remove("map-expanded");
    }
    setTimeout(() => {
        if (detailMap) detailMap.invalidateSize();
    }, 350);
    const btn = document.querySelector(".map-expand-btn");
    if (btn) {
        btn.textContent = mapExpanded ? "\u2B07 Back to Info" : "\u2B06 Expand Map";
    }
}

// ── Wildlife state ──
let activeCategory = "all";
let activeSort = "alpha";

// ── View Management ──
let currentView = "list-view"; // Current active view

function switchView(viewName) {
    // Hide all views
    document.getElementById("list-view").style.display = "none";
    document.getElementById("detail-view").classList.add("hidden");
    document.getElementById("wildlife-view").classList.add("hidden");
    document.getElementById("island-map-view").classList.add("hidden");
    document.getElementById("activities-view").classList.add("hidden");
    document.getElementById("owls-view")?.classList.add("hidden");
    document.getElementById("sightings-view")?.classList.add("hidden");
    document.getElementById("events-view")?.classList.add("hidden");
    document.getElementById("tasks-view")?.classList.add("hidden");
    // Reset global species detail overlay
    document.getElementById("global-species-detail-view")?.classList.add("hidden");

    // Show target view
    const viewElement = document.getElementById(viewName);
    if (viewName === "list-view") {
        viewElement.style.display = "";
    } else {
        viewElement.classList.remove("hidden");
    }

    currentView = viewName;

    // Initialize maps if needed
    if (viewName === "island-map-view") {
        setTimeout(() => {
            if (allTrailsMap) {
                allTrailsMap.invalidateSize();
            }
        }, 50);
    }

    // Notify owls module when tasks view is shown
    if (viewName === "tasks-view" && typeof window.onTasksViewShown === "function") {
        window.onTasksViewShown();
    }
}

// ── Photo Carousel ──
// Additional gallery photos per property folder (shown after the main photo)
const galleryPhotos = {
    "A.W. Smith Preserve (Fox Rocks)": [
        "Fall Colors at Fox Rocks by Banner Moffat at Perry Creek (A.W. Smith).JPG",
        "Fall Colors at Fox Rocks by Banner Moffat.JPG",
        "Roberts_ Perry Creek 2025-11-21 10.JPG",
        "View of Long Cove from Fox Rocks.jpeg",
    ],
    "Granite Island Preserve & Story Book Trail": [
        "Basin Preserve_ Granite Island Preserve 2025-12-18 10.JPG",
        "IMG_0359.JPG",
        "LittleBeaver.jpg",
    ],
    "Marcuse Wetland Preserve": [
        "2019 FALL MarcuseGold.jpg",
        "WaxyCapsKH.jpg",
        "shroomsKH.jpeg",
    ],
};

let carouselIndex = 0;
let carouselCount = 0;
let carouselStartX = 0;
let carouselStartY = 0;
let carouselDeltaX = 0;
let carouselDragging = false;
let carouselIsHorizontal = null; // null = undecided, true = horizontal, false = vertical

function initCarousel(mainPhotoSrc, propertyFolder) {
    const track = document.getElementById("carousel-track");
    const dotsContainer = document.getElementById("carousel-dots");
    const carousel = document.getElementById("detail-photo-carousel");
    const info = document.getElementById("detail-info");

    // Hide/show the photo banner. When hidden, flag the info pane so the back
    // button and title don't collide (the button floats where the banner was).
    const hideBanner = (hidden) => {
        carousel.classList.toggle("no-photo", hidden);
        if (info) info.classList.toggle("no-banner", hidden);
    };

    track.innerHTML = "";
    dotsContainer.innerHTML = "";
    carouselIndex = 0;
    carouselDeltaX = 0;

    // Offline: the photo banner (main image + gallery) isn't guaranteed to be
    // cached — gallery photos are intentionally left out of the offline bundle —
    // so hide the banner entirely rather than risk broken images. The trail's
    // photo still shows on the list card (that main image is cached).
    if (!navigator.onLine) {
        hideBanner(true);
        carouselCount = 0;
        return;
    }

    // Build image list: main photo first, then gallery photos
    const images = [];
    if (mainPhotoSrc) {
        images.push(mainPhotoSrc);
    }
    const extras = galleryPhotos[propertyFolder];
    if (extras) {
        for (const photo of extras) {
            images.push("Properties/" + propertyFolder + "/Photo Gallery/" + photo);
        }
    }

    if (images.length === 0) {
        hideBanner(true);
        carouselCount = 0;
        return;
    }
    hideBanner(false);

    carouselCount = images.length;

    // Create images
    for (let i = 0; i < images.length; i++) {
        const img = document.createElement("img");
        img.src = images[i];
        img.alt = "";
        img.draggable = false;
        if (i === 0) {
            const filter = CARD_FILTERS[propertyFolder];
            if (filter) img.style.filter = filter;
        }
        track.appendChild(img);
    }

    // Create dots (only if more than 1 image)
    if (carouselCount > 1) {
        dotsContainer.classList.remove("hidden");
        for (let i = 0; i < carouselCount; i++) {
            const dot = document.createElement("span");
            dot.className = "carousel-dot" + (i === 0 ? " active" : "");
            dotsContainer.appendChild(dot);
        }
    } else {
        dotsContainer.classList.add("hidden");
    }

    // Show/hide arrow buttons
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    if (carouselCount > 1) {
        prevBtn.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
    } else {
        prevBtn.classList.add("hidden");
        nextBtn.classList.add("hidden");
    }

    track.style.transform = "translateX(0)";
}

function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= carouselCount) index = carouselCount - 1;
    carouselIndex = index;

    const track = document.getElementById("carousel-track");
    track.style.transition = "transform 0.3s ease";
    track.style.transform = "translateX(-" + (index * 100) + "%)";

    // Update dots
    const dots = document.querySelectorAll("#carousel-dots .carousel-dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

// Touch/swipe handlers on the carousel
(function () {
    const carousel = document.getElementById("detail-photo-carousel");
    if (!carousel) return;

    carousel.addEventListener("touchstart", (e) => {
        if (carouselCount <= 1) return;
        carouselDragging = true;
        carouselIsHorizontal = null;
        carouselStartX = e.touches[0].clientX;
        carouselStartY = e.touches[0].clientY;
        carouselDeltaX = 0;
        const track = document.getElementById("carousel-track");
        track.style.transition = "none";
    }, { passive: true });

    carousel.addEventListener("touchmove", (e) => {
        if (!carouselDragging) return;
        const dx = e.touches[0].clientX - carouselStartX;
        const dy = e.touches[0].clientY - carouselStartY;

        // Determine direction on first significant movement
        if (carouselIsHorizontal === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
            carouselIsHorizontal = Math.abs(dx) >= Math.abs(dy);
        }

        // Only handle horizontal swipes; let vertical pass through to page scroll
        if (!carouselIsHorizontal) return;

        e.preventDefault(); // Prevent page scroll during horizontal swipe
        carouselDeltaX = dx;
        const track = document.getElementById("carousel-track");
        const offset = -(carouselIndex * carousel.offsetWidth) + carouselDeltaX;
        track.style.transform = "translateX(" + offset + "px)";
    }, { passive: false }); // Must be non-passive to call preventDefault

    carousel.addEventListener("touchend", () => {
        if (!carouselDragging) return;
        carouselDragging = false;
        carouselIsHorizontal = null;
        if (!carouselIsHorizontal && Math.abs(carouselDeltaX) < 5) {
            carouselDeltaX = 0;
            return;
        }
        const threshold = carousel.offsetWidth * 0.2;
        if (carouselDeltaX < -threshold) {
            goToSlide(carouselIndex + 1);
        } else if (carouselDeltaX > threshold) {
            goToSlide(carouselIndex - 1);
        } else {
            goToSlide(carouselIndex); // snap back
        }
        carouselDeltaX = 0;
    }, { passive: true });
})();

// ── Carousel arrow button click handlers ──
(function () {
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            goToSlide(carouselIndex - 1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            goToSlide(carouselIndex + 1);
        });
    }
})();

// ── Bottom tab bar (detail-nav) ──
document.querySelectorAll(".detail-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        const tabName = tab.dataset.tab;

        if (tabName === "map") {
            // Navigate to Island Map view
            switchView("island-map-view");
            initializeAllTrailsMap();
        } else if (tabName === "wildlife") {
            // Toggle wildlife overlay
            if (tab.classList.contains("active")) {
                // Deactivate current tab
                tab.classList.remove("active");
                hideWildlifePanel();
            } else {
                // Deactivate all tabs first
                document.querySelectorAll(".detail-tab").forEach((t) => t.classList.remove("active"));
                hideWildlifePanel();

                // Activate clicked tab
                tab.classList.add("active");
                showWildlifePanel();
            }
        } else if (tabName === "activities") {
            // Activities is placeholder, do nothing for now
        } else if (tabName === "owls") {
            switchView("owls-view");
        } else if (tabName === "events") {
            switchView("events-view");
        }
    });
});

function resetDetailTabs() {
    document.querySelectorAll(".detail-tab").forEach((t) => t.classList.remove("active"));
    hideWildlifePanel();
}

// ── Bottom nav button handlers (List View) ──
document.getElementById("nav-wildlife")?.addEventListener("click", () => {
    switchView("wildlife-view");
    buildGlobalWildlifeList();
});

document.getElementById("nav-map")?.addEventListener("click", () => {
    switchView("island-map-view");
    setTimeout(() => initializeAllTrailsMap(), 100);
});

document.getElementById("nav-activities")?.addEventListener("click", () => {
    switchView("activities-view");
});

// ── Bottom nav button handlers (Wildlife View) ──
document.getElementById("wildlife-view-back-btn")?.addEventListener("click", () => {
    switchView("list-view");
});

document.getElementById("wildlife-nav-wildlife")?.addEventListener("click", () => {
    // Already in wildlife view, do nothing
});

document.getElementById("wildlife-nav-map")?.addEventListener("click", () => {
    switchView("island-map-view");
    setTimeout(() => initializeAllTrailsMap(), 100);
});

document.getElementById("wildlife-nav-activities")?.addEventListener("click", () => {
    switchView("activities-view");
});

// ── Bottom nav button handlers (Island Map View) ──
document.getElementById("map-back-btn")?.addEventListener("click", () => {
    switchView("list-view");
});

document.getElementById("map-nav-wildlife")?.addEventListener("click", () => {
    switchView("wildlife-view");
    buildGlobalWildlifeList();
});

document.getElementById("map-nav-activities")?.addEventListener("click", () => {
    switchView("activities-view");
});

// ── Bottom nav button handlers (Activities View) ──
document.getElementById("activities-back-btn")?.addEventListener("click", () => {
    switchView("list-view");
});

document.getElementById("activities-nav-wildlife")?.addEventListener("click", () => {
    switchView("wildlife-view");
    buildGlobalWildlifeList();
});

document.getElementById("activities-nav-map")?.addEventListener("click", () => {
    switchView("island-map-view");
    setTimeout(() => initializeAllTrailsMap(), 100);
});

document.getElementById("activities-nav-owls")?.addEventListener("click", () => {
    switchView("owls-view");
});

// ── Bottom nav button handlers (List View) ──
document.getElementById("nav-owls")?.addEventListener("click", () => {
    switchView("owls-view");
});

// ── Bottom nav button handlers (Wildlife View) ──
document.getElementById("wildlife-nav-owls")?.addEventListener("click", () => {
    switchView("owls-view");
});

// ── Bottom nav button handlers (Island Map View) ──
document.getElementById("map-nav-owls")?.addEventListener("click", () => {
    switchView("owls-view");
});

// ── Bottom nav button handlers (Owls View) ──
document.getElementById("owls-back-btn")?.addEventListener("click", () => {
    switchView("list-view");
});

document.getElementById("owls-nav-wildlife")?.addEventListener("click", () => {
    switchView("wildlife-view");
    buildGlobalWildlifeList();
});

document.getElementById("owls-nav-map")?.addEventListener("click", () => {
    switchView("island-map-view");
    setTimeout(() => initializeAllTrailsMap(), 100);
});

document.getElementById("owls-nav-activities")?.addEventListener("click", () => {
    switchView("activities-view");
});

document.getElementById("owls-nav-owls")?.addEventListener("click", () => {
    // Already in owls view, do nothing
});

document.getElementById("owls-nav-events")?.addEventListener("click", () => {
    switchView("events-view");
});

// ── Bottom nav button handlers (Events View) ──
document.getElementById("events-back-btn")?.addEventListener("click", () => {
    switchView("list-view");
});

document.getElementById("events-nav-wildlife")?.addEventListener("click", () => {
    switchView("wildlife-view");
    buildGlobalWildlifeList();
});

document.getElementById("events-nav-activities")?.addEventListener("click", () => {
    switchView("activities-view");
});

document.getElementById("events-nav-map")?.addEventListener("click", () => {
    switchView("island-map-view");
    setTimeout(() => initializeAllTrailsMap(), 100);
});

document.getElementById("events-nav-owls")?.addEventListener("click", () => {
    switchView("owls-view");
});

document.getElementById("events-nav-events")?.addEventListener("click", () => {
    // Already in events view, do nothing
});

// ── Bottom nav events buttons (other views) ──
document.getElementById("nav-events")?.addEventListener("click", () => {
    switchView("events-view");
});

document.getElementById("wildlife-nav-events")?.addEventListener("click", () => {
    switchView("events-view");
});

document.getElementById("map-nav-events")?.addEventListener("click", () => {
    switchView("events-view");
});

document.getElementById("activities-nav-events")?.addEventListener("click", () => {
    switchView("events-view");
});

// ── Bottom nav button handlers (Tasks View) ──
document.getElementById("tasks-back-btn")?.addEventListener("click", () => {
    switchView("list-view");
});

document.getElementById("tasks-nav-tasks")?.addEventListener("click", () => {
    // Already in tasks view
});

document.getElementById("tasks-nav-activities")?.addEventListener("click", () => {
    switchView("activities-view");
});

document.getElementById("tasks-nav-map")?.addEventListener("click", () => {
    switchView("island-map-view");
    setTimeout(() => initializeAllTrailsMap(), 100);
});

document.getElementById("tasks-nav-owls")?.addEventListener("click", () => {
    switchView("owls-view");
});

document.getElementById("tasks-nav-events")?.addEventListener("click", () => {
    switchView("events-view");
});

// ── Resource Dropdowns ──
(function() {
    const dropdownHeaders = document.querySelectorAll(".dropdown-header");

    dropdownHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const targetId = header.dataset.target;
            const targetContent = document.getElementById(targetId);
            const isExpanded = header.classList.contains("expanded");

            // Toggle current dropdown
            if (isExpanded) {
                header.classList.remove("expanded");
                targetContent?.classList.remove("visible");
                targetContent?.classList.add("hidden");
            } else {
                header.classList.add("expanded");
                targetContent?.classList.remove("hidden");
                targetContent?.classList.add("visible");
            }
        });
    });
})();

// ── FAQ Accordion ──
(function() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        question.addEventListener("click", () => {
            const isExpanded = item.classList.contains("expanded");

            // Close all items
            faqItems.forEach(i => {
                i.classList.remove("expanded");
                i.querySelector(".faq-answer").classList.remove("visible");
            });

            // Open clicked item if it wasn't already expanded
            if (!isExpanded) {
                item.classList.add("expanded");
                answer.classList.add("visible");
            }
        });
    });
})();

// ── Wildlife functions ──
function showWildlifePanel() {
    const detailView = document.getElementById("detail-view");
    detailView.classList.add("wildlife-active");
    buildWildlifeGrid();
    showWildlifeGrid();
}

function hideWildlifePanel() {
    const detailView = document.getElementById("detail-view");
    detailView.classList.remove("wildlife-active");
    if (detailMap) {
        setTimeout(() => detailMap.invalidateSize(), 50);
    }
}

function getFilteredSpecies(searchQuery) {
    let list = wildlifeSpecies;

    // Filter by category
    if (activeCategory !== "all") {
        list = list.filter((s) => s.category === activeCategory);
    }

    // Filter by search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter((s) =>
            s.commonName.toLowerCase().includes(q) ||
            s.scientificName.toLowerCase().includes(q)
        );
    }

    // Sort
    if (activeSort === "alpha") {
        list = [...list].sort((a, b) => a.commonName.localeCompare(b.commonName));
    } else {
        // Abundance: highest first, then alphabetical within same level
        list = [...list].sort((a, b) => {
            if (b.abundance !== a.abundance) return b.abundance - a.abundance;
            return a.commonName.localeCompare(b.commonName);
        });
    }

    return list;
}

function buildWildlifeGrid() {
    const grid = document.getElementById("wildlife-grid");
    const emptyEl = document.getElementById("wildlife-empty");
    grid.innerHTML = "";

    const searchInput = document.getElementById("wildlife-search");
    const searchQuery = searchInput ? searchInput.value.trim() : "";
    const filtered = getFilteredSpecies(searchQuery);

    if (filtered.length === 0) {
        grid.style.display = "none";
        emptyEl.classList.remove("hidden");
        return;
    }

    grid.style.display = "";
    emptyEl.classList.add("hidden");

    for (const species of filtered) {
        const card = document.createElement("div");
        card.className = "species-card";

        const img = document.createElement("img");
        img.alt = species.commonName;
        img.loading = "lazy";
        img.src = "Wildlife/" + species.folder + "/" + species.photo;
        card.appendChild(img);

        const label = document.createElement("div");
        label.className = "species-card-label";

        const nameSpan = document.createElement("span");
        nameSpan.className = "species-card-name";
        nameSpan.textContent = species.commonName;
        label.appendChild(nameSpan);

        const sciSpan = document.createElement("span");
        sciSpan.className = "species-card-sci";
        sciSpan.textContent = species.scientificName;
        label.appendChild(sciSpan);

        card.appendChild(label);

        card.addEventListener("click", () => showSpeciesDetail(species));
        grid.appendChild(card);
    }
}

function showSpeciesDetail(species) {
    document.getElementById("wildlife-grid-view").classList.add("hidden");
    const detailView = document.getElementById("wildlife-detail-view");
    detailView.classList.remove("hidden");

    document.getElementById("wildlife-detail-photo").src =
        "Wildlife/" + species.folder + "/" + species.photo;
    document.getElementById("wildlife-detail-photo").alt = species.commonName;
    document.getElementById("wildlife-detail-name").textContent = species.commonName;
    document.getElementById("wildlife-detail-scientific").textContent = species.scientificName;
    document.getElementById("wildlife-detail-desc").textContent = species.description;

    // Category badge
    const catBadge = document.getElementById("wildlife-detail-category");
    catBadge.textContent = categoryLabels[species.category] || species.category;
    catBadge.className = "category-badge category-" + species.category;

    // Abundance badge
    const abBadge = document.getElementById("wildlife-detail-abundance");
    const abLabel = abundanceLabels[species.abundance] || "";
    abBadge.textContent = abLabel;
    abBadge.className = "abundance-badge abundance-" + species.abundance;

    // Native badge
    const natBadge = document.getElementById("wildlife-detail-native");
    natBadge.textContent = species.native ? "Native" : "Non-native";
    natBadge.className = species.native ? "native-badge" : "native-badge non-native";

    detailView.scrollTop = 0;
}

function showWildlifeGrid() {
    document.getElementById("wildlife-detail-view").classList.add("hidden");
    document.getElementById("wildlife-grid-view").classList.remove("hidden");
}

function showGlobalSpeciesDetail(species) {
    const detailView = document.getElementById("global-species-detail-view");
    detailView.classList.remove("hidden");

    const photo = document.getElementById("global-species-detail-photo");
    photo.src = "Wildlife/" + species.folder + "/" + species.photo;
    photo.alt = species.commonName;

    document.getElementById("global-species-detail-name").textContent = species.commonName;
    document.getElementById("global-species-detail-scientific").textContent = species.scientificName;
    document.getElementById("global-species-detail-desc").textContent = species.description;

    // Category badge
    const catBadge = document.getElementById("global-species-detail-category");
    catBadge.textContent = categoryLabels[species.category] || species.category;
    catBadge.className = "category-badge category-" + species.category;

    const abBadge = document.getElementById("global-species-detail-abundance");
    abBadge.textContent = abundanceLabels[species.abundance] || "";
    abBadge.className = "abundance-badge abundance-" + species.abundance;

    const natBadge = document.getElementById("global-species-detail-native");
    natBadge.textContent = species.native ? "Native" : "Non-native";
    natBadge.className = species.native ? "native-badge" : "native-badge non-native";

    // When we arrived here from a photo-ID suggestion, the back button
    // returns to that result and an extra "Close" button exits entirely.
    const closeBtn = document.getElementById("global-species-detail-close-btn");
    const backBtn = document.getElementById("global-species-detail-back-btn");
    if (closeBtn) closeBtn.classList.toggle("hidden", !identifyFromDetail);
    if (backBtn) backBtn.textContent = identifyFromDetail ? "← Back to photo" : "← Back";

    detailView.scrollTop = 0;
}

// ── Scoped Category & Sort Handlers ──
function setupCategoryHandlers(container, buildFn) {
    container.querySelectorAll(".category-pill").forEach((pill) => {
        pill.addEventListener("click", () => {
            container.querySelectorAll(".category-pill").forEach((p) => p.classList.remove("active"));
            pill.classList.add("active");
            activeCategory = pill.dataset.category;
            buildFn();
        });
    });
}

function setupSortHandlers(container, buildFn) {
    container.querySelectorAll(".sort-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            container.querySelectorAll(".sort-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            activeSort = btn.dataset.sort;
            buildFn();
        });
    });
}

// Detail panel (property-specific) handlers
setupCategoryHandlers(document.getElementById("wildlife-panel"), buildWildlifeGrid);
setupSortHandlers(document.getElementById("wildlife-panel"), buildWildlifeGrid);
document.getElementById("wildlife-search").addEventListener("input", buildWildlifeGrid);

// Global wildlife view handlers
setupCategoryHandlers(document.getElementById("wildlife-view"), buildGlobalWildlifeList);
setupSortHandlers(document.getElementById("wildlife-view"), buildGlobalWildlifeList);
document.getElementById("global-wildlife-search").addEventListener("input", buildGlobalWildlifeList);

// Wildlife back button (detail panel — returns to property info)
document.getElementById("wildlife-back-btn").addEventListener("click", () => {
    document.querySelectorAll(".detail-tab").forEach((t) => t.classList.remove("active"));
    hideWildlifePanel();
});

// Wildlife detail species back button
document.getElementById("wildlife-detail-back-btn").addEventListener("click", () => {
    showWildlifeGrid();
});

// Global species detail back button
document.getElementById("global-species-detail-back-btn")?.addEventListener("click", () => {
    document.getElementById("global-species-detail-view").classList.add("hidden");
    // If we came from a photo-ID suggestion, return to the results modal
    // (showing the original photos) rather than the species list.
    if (identifyFromDetail) {
        document.getElementById("identify-modal")?.classList.remove("hidden");
    }
});

// Global species detail "Close" button — only used when arriving from the
// photo identifier; exits both the detail page and the identify modal.
document.getElementById("global-species-detail-close-btn")?.addEventListener("click", () => {
    document.getElementById("global-species-detail-view").classList.add("hidden");
    closeIdentify();
});

// ── Global Wildlife List Builder ──
function buildGlobalWildlifeList() {
    const listEl = document.getElementById("global-wildlife-list");
    if (!listEl) return;
    listEl.innerHTML = "";

    const searchInput = document.getElementById("global-wildlife-search");
    const searchQuery = searchInput ? searchInput.value.trim() : "";
    const filtered = getFilteredSpecies(searchQuery);

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.style.cssText = "padding:3rem 1.5rem;text-align:center;color:#999;font-size:0.95rem;font-style:italic;";
        empty.textContent = "No species in this category yet.";
        listEl.appendChild(empty);
        return;
    }

    for (const species of filtered) {
        const card = document.createElement("div");
        card.className = "species-card";

        const img = document.createElement("img");
        img.alt = species.commonName;
        img.loading = "lazy";
        img.src = "Wildlife/" + species.folder + "/" + species.photo;
        card.appendChild(img);

        const label = document.createElement("div");
        label.className = "species-card-label";

        const nameSpan = document.createElement("span");
        nameSpan.className = "species-card-name";
        nameSpan.textContent = species.commonName;
        label.appendChild(nameSpan);

        const sciSpan = document.createElement("span");
        sciSpan.className = "species-card-sci";
        sciSpan.textContent = species.scientificName;
        label.appendChild(sciSpan);

        card.appendChild(label);

        card.addEventListener("click", () => { identifyFromDetail = false; showGlobalSpeciesDetail(species); });
        listEl.appendChild(card);
    }
}

function navigateToPropertyFromAllTrails(prop) {
    cameFromAllTrails = true;
    stopLocationTracking();
    showProperty(prop);
}

async function showProperty(prop) {
    // Notify owls module we're leaving any previous detail map
    if (typeof window.onDetailMapLeaving === 'function') window.onDetailMapLeaving();

    currentDetailProp = prop;

    // Reset expand state
    mapExpanded = false;
    document.getElementById("detail-view").classList.remove("map-expanded");
    resetDetailTabs();

    // Update back button text based on navigation source
    const backBtn = document.getElementById("detail-back-btn");
    backBtn.innerHTML = cameFromAllTrails ? "&larr; Map" : "&larr; Trails";

    const owner = prop.owner || "vlt";
    const org = orgInfo[owner];

    // ── Populate info panel ──
    const mainPhotoSrc = prop.photo ? "Properties/" + prop.folder + "/" + prop.photo : null;
    initCarousel(mainPhotoSrc, prop.folder);

    document.getElementById("detail-org-logo").src = org.logo;
    const logo2El = document.getElementById("detail-org-logo-2");
    if (prop.coOwner) {
        logo2El.src = orgInfo[prop.coOwner].logo;
        logo2El.style.display = "";
    } else {
        logo2El.src = "";
        logo2El.style.display = "none";
    }
    const titleEl = document.getElementById("detail-title");
    titleEl.textContent = prop.name.replace(/\n/g, " ");
    titleEl.href = org.url;

    // ── Trail stats (structured data) ──
    const lengthEl = document.getElementById("detail-length");
    renderTrailStats(prop, lengthEl);

    // ── Show detail view immediately so the user isn't stuck on the all-trails
    //    map tooltip while the description file loads over the network. ──
    switchView("detail-view");

    // ── Load description (RTF) in the background ──
    const descEl = document.getElementById("detail-desc");
    descEl.textContent = "";

    if (prop.description) {
        fetch(propPath(prop, prop.description))
            .then(res => res.text())
            .then(rtf => {
                const plain = parseRTF(rtf);
                const fields = parseDescriptionFields(plain);
                if (fields.warnings || fields.description) {
                    descEl.innerHTML = "";
                    for (const warning of (fields.warnings || [])) {
                        const p = document.createElement("p");
                        p.style.fontWeight = "bold";
                        p.style.color = "#cc0000";
                        p.textContent = warning;
                        descEl.appendChild(p);
                    }
                    for (const para of (fields.description || [])) {
                        const p = document.createElement("p");
                        p.textContent = para;
                        descEl.appendChild(p);
                    }
                }
            })
            .catch(err => console.error("Failed to load description:", err));
    }

    // ── Initialize map in bottom half ──
    if (detailMap) {
        detailMap.remove();
        detailMap = null;
    }
    detailMap = L.map("detail-map", { zoomControl: false });

    // Two base layers the user can toggle between (matches the All Trails map).
    const detailSatellite = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        { attribution: "Map data &copy; Google", maxZoom: 20 }
    );
    // USGS topographic quads — contour lines, no API key. maxNativeZoom lets it
    // upscale past its native zoom so it stays usable at the satellite's deeper
    // zoom levels instead of going blank.
    const detailTopo = L.tileLayer(
        "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; USGS The National Map", maxNativeZoom: 16, maxZoom: 20 }
    );

    const detailTileLayer = detailSatellite.addTo(detailMap); // satellite is the default

    // Hide loading indicator when the active base layer first loads
    detailTileLayer.on('load', function() {
        const loader = document.querySelector('#detail-map .map-loading');
        if (loader) loader.classList.add('hidden');
    });

    // Compact Sat / Topo toggle — topleft so it shares the row with Back to
    // Info + Hide Issues (they spread evenly across the top when expanded).
    detailMap.addControl(makeLayerToggle(detailMap, detailSatellite, detailTopo, "topleft"));
    L.control.zoom({ position: "bottomright" }).addTo(detailMap);
    // "My Location" on a single-preserve map — no snap (already in one preserve),
    // just center on the user and drop the blue dot.
    detailMap.addControl(makeLocateControl(() => detailMap, false));
    const ExpandControl = L.Control.extend({
        options: { position: "topleft" },
        onAdd: function () {
            const btn = L.DomUtil.create("button", "map-expand-btn");
            btn.textContent = "\u2B06 Expand Map";
            btn.setAttribute("aria-label", "Expand map");
            L.DomEvent.disableClickPropagation(btn);
            btn.addEventListener("click", toggleMapExpand);
            return btn;
        },
    });
    detailMap.addControl(new ExpandControl());
    detailMap.addControl(makeStatusControl());

    setTimeout(() => detailMap.invalidateSize(), 50);

    // Offline: only the default cached view exists, so lock zoom/pan/expand.
    setDetailMapOffline(detailMap, !navigator.onLine);

    // Notify owls module that the detail map is ready for controls
    if (typeof window.onDetailMapReady === 'function') window.onDetailMapReady(detailMap, prop);

    // ── Load layers: boundary → trail → parking ──
    // interactive:false → tapping the boundary doesn't intercept map clicks,
    // which is essential for pin-drop mode (touch needs to reach the map's
    // click handler, not the polygon's).
    await addBoundary(detailMap, prop, { interactive: false });

    try {
        const geoJson = await loadKml(propPath(prop, prop.trail));
        const layer = L.geoJSON(geoJson, {
            style: { color: "#ff4444", weight: 4, opacity: 0.95 },
            filter: (f) => f.geometry.type !== "Point",
            interactive: false,    // same reason — let map clicks through
        }).addTo(detailMap);

        let bounds = layer.getBounds();

        for (const conn of prop.connectors) {
            try {
                const connGeoJson = await loadKml(propPath(prop, conn));
                const connLayer = L.geoJSON(connGeoJson, {
                    style: { color: "#ff4444", weight: 4, opacity: 0.95 },
                    filter: (f) => f.geometry.type !== "Point",
                    interactive: false,
                }).addTo(detailMap);
                bounds.extend(connLayer.getBounds());
            } catch (err) {
                console.error("Failed to load connector:", conn, err);
            }
        }

        detailMap.fitBounds(bounds, { padding: [30, 30] });
    } catch (err) {
        console.error("Failed to load trail:", err);
    }

    // Load adjacent properties (dimmed, does not affect zoom)
    for (const adjFolder of (prop.adjacent || [])) {
        const adjProp = properties.find((p) => p.folder === adjFolder);
        if (adjProp) loadAdjacentLayers(detailMap, adjProp);
    }

    await addParkingForProp(detailMap, prop);
    startLocationTracking(detailMap);
}

// Back from detail view
document.getElementById("detail-back-btn").addEventListener("click", () => {
    // Reset expand state
    mapExpanded = false;
    document.getElementById("detail-view").classList.remove("map-expanded");

    resetDetailTabs();
    if (typeof window.onDetailMapLeaving === 'function') window.onDetailMapLeaving();
    stopLocationTracking();
    if (detailMap) {
        detailMap.remove();
        detailMap = null;
    }
    currentDetailProp = null;

    // Return to wherever the trail was opened from: the island map (if you
    // tapped a trail on the All Trails map) or the trail list otherwise.
    if (cameFromAllTrails) {
        cameFromAllTrails = false;
        switchView("island-map-view");
        setTimeout(() => initializeAllTrailsMap(), 100);
    } else {
        switchView("list-view");
    }
});

// ============================================================
// All Trails Map
// ============================================================
const trailColor = "#ff4444";

function initAllMap() {
    if (allMap) return;
    allMap = L.map("all-map", { zoomControl: false });

    // Two base layers the user can toggle between.
    const satelliteLayer = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        { attribution: "Map data &copy; Google", maxZoom: 20 }
    );
    // USGS topographic quads — contour lines, reliable, no API key. maxNativeZoom
    // lets it upscale past its native zoom so it stays usable at the satellite's
    // deeper zoom levels instead of going blank.
    const topoLayer = L.tileLayer(
        "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; USGS The National Map", maxNativeZoom: 16, maxZoom: 20 }
    );

    const allTileLayer = satelliteLayer.addTo(allMap); // satellite is the default

    // Hide loading indicator when the active base layer first loads
    allTileLayer.on('load', function() {
        const loader = document.querySelector('#all-map .map-loading');
        if (loader) loader.classList.add('hidden');
    });

    // Compact Sat / Topo toggle (matches the other map buttons in size).
    allMap.addControl(makeLayerToggle(allMap, satelliteLayer, topoLayer));

    L.control.zoom({ position: "bottomright" }).addTo(allMap);

    // "My Location" button — locate the user; snap into the preserve they're
    // standing in (allowSnap), or just center the map on them.
    allMap.addControl(makeLocateControl(() => allMap, true));

    const AllLegendControl = L.Control.extend({
        options: { position: "bottomleft" },
        onAdd: function () {
            const div = L.DomUtil.create("div", "map-legend");
            div.innerHTML =
                '<span class="legend-item"><span class="legend-swatch" style="background:#4a9e4a"></span>VLT</span>' +
                '<span class="legend-item"><span class="legend-swatch" style="background:#3a8fd4"></span>MCHT</span>' +
                '<span class="legend-item"><span class="legend-swatch" style="background:#f0c030"></span>Town</span>';
            L.DomEvent.disableClickPropagation(div);
            return div;
        },
    });
    allMap.addControl(new AllLegendControl());
    allMap.addControl(makeStatusControl());

    // Offline: only cached tiles exist, so lock zoom/pan here too (otherwise you
    // can scroll the island into blank, uncached areas). Mirrors the detail map.
    setDetailMapOffline(allMap, !navigator.onLine);
}

async function showAllTrails() {
    initAllMap();
    setTimeout(() => allMap.invalidateSize(), 50);

    if (allTrailsLoaded) {
        startLocationTracking(allMap);
        return;
    }

    const allBounds = L.latLngBounds();

    // 1. Load all boundaries first (bottom layer)
    await addAllBoundaries(allMap);

    // 2. Load all trails on top of boundaries
    for (const prop of properties) {
        if (!prop.trail) continue;
        try {
            const geoJson = await loadKml(propPath(prop, prop.trail));
            const layer = L.geoJSON(geoJson, {
                style: { color: trailColor, weight: 4, opacity: 0.95 },
                filter: (f) => f.geometry.type !== "Point",
                onEachFeature: function (feature, lyr) {
                    lyr.bindTooltip(prop.name.replace(/\n/g, " "), {
                        sticky: true,
                        className: "trail-tooltip",
                    });
                    lyr.on("click", function () {
                        navigateToPropertyFromAllTrails(prop);
                    });
                },
            }).addTo(allMap);

            allBounds.extend(layer.getBounds());

            // Load connectors (also red, on top)
            for (const conn of prop.connectors) {
                try {
                    const connGeoJson = await loadKml(propPath(prop, conn));
                    const connLayer = L.geoJSON(connGeoJson, {
                        style: { color: trailColor, weight: 4, opacity: 0.95 },
                        filter: (f) => f.geometry.type !== "Point",
                        onEachFeature: function (feature, lyr) {
                            lyr.on("click", function () {
                                navigateToPropertyFromAllTrails(prop);
                            });
                        },
                    }).addTo(allMap);
                    allBounds.extend(connLayer.getBounds());
                } catch (err) {
                    console.error("Failed to load connector:", conn, err);
                }
            }
        } catch (err) {
            console.error("Failed to load trail:", prop.folder, err);
        }
    }

    // 3. Load parking on top of everything
    await addAllParking(allMap);

    allMap.fitBounds(allBounds, { padding: [30, 30] });
    allTrailsLoaded = true;
    startLocationTracking(allMap);
}

// Initialize all trails map (called when switching to island-map-view)
function initializeAllTrailsMap() {
    if (!allTrailsLoaded) {
        showAllTrails();
    } else if (allMap) {
        allMap.invalidateSize();
    }
}

// ============================================================
// Geolocation — Blue Dot
// ============================================================
let activeMap = null;

// Which preserve (if any) contains this GPS point? Uses turf point-in-polygon
// against the boundary polygons cached when the island map loaded.
function findContainingProperty(lat, lng) {
    if (typeof turf === "undefined") return null;
    const pt = [lng, lat]; // GeoJSON is [lng, lat]
    for (const entry of boundaryPolygons) {
        const gj = entry.geojson;
        const features = gj && gj.features ? gj.features : (gj ? [gj] : []);
        for (const f of features) {
            const geom = f && f.geometry ? f.geometry : f;
            if (!geom || (geom.type !== "Polygon" && geom.type !== "MultiPolygon")) continue;
            try {
                if (turf.booleanPointInPolygon(pt, geom)) return entry.prop;
            } catch (e) { /* malformed geometry — skip */ }
        }
    }
    return null;
}

function locationDotIcon() {
    return L.divIcon({ className: "location-dot", iconSize: [18, 18], iconAnchor: [9, 9] });
}

// Place/refresh the blue dot on a specific map. Reused by the live tracker
// AND the My Location button so the dot is always on the visible map.
function showLocationDot(map, lat, lng) {
    if (!map) return;
    const latlng = [lat, lng];
    if (locationMarker) {
        locationMarker.setLatLng(latlng);
        if (!map.hasLayer(locationMarker)) locationMarker.addTo(map);
    } else {
        locationMarker = L.marker(latlng, { icon: locationDotIcon(), zIndexOffset: 1000 }).addTo(map);
    }
    activeMap = map;
}

// "My Location" button. On the island map (allowSnap) it snaps into the
// preserve you're standing in; otherwise it just centers + drops the dot.
// If a fresh fix fails, it falls back to the live tracker's last position so
// the dot still appears instead of silently doing nothing.
let locating = false;
function locateMe(btn, map, allowSnap) {
    map = map || allMap;
    if (!navigator.geolocation) {
        console.log("Location isn't available on this device.");
        return;
    }
    if (locating) return;
    locating = true;
    if (btn) btn.classList.add("locating");

    const place = (lat, lng) => {
        if (allowSnap) {
            const prop = findContainingProperty(lat, lng);
            if (prop) { navigateToPropertyFromAllTrails(prop); return; }
        }
        map.setView([lat, lng], Math.max(map.getZoom() || 15, 15));
        showLocationDot(map, lat, lng);
    };

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            locating = false;
            if (btn) btn.classList.remove("locating");
            place(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
            locating = false;
            if (btn) btn.classList.remove("locating");
            // Fallback: use the live tracker's most recent fix if we have one.
            if (locationMarker) {
                const ll = locationMarker.getLatLng();
                place(ll.lat, ll.lng);
                return;
            }
            const msg = err.code === 1
                ? "Location permission denied. Enable it in Settings to use this."
                : "Couldn't get your location — try again outdoors.";
            if (typeof window.showIssueToast === "function") window.showIssueToast(msg);
            else console.log(msg);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
}

// Reusable "My Location" map control. getMap() is a getter so it always
// targets the current map (the detail map is recreated per preserve).
function makeLocateControl(getMap, allowSnap) {
    const Ctl = L.Control.extend({
        options: { position: "bottomright" },
        onAdd: function () {
            const btn = L.DomUtil.create("button", "map-locate-btn");
            btn.type = "button";
            btn.title = "My Location";
            btn.setAttribute("aria-label", "My Location");
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/></svg>';
            L.DomEvent.disableClickPropagation(btn);
            L.DomEvent.on(btn, "click", function (e) { L.DomEvent.stop(e); locateMe(btn, getMap(), allowSnap); });
            return btn;
        },
    });
    return new Ctl();
}

function startLocationTracking(targetMap) {
    if (!navigator.geolocation) return;
    stopLocationTracking();
    activeMap = targetMap;

    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            showLocationDot(activeMap, pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
            console.log("Geolocation error:", err.message);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
}

function stopLocationTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    if (locationMarker && activeMap) {
        activeMap.removeLayer(locationMarker);
        locationMarker = null;
    }
}

// ── Owls integration hooks ──────────────────────────────────
window.getDetailMap         = () => detailMap;
window.getCurrentDetailProp = () => currentDetailProp;
window.getAllProperties     = () => properties;
window.showProperty         = showProperty;
window.propPath             = propPath;
window.loadKml              = loadKml;

// ── Photo Species Identification ─────────────────────────────
// Camera button → pick/snap a photo → Claude identifies it against the
// Vinalhaven species list (via the identify-species Netlify function) →
// show confident matches, or "No confident matches at this time."

const IDENTIFY_ENDPOINT = "/.netlify/functions/identify-species";
const IDENTIFY_MAX_DIM = 1024;     // longest edge sent to the model
const IDENTIFY_MAX_PHOTOS = 3;     // macro / micro / stem-or-leaf

// Photos staged for the current identification: { base64, mediaType, url }.
let identifyPhotos = [];
// True while a species detail page was opened from an ID suggestion, so its
// Back returns to the results and an extra Close exits the whole flow.
let identifyFromDetail = false;

// Close the identify flow entirely and release any photo previews.
function closeIdentify() {
    document.getElementById("identify-modal")?.classList.add("hidden");
    for (const p of identifyPhotos) { if (p.url) URL.revokeObjectURL(p.url); }
    identifyPhotos = [];
    identifyFromDetail = false;
    const results = document.getElementById("identify-results");
    const status = document.getElementById("identify-status");
    if (results) results.innerHTML = "";
    if (status) { status.innerHTML = ""; status.classList.remove("no-match"); }
}

(function setupIdentify() {
    // Both the global Wildlife page and each preserve's Wildlife tab have a
    // camera button (class wildlife-identify-trigger); wire them all.
    const triggers = document.querySelectorAll(".wildlife-identify-trigger");
    const input    = document.getElementById("wildlife-identify-input");
    const modal    = document.getElementById("identify-modal");
    const closeBtn = document.getElementById("identify-close-btn");
    const overlay  = modal?.querySelector(".identify-overlay");
    const goBtn    = document.getElementById("identify-go-btn");
    const hint     = document.getElementById("identify-hint");
    const photosEl = document.getElementById("identify-photos");
    const statusEl = document.getElementById("identify-status");
    const resultsEl = document.getElementById("identify-results");

    if (!triggers.length || !input || !modal) return;

    triggers.forEach((btn) => btn.addEventListener("click", () => {
        // Photo ID needs the network (Claude vision API), so block it offline
        // with a clear prompt instead of opening a flow that can't finish.
        if (!navigator.onLine) {
            if (typeof showIssueToast === "function") showIssueToast("Photo search does not work offline.");
            else alert("Photo search does not work offline.");
            return;
        }
        closeIdentify();                 // start a fresh session
        modal.classList.remove("hidden");
        setState("collect");
    }));

    closeBtn?.addEventListener("click", closeIdentify);
    overlay?.addEventListener("click", closeIdentify);

    input.addEventListener("change", async () => {
        const files = Array.from(input.files || []);
        input.value = "";                // allow re-picking the same file later
        await addPhotos(files);
    });

    goBtn?.addEventListener("click", runIdentification);

    // State: 'collect' (adding photos) | 'loading' | 'results'.
    function setState(state) {
        const collecting = state === "collect";
        if (hint) hint.style.display = collecting ? "" : "none";
        if (goBtn) goBtn.style.display = collecting ? "" : "none";
        if (statusEl) statusEl.style.display = collecting ? "none" : "";
        if (resultsEl) resultsEl.style.display = state === "results" ? "" : "none";
        renderPhotos(collecting);
        if (goBtn) goBtn.disabled = identifyPhotos.length === 0;
    }

    function setStatus(html, isNoMatch) {
        statusEl.innerHTML = html;
        statusEl.classList.toggle("no-match", !!isNoMatch);
    }

    async function addPhotos(files) {
        const room = IDENTIFY_MAX_PHOTOS - identifyPhotos.length;
        for (const file of files.slice(0, room)) {
            try {
                const p = await downscaleToBase64(file);
                p.url = URL.createObjectURL(file);
                identifyPhotos.push(p);
            } catch { /* skip unreadable file */ }
        }
        setState("collect");
    }

    function renderPhotos(editable) {
        if (!photosEl) return;
        photosEl.innerHTML = "";
        identifyPhotos.forEach((p, i) => {
            const tile = document.createElement("div");
            tile.className = "identify-photo";
            const img = document.createElement("img");
            img.src = p.url;
            tile.appendChild(img);
            if (editable) {
                const rm = document.createElement("button");
                rm.type = "button";
                rm.className = "identify-photo-remove";
                rm.setAttribute("aria-label", "Remove photo");
                rm.textContent = "×";
                rm.addEventListener("click", () => {
                    if (p.url) URL.revokeObjectURL(p.url);
                    identifyPhotos.splice(i, 1);
                    setState("collect");
                });
                tile.appendChild(rm);
            }
            photosEl.appendChild(tile);
        });
        if (editable && identifyPhotos.length < IDENTIFY_MAX_PHOTOS) {
            const add = document.createElement("button");
            add.type = "button";
            add.className = "identify-photo-add";
            add.innerHTML = "<span>+</span><small>Add photo</small>";
            add.addEventListener("click", () => input.click());
            photosEl.appendChild(add);
        }
    }

    async function runIdentification() {
        if (identifyPhotos.length === 0) return;
        setState("loading");
        setStatus('<div class="loading-spinner"></div><span>Identifying…</span>');

        const species = wildlifeSpecies.map((s) => ({
            id: s.id,
            commonName: s.commonName,
            scientificName: s.scientificName,
        }));

        let data;
        try {
            const resp = await fetch(IDENTIFY_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    images: identifyPhotos.map((p) => ({ base64: p.base64, mediaType: p.mediaType })),
                    species,
                }),
            });
            if (!resp.ok) {
                const e = await resp.json().catch(() => ({}));
                setState("results");
                setStatus(e.error || "Something went wrong. Please try again.", true);
                return;
            }
            data = await resp.json();
        } catch {
            setState("results");
            setStatus("Couldn’t reach the identifier. Check your connection and try again.", true);
            return;
        }

        setState("results");
        renderResults(data.matches || []);
    }

    function renderResults(matches) {
        // Map returned ids back to full species records.
        const found = matches
            .map((m) => {
                const sp = wildlifeSpecies.find((s) => s.id === m.id);
                return sp ? { species: sp, confidence: m.confidence } : null;
            })
            .filter(Boolean);

        resultsEl.innerHTML = "";
        if (found.length === 0) {
            setStatus("No confident matches at this time.", true);
            return;
        }

        setStatus(found.length === 1 ? "Best match:" : "Possible matches:");

        for (const { species, confidence } of found) {
            const row = document.createElement("button");
            row.type = "button";
            row.className = "identify-result";

            const img = document.createElement("img");
            img.alt = species.commonName;
            img.loading = "lazy";
            img.src = "Wildlife/" + species.folder + "/" + species.photo;
            row.appendChild(img);

            const text = document.createElement("div");
            text.className = "identify-result-text";
            const name = document.createElement("span");
            name.className = "identify-result-name";
            name.textContent = species.commonName;
            const sci = document.createElement("span");
            sci.className = "identify-result-sci";
            sci.textContent = species.scientificName;
            text.appendChild(name);
            text.appendChild(sci);
            row.appendChild(text);

            if (confidence === "high" || confidence === "medium") {
                const badge = document.createElement("span");
                badge.className = "identify-confidence " + confidence;
                badge.textContent = confidence === "high" ? "Likely" : "Maybe";
                row.appendChild(badge);
            }

            row.addEventListener("click", () => {
                // Keep the modal's DOM but hide it; open the species page.
                // Back returns here (with the original photos), Close exits.
                identifyFromDetail = true;
                modal.classList.add("hidden");
                showGlobalSpeciesDetail(species);
            });
            resultsEl.appendChild(row);
        }
    }
})();

// Downscale an image file to a JPEG no larger than IDENTIFY_MAX_DIM on its
// longest edge, returned as base64 (no data-URL prefix) plus its media type.
function downscaleToBase64(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;
            const scale = Math.min(1, IDENTIFY_MAX_DIM / Math.max(width, height));
            width = Math.round(width * scale);
            height = Math.round(height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            const base64 = dataUrl.split(",")[1];
            if (!base64) { reject(new Error("encode failed")); return; }
            resolve({ base64, mediaType: "image/jpeg" });
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode failed")); };
        img.src = url;
    });
}

// ── In-app Document Viewer ───────────────────────────────────
// Resource links marked with data-doc open in a full-screen overlay with its
// own Back button, so a PDF/image never replaces the whole app. PDFs render
// every page (stacked, vertical scroll) via PDF.js — iframes only show page 1
// on mobile WebKit — with − / + zoom buttons, since the app disables pinch-zoom.
const PDFJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

(function setupDocViewer() {
    const viewer   = document.getElementById("doc-viewer");
    const body     = document.getElementById("doc-viewer-body");
    const titleEl  = document.getElementById("doc-viewer-title");
    const extEl    = document.getElementById("doc-viewer-external");
    const backBtn  = document.getElementById("doc-viewer-back");
    const zoomWrap = document.getElementById("doc-viewer-zoom");
    const zoomIn   = document.getElementById("doc-zoom-in");
    const zoomOut  = document.getElementById("doc-zoom-out");
    if (!viewer || !body) return;

    let pdfDoc = null;       // current PDF.js document
    let pdfZoom = 1;         // 1 = fit container width
    let renderToken = 0;     // cancels superseded renders (zoom/close)

    // Lazy-load PDF.js the first time a PDF is opened.
    let pdfjsReady = null;
    function ensurePdfJs() {
        if (pdfjsReady) return pdfjsReady;
        pdfjsReady = new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = PDFJS_SRC;
            s.onload = () => {
                try {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
                    resolve(window.pdfjsLib);
                } catch (e) { reject(e); }
            };
            s.onerror = () => reject(new Error("pdfjs failed to load"));
            document.head.appendChild(s);
        });
        return pdfjsReady;
    }

    async function renderPdfPages() {
        if (!pdfDoc) return;
        const token = ++renderToken;
        body.innerHTML = "";
        const baseWidth = body.clientWidth || 360;
        const dpr = window.devicePixelRatio || 1;
        for (let n = 1; n <= pdfDoc.numPages; n++) {
            const page = await pdfDoc.getPage(n);
            if (token !== renderToken) return; // superseded
            const unit = page.getViewport({ scale: 1 });
            const cssWidth = baseWidth * pdfZoom;
            const viewport = page.getViewport({ scale: (cssWidth / unit.width) * dpr });
            const canvas = document.createElement("canvas");
            canvas.className = "doc-viewer-page";
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            canvas.style.width = cssWidth + "px";
            canvas.style.height = (cssWidth * unit.height / unit.width) + "px";
            await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
            if (token !== renderToken) return;
            body.appendChild(canvas);
        }
    }

    async function openPdf(src) {
        body.innerHTML = '<div class="doc-viewer-loading"><div class="loading-spinner"></div></div>';
        let lib;
        try { lib = await ensurePdfJs(); }
        catch { body.innerHTML = '<p class="doc-viewer-error">Couldn’t load the PDF viewer. Tap “Open ↗” to view it.</p>'; return; }
        try { pdfDoc = await lib.getDocument(src).promise; }
        catch { body.innerHTML = '<p class="doc-viewer-error">Couldn’t open this PDF. Tap “Open ↗” to view it.</p>'; return; }
        pdfZoom = 1;
        if (zoomWrap) zoomWrap.classList.remove("hidden");
        await renderPdfPages();
    }

    function openImage(src, title) {
        const img = document.createElement("img");
        img.className = "doc-viewer-image";
        img.src = src;
        img.alt = title || "";
        body.innerHTML = "";
        body.appendChild(img);
    }

    function openDoc(src, title, type) {
        titleEl.textContent = title || "";
        if (extEl) extEl.href = src;
        pdfDoc = null;
        renderToken++;
        if (zoomWrap) zoomWrap.classList.add("hidden");
        body.scrollTop = 0;
        viewer.classList.remove("hidden");
        if (type === "image") openImage(src, title);
        else openPdf(src);
    }

    function closeDoc() {
        viewer.classList.add("hidden");
        body.innerHTML = ""; // stop loading / free memory
        pdfDoc = null;
        renderToken++;
    }

    function setZoom(delta) {
        const next = Math.min(3, Math.max(0.5, +(pdfZoom + delta).toFixed(2)));
        if (next === pdfZoom) return;
        pdfZoom = next;
        renderPdfPages();
    }

    backBtn?.addEventListener("click", closeDoc);
    zoomIn?.addEventListener("click", () => setZoom(0.25));
    zoomOut?.addEventListener("click", () => setZoom(-0.25));

    document.querySelectorAll(".resource-link[data-doc]").forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            openDoc(a.getAttribute("href"), a.dataset.title, a.dataset.doc);
        });
    });
})();

// ── Service worker + offline map pre-caching ─────────────────
// Registers the offline cache (network-first for app code, so ?v= updates keep
// flowing) and, on first run, downloads each trail's centered satellite+topo
// view so the maps work offline. A super-thin top bar shows progress; the app
// stays fully usable meanwhile.
const PRECACHE_DONE_KEY = "vltMapsPrecached_v3";
// How many tiles / content files a complete download cached last time. The
// "Download All" button is considered done (and greyed out) only while both
// caches still hold at least this many entries — so if a cache is cleared or
// evicted the button reactivates on its own. See refreshOfflineMapsStatus.
const OFFLINE_MAPS_TARGET_KEY = "vltMapsTileTarget";
const OFFLINE_CONTENT_TARGET_KEY = "vltMapsContentTarget";
// When we last force-repaired the caches — used to throttle the on-reconnect
// repair so a flapping connection doesn't re-download every few seconds.
const OFFLINE_LAST_REPAIR_KEY = "vltMapsLastRepair";
const REPAIR_COOLDOWN_MS = 60 * 60 * 1000; // repair at most once an hour
// The APP_VERSION that last completed an offline download. If it differs from
// the running APP_VERSION when a background download runs, the download was
// triggered by an app update, so we tell the user their maps are refreshing.
const OFFLINE_APP_VERSION_KEY = "vltMapsAppVersion";
// Cache names — must match the ones in sw.js.
const TILE_CACHE_NAME = "vlt-tiles-v3";
const CONTENT_CACHE_NAME = "vlt-content-v3";
let mapPrecacheStarted = false;

// Small toast helper — defers to owls.js's showIssueToast (loaded after this
// file, but available by the time any download runs).
function showOfflineToast(msg) {
    if (typeof window.showIssueToast === "function") window.showIssueToast(msg);
}

function precacheBarSet(pct) {
    const bar = document.getElementById("map-precache-bar");
    const fill = document.getElementById("map-precache-fill");
    if (!bar || !fill) return;
    bar.classList.remove("hidden");
    fill.style.width = Math.max(2, Math.min(100, pct)) + "%";
}
function precacheBarHide() {
    document.getElementById("map-precache-bar")?.classList.add("hidden");
}

function lngToTileX(lng, z) { return Math.floor((lng + 180) / 360 * Math.pow(2, z)); }
function latToTileY(lat, z) {
    const r = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z));
}

// Tile URLs covering one displayed view. Satellite uses the display zoom; USGS
// topo only exists to z16, so it's requested at min(z,16). The displayed bounds
// already span the whole viewport, so the edge tiles cover it — no padding ring.
function viewTileUrls(b, zoom) {
    const out = [];
    // Pad the bounds by ~15% so the cached tiles include a ring around the
    // visible edge. This absorbs any rounding/orientation/size difference
    // between download-time and view-time so the offline map never shows a
    // blank stripe at the edge.
    if (b && typeof b.pad === "function") b = b.pad(0.15);
    const span = (zz) => {
        const m = Math.pow(2, zz), cl = (v) => Math.max(0, Math.min(m - 1, v));
        return {
            x0: cl(lngToTileX(b.getWest(), zz)), x1: cl(lngToTileX(b.getEast(), zz)),
            y0: cl(latToTileY(b.getNorth(), zz)), y1: cl(latToTileY(b.getSouth(), zz)),
        };
    };
    const sat = span(zoom);
    for (let x = sat.x0; x <= sat.x1; x++)
        for (let y = sat.y0; y <= sat.y1; y++)
            out.push(`https://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${zoom}`);
    const zt = Math.min(zoom, 16);
    const topo = span(zt);
    for (let x = topo.x0; x <= topo.x1; x++)
        for (let y = topo.y0; y <= topo.y1; y++)
            out.push(`https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/${zt}/${y}/${x}`);
    return out;
}

// Walk every trail to collect the tiles for its default view. The collapsed
// map sets the (locked) zoom; we then cache the EXPANDED viewport extent at that
// same zoom, which is a superset — so both the normal and expanded offline maps
// render fully.
// Single-flight guard: building the tile list spins up off-screen Leaflet maps,
// so two overlapping computations (e.g. the auto precache still running when the
// user taps "Download All") would fight over the shared DOM and produce bloated,
// inconsistent bounds. If one is already in flight, reuse its result.
let _tileUrlsInFlight = null;
function computeAllTrailTileUrls() {
    if (_tileUrlsInFlight) return _tileUrlsInFlight;
    _tileUrlsInFlight = _computeAllTrailTileUrls().finally(() => { _tileUrlsInFlight = null; });
    return _tileUrlsInFlight;
}

async function _computeAllTrailTileUrls() {
    const mk = (w, h) => {
        const div = document.createElement("div");
        div.style.cssText = `position:fixed;left:-10000px;top:0;width:${w}px;height:${h}px;`;
        document.body.appendChild(div);
        return { div, map: L.map(div, { zoomControl: false, attributionControl: false, maxZoom: 20 }) };
    };
    const W  = window.innerWidth || 390;
    const IH = window.innerHeight || 740;
    // Match the REAL detail map so the precache picks the SAME fitBounds zoom the
    // map will actually render at. Collapsed is 40vh (see #detail-map flex:0 0
    // 40vh); Expanded hides the bottom nav so it fills the whole viewport.
    // (The old (IH-52)/2 guess was ~47vh, which pushed some trails a zoom level
    // too deep — so every cached tile was a miss and the map came up blank.)
    const Hc = Math.max(120, Math.round(IH * 0.40)); // collapsed = 40vh
    const He = IH;                                    // expanded = full screen
    const collapsed = mk(W, Hc);
    const expanded  = mk(W, He);
    const urls = new Set();
    for (const prop of properties) {
        if (!prop.trail || prop.comingSoon) continue;
        try {
            const geo = await loadKml(propPath(prop, prop.trail));
            const layer = L.geoJSON(geo, { filter: (f) => f.geometry.type !== "Point" });
            const b = layer.getBounds();
            if (!b || !b.isValid()) continue;
            // Extend by connector segments exactly as the detail view does
            // (see showPropertyDetail) — otherwise a trail with connectors fits
            // to a different zoom offline and requests uncached tiles.
            for (const conn of (prop.connectors || [])) {
                try {
                    const cGeo = await loadKml(propPath(prop, conn));
                    const cLayer = L.geoJSON(cGeo, { filter: (f) => f.geometry.type !== "Point" });
                    const cb = cLayer.getBounds();
                    if (cb && cb.isValid()) b.extend(cb);
                } catch (_) { /* skip a connector that won't load */ }
            }
            collapsed.map.fitBounds(b, { padding: [30, 30] });
            const z = collapsed.map.getZoom();
            const center = collapsed.map.getCenter();
            // Cache a small zoom band around the locked zoom, using the EXPANDED
            // (full-screen) extent so both the normal and Expanded offline views
            // are covered. The band absorbs any residual container/viewport
            // difference between here and the real map (e.g. the iOS toolbar
            // shifting innerHeight) so the map can never come up blank.
            for (let zz = z - 1; zz <= z + 1; zz++) {
                if (zz < 1 || zz > 20) continue;
                expanded.map.setView(center, zz, { animate: false });
                viewTileUrls(expanded.map.getBounds(), zz).forEach((u) => urls.add(u));
            }
        } catch (e) { /* skip a trail that won't load */ }
    }
    collapsed.map.remove(); collapsed.div.remove();
    expanded.map.remove();  expanded.div.remove();
    return Array.from(urls);
}

// Every same-origin file a trail page needs offline — description text, the
// main photo (shown on the list card), and the trail/connector/boundary/parking
// map layers. The trail's stats (title, difficulty, length, duration, features)
// live in the app bundle itself, which the service worker already caches, so
// they need no separate download. Gallery photos are deliberately excluded to
// keep the download small (they're ~30 MB of full-res images); offline, the
// detail-page photo banner is hidden instead of showing broken gallery images
// (see initCarousel). Shared-parking files belong to another property's folder
// and are captured when that property is walked here.
// App-shell branding shown across the UI (main header banner + the org logos on
// every trail detail page). These load at runtime and otherwise only get cached
// if the user happened to view the relevant page online, so include them
// explicitly in the offline bundle.
const SHELL_ASSET_URLS = [
    "Logos/banner.png",       // main list-view header
    "Logos/VLTLOGO.webp",     // Vinalhaven Land Trust
    "Logos/MCHT_logo.webp",   // Maine Coast Heritage Trust
    "Logos/TOV_logo.png",     // Town of Vinalhaven
    "Logos/owls-sign.png",    // volunteer (OWLS) page
];

function computeAllTrailAssetUrls() {
    const urls = new Set(SHELL_ASSET_URLS);
    for (const prop of properties) {
        const add = (file) => { if (file) urls.add(propPath(prop, file)); };
        // Cache the small card thumbnail, not the full-res photo — the list
        // cards use it and the detail banner is hidden offline anyway.
        if (prop.photo) urls.add(cardThumbPath(prop));
        add(prop.description);
        add(prop.trail);
        (prop.connectors || []).forEach(add);
        if (typeof prop.boundary === "string") add(prop.boundary);
        else if (prop.boundary && Array.isArray(prop.boundary.parcels)) prop.boundary.parcels.forEach(add);
        (prop.parking || []).forEach(add);
    }
    return Array.from(urls);
}

// Hand a list of tile URLs to the service worker and resolve with its final
// { ok, failed, total, quotaError } report. onProgress(pct) fires as it runs.
// force=true re-fetches and overwrites tiles already in the cache (heals a bad
// cache); force=false skips tiles that are already present (fast auto-run).
function runTileCacheJob(urls, { force = false, cacheName, onProgress } = {}) {
    return new Promise((resolve, reject) => {
        if (!("serviceWorker" in navigator)) return reject(new Error("no service worker"));
        navigator.serviceWorker.ready.then((reg) => {
            const sw = reg.active || navigator.serviceWorker.controller;
            if (!sw) return reject(new Error("no active service worker"));
            const jobId = "tc" + Date.now() + "-" + Math.random().toString(36).slice(2);
            const onMsg = (ev) => {
                const d = ev.data || {};
                if (d.jobId !== jobId) return;
                if (d.type === "CACHE_TILES_PROGRESS") {
                    if (onProgress) onProgress(Math.round((d.done / d.total) * 100), d);
                } else if (d.type === "CACHE_TILES_DONE") {
                    navigator.serviceWorker.removeEventListener("message", onMsg);
                    resolve(d);
                }
            };
            navigator.serviceWorker.addEventListener("message", onMsg);
            sw.postMessage({ type: "CACHE_TILES", urls, jobId, force, cacheName });
        }).catch(reject);
    });
}

// Ask the service worker how many entries are cached in the given cache.
function getCachedTileCount(cacheName) {
    return new Promise((resolve) => {
        if (!("serviceWorker" in navigator)) return resolve(0);
        navigator.serviceWorker.ready.then((reg) => {
            const sw = reg.active || navigator.serviceWorker.controller;
            if (!sw) return resolve(0);
            const jobId = "ts" + Date.now() + "-" + Math.random().toString(36).slice(2);
            const onMsg = (ev) => {
                const d = ev.data || {};
                if (d.jobId !== jobId || d.type !== "TILE_STATUS_RESULT") return;
                navigator.serviceWorker.removeEventListener("message", onMsg);
                resolve(d.count || 0);
            };
            navigator.serviceWorker.addEventListener("message", onMsg);
            sw.postMessage({ type: "TILE_STATUS", jobId, cacheName });
        }).catch(() => resolve(0));
    });
}

// Download everything needed for full offline use — map tiles AND per-trail
// content — reporting a single combined progress. Resolves with both SW reports.
async function downloadOfflineBundle({ force = false, onBar, onStatus } = {}) {
    const tileUrls  = await computeAllTrailTileUrls();
    const assetUrls = computeAllTrailAssetUrls();
    const grand = (tileUrls.length + assetUrls.length) || 1;
    let tileDone = 0, contentDone = 0;
    const bar = () => { if (onBar) onBar(Math.round((tileDone + contentDone) / grand * 100)); };

    if (onStatus) onStatus("Downloading maps… 0%");
    const tiles = await runTileCacheJob(tileUrls, {
        force, cacheName: TILE_CACHE_NAME,
        onProgress: (pct, d) => { tileDone = d.done; bar(); if (onStatus) onStatus(`Downloading maps… ${pct}%`); },
    });
    tileDone = tileUrls.length; bar();

    if (onStatus) onStatus("Downloading trail info… 0%");
    const content = await runTileCacheJob(assetUrls, {
        force, cacheName: CONTENT_CACHE_NAME,
        onProgress: (pct, d) => { contentDone = d.done; bar(); if (onStatus) onStatus(`Downloading trail info… ${pct}%`); },
    });
    contentDone = assetUrls.length; bar();

    return { tiles, content };
}

// Cheap check (no heavy re-computation): are both caches still holding at least
// as much as the last complete download? Used on every reopen so we only spend
// effort when something is actually missing/evicted.
async function offlineBundleComplete() {
    const tileTarget    = parseInt(localStorage.getItem(OFFLINE_MAPS_TARGET_KEY) || "0", 10);
    const contentTarget = parseInt(localStorage.getItem(OFFLINE_CONTENT_TARGET_KEY) || "0", 10);
    if (!tileTarget || !contentTarget) return false;
    const tileCount    = await getCachedTileCount(TILE_CACHE_NAME);
    const contentCount = await getCachedTileCount(CONTENT_CACHE_NAME);
    return tileCount >= tileTarget && contentCount >= contentTarget;
}

// Persist a completed download's results (targets + done flag) if nothing
// failed. Returns whether the bundle came down clean.
function persistBundleResult(res) {
    const clean = res.tiles.failed === 0 && res.content.failed === 0
        && !res.tiles.quotaError && !res.content.quotaError;
    if (clean) {
        localStorage.setItem(OFFLINE_MAPS_TARGET_KEY, String(res.tiles.ok));
        localStorage.setItem(OFFLINE_CONTENT_TARGET_KEY, String(res.content.ok));
        localStorage.setItem(PRECACHE_DONE_KEY, "1");
        refreshOfflineMapsStatus();
    }
    return clean;
}

// Best-effort detection of a metered/cellular connection so we don't burn
// mobile data on a full repair. Unknown (e.g. iOS Safari, which has no Network
// Information API) is treated as not-cellular so the repair still runs.
function onCellularConnection() {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return false;
    if (c.saveData) return true;
    if (typeof c.type === "string") return c.type === "cellular";
    if (typeof c.effectiveType === "string") return /(^|\b)(slow-2g|2g)$/.test(c.effectiveType);
    return false;
}

// Verify both caches and download anything missing. Fast no-op when everything
// is already saved. force=true re-downloads and overwrites everything, which
// repairs corrupted/partial entries (e.g. a tile a flaky connection stored as
// an error). Guarded so overlapping triggers don't run it twice at once.
async function maybePrecacheMaps(opts = {}) {
    const force = !!opts.force;
    // Concurrency guard only — don't overlap with another run or the manual
    // button. It is reset in `finally` so a later reconnect can repair again.
    if (mapPrecacheStarted || downloadAllRunning) return;
    if (!("serviceWorker" in navigator) || !navigator.onLine) return;
    if (typeof L === "undefined" || typeof properties === "undefined") return;
    try { await navigator.serviceWorker.ready; } catch (_) { return; }
    // Nothing to do only when NOT forcing and everything is already present.
    if (!force && await offlineBundleComplete()) return;
    mapPrecacheStarted = true;
    // If a previous version had downloaded and the running version is newer, this
    // download is refreshing the offline data for an app update — let the user know.
    const prevVersion = localStorage.getItem(OFFLINE_APP_VERSION_KEY);
    const isUpdateRefresh = !!prevVersion && prevVersion !== APP_VERSION;
    if (isUpdateRefresh) showOfflineToast("An update is refreshing your offline maps…");
    try {
        precacheBarSet(2);
        const res = await downloadOfflineBundle({ force, onBar: precacheBarSet });
        precacheBarSet(100);
        setTimeout(precacheBarHide, 700);
        if (persistBundleResult(res)) {
            localStorage.setItem(OFFLINE_APP_VERSION_KEY, APP_VERSION);
            if (force) localStorage.setItem(OFFLINE_LAST_REPAIR_KEY, String(Date.now()));
            if (isUpdateRefresh) showOfflineToast("Offline maps updated ✓");
        } else {
            // Something failed (flaky connection / storage full) → leave the
            // "done" markers unset so the next reconnect retries.
            console.warn("offline precache incomplete:", res);
        }
    } catch (e) {
        console.warn("precache maps:", e);
        precacheBarHide();
    } finally {
        mapPrecacheStarted = false;
    }
}

// Decide what to do when the app opens or comes back online: if a repair is due
// (we're on a non-metered connection and it's been over an hour), force a full
// re-download to heal any corrupted caches; otherwise just fill any gaps. This
// is what keeps caches self-repairing whenever a phone reconnects to Wi-Fi.
async function syncOfflineCaches() {
    if (!("serviceWorker" in navigator) || !navigator.onLine) return;
    const last = parseInt(localStorage.getItem(OFFLINE_LAST_REPAIR_KEY) || "0", 10);
    const repairDue = !onCellularConnection() && (Date.now() - last >= REPAIR_COOLDOWN_MS);
    await maybePrecacheMaps({ force: repairDue });
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js")
            .then(() => { setTimeout(syncOfflineCaches, 3000); }) // let the app settle first
            .catch((e) => console.warn("SW register failed:", e));
    });
    // Repair/refresh whenever the phone regains a connection.
    window.addEventListener("online", () => { setTimeout(syncOfflineCaches, 1500); });
}
window.maybePrecacheMaps = maybePrecacheMaps;
window.syncOfflineCaches = syncOfflineCaches;

// ── "Download All Offline Maps" button (Resources page) ──────
// A user-driven, force re-download of every trail's tiles. Unlike the automatic
// precache it ignores the "already done" flag and overwrites existing tiles, so
// it heals a bad/partial cache and re-downloads after iOS has evicted the maps.
let downloadAllRunning = false;

function setOfflineMapsStatus(msg, state) {
    const el = document.getElementById("offline-maps-status");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("ok", "warn", "err");
    if (state) el.classList.add(state);
}

// Grey out + lock the button when everything is downloaded; otherwise it stays
// an active "Download All Offline Maps" button.
function setOfflineMapsButtonDone(done) {
    const btn = document.getElementById("offline-maps-btn");
    if (!btn) return;
    btn.disabled = done;
    btn.textContent = done ? "✓ Offline Maps Saved" : "Download All Offline Maps";
}

async function refreshOfflineMapsStatus() {
    const el = document.getElementById("offline-maps-status");
    if (!el || downloadAllRunning) return;
    try {
        const tileCount    = await getCachedTileCount(TILE_CACHE_NAME);
        const contentCount = await getCachedTileCount(CONTENT_CACHE_NAME);
        const tileTarget    = parseInt(localStorage.getItem(OFFLINE_MAPS_TARGET_KEY) || "0", 10);
        const contentTarget = parseInt(localStorage.getItem(OFFLINE_CONTENT_TARGET_KEY) || "0", 10);
        const fullyDownloaded = tileTarget > 0 && contentTarget > 0
            && tileCount >= tileTarget && contentCount >= contentTarget;
        if (fullyDownloaded) {
            setOfflineMapsStatus(`✓ Maps & trail info saved (${tileCount + contentCount} items). Everything works with no signal.`, "ok");
        } else if (tileCount + contentCount > 0) {
            setOfflineMapsStatus("Partially saved — tap to finish downloading for offline use.", "warn");
        } else {
            setOfflineMapsStatus("No maps saved yet — tap to download for offline use.", "");
        }
        // A cache was cleared or evicted below the last complete download → drop
        // the stale "done" markers so both this button and the automatic precache
        // treat the offline bundle as needing to be re-downloaded.
        if (!fullyDownloaded && (tileTarget > 0 || contentTarget > 0)) {
            localStorage.removeItem(PRECACHE_DONE_KEY);
            localStorage.removeItem(OFFLINE_MAPS_TARGET_KEY);
            localStorage.removeItem(OFFLINE_CONTENT_TARGET_KEY);
        }
        setOfflineMapsButtonDone(fullyDownloaded);
    } catch (_) { /* leave default text */ }
}

async function downloadAllOfflineMaps() {
    if (downloadAllRunning) return;
    const btn = document.getElementById("offline-maps-btn");
    if (!("serviceWorker" in navigator)) {
        setOfflineMapsStatus("Offline maps aren't supported by this browser.", "err");
        return;
    }
    if (!navigator.onLine) {
        setOfflineMapsStatus("You're offline. Connect to the internet, then try again.", "warn");
        return;
    }
    downloadAllRunning = true;
    let fullyDone = false;
    if (btn) { btn.disabled = true; btn.classList.add("busy"); }
    setOfflineMapsStatus("Preparing download…", "");
    try {
        // Make sure the service worker is registered/active before we start.
        try { await navigator.serviceWorker.register("sw.js"); } catch (_) {}
        const { tiles, content } = await downloadOfflineBundle({
            force: true,
            onStatus: (msg) => setOfflineMapsStatus(msg, ""),
        });
        if (tiles.quotaError || content.quotaError) {
            setOfflineMapsStatus("Ran out of storage space. Free up space on your device and try again.", "err");
        } else if (tiles.failed > 0 || content.failed > 0) {
            const missed = tiles.failed + content.failed;
            setOfflineMapsStatus(`${missed} item${missed === 1 ? "" : "s"} didn't download. Tap to retry.`, "warn");
        } else {
            localStorage.setItem(PRECACHE_DONE_KEY, "1");
            localStorage.setItem(OFFLINE_MAPS_TARGET_KEY, String(tiles.ok));
            localStorage.setItem(OFFLINE_CONTENT_TARGET_KEY, String(content.ok));
            localStorage.setItem(OFFLINE_LAST_REPAIR_KEY, String(Date.now())); // manual download counts as a repair
            localStorage.setItem(OFFLINE_APP_VERSION_KEY, APP_VERSION);
            setOfflineMapsStatus(`✓ Maps & trail info saved (${tiles.ok + content.ok} items). Everything works with no signal.`, "ok");
            fullyDone = true;
        }
    } catch (e) {
        console.warn("download all offline maps:", e);
        setOfflineMapsStatus("Something went wrong. Please try again.", "err");
    } finally {
        downloadAllRunning = false;
        if (btn) {
            btn.classList.remove("busy");
            // Keep it greyed + locked when everything downloaded; otherwise re-enable.
            if (fullyDone) setOfflineMapsButtonDone(true);
            else btn.disabled = false;
        }
    }
}

(function wireOfflineMapsButton() {
    const btn = document.getElementById("offline-maps-btn");
    if (!btn) return;
    btn.addEventListener("click", downloadAllOfflineMaps);
    // Show how many tiles are already cached once the SW is ready.
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(refreshOfflineMapsStatus).catch(() => {});
    }
    window.addEventListener("online", refreshOfflineMapsStatus);
})();

// ── Offline map lock ─────────────────────────────────────────
// Offline we only have each trail's default cached view, so disable zoom and
// pan (which would request uncached tiles). Expand still works — we cache the
// expanded viewport extent too — and the Satellite/Topographic toggle works
// (both layers are cached). The Online/Offline pill (see makeStatusControl)
// shows the connection state.
function setDetailMapOffline(map, offline) {
    if (!map) return;
    ["dragging", "scrollWheelZoom", "doubleClickZoom", "boxZoom", "keyboard", "touchZoom", "tap"]
        .forEach((h) => { if (map[h]) offline ? map[h].disable() : map[h].enable(); });
    map.getContainer().classList.toggle("map-offline", offline);
}

window.addEventListener("offline", () => { setDetailMapOffline(detailMap, true);  if (allMap) setDetailMapOffline(allMap, true); });
window.addEventListener("online",  () => { setDetailMapOffline(detailMap, false); if (allMap) setDetailMapOffline(allMap, false); });

// ── Sat / Topo layer toggle ──────────────────────────────────
// Compact two-segment toggle replacing Leaflet's radio layer control. Active
// side is filled (Sat = dark green, Topo = cream); the box matches the other
// map buttons in size.
function makeLayerToggle(map, satLayer, topoLayer, position) {
    const Ctl = L.Control.extend({
        options: { position: position || "topright" },
        onAdd: function () {
            const wrap = L.DomUtil.create("div", "leaflet-control map-layer-toggle");
            wrap.innerHTML =
                '<button type="button" class="mlt-seg mlt-sat active">Sat</button>' +
                '<button type="button" class="mlt-seg mlt-topo">Topo</button>';
            const satBtn = wrap.querySelector(".mlt-sat");
            const topoBtn = wrap.querySelector(".mlt-topo");
            const select = (topo) => {
                if (topo) {
                    if (map.hasLayer(satLayer)) map.removeLayer(satLayer);
                    if (!map.hasLayer(topoLayer)) topoLayer.addTo(map);
                } else {
                    if (map.hasLayer(topoLayer)) map.removeLayer(topoLayer);
                    if (!map.hasLayer(satLayer)) satLayer.addTo(map);
                }
                satBtn.classList.toggle("active", !topo);
                topoBtn.classList.toggle("active", topo);
            };
            L.DomEvent.disableClickPropagation(wrap);
            satBtn.addEventListener("click", () => select(false));
            topoBtn.addEventListener("click", () => select(true));
            return wrap;
        },
    });
    return new Ctl();
}

// ── Online/Offline status pill (on every map) ────────────────
// A tiny red/green light + "Online"/"Offline" word, added as a Leaflet control
// to each map. A single global handler keeps every visible pill in sync.
function makeStatusControl() {
    const Ctl = L.Control.extend({
        options: { position: "bottomleft" },
        onAdd: function () {
            const div = L.DomUtil.create("div", "leaflet-control map-net-status");
            div.innerHTML = '<span class="map-net-dot"></span><span class="map-net-label"></span>';
            L.DomEvent.disableClickPropagation(div);
            applyNetStatus(div);
            return div;
        },
    });
    return new Ctl();
}

function applyNetStatus(div) {
    const online = navigator.onLine;
    div.classList.toggle("online", online);
    div.classList.toggle("offline", !online);
    const label = div.querySelector(".map-net-label");
    if (label) label.textContent = online ? "Online" : "Offline";
}

function updateAllNetStatus() {
    document.querySelectorAll(".map-net-status").forEach(applyNetStatus);
}
window.addEventListener("online", updateAllNetStatus);
window.addEventListener("offline", updateAllNetStatus);
