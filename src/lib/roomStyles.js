// Every building in the Republic keeps its own room. Walls, floors, trim and the shape
// of its windows all follow from this table, so no two trades look alike inside.

const STYLES = {
  marble: {
    wall: 'linear-gradient(180deg,#333a32 0%,#242a25 68%,#1b201c 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(226,238,220,0.5) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, rgba(226,238,220,0.5) 0 1px, transparent 1px 96px)',
    wallAlpha: 0.12,
    floor: 'linear-gradient(180deg,#514c3f 0%,#302c24 58%,#21201a 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(232,217,176,0.6) 0 1px, transparent 1px 64px)',
    floorAlpha: 0.2,
    skirting: '#6f7364',
    window: 'tall',
    vignette: 'inset 0 0 140px 40px rgba(0,0,0,0.72)',
  },
  brass: {
    wall: 'linear-gradient(180deg,#1f2a22 0%,#16201a 66%,#10170f 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(242,201,107,0.55) 0 1px, transparent 1px 52px), repeating-linear-gradient(90deg, rgba(242,201,107,0.4) 0 1px, transparent 1px 118px)',
    wallAlpha: 0.14,
    floor: 'linear-gradient(180deg,#3a3126 0%,#241d15 60%,#16110c 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(242,201,107,0.45) 0 2px, transparent 2px 58px)',
    floorAlpha: 0.22,
    skirting: '#8a7433',
    window: 'tall',
    vignette: 'inset 0 0 150px 44px rgba(0,0,0,0.75)',
  },
  oak: {
    wall: 'linear-gradient(180deg,#3b2b1c 0%,#2a1e13 66%,#1d150d 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(232,207,160,0.4) 0 1px, transparent 1px 30px), repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 2px, transparent 2px 72px)',
    wallAlpha: 0.16,
    floor: 'linear-gradient(180deg,#4a3623 0%,#2f2216 60%,#1d150e 100%)',
    floorTexture:
      'repeating-linear-gradient(90deg, rgba(255,236,198,0.35) 0 2px, transparent 2px 84px), repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 19px)',
    floorAlpha: 0.3,
    skirting: '#7a5c39',
    window: 'tall',
    vignette: 'inset 0 0 150px 46px rgba(24,12,4,0.7)',
  },
  flour: {
    wall: 'linear-gradient(180deg,#6b4a34 0%,#523524 66%,#3b2618 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(255,241,214,0.5) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, rgba(255,241,214,0.35) 0 1px, transparent 1px 78px)',
    wallAlpha: 0.2,
    floor: 'linear-gradient(180deg,#8d6640 0%,#6b4a2c 58%,#4b3320 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(255,246,226,0.4) 0 2px, transparent 2px 62px)',
    floorAlpha: 0.26,
    skirting: '#c9a469',
    window: 'tall',
    vignette: 'inset 0 0 130px 34px rgba(38,20,8,0.6)',
  },
  sea: {
    wall: 'linear-gradient(180deg,#1d2f38 0%,#152430 66%,#0e1a22 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(190,232,244,0.45) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(190,232,244,0.3) 0 2px, transparent 2px 88px)',
    wallAlpha: 0.16,
    floor: 'linear-gradient(180deg,#3f4a4a 0%,#28312f 60%,#1a201f 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(196,226,232,0.35) 0 2px, transparent 2px 58px)',
    floorAlpha: 0.24,
    skirting: '#6f8b92',
    window: 'round',
    vignette: 'inset 0 0 150px 44px rgba(2,14,20,0.72)',
  },
  moss: {
    wall: 'linear-gradient(180deg,#1d2b1c 0%,#152113 66%,#0e170d 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(170,208,150,0.4) 0 1px, transparent 1px 36px), repeating-linear-gradient(90deg, rgba(0,0,0,0.6) 0 3px, transparent 3px 90px)',
    wallAlpha: 0.14,
    floor: 'linear-gradient(180deg,#2c3524 0%,#1c241a 60%,#111710 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(178,206,152,0.4) 0 2px, transparent 2px 72px)',
    floorAlpha: 0.22,
    skirting: '#5d6b45',
    window: 'tall',
    vignette: 'inset 0 0 160px 56px rgba(0,0,0,0.75)',
  },
  hex: {
    wall: 'linear-gradient(180deg,#2a1730 0%,#1e1024 66%,#140a19 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(214,168,255,0.45) 0 1px, transparent 1px 42px), repeating-linear-gradient(90deg, rgba(214,168,255,0.25) 0 2px, transparent 2px 96px)',
    wallAlpha: 0.16,
    floor: 'linear-gradient(180deg,#33203a 0%,#221329 60%,#150c19 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(224,180,255,0.35) 0 2px, transparent 2px 66px)',
    floorAlpha: 0.22,
    skirting: '#7c5590',
    window: 'tall',
    vignette: 'inset 0 0 160px 52px rgba(10,0,16,0.8)',
  },
  sand: {
    wall: 'linear-gradient(180deg,#6d4f31 0%,#573d25 66%,#3f2c1a 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(255,224,176,0.5) 0 1px, transparent 1px 38px), repeating-linear-gradient(90deg, rgba(255,224,176,0.3) 0 1px, transparent 1px 84px)',
    wallAlpha: 0.18,
    floor: 'linear-gradient(180deg,#a97c4a 0%,#7f5a32 58%,#5a3f22 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(255,232,190,0.4) 0 2px, transparent 2px 68px)',
    floorAlpha: 0.24,
    skirting: '#c69a5e',
    window: 'tall',
    vignette: 'inset 0 0 140px 40px rgba(48,26,8,0.62)',
  },
  ice: {
    wall: 'linear-gradient(180deg,#2b3d47 0%,#20303a 66%,#17242c 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(226,246,255,0.55) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(226,246,255,0.35) 0 2px, transparent 2px 90px)',
    wallAlpha: 0.2,
    floor: 'linear-gradient(180deg,#7f9aa5 0%,#5c7682 58%,#3d525c 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(252,255,255,0.45) 0 2px, transparent 2px 74px)',
    floorAlpha: 0.26,
    skirting: '#a8c8d4',
    window: 'round',
    vignette: 'inset 0 0 150px 40px rgba(6,26,36,0.62)',
  },
  rock: {
    wall: 'linear-gradient(180deg,#2f2a22 0%,#231f19 66%,#181510 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(214,196,158,0.35) 0 2px, transparent 2px 48px), repeating-linear-gradient(90deg, rgba(0,0,0,0.55) 0 4px, transparent 4px 106px)',
    wallAlpha: 0.14,
    floor: 'linear-gradient(180deg,#3b342a 0%,#262019 60%,#17130e 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(214,196,158,0.3) 0 2px, transparent 2px 54px)',
    floorAlpha: 0.2,
    skirting: '#6a5d47',
    window: 'none',
    vignette: 'inset 0 0 170px 62px rgba(0,0,0,0.82)',
  },
  glass: {
    wall: 'linear-gradient(180deg,#3a1540 0%,#28102f 62%,#160a1c 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, rgba(255,154,213,0.5) 0 1px, transparent 1px 46px), repeating-linear-gradient(90deg, rgba(143,242,224,0.45) 0 2px, transparent 2px 88px)',
    wallAlpha: 0.2,
    floor: 'linear-gradient(180deg,#1f3a44 0%,#16303a 58%,#0d1f27 100%)',
    floorTexture: 'repeating-linear-gradient(90deg, rgba(143,242,224,0.4) 0 2px, transparent 2px 70px)',
    floorAlpha: 0.26,
    skirting: '#ff9ad5',
    window: 'round',
    vignette: 'inset 0 0 150px 40px rgba(10,0,20,0.66)',
  },
  hearth: {
    wall: 'linear-gradient(180deg,#fbf7ec 0%,#efe8d8 70%,#e2d9c5 100%)',
    wallTexture:
      'repeating-linear-gradient(0deg, #8a7a5c 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, #8a7a5c 0 1px, transparent 1px 96px)',
    wallAlpha: 0.16,
    floor: 'linear-gradient(180deg,#d8ac70 0%,#c4955a 55%,#ab7c45 100%)',
    floorTexture:
      'repeating-linear-gradient(90deg, #8d6435 0 2px, rgba(255,255,255,0.10) 2px 3px, transparent 3px 94px), repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 17px)',
    floorAlpha: 0.75,
    skirting: '#b9a880',
    window: 'garden',
    vignette: 'inset 0 0 120px 24px rgba(90,62,32,0.35)',
  },
};

