/**
 * Aqua row registered into the General settings section
 * (`settings.general.item`, right under Appearance): every glass knob — mode
 * (mica / compatibility), blur/frost (mica mode only), fluid color,
 * background brightness, the backdrop source picker, and the wallpaper
 * picker with its two knobs. Every
 * write goes straight through to the layer, so the skin moves live. The
 * controls follow the Appearance cubes directly (no row title of their own),
 * and the whole row renders nothing while the master switch in the Plugins
 * section is off.
 */
import { useRef } from 'react'
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots'
// Type-only: pulls the `settings.general.item` SlotMap merge.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import { fileToDataUrl, Knob, Segmented } from './AquaControls.tsx'
import { loadVideoHandle, saveVideoBlob, saveVideoHandle } from './wallpaper-store.ts'
import type { createAquaRowStore } from './settings-store.ts'
import css from './AquaAppearanceRow.module.css'

/** Injected business face: every knob write except the master switch. */
export interface AquaAppearanceRowInjected {
  /** Set the rendering mode. */
  setMode: (value: 'mica' | 'compat') => void
  /** Set the glass blur radius, px. */
  setBlur: (value: number) => void
  /** Set the glass frost amount, 0-100. */
  setFrost: (value: number) => void
  /** Set the fluid hue, degrees (0-360, continuous). */
  setFluidHue: (value: number) => void
  /** Set the fluid depth, 0-100 (continuous). */
  setFluidDepth: (value: number) => void
  /** Set the background brightness, 0-100 (0 = black, 50 = transparent, 100 = white). */
  setBgBrightness: (value: number) => void
  /** Set the backdrop source. */
  setBackground: (value: 'fluid' | 'wallpaper') => void
  /** Set the wallpaper image (a data URL). */
  setWallpaper: (value: string) => void
  /** Set the particle-whale flag. */
  setWhale: (value: boolean) => void
  /** Set the ambient marine-life flag. */
  setCritters: (value: boolean) => void
  /** Set the interactive-mesh flag. */
  setMesh: (value: boolean) => void
  /** Set the cursor-spotlight flag. */
  setSpotlight: (value: boolean) => void
  /** Set the hover-press flag. */
  setPress: (value: boolean) => void
  /** Set the wallpaper blur radius, px. */
  setWallpaperBlur: (value: number) => void
  /** Set the wallpaper frost veil, 0-100. */
  setWallpaperFrost: (value: number) => void
  /** Set the video wallpaper blur radius, px. */
  setVideoBlur: (value: number) => void
  /** Set the video wallpaper brightness, 0-100. */
  setVideoBrightness: (value: number) => void
  /** Re-read the fsa: video after the user re-granted file access. */
  authorizeVideo: () => void
}

/** Full component props: runtime share + store share + locale seat + injected face. */
export type AquaAppearanceRowComponentProps =
  PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createAquaRowStore>>
  & PropsLocale<'settings.aqua'> & AquaAppearanceRowInjected

/**
 * Render the Aqua appearance row.
 * @param props - composed slot props.
 * @returns the General section row.
 */
