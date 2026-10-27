import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 40
const getFrameSrc = (index) => {
  const num = String(index + 1).padStart(3, '0')
  return `/Frames/ezgif-frame-${num}.png`
}

export default function Hero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const rafRef = useRef(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    const images = []
    let loadedCount = 0
    let errorCount = 0
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = getFrameSrc(i)
      img.decoding = 'async'
      img.onload = () => {
        if (cancelled) return
        if (img.naturalWidth > 0) {
          loadedCount++
          if (!loaded) {
            setLoaded(true)
          }
        } else {
          errorCount++
          if (loadedCount === 0 && errorCount === FRAME_COUNT) {
            setError(true)
          }
        }
      }
      img.onerror = () => {
        if (cancelled) return
        errorCount++
        if (loadedCount === 0 && errorCount === FRAME_COUNT) {
          setError(true)
        }
      }
      images.push(img)
    }
    imagesRef.current = images
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!section || !stage || !canvas) return

    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = (idx) => {
      const images = imagesRef.current
      let frameIdx = idx
      if (reduceMotion) frameIdx = 0
      if (frameIdx < 0) frameIdx = 0
      if (frameIdx >= FRAME_COUNT) frameIdx = FRAME_COUNT - 1

      let imgDraw = images[frameIdx]
      if (!imgDraw || !imgDraw.complete || imgDraw.naturalWidth === 0) {
        if (currentRef.current >= 0) {
          const cur = images[currentRef.current]
          if (cur && cur.complete && cur.naturalWidth > 0) {
            imgDraw = cur
            frameIdx = currentRef.current
          }
        }
        if (!imgDraw || !imgDraw.complete || imgDraw.naturalWidth === 0) {
          for (let i = 0; i < images.length; i++) {
            const cand = images[i]
            if (cand && cand.complete && cand.naturalWidth > 0) {
              imgDraw = cand
              frameIdx = i
              break
            }
          }
        }
      }

      if (!imgDraw || !imgDraw.complete || imgDraw.naturalWidth === 0) {
        if (!error) setError(true)
        return
      }

      const dpr = window.devicePixelRatio || 1
      const rect = stage.getBoundingClientRect()
      const cssW = rect.width
      const cssH = rect.height
      if (canvas.width !== Math.floor(cssW * dpr) || canvas.height !== Math.floor(cssH * dpr)) {
        canvas.width = Math.floor(cssW * dpr)
        canvas.height = Math.floor(cssH * dpr)
        canvas.style.width = cssW + 'px'
        canvas.style.height = cssH + 'px'
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)

      const ir = imgDraw.naturalWidth / imgDraw.naturalHeight
      const cr = cssW / cssH
      let dw, dh, dx, dy
      if (cr > ir) {
        dw = cssW
        dh = cssW / ir
        dx = 0
        dy = (cssH - dh) / 2
      } else {
        dh = cssH
        dw = cssH * ir
        dx = (cssW - dw) / 2
        dy = 0
      }
      ctx.drawImage(imgDraw, dx, dy, dw, dh)
      currentRef.current = frameIdx
    }

    const calc = () => {
      if (reduceMotion) {
        targetRef.current = 0
        return
      }
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const top = rect.top + window.scrollY
      const h = section.offsetHeight
      const span = Math.max(1, h - vh)
      const scrolled = window.scrollY - top
      if (scrolled <= 0) {
        targetRef.current = 0
        return
      }
      if (scrolled >= span) {
        targetRef.current = FRAME_COUNT - 1
        return
      }
      const p = scrolled / span
      targetRef.current = Math.round(p * (FRAME_COUNT - 1))
    }

    const tick = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        calc()
        let t = targetRef.current
        let c = currentRef.current
        if (reduceMotion) t = 0
        else if (Math.abs(t - c) > 1) t = c + (t > c ? 1 : -1)
        draw(t)
        if (!reduceMotion && t !== targetRef.current) tick()
      })
    }

    calc()
    draw(targetRef.current)
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [loaded])

  return (
    <section ref={sectionRef} className="relative h-[400vh] w-full overflow-visible">
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full self-start">
        <div className="min-h-[100svh] w-full p-1.5 sm:p-2 md:p-2.5 lg:p-3">
          <div className="relative mx-auto h-[calc(100svh-0.75rem)] min-h-[calc(100svh-0.75rem)] w-full max-w-[1920px] overflow-hidden rounded-[8px] border border-black/40 bg-[rgba(0,0,0,0.4)] sm:h-[calc(100svh-1rem)] sm:min-h-[calc(100svh-1rem)] sm:rounded-[10px] md:h-[calc(100svh-1.25rem)] md:min-h-[calc(100svh-1.25rem)] md:rounded-[10px] lg:h-[calc(100svh-1.5rem)] lg:min-h-[calc(100svh-1.5rem)] lg:rounded-[12px]">
            <div className="absolute inset-0 z-0">
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" aria-hidden="true" />
            </div>
            <div className="relative z-[1] flex h-full min-h-full flex-col pointer-events-none">
              <div className="absolute inset-0 pointer-events-none bg-black/70" />
              <header className="relative z-[1] flex w-full justify-center m-0 p-0">
                <nav
                  className="
                    pointer-events-auto relative mt-0 flex w-fit items-start justify-center gap-3
                    rounded-b-[16px] bg-black px-5 pt-1 pb-3
                    text-[9px] leading-none tracking-[0.24em] uppercase
                    sm:gap-5 sm:px-6 sm:text-[10px]
                    md:gap-7 md:px-8 md:pt-1.5 md:pb-4
                    [--bar:#000] [--r:16px]
                    before:pointer-events-none before:absolute before:top-0 before:-left-[var(--r)]
                    before:h-[var(--r)] before:w-[var(--r)] before:content-['']
                    before:bg-[radial-gradient(circle_at_0_100%,transparent_var(--r),var(--bar)_calc(var(--r)_+_0.5px))]
                    after:pointer-events-none after:absolute after:top-0 after:-right-[var(--r)]
                    after:h-[var(--r)] after:w-[var(--r)] after:content-['']
                    after:bg-[radial-gradient(circle_at_100%_100%,transparent_var(--r),var(--bar)_calc(var(--r)_+_0.5px))]
                  "
                >
                  <a href="#" className="text-text-secondary transition-colors hover:text-text-primary">About</a>
                  <a href="#" className="text-text-secondary transition-colors hover:text-text-primary">Fighters</a>
                  <a href="#" className="text-text-secondary transition-colors hover:text-text-primary">Events</a>
                  <a href="#" className="text-text-secondary transition-colors hover:text-text-primary">Rankings</a>
                  <a href="#" className="text-text-secondary transition-colors hover:text-text-primary">Community</a>
                </nav>
              </header>
              <div className="relative z-[1] flex flex-1 flex-col justify-end px-4 pb-6 sm:px-6 sm:pb-8 lg:px-10 lg:pb-10 xl:px-14 xl:pb-12">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(260px,0.8fr)] lg:items-end lg:gap-10 xl:gap-16">
                  <div className="max-w-[min(1080px,100%)]">
                    <h1 className="m-0 font-bebas font-normal uppercase leading-[0.82] tracking-[-0.01em] text-[clamp(68px,14vw,200px)] text-balance">
                      WHERE
                      <br />
                      CHAMPIONS
                      <br />
                      RISE.
                    </h1>
                  </div>
                  <div className="flex max-w-[300px] flex-col items-start gap-3 lg:justify-self-end lg:mb-1 pointer-events-auto">
                    <p className="m-0 text-xs leading-[1.8] text-text-secondary sm:text-sm">
                      Step into the ring where grit meets glory. Witness relentless ambition and legendary bouts.
                    </p>
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#101114] transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span>Explore Fighters</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#101114]">
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M2.5 7.5L7.5 2.5M7.5 2.5H3.33333M7.5 2.5V6.66667" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {!loaded && !error && currentRef.current < 0 && imagesRef.current.every(img => !img || !img.complete || img.naturalWidth === 0) && (
              <div className="absolute inset-0 z-[3] flex items-center justify-center text-text-secondary bg-[radial-gradient(ellipse_at_center,rgba(8,9,11,0.3)_0%,rgba(8,9,11,0.9)_100%)]">
                Loading...
              </div>
            )}
            {error && currentRef.current < 0 && imagesRef.current.every(img => !img || !img.complete || img.naturalWidth === 0) && (
              <div className="absolute inset-0 z-[3] flex items-center justify-center text-text-secondary bg-[radial-gradient(ellipse_at_center,rgba(8,9,11,0.3)_0%,rgba(8,9,11,0.9)_100%)]">
                Unable to load frames
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
