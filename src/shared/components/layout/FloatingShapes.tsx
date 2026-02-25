export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="floating-shape -left-28 top-20 size-72 bg-fuchsia-500/60 animate-float" />
      <div className="floating-shape right-0 top-10 size-64 bg-cyan-500/50 [animation-delay:1.2s] animate-float" />
      <div className="floating-shape bottom-8 left-1/3 size-80 bg-indigo-500/45 [animation-delay:2s] animate-float" />
    </div>
  )
}
