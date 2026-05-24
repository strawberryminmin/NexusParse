export default function RawJsonTab({ data }) {
  return (
    <div
      className="rounded-2xl p-6 animate-fadeIn"
      style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(109, 40, 217, 0.18)',
        backdropFilter: 'blur(10px)',
      }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 16, letterSpacing: '-0.01em' }}>
        Raw JSON Output
      </h2>
      <pre style={{
        background: 'rgba(2, 4, 16, 0.6)',
        border: '1px solid rgba(109, 40, 217, 0.25)',
        color: '#34d399',
        padding: '20px',
        borderRadius: '12px',
        overflowX: 'auto',
        fontSize: '13px',
        fontFamily: 'monospace',
        lineHeight: 1.5
      }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
