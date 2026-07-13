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
            <a className="brand" href="#home" aria-label="TYPEORBIT home">
              TYPE<span>/</span>ORBIT
            </a>
            <nav aria-label="Primary navigation">
              <a href="#system">System</a>
              <a href="#about">About</a>
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
              Generative motion laboratory
            </motion.p>
            <div className="title-wrap">
              <motion.h1
                variants={reveal}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                Motion with
                <br />
                <em>an orbit.</em>
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
                A real-time visual system where type, light and movement respond
                to human input.
              </p>
              <ScrambleLink href="#system">Enter the system</ScrambleLink>
            </motion.div>
          </div>

          <motion.div
            className="hero-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span>Move your cursor</span>
            <span className="coordinates">X 00.00 / Y 00.00</span>
            <a href="#system">Scroll ↓</a>
          </motion.div>
        </div>

        <div className="visual-panel" aria-label="Interactive generative orbit">
          <OrbitCanvas />
          <div className="visual-label top-label">
            <span>LIVE SIGNAL</span><span>60 FPS</span>
          </div>
          <div className="visual-label bottom-label">
            <span>WEBGL / OGL</span><span>POINTER ACTIVE</span>
          </div>
          <div className="crosshair" aria-hidden="true" />
        </div>
      </section>

      <section className="system" id="system">
        <div className="section-index">01 / SYSTEM</div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          Built to feel alive.
          <br />Designed to stay light.
        </motion.h2>
        <div className="system-grid">
          {[
            ['001', 'Procedural', 'Every frame is drawn in real time. No video, no loop.'],
            ['002', 'Responsive', 'Pointer velocity bends the field and shifts its energy.'],
            ['003', 'Efficient', 'Rendering pauses outside the viewport and respects reduced motion.'],
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
        <p>TYPEORBIT / EXPERIMENT 001</p>
        <h2>Not decoration.<br />A living interface.</h2>
        <a href="#home">Return to orbit ↑</a>
      </section>
    </main>
  )
}
