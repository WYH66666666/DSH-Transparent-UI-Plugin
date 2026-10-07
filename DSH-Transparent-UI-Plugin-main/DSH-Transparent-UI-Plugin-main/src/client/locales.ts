/** `settings.aqua` namespace dictionaries (the settings-row copy). */

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.aqua'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'aqua.title': '玻璃主题',
  'aqua.description': '全局玻璃质感，云母/兼容双模式，模糊度、磨砂度、背景与颜色都可自由调节',
  'aqua.enable': '开启',
  'aqua.disable': '关闭',
  'aqua.mode': '模式',
  'aqua.modeMica': '云母效果',
  'aqua.modeCompat': '兼容模式',
  'aqua.materialGroup': '玻璃材质',
  'aqua.decorAmbient': '环境装饰',
  'aqua.decorHover': '悬停效果',
  'aqua.whale': '粒子鲸鱼',
  'aqua.critters': '小鱼',
  'aqua.mesh': '网状交互',
  'aqua.spotlight': '鼠标辉光',
  'aqua.press': '悬停下压',
  'aqua.blur': '玻璃模糊度',
  'aqua.frost': '磨砂度',
  'aqua.fluidHue': '色调',
  'aqua.fluidDepth': '颜色深浅',
  'aqua.bgBrightness': '背景亮度',
  'aqua.bgBrightnessHintDark': '深色模式：0 压暗至纯黑，50 原样',
  'aqua.bgBrightnessHintLight': '浅色模式：50 原样，100 提亮至纯白',
  'aqua.background': '背景',
  'aqua.backgroundFluid': '流体',
  'aqua.backgroundWallpaper': '壁纸',
  'aqua.wallpaper': '壁纸',
  'aqua.wallpaperHint': '浅色壁纸用浅色模式，深色壁纸用深色模式⚠️',
  'aqua.chooseImage': '选择图片',
  'aqua.chooseVideo': '选择视频',
  'aqua.deleteWallpaper': '删除',
  'aqua.wallpaperBlur': '壁纸模糊度',
  'aqua.wallpaperFrost': '壁纸磨砂度',
  'aqua.videoBlur': '视频模糊度',
  'aqua.videoBrightness': '视频亮度',
  'aqua.videoHint': '⚠️视频会自动压暗以保证文字清晰，可用模糊度和亮度调节；刷新后未自动播放时点一下“选择视频”即可恢复',
} satisfies Record<string, string>

export type AquaLocaleKey = keyof typeof zh

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The Aqua settings row's copy. */
    'settings.aqua': AquaLocaleKey
  }
}

/** English dictionary. */
export const en = {
  'aqua.title': 'Glass theme',
  'aqua.description': 'Global glassmorphism with mica/compatibility modes — blur, frost, backdrop, and color all adjustable',
  'aqua.enable': 'On',
  'aqua.disable': 'Off',
  'aqua.mode': 'Mode',
  'aqua.modeMica': 'Mica',
  'aqua.modeCompat': 'Compatibility',
  'aqua.materialGroup': 'Glass material',
  'aqua.decorAmbient': 'Ambient',
  'aqua.decorHover': 'Hover effects',
  'aqua.whale': 'Particle whale',
  'aqua.critters': 'Fish',
  'aqua.mesh': 'Interactive mesh',
  'aqua.spotlight': 'Cursor glow',
  'aqua.press': 'Hover tilt',
  'aqua.blur': 'Glass blur',
  'aqua.frost': 'Frost',
  'aqua.fluidHue': 'Hue',
  'aqua.fluidDepth': 'Color depth',
  'aqua.bgBrightness': 'Background brightness',
  'aqua.bgBrightnessHintDark': 'Dark mode: 0 fades to pure black, 50 is unchanged',
  'aqua.bgBrightnessHintLight': 'Light mode: 50 is unchanged, 100 brightens to pure white',
  'aqua.background': 'Backdrop',
  'aqua.backgroundFluid': 'Fluid',
  'aqua.backgroundWallpaper': 'Wallpaper',
  'aqua.wallpaper': 'Wallpaper',
  'aqua.wallpaperHint': 'Use light mode for light wallpapers, dark mode for dark wallpapers ⚠️',
  'aqua.chooseImage': 'Choose image',
  'aqua.chooseVideo': 'Choose video',
  'aqua.deleteWallpaper': 'Delete',
  'aqua.wallpaperBlur': 'Wallpaper blur',
  'aqua.wallpaperFrost': 'Wallpaper frost',
  'aqua.videoBlur': 'Video blur',
  'aqua.videoBrightness': 'Video brightness',
  'aqua.videoHint': '⚠️ The video is dimmed automatically to keep text readable — adjust blur and brightness here; if it does not play after a reload, click "Choose video" once to restore access',
} satisfies Record<AquaLocaleKey, string>
