import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { get } from "../api/client";
import { Character } from "../types";
import { characterImageURL } from "../utils/image";

const HOUSES = ["gryffindor","slytherin","ravenclaw","hufflepuff"];

function keyOf(c: Character) {
  return encodeURIComponent(`${c.name}-${c.actor ?? "NA"}`);
}

export default function GalleryPage() {
  const [all, setAll] = useState<Character[]>([]);
  const [params, setParams] = useSearchParams();
  const house = params.get("house") ?? "";

  useEffect(() => {
    const url = house ? `/characters/house/${house}` : "/characters";
    get<Character[]>(url).then(setAll).catch(() => setAll([]));
  }, [house]);

  const shown = useMemo(() => all, [all]);

  return (
    <section>
      <h2>Characters — Gallery</h2>

      <div className="toolbar">
        <select value={house} onChange={(e)=>{ params.set("house", e.target.value); setParams(params); }}>
          <option value="">All Houses</option>
          {HOUSES.map(h => <option key={h} value={h}>{h[0].toUpperCase()+h.slice(1)}</option>)}
        </select>
      </div>

      <div className="gallery-grid">
        {shown.map((c, idx) => (
          <Link
            key={keyOf(c)}
            to={`/character/${keyOf(c)}`}
            state={{ keys: shown.map(keyOf), index: idx, from: "gallery" }}
            className="gallery-card"
            title={`${c.name} • ${c.house ?? "No House"}`}
          >
            <figure className="gallery-figure">
              <img src={characterImageURL(c)} alt={c.name} className="gallery-img" />
              <figcaption className="gallery-cap">
                <strong>{c.name}</strong>
                <span className="muted">{c.house ?? "No House"}</span>
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>

      {shown.length === 0 && <p className="muted">No images available.</p>}
    </section>
  );
}