// Which trade keeps which room.
const ROOMS_BY_STYLE = {
  marble: ['capital', 'parliament', 'government', 'registry', 'shop', 'homes', 'dealership'],
  brass: ['bank', 'exchange', 'guild'],
  oak: ['library', 'herald', 'owl-tower', 'furniture'],
  flour: ['bakery', 'granary', 'pets'],
  sea: ['fishmarket', 'chandlery', 'lighthouse'],
  moss: ['forest', 'shrine', 'inn', 'den', 'charcoal', 'moonwell'],
  hex: ['witch'],
  sand: ['caravanserai', 'bazaar', 'well', 'tomb', 'observatory', 'cactus'],
  ice: ['icehouse', 'lodge', 'chapel', 'bothy', 'sled', 'hotspring'],
  rock: ['mineshaft', 'assay'],
  glass: ['sift-garden', 'sift-archive', 'sift-court', 'sift-bazaar', 'sift-baths', 'sift-tower'],
};

const STYLE_BY_ROOM = Object.entries(ROOMS_BY_STYLE).reduce((all, [style, rooms]) => {
  rooms.forEach((room) => {
    all[room] = style;
  });
  return all;
}, {});

export const styleFor = (place) => {
  if (!place) return STYLES.marble;
  // Homes keep their own pale oak rooms whatever else is in the Republic.
  if (place.wood) return STYLES.hearth;
  return STYLES[STYLE_BY_ROOM[place.id]] || STYLES.marble;
};