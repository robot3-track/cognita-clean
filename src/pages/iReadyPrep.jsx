
export default function IReadyPrep() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 60px)" }}>
      <iframe
        src="https://ireadydiagnostic.vercel.app"
        title="iReady Diagnostic Prep"
        className="flex-1 w-full border-0"
        allow="fullscreen"
      />
    </div>
  );
}
