// Animation / game tuning — the design's shipped tweak values. Passed to the
// engine as authoritative defaults (edit here to re-tune the whole site).
export const CFG = {
  animStart: 0.74,   // reveal trigger line (× viewport height)
  animDur: 550,      // reveal duration (ms)
  animRise: 0,       // upward drift on reveal (px)
  animDrift: 0,      // lateral drift on reveal (px)
  animTilt: 0,       // depth tilt on reveal (deg)
  animScale: 0.94,   // starting scale on reveal
  animBlur: 3,       // starting blur on reveal (px)
  flyDur: 1050,      // konami / break fly-away duration (ms)
  eatParticles: 25,  // sparks per snake pickup
  eatPower: 0.5,     // pickup spark speed
  snakeBase: 150,    // snake step interval at start (ms)
  snakeMin: 60,      // fastest snake step interval (ms)
  snakeRamp: 2,      // ms shaved off the interval per point
  snakeGap: 6,       // px gap between snake cell and grid cell
  golOpacity: 0.44,  // Game-of-Life background opacity
  golFade: 560,      // GoL cell fade duration (ms)
  golWait: 280,      // GoL pause between generations (ms)
};

// Chat pills — icon/colour mirrors the badge of the card each one scrolls to.
// `type` is the block type jumpToType() lands on.
export const PILLS = [
  { type: 'profile',   icon: "●", label: "Profile",    iconColor: "#7bf5b0", hoverBorder: "rgba(120,255,180,0.55)", hoverBg: "linear-gradient(180deg, rgba(30,74,54,0.95), rgba(19,52,38,0.92))", hoverColor: "#c4f7da" },
  { type: 'role',      icon: "✚", label: "Experience", iconColor: "#b48cff", hoverBorder: "rgba(190,150,255,0.55)", hoverBg: "linear-gradient(180deg, rgba(64,40,110,0.95), rgba(44,28,78,0.92))", hoverColor: "#e2d4ff" },
  { type: 'reviews',   icon: "★", label: "Reviews",    iconColor: "#78b4ff", hoverBorder: "rgba(120,180,255,0.55)", hoverBg: "linear-gradient(180deg, rgba(10,66,124,0.96), rgba(8,46,90,0.92))", hoverColor: "#cfe3ff" },
  { type: 'approach',  icon: "✦", label: "Approach",   iconColor: "#ff9ecb", hoverBorder: "rgba(255,140,200,0.5)",  hoverBg: "linear-gradient(180deg, rgba(96,32,72,0.95), rgba(66,22,50,0.92))", hoverColor: "#ffd2e8" },
  { type: 'education', icon: "⌂", label: "Education",  iconColor: "#6edceb", hoverBorder: "rgba(110,220,235,0.5)",  hoverBg: "linear-gradient(180deg, rgba(20,72,80,0.95), rgba(14,50,56,0.92))", hoverColor: "#c2eef5" },
];
