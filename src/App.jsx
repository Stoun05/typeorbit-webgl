import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import OrbitCanvas from './components/OrbitCanvas.jsx'

const reveal = {
  hidden: { y: 26, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

function MagneticLink({ children, href }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20 })
  const springY = useSpring(y, { stiffness: 260, damping: 20 })

  const move = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left - rect.width / 2) * 0.24)
    y.set((event.clientY - rect.top - rect.height / 2) * 0.32)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      className="magnetic-link"
      href={href}
      style={{ x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </motion.a>
  )
}

function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 620, damping: 38, mass: 0.35 })
  const smoothY = useSpring(y, { stiffness: 620, damping: 38, mass: 0.35 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setActive(Boolean(event.target.closest('a, button, .visual-panel, .system-grid article')))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <motion.div
      className="custom-cursor"
      aria-hidden="true"
      style={{ x: smoothX, y: smoothY }}
      animate={{ scale: active ? 1.9 : 1, opacity: active ? 0.72 : 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0)
  const [introVisible, setIntroVisible] = useState(true)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 8])
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.78, 1], [1, 0.92, 0.35])
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
  const updateCoordinates = useCallback(({ x, y }) => {
    setCoordinates({ x: Math.round(x * 100), y: Math.round(y * 100) })
  }, [])

  useEffect(() => {
    const quick = window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches
    const step = quick ? 20 : 4
    const speed = quick ? 18 : 28
    let value = 0
    let hideTimer
    document.body.style.overflow = 'hidden'
    const timer = window.setInterval(() => {
      value = Math.min(100, value + step)
      setLoadProgress(value)
      if (value === 100) {
        window.clearInterval(timer)
        hideTimer = window.setTimeout(() => {
          setIntroVisible(false)
          document.body.style.overflow = ''
        }, quick ? 120 : 360)
      }
    }, speed)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(hideTimer)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <main>
      <AnimatePresence>
        {introVisible && (
          <motion.div
            className="intro-loader"
            initial={{ opacity: 1 }}
            exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div className="loader-brand">TYPE<span>/</span>ORBIT</div>
            <div className="loader-orbit" aria-hidden="true"><i /><i /><i /></div>
            <div className="loader-progress">
              <span>ULGAM ÝÜKLENÝÄR</span>
              <strong>{String(loadProgress).padStart(3, '0')}%</strong>
            </div>
            <div className="loader-track"><i style={{ transform: `scaleX(${loadProgress / 100})` }} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomCursor />

      <section className="hero" id="home" ref={heroRef}>
        <div className="hero-copy">
          <motion.header
            className="nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <a className="brand" href="#home" aria-label="TYPEORBIT baş sahypa">
              TYPE<span>/</span>ORBIT
            </a>
            <nav aria-label="Esasy menýu">
              <a href="#system">Ulgam</a>
              <a href="#about">Biz barada</a>
            </nav>
            <span className="edition">EXP—001</span>
          </motion.header>

          <div className="hero-content">
            <motion.p
              className="eyebrow"
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.12, duration: 0.7 }}
            >
              Döredijilik hereketiniň laboratoriýasy
            </motion.p>
            <div className="title-wrap">
              <motion.h1
                variants={reveal}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                Hereketiň täze
                <br />
                <em>orbitasy.</em>
              </motion.h1>
            </div>
            <motion.div
              className="intro-row"
              variants={reveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.38, duration: 0.8 }}
            >
              <p>
                Harplaryň, ýagtylygyň we hereketiň adamyň täsirine şol pursatda
                jogap berýän janly wizual ulgamy.
              </p>
              <MagneticLink href="#system">Ulgamy öwren</MagneticLink>
            </motion.div>
          </div>

          <motion.div
            className="hero-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span>Syçanjygy hereketlendir</span>
            <span className="coordinates">X {String(coordinates.x).padStart(2, '0')}.00 / Y {String(coordinates.y).padStart(2, '0')}.00</span>
            <a href="#system">Aşak geç ↓</a>
          </motion.div>
        </div>

        <div className="visual-panel" aria-label="Interaktiw döredijilik orbitasy">
          <motion.div
            className="visual-motion"
            style={{ scale: orbitScale, rotate: orbitRotate, y: orbitY, opacity: orbitOpacity }}
          >
            <OrbitCanvas onPointerChange={updateCoordinates} />
            <div className="visual-label top-label">
              <span>JANLY SIGNAL</span><span>60 KADR/S</span>
            </div>
            <div className="visual-label bottom-label">
              <span>WEBGL / OGL</span><span>GÖRKEZIJI IŞJEŇ</span>
            </div>
            <div className="crosshair" aria-hidden="true" />
          </motion.div>
        </div>
      </section>

      <section className="system" id="system">
        <div className="section-index">01 / ULGAM</div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          Janly duýulmak üçin döredildi.
          <br />Ýeňil işlemek üçin taslandy.
        </motion.h2>
        <div className="system-grid">
          {[
            ['001', 'Şol pursatda döredilýär', 'Her kadr şol pursatda täzeden çyzylýar. Wideo hem-de gaýtalanýan ýazgy ýok.'],
            ['002', 'Täsire duýgur', 'Görkezijiniň tizligi meýdany egýär we onuň energiýasyny üýtgedýär.'],
            ['003', 'Tygşytly', 'Animasiýa görünmeýän wagty saklanýar we az hereket sazlamasyna eýerýär.'],
          ].map(([number, title, text], index) => (
            <motion.article
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              whileHover={{ y: -14, rotateX: 3, backgroundColor: 'rgba(240, 108, 31, 0.07)' }}
              whileTap={{ scale: 0.985 }}
              transition={{ delay: index * 0.12, duration: 0.65, y: { type: 'spring', stiffness: 280, damping: 22 } }}
              style={{ transformPerspective: 900 }}
            >
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <p>TYPEORBIT / TEJRIBE 001</p>
        <h2>Diňe bezeg däl.<br />Bu — janly interfeýs.</h2>
        <a href="#home">Orbita dolan ↑</a>
      </section>
    </main>
  )
}
