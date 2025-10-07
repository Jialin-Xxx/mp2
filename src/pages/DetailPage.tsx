import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { get } from "../api/client";
import { Character } from "../types";
import { characterImageURL } from "../utils/image";

type Loc = { state?: { keys: string[]; index: number; from?: string } };

export default function DetailPage() {
  const { key } = useParams();      // name-actor 的编码串
  const nav = useNavigate();
  const loc = useLocation() as Loc;
  const keys = loc.state?.keys ?? [];
  const index = loc.state?.index ?? Math.max(0, keys.indexOf(key ?? ""));

  const [data, setData] = useState<Character | null>(null);

  useEffect(() => {
    get<Character[]>("/characters").then(all => {
      const decoded = decodeURIComponent(key ?? "");
      const [nm, ac] = decoded.split("-");
      const found = all.find(c => c.name === nm && (c.actor ?? "NA") === (ac ?? "NA"));
      setData(found ?? null);
    });
  }, [key]);

  const go = (delta: number) => {
    if (!keys.length) return;
    const nextIdx = (index + delta + keys.length) % keys.length;
    nav(`/character/${keys[nextIdx]}`, { state: { keys, index: nextIdx, from: loc.state?.from } });
  };

  if (!data) return <p>Loading…</p>;

  return (
    <article className="detail">
      <div className="detail-media">
        <img src={characterImageURL(data)} alt={data.name} />
      </div>

      <div className="detail-info">
        <h2>{data.name}</h2>
        <p className="muted">{data.actor || "Unknown actor"}</p>

        <ul className="kv">
          <li><b>House</b><span>{data.house ?? "—"}</span></li>
          <li><b>Species</b><span>{data.species ?? "—"}</span></li>
          <li><b>Gender</b><span>{data.gender ?? "—"}</span></li>
          <li><b>Patronus</b><span>{data.patronus ?? "—"}</span></li>
          <li><b>Birth</b><span>{data.dateOfBirth ?? "—"}</span></li>
          <li><b>Ancestry</b><span>{data.ancestry ?? "—"}</span></li>
          <li><b>Alive</b><span>{data.alive ? "Yes" : "No / Unknown"}</span></li>
        </ul>

        <div className="navbuttons">
          <button onClick={() => go(-1)}>← Previous</button>
          <button onClick={() => go(1)}>Next →</button>
        </div>
      </div>
    </article>
  );
}
