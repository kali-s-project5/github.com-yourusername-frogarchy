import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "frog-royalty-legacy";

const FROG_EMOJI = ["🐸", "🌿", "🍃", "✨", "🌙", "🌲", "💚", "🌿"];

function FloatingFrog({ style }) {
  return (
    <div className="floating-frog" style={style}>
      🐸
    </div>
  );
}

function Firefly({ style }) {
  return <div className="firefly" style={style} />;
}

function RoyalCard({ reign, index, isFirst }) {
  const [expanded, setExpanded] = useState(index === 0);
  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

  return (
    <div className={`royal-card ${expanded ? "expanded" : ""}`} style={{ animationDelay: `${index * 0.15}s` }}>
      <div className="card-header" onClick={() => setExpanded(!expanded)}>
        <div className="reign-number">{ordinals[index] || `${index + 1}th`} Reign</div>
        <div className="card-title-row">
          <span className="monarch-name">👑 {reign.name}</span>
          <span className="reign-year">{reign.year} · EF{reign.efNumber || "?"}</span>
        </div>
        <div className="expand-arrow">{expanded ? "▲" : "▼"}</div>
      </div>

      {expanded && (
        <div className="card-body">
          {reign.photos && reign.photos.length > 0 && (
            <div className="photo-grid">
              {reign.photos.map((photo, i) => (
                <div key={i} className="photo-frame">
                  <img src={photo.url} alt={photo.caption || "Forest memory"} />
                  {photo.caption && <div className="photo-caption">{photo.caption}</div>}
                </div>
              ))}
            </div>
          )}
          <div className="story-text">{reign.story}</div>
          {reign.frogsSpotted && (
            <div className="frogs-spotted">
              <span className="spotted-label">🐸 Frogs spotted in the wild:</span>
              <span className="spotted-count">{reign.frogsSpotted}</span>
            </div>
          )}
          {reign.message && (
            <div className="royal-message">
              <div className="message-label">A message to the next Monarch:</div>
              <div className="message-text">"{reign.message}"</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddReignForm({ onAdd, onCancel }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [efNumber, setEfNumber] = useState("");
  const [story, setStory] = useState("");
  const [frogsSpotted, setFrogsSpotted] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => [...prev, { url: ev.target.result, caption: "" }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addPhotoByUrl = () => {
    if (!photoUrl.trim()) return;
    setPhotos((prev) => [...prev, { url: photoUrl.trim(), caption: photoCaption.trim() }]);
    setPhotoUrl("");
    setPhotoCaption("");
  };

  const updateCaption = (index, caption) => {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, caption } : p)));
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim() || !story.trim()) return;
    onAdd({ name: name.trim(), year, efNumber, story: story.trim(), frogsSpotted, message: message.trim(), photos, timestamp: Date.now() });
  };

  return (
    <div className="add-reign-form">
      <h3 className="form-title">🐸 Claim Your Reign</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Your Name / Forest Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Luna Lilypad, Frog Queen of the Mossy Glen" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" />
          </div>
          <div className="form-group">
            <label>Electric Forest #</label>
            <input value={efNumber} onChange={(e) => setEfNumber(e.target.value)} placeholder="e.g. 7" />
          </div>
          <div className="form-group">
            <label>🐸 Frogs Spotted</label>
            <input value={frogsSpotted} onChange={(e) => setFrogsSpotted(e.target.value)} placeholder="e.g. 12" />
          </div>
        </div>
        <div className="form-group">
          <label>Your Story *</label>
          <textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Tell us how you found the crown, what the forest showed you, and what it meant to wear it..." rows={5} />
        </div>
        <div className="form-group">
          <label>Message to the Next Monarch</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Wisdom, a blessing, a riddle... what do you pass along with the crown?" rows={3} />
        </div>

        <div className="form-group">
          <label>Photos 📷</label>
          <div className="photo-upload-area">
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
            <button className="upload-btn" onClick={() => fileRef.current.click()}>Upload from device</button>
            <div className="photo-url-row">
              <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Or paste image URL..." />
              <input value={photoCaption} onChange={(e) => setPhotoCaption(e.target.value)} placeholder="Caption (optional)" />
              <button className="add-url-btn" onClick={addPhotoByUrl}>Add</button>
            </div>
          </div>
          {photos.length > 0 && (
            <div className="photo-previews">
              {photos.map((p, i) => (
                <div key={i} className="photo-preview">
                  <img src={p.url} alt="" />
                  <input value={p.caption} onChange={(e) => updateCaption(i, e.target.value)} placeholder="Add caption..." />
                  <button className="remove-photo" onClick={() => removePhoto(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="submit-btn" onClick={handleSubmit} disabled={!name.trim() || !story.trim()}>
          ✨ Inscribe My Reign ✨
        </button>
      </div>
    </div>
  );
}

export default function FrogRoyaltyLegacy() {
  const [reigns, setReigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY, true);
        if (result && result.value) {
          setReigns(JSON.parse(result.value));
        }
      } catch (e) {
        // No data yet — fresh legacy
      }
      setLoaded(true);
    };
    load();
  }, []);

  const addReign = async (reign) => {
    const updated = [reign, ...reigns];
    setReigns(updated);
    setShowForm(false);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(updated), true);
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  const fireflies = Array.from({ length: 18 }, (_, i) => ({
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 95}%`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
  }));

  const floatingFrogs = Array.from({ length: 5 }, (_, i) => ({
    top: `${10 + i * 18}%`,
    left: `${Math.random() > 0.5 ? 2 + Math.random() * 5 : 90 + Math.random() * 7}%`,
    fontSize: `${1 + Math.random()}rem`,
    animationDelay: `${i * 0.7}s`,
    opacity: 0.25 + Math.random() * 0.3,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0f0a;
          color: #c8dfc0;
          font-family: 'Lora', Georgia, serif;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          background: radial-gradient(ellipse at 20% 0%, #0d2010 0%, #050a05 50%, #0a1a0a 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* Fireflies */
        .firefly {
          position: fixed;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #b8ff8c;
          box-shadow: 0 0 6px 2px #7dff4a, 0 0 14px 4px #4aff1a55;
          pointer-events: none;
          animation: blink var(--dur, 2.5s) var(--delay, 0s) ease-in-out infinite alternate;
          z-index: 0;
        }
        @keyframes blink {
          0% { opacity: 0; transform: translate(0,0) scale(0.8); }
          50% { opacity: 1; transform: translate(4px, -8px) scale(1.2); }
          100% { opacity: 0.2; transform: translate(-3px, 6px) scale(0.9); }
        }

        /* Floating frogs */
        .floating-frog {
          position: fixed;
          pointer-events: none;
          animation: floatFrog 6s ease-in-out infinite alternate;
          z-index: 0;
          filter: drop-shadow(0 0 8px #3aff6a55);
        }
        @keyframes floatFrog {
          from { transform: translateY(0px) rotate(-5deg); }
          to { transform: translateY(-20px) rotate(5deg); }
        }

        /* Layout */
        .container {
          max-width: 780px;
          margin: 0 auto;
          padding: 2rem 1.5rem 5rem;
          position: relative;
          z-index: 1;
        }

        /* Hero */
        .hero {
          text-align: center;
          padding: 3.5rem 0 2.5rem;
        }
        .crown-emoji {
          font-size: 4rem;
          display: block;
          animation: crownGlow 3s ease-in-out infinite alternate;
          margin-bottom: 1rem;
        }
        @keyframes crownGlow {
          from { filter: drop-shadow(0 0 10px #ffd70088); transform: translateY(0) rotate(-3deg); }
          to { filter: drop-shadow(0 0 25px #ffd700cc); transform: translateY(-6px) rotate(3deg); }
        }
        .hero-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(1.5rem, 5vw, 2.8rem);
          color: #e8f5d8;
          letter-spacing: 0.04em;
          line-height: 1.2;
          text-shadow: 0 0 40px #4aff1a44, 0 2px 8px #00000088;
          margin-bottom: 0.5rem;
        }
        .hero-subtitle {
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(0.7rem, 2vw, 1rem);
          color: #7db870;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .hero-lore {
          font-style: italic;
          color: #8fba80;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 2rem;
          border-left: 2px solid #2a5a2a;
          padding-left: 1.2rem;
          text-align: left;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: #2d5a2d;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #2d5a2d, transparent);
        }

        /* Claim button */
        .claim-btn {
          display: block;
          margin: 0 auto 2.5rem;
          background: linear-gradient(135deg, #1a4a1a, #2a6a2a);
          border: 1px solid #4aaa4a;
          color: #b8f0b0;
          font-family: 'Cinzel Decorative', serif;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          padding: 0.9rem 2rem;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 0 20px #1a4a1a88, inset 0 1px 0 #5aaa5a22;
        }
        .claim-btn:hover {
          background: linear-gradient(135deg, #1f5a1f, #3a7a3a);
          box-shadow: 0 0 35px #2a6a2a99, inset 0 1px 0 #6aaa6a33;
          transform: translateY(-1px);
          color: #d0ffcc;
        }

        /* Royal cards */
        .reigns-section { margin-top: 1rem; }
        .section-title {
          font-family: 'Cinzel Decorative', serif;
          font-size: 0.9rem;
          color: #4a8a4a;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .royal-card {
          background: linear-gradient(145deg, #0d1f0d, #0f2a0f);
          border: 1px solid #1e4a1e;
          border-radius: 2px;
          margin-bottom: 1rem;
          overflow: hidden;
          animation: fadeInUp 0.5s ease both;
          transition: border-color 0.3s;
        }
        .royal-card:hover { border-color: #2e6a2e; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-header {
          padding: 1.2rem 1.5rem;
          cursor: pointer;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1rem;
          transition: background 0.2s;
        }
        .card-header:hover { background: #0f2a0f88; }

        .reign-number {
          font-family: 'Cinzel Decorative', serif;
          font-size: 0.65rem;
          color: #4a8a4a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .card-title-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        .monarch-name {
          font-size: 1.05rem;
          color: #d0f0c0;
          font-weight: 500;
        }
        .reign-year {
          font-size: 0.78rem;
          color: #4a8a4a;
          letter-spacing: 0.08em;
        }
        .expand-arrow { color: #2e6a2e; font-size: 0.7rem; }

        .card-body {
          padding: 0 1.5rem 1.5rem;
          border-top: 1px solid #1a3a1a;
          padding-top: 1.3rem;
        }

        /* Photo grid */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.2rem;
        }
        .photo-frame img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 1px;
          border: 1px solid #1a3a1a;
          filter: saturate(0.85) brightness(0.95);
          transition: filter 0.3s;
        }
        .photo-frame img:hover { filter: saturate(1.1) brightness(1.05); }
        .photo-caption {
          font-size: 0.72rem;
          color: #5a8a5a;
          margin-top: 0.3rem;
          font-style: italic;
          text-align: center;
        }

        .story-text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: #9acc8a;
          margin-bottom: 1rem;
          white-space: pre-wrap;
        }

        .frogs-spotted {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0f2a0f;
          border: 1px solid #1e4a1e;
          padding: 0.4rem 0.9rem;
          border-radius: 2px;
          margin-bottom: 1rem;
        }
        .spotted-label { font-size: 0.8rem; color: #5a8a5a; }
        .spotted-count { font-family: 'Cinzel Decorative', serif; color: #7aff4a; font-size: 1rem; }

        .royal-message {
          background: #080f08;
          border-left: 3px solid #2a5a2a;
          padding: 1rem 1.2rem;
          margin-top: 0.5rem;
          border-radius: 0 2px 2px 0;
        }
        .message-label {
          font-size: 0.72rem;
          color: #4a7a4a;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .message-text {
          font-style: italic;
          color: #8acc78;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #3a6a3a;
        }
        .empty-state .big-frog { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .empty-state p { font-style: italic; line-height: 1.7; }

        /* Form */
        .add-reign-form {
          background: #0a1a0a;
          border: 1px solid #2a5a2a;
          border-radius: 2px;
          padding: 2rem;
          margin-bottom: 2rem;
          animation: fadeInUp 0.3s ease;
        }
        .form-title {
          font-family: 'Cinzel Decorative', serif;
          color: #c0e8b0;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .form-grid { display: flex; flex-direction: column; gap: 1rem; }
        .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .form-group label {
          font-size: 0.75rem;
          color: #4a8a4a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .form-group input, .form-group textarea {
          background: #050f05;
          border: 1px solid #1e4a1e;
          border-radius: 1px;
          color: #b0d8a8;
          font-family: 'Lora', Georgia, serif;
          font-size: 0.9rem;
          padding: 0.6rem 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          resize: vertical;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: #3a7a3a; }
        .form-group input::placeholder, .form-group textarea::placeholder { color: #2a5a2a; }

        .photo-upload-area { display: flex; flex-direction: column; gap: 0.6rem; }
        .upload-btn {
          background: #0d1f0d;
          border: 1px dashed #2a5a2a;
          color: #5a9a5a;
          font-family: 'Lora', serif;
          font-size: 0.85rem;
          padding: 0.7rem;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
        }
        .upload-btn:hover { background: #0f2a0f; color: #7aaa7a; }
        .photo-url-row { display: flex; gap: 0.5rem; }
        .photo-url-row input { flex: 1; }
        .add-url-btn {
          background: #1a3a1a;
          border: 1px solid #2a5a2a;
          color: #7aaa7a;
          font-family: 'Lora', serif;
          font-size: 0.8rem;
          padding: 0 0.8rem;
          cursor: pointer;
          border-radius: 1px;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .add-url-btn:hover { background: #1f4a1f; }

        .photo-previews { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.75rem; }
        .photo-preview {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 120px;
          gap: 0.3rem;
        }
        .photo-preview img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border: 1px solid #1e4a1e;
          border-radius: 1px;
        }
        .photo-preview input {
          font-size: 0.7rem !important;
          padding: 0.3rem 0.5rem !important;
        }
        .remove-photo {
          position: absolute;
          top: 3px;
          right: 3px;
          background: #1a0000cc;
          border: none;
          color: #ff7070;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }
        .cancel-btn {
          background: none;
          border: 1px solid #1e4a1e;
          color: #4a7a4a;
          font-family: 'Lora', serif;
          font-size: 0.85rem;
          padding: 0.7rem 1.5rem;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
        }
        .cancel-btn:hover { color: #6a9a6a; border-color: #2a5a2a; }
        .submit-btn {
          background: linear-gradient(135deg, #1a4a1a, #2a6a2a);
          border: 1px solid #4aaa4a;
          color: #b8f0b0;
          font-family: 'Cinzel Decorative', serif;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          padding: 0.7rem 1.5rem;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          box-shadow: 0 0 20px #2a6a2a66;
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Footer */
        .legacy-footer {
          text-align: center;
          padding-top: 3rem;
          color: #2a5a2a;
          font-size: 0.78rem;
          font-style: italic;
          letter-spacing: 0.05em;
        }

        /* Loading */
        .loading {
          text-align: center;
          padding: 5rem;
          color: #2a5a2a;
          font-size: 2rem;
          animation: blink 1.5s ease-in-out infinite;
        }

        @media (max-width: 500px) {
          .form-row { grid-template-columns: 1fr; }
          .photo-url-row { flex-direction: column; }
        }
      `}</style>

      <div className="app">
        {fireflies.map((f, i) => (
          <Firefly key={i} style={{ top: f.top, left: f.left, "--delay": f.animationDelay, "--dur": f.animationDuration }} />
        ))}
        {floatingFrogs.map((f, i) => (
          <FloatingFrog key={i} style={{ ...f, animationDelay: f.animationDelay }} />
        ))}

        <div className="container">
          <div className="hero">
            <span className="crown-emoji">👑</span>
            <h1 className="hero-title">Frogarchy</h1>
            <div className="hero-subtitle">Electric Forest · A Crown Without a Kingdom</div>
            <div className="divider">🐸</div>
            <p className="hero-lore">
              Somewhere in the forest, a handmade paper mâché frog crown rests upon a new head each year. 
              It was not bought. It was not planned. It was left — with love — for whoever the forest chose. 
              This is where those stories live.
            </p>
          </div>

          {!showForm && (
            <button className="claim-btn" onClick={() => setShowForm(true)}>
              🐸 I Wear the Crown — Claim My Reign 🐸
            </button>
          )}

          {showForm && (
            <AddReignForm onAdd={addReign} onCancel={() => setShowForm(false)} />
          )}

          <div className="reigns-section">
            {!loaded ? (
              <div className="loading">🐸</div>
            ) : reigns.length === 0 ? (
              <div className="empty-state">
                <span className="big-frog">🐸</span>
                <p>The legacy begins with you.<br />The first chapter is unwritten.</p>
              </div>
            ) : (
              <>
                <div className="section-title">The Frogarchy Chronicles</div>
                {reigns.map((reign, i) => (
                  <RoyalCard key={reign.timestamp || i} reign={reign} index={i} isFirst={i === 0} />
                ))}
              </>
            )}
          </div>

          <div className="legacy-footer">
            May the forest keep choosing wisely. 🐸<br />
            The crown belongs to no one — and everyone.
          </div>
        </div>
      </div>
    </>
  );
}
