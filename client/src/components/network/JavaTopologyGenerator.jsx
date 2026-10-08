import { useRef, useState } from "react";
import { JAVA_TOPOLOGY_EXAMPLE, parseJavaTopology } from "../../utils/javaTopologyParser";

function JavaTopologyGenerator({ onGenerate, onClose, disabled = false }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const validate = (value) => {
    try {
      const result = parseJavaTopology(value);
      setPreview({ routerCount: result.routerCount, linkCount: result.linkCount });
      setError("");
      return result;
    } catch (err) {
      setPreview(null);
      setError(err.message || "Could not parse the Java topology.");
      return null;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".java")) {
      setError("Please select a .java file.");
      setPreview(null);
      return;
    }

    setFileName(file.name);
    setIsReading(true);
    setError("");
    setPreview(null);

    try {
      const text = await file.text();
      setSource(text);
      validate(text);
    } catch (err) {
      setError(err.message || "Unable to read the Java file.");
    } finally {
      setIsReading(false);
    }
  };

  const handleGenerate = () => {
    const result = validate(source);
    if (!result) return;
    onGenerate(result);
    onClose();
  };

  const handleExample = () => {
    setFileName("netviz_example.java");
    setSource(JAVA_TOPOLOGY_EXAMPLE);
    validate(JAVA_TOPOLOGY_EXAMPLE);
  };

  return (
    <div
      className="java-generator-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isReading && !disabled) onClose();
      }}
    >
      <div className="java-generator-dialog" role="dialog" aria-modal="true">
        <div className="java-generator-header">
          <div>
            <h2>Generate Topology from Java</h2>
            <p>Upload or paste a NetViz Java topology definition.</p>
          </div>
          <button type="button" className="java-generator-close" onClick={onClose} disabled={isReading || disabled} aria-label="Close">×</button>
        </div>

        <div className="java-generator-body">
          <div className="java-generator-upload-row">
            <button type="button" className="feature-button" onClick={() => fileInputRef.current?.click()} disabled={isReading || disabled}>
              {isReading ? "Reading..." : "Choose .java File"}
            </button>
            <input ref={fileInputRef} type="file" accept=".java" onChange={handleFileChange} hidden />
            <span className="java-generator-file-name">{fileName || "No file selected"}</span>
          </div>

          <div className="java-generator-format">
            <div className="java-generator-section-title">Supported Java format</div>
            <pre>{`Router r1 = new Router("R1", "Core Router", "10.0.0.1");
Router r2 = new Router("R2", "Router", "10.0.0.2");
link(r1, r2, 10, 20, 100, 0);`}</pre>
            <p>Router: <strong>id, role, IP address, priority</strong>. Link: <strong>source, target, cost, delay, bandwidth, packet loss</strong>.</p>
          </div>

          {preview && <div className="java-generator-preview"><span>Routers <strong>{preview.routerCount}</strong></span><span>Links <strong>{preview.linkCount}</strong></span></div>}
          {error && <div className="java-generator-error">{error}</div>}

          <div className="java-generator-source">
            <div className="java-generator-section-title">Java source</div>
            <textarea value={source} onChange={(event) => { setSource(event.target.value); setFileName(event.target.value.trim() ? "Edited Java source" : ""); setPreview(null); setError(""); }} placeholder="Paste your NetViz Java topology here..." spellCheck="false" disabled={disabled} />
          </div>
        </div>

        <div className="java-generator-footer">
          <button type="button" className="topology-dialog-button topology-dialog-cancel" onClick={onClose} disabled={isReading || disabled}>Cancel</button>
          <button type="button" className="java-example-button" onClick={handleExample} disabled={isReading || disabled}>Load Example</button>
          <button type="button" className="topology-dialog-button topology-dialog-confirm" onClick={handleGenerate} disabled={isReading || disabled || !source.trim()}>Generate Topology</button>
        </div>
      </div>
    </div>
  );
}

export default JavaTopologyGenerator;
