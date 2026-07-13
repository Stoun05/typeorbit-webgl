import { motion } from 'motion/react'
import OrbitCanvas from './components/OrbitCanvas.jsx'

const reveal = {
  hidden: { y: 26, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

function ScrambleLink({ children, href }) {
  return (
    <motion.a href={href} whileHover={{ x: 4 }} transition={{ duration: 0.25 }}>
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </motion.a>
  )
}

export default function App() {
  return (
    <main>
      <section className="hero" id="home">
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
              <ScrambleLink href="#system">Ulgamy öwren</ScrambleLink>
            </motion.div>
          </div>

          <motion.div
            className="hero-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span>Syçanjygy hereketlendir</span>
            <span className="coordinates">X 00.00 / Y 00.00</span>
            <a href="#system">Aşak geç ↓</a>
          </motion.div>
        </div>

        <div className="visual-panel" aria-label="Interaktiw döredijilik orbitasy">
          <OrbitCanvas />
          <div className="visual-label top-label">
            <span>JANLY SIGNAL</span><span>60 KADR/S</span>
          </div>
          <div className="visual-label bottom-label">
            <span>WEBGL / OGL</span><span>GÖRKEZIJI IŞJEŇ</span>
          </div>
          <div className="crosshair" aria-hidden="true" />
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
              transition={{ delay: index * 0.12, duration: 0.65 }}
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
