import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { get } from "../api/client";
import { Character } from "../types";

function keyOf(c: Character) {
  return encodeURIComponent(`${c.name}-${c.actor ?? "NA"}`);
}

export default function ListPage() {
  const [all, setAll] = useState<Character[]>([]);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "name";  // name | house
  const order = params.get("order") ?? "asc"; // asc | desc

  useEffect(() => {
    get<Character[]>("/characters").then(setAll).catch(() => setAll([]));
  }, []);

const items = useMemo(() => {
  const filtered = all.filter(c => {
    const text = `${c.name} ${c.actor ?? ""} ${c.house ?? ""}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const houseKey = (c: Character) => (c.house ?? "").toLowerCase();
  const nameKey  = (c: Character) => (c.name  ?? "").toLowerCase();

  filtered.sort((a, b) => {
    if (sort === "house") {
      const au = houseKey(a) === "";
      const bu = houseKey(b) === "";
      if (au !== bu) return au ? 1 : -1;

      const cmp = houseKey(a).localeCompare(houseKey(b));
      return order === "asc" ? cmp : -cmp;
    } else {
      const cmp = nameKey(a).localeCompare(nameKey(b));
      return order === "asc" ? cmp : -cmp;
    }
  });

  return filtered;
}, [all, q, sort, order]);


  return (
    <section>
      <h2>Characters — List</h2>

      <div className="toolbar toolbar--center">
        <input
            className="search-input"
            placeholder="Search by name / actor / house..."
            value={q}
            onChange={(e) => { params.set("q", e.target.value); setParams(params, { replace: true }); }}
            aria-label="Search characters"
        />
        <div className="controls">
            <select value={sort} onChange={(e)=>{ params.set("sort", e.target.value); setParams(params); }}>
              <option value="name">Sort by Name</option>
              <option value="house">Sort by House</option>
            </select>
            <select value={order} onChange={(e)=>{ params.set("order", e.target.value); setParams(params); }}>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
        </div>
        </div>

      <ul className="list">
        {items.map((c, idx) => (
          <li key={keyOf(c)} className="row">
            <div className="row-main">
              <strong>{c.name}</strong>
              <span className="muted">{c.actor ?? "Unknown actor"}</span>
              <span className={`tag ${c.house ?? "None"}`}>{c.house ?? "No House"}</span>
            </div>
            <Link
              to={`/character/${keyOf(c)}`}
              state={{ keys: items.map(keyOf), index: idx, from: "list" }}
              className="btn"
            >
              Details →
            </Link>
          </li>
        ))}
      </ul>

      {items.length === 0 && <p className="muted">No results.</p>}
    </section>
  );
}
