# TYPEORBIT

A generative WebGL landing page built with React, Vite, Motion and OGL.

## Features

- Procedural orbit shader rendered in real time
- Pointer velocity deformation with eased movement
- Lazy WebGL initialization using `requestIdleCallback`
- Rendering pauses when the canvas leaves the viewport
- Device pixel ratio capped at 2
- Reduced-motion and responsive layouts

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