export function AquaAppearanceRow(props: AquaAppearanceRowComponentProps) {
  const {
    t, setMode, setBlur, setFrost, setFluidHue, setFluidDepth, setBgBrightness,
    setBackground, setWallpaper, setWhale, setCritters, setMesh, setSpotlight, setPress,
    setWallpaperBlur, setWallpaperFrost, setVideoBlur, setVideoBrightness, authorizeVideo, useStore,
  } = props
  const enabled = useStore(s => s.enabled)
  const mode = useStore(s => s.mode)
  const blur = useStore(s => s.blur)
  const frost = useStore(s => s.frost)
  const fluidHue = useStore(s => s.fluidHue)
  const fluidDepth = useStore(s => s.fluidDepth)
  const bgBrightness = useStore(s => s.bgBrightness)
  const dark = useStore(s => s.dark)
  const background = useStore(s => s.background)
  const whale = useStore(s => s.whale)
  const critters = useStore(s => s.critters)
  const mesh = useStore(s => s.mesh)
  const spotlight = useStore(s => s.spotlight)
  const press = useStore(s => s.press)
  const wallpaper = useStore(s => s.wallpaper)
  const wallpaperBlur = useStore(s => s.wallpaperBlur)
  const wallpaperFrost = useStore(s => s.wallpaperFrost)
  const videoBlur = useStore(s => s.videoBlur)
  const videoBrightness = useStore(s => s.videoBrightness)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLInputElement | null>(null)

  // Videos are `idb:` blobs, `fsa:` remembered-file handles, or legacy
  // `data:video/` URLs.
  const isVideoWallpaper = wallpaper.startsWith('data:video/') || wallpaper.startsWith('idb:') || wallpaper.startsWith('fsa:')

  /** Pick a video. Chromium: File System Access — the browser remembers the
   *  file authorization, so later visits re-read the ORIGINAL file with no
   *  storage copy. Other browsers fall back to the plain file input. */
  const pickVideo = (): void => {
    if (window.showOpenFilePicker !== undefined) {
      void (async () => {
        try {
          const [handle] = await window.showOpenFilePicker({
            multiple: false,
            types: [{ description: 'Video', accept: { 'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.mkv'] } }],
          })
          if (handle === undefined) return
          setBackground('wallpaper')
          if (await saveVideoHandle(handle)) {
            setWallpaper(`fsa:${handle.name}`)
          } else {
            // idb unavailable — degrade to the blob store / data URL path.
            const file = await handle.getFile()
            void saveVideoBlob(file).then((id) => {
              if (id !== '') setWallpaper(id)
              else void fileToDataUrl(file).then(setWallpaper)
            })
          }
        } catch {
          /* picker cancelled — keep current state */
        }
      })()
    } else {
      videoRef.current?.click()
    }
  }

  /** 选择视频 click: an fsa: video with stale permission re-authorizes in
   *  one click (no picker); anything else opens the picker. */
  const onChooseVideo = (): void => {
    if (wallpaper.startsWith('fsa:')) {
      void (async () => {
        const handle = await loadVideoHandle()
        if (handle !== null) {
          try {
            const permission = await handle.queryPermission({ mode: 'read' })
            if (permission === 'granted') {
              authorizeVideo()
              return
            }
            if (permission === 'prompt') {
              const next = await handle.requestPermission({ mode: 'read' })
              if (next === 'granted') {
                authorizeVideo()
                return
              }
            }
          } catch {
            /* fall through to re-pick */
          }
        }
        pickVideo()
      })()
    } else {
      pickVideo()
    }
  }

  // The brightness knob only ever offers the half that makes sense for the
  // resolved scheme: dark mode darkens (0-50), light mode brightens (50-100).
  // The stored 0-100 value is clamped for display; writing always stays in
  // the offered range, so a value picked in one scheme is inert in the other.
  const bgMin = dark ? 0 : 50
  const bgMax = dark ? 50 : 100
  const bgDisplay = Math.min(bgMax, Math.max(bgMin, bgBrightness))

  // Off = the Plugins master switch is off: leave no trace in General.
  if (!enabled) return null

  return (
    <div className={css.group}>
      {/* 模式 */}
      <div className={css.subGroup}>
        <div className={css.subTitle}>{t('aqua.mode')}</div>
        <div className={css.controls}>
          <div className={css.row}>
            <Segmented
              label={t('aqua.mode')}
              value={mode}
              options={[
                { id: 'mica', label: t('aqua.modeMica') },
                { id: 'compat', label: t('aqua.modeCompat') },
              ]}
              onSelect={setMode}
            />
          </div>
        </div>
      </div>

      {/* 玻璃材质：仅云母模式 */}
      {mode === 'mica' && (
        <div className={css.subGroup}>
          <div className={css.subTitle}>{t('aqua.materialGroup')}</div>
          <div className={css.controls}>
            <Knob label={t('aqua.blur')} value={blur} min={0} max={40} step={0.5} unit="px" onChange={setBlur} />
            <Knob label={t('aqua.frost')} value={frost} min={0} max={100} step={1} unit="%" onChange={setFrost} />
          </div>
        </div>
      )}

      {/* 背景 */}
      <div className={css.subGroup}>
        <div className={css.subTitle}>{t('aqua.background')}</div>
        <div className={css.controls}>
          <div className={css.row}>
            <Segmented
              label={t('aqua.background')}
              value={background}
              options={[
                { id: 'fluid', label: t('aqua.backgroundFluid') },
                { id: 'wallpaper', label: t('aqua.backgroundWallpaper') },
              ]}
              onSelect={setBackground}
            />
          </div>

          {background === 'fluid' && (
            <>
              <Knob label={t('aqua.fluidHue')} value={fluidHue} min={0} max={360} step={1} unit="°" onChange={setFluidHue} />
              <Knob label={t('aqua.fluidDepth')} value={fluidDepth} min={0} max={100} step={1} unit="%" onChange={setFluidDepth} />
            </>
          )}

          {background === 'wallpaper' && (
            <>
              <div className={css.row}>
                <span className={css.rowLabel}>{t('aqua.wallpaper')}</span>
                <div className={css.wallpaperPick}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className={css.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file !== undefined) {
                        setBackground('wallpaper')
                        void fileToDataUrl(file).then(setWallpaper)
                      }
                      e.target.value = ''
                    }}
                  />
                  <input
                    ref={videoRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className={css.fileInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file !== undefined) {
                        // Picking a backdrop switches the source to wallpaper
                        // automatically, so the media shows right away. The
                        // video plays through the browser's native decoder as
                        // the background (no controls, no progress bar).
                        setBackground('wallpaper')
                        // ALWAYS persist videos in IndexedDB: even a small
                        // video's data URL can blow the localStorage quota
                        // (base64 inflates 33%), which would silently lose
                        // the wallpaper on the next reload. Only when idb is
                        // unavailable do we fall back to the data-URL path.
                        void saveVideoBlob(file).then((id) => {
                          if (id !== '') {
                            setWallpaper(id)
                          } else {
                            void fileToDataUrl(file).then(setWallpaper)
                          }
                        })
                      }
                      e.target.value = ''
                    }}
                  />
                  <button type="button" className={css.pickButton} onClick={() => { fileRef.current?.click() }}>
                    {t('aqua.chooseImage')}
                  </button>
                  <button type="button" className={css.pickButton} onClick={onChooseVideo}>
                    {t('aqua.chooseVideo')}
                  </button>
                  {wallpaper !== '' && (
                    <button type="button" className={css.deleteButton} onClick={() => { setWallpaper('') }}>
                      {t('aqua.deleteWallpaper')}
                    </button>
                  )}
                </div>
              </div>
              <div className={css.knobHint}>{t('aqua.wallpaperHint')}</div>
              {/* 视频壁纸不支持模糊/磨砂调节（视频直接清晰播放） */}
              {!isVideoWallpaper && (
                <>
                  <Knob label={t('aqua.wallpaperBlur')} value={wallpaperBlur} min={0} max={40} step={0.5} unit="px" onChange={setWallpaperBlur} />
                  <Knob label={t('aqua.wallpaperFrost')} value={wallpaperFrost} min={0} max={100} step={1} unit="%" onChange={setWallpaperFrost} />
                </>
              )}
              {/* 视频壁纸：模糊度 + 亮度，配上提醒 */}
              {isVideoWallpaper && (
                <>
                  <Knob label={t('aqua.videoBlur')} value={videoBlur} min={0} max={40} step={0.5} unit="px" onChange={setVideoBlur} />
                  <Knob label={t('aqua.videoBrightness')} value={videoBrightness} min={0} max={100} step={1} unit="%" onChange={setVideoBrightness} />
                  <div className={css.knobHint}>{t('aqua.videoHint')}</div>
                </>
              )}
            </>
          )}

          <Knob label={t('aqua.bgBrightness')} value={bgDisplay} min={bgMin} max={bgMax} step={1} unit="%" onChange={setBgBrightness} />
          <div className={css.knobHint}>
            {t(dark ? 'aqua.bgBrightnessHintDark' : 'aqua.bgBrightnessHintLight')}
          </div>
        </div>
      </div>

      {/* 装饰：环境装饰 */}
      <div className={css.subGroup}>
        <div className={css.subTitle}>{t('aqua.decorAmbient')}</div>
        <div className={css.controls}>
          <div className={css.row}>
            <span className={css.rowLabel}>{t('aqua.whale')}</span>
            <button
              type="button"
              className={whale ? css.toggleOn : css.toggle}
              aria-pressed={whale}
              onClick={() => { setWhale(!whale) }}
            >
              <span className={css.check}>
                {whale && <IconCheckOutline16 />}
              </span>
              {whale ? t('aqua.enable') : t('aqua.disable')}
            </button>
          </div>
          <div className={css.row}>
            <span className={css.rowLabel}>{t('aqua.critters')}</span>
            <button
              type="button"
              className={critters ? css.toggleOn : css.toggle}
              aria-pressed={critters}
              onClick={() => { setCritters(!critters) }}
            >
              <span className={css.check}>
                {critters && <IconCheckOutline16 />}
              </span>
              {critters ? t('aqua.enable') : t('aqua.disable')}
            </button>
          </div>
          <div className={css.row}>
            <span className={css.rowLabel}>{t('aqua.mesh')}</span>
            <button
              type="button"
              className={mesh ? css.toggleOn : css.toggle}
              aria-pressed={mesh}
              onClick={() => { setMesh(!mesh) }}
            >
              <span className={css.check}>
                {mesh && <IconCheckOutline16 />}
              </span>
              {mesh ? t('aqua.enable') : t('aqua.disable')}
            </button>
          </div>
        </div>
      </div>

      {/* 装饰：悬停效果（仅云母模式的漂浮玻璃） */}
      {mode === 'mica' && (
        <div className={css.subGroup}>
          <div className={css.subTitle}>{t('aqua.decorHover')}</div>
          <div className={css.controls}>
            <div className={css.row}>
              <span className={css.rowLabel}>{t('aqua.spotlight')}</span>
              <button
                type="button"
                className={spotlight ? css.toggleOn : css.toggle}
                aria-pressed={spotlight}
                onClick={() => { setSpotlight(!spotlight) }}
              >
                <span className={css.check}>
                  {spotlight && <IconCheckOutline16 />}
                </span>
                {spotlight ? t('aqua.enable') : t('aqua.disable')}
              </button>
            </div>
            <div className={css.row}>
              <span className={css.rowLabel}>{t('aqua.press')}</span>
              <button
                type="button"
                className={press ? css.toggleOn : css.toggle}
                aria-pressed={press}
                onClick={() => { setPress(!press) }}
              >
                <span className={css.check}>
                  {press && <IconCheckOutline16 />}
                </span>
                {press ? t('aqua.enable') : t('aqua.disable')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
