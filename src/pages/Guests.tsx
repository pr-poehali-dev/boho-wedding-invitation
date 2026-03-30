import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const RSVP_URL = "https://functions.poehali.dev/9c6624c2-0e9a-428d-8165-89f64ab6c4e8";

const DRINK_LABELS: Record<string, string> = {
  red_wine: "Вино красное",
  white_wine: "Вино белое",
  whiskey: "Виски",
  vodka: "Водка",
  soft: "Безалкогольные",
};

interface GuestRow {
  id: number;
  submitter_name: string;
  attending: string;
  guest_name: string;
  drinks: string[];
  is_primary: boolean;
  created_at: string;
}

interface GroupedRsvp {
  submitter_name: string;
  attending: string;
  created_at: string;
  members: { name: string; drinks: string[]; is_primary: boolean }[];
}

function groupRows(rows: GuestRow[]): GroupedRsvp[] {
  const map = new Map<string, GroupedRsvp>();
  for (const row of rows) {
    const key = `${row.submitter_name}__${row.created_at}`;
    if (!map.has(key)) {
      map.set(key, {
        submitter_name: row.submitter_name,
        attending: row.attending,
        created_at: row.created_at,
        members: [],
      });
    }
    map.get(key)!.members.push({
      name: row.guest_name,
      drinks: row.drinks || [],
      is_primary: row.is_primary,
    });
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PASSWORD = "04.07.2026";
const STORAGE_KEY = "guests_auth";

function PasswordGate({ onEnter }: { onEnter: () => void }) {
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  const submit = () => {
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      onEnter();
    } else {
      setWrong(true);
      setValue("");
    }
  };

  return (
    <div className="guests-gate">
      <div className="guests-gate__box">
        <p className="guests-gate__title">Список гостей</p>
        <p className="guests-gate__hint">Введите пароль для доступа</p>
        <input
          className={`guests-gate__input${wrong ? " guests-gate__input--error" : ""}`}
          type="password"
          placeholder="Пароль"
          value={value}
          onChange={(e) => { setValue(e.target.value); setWrong(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        {wrong && <p className="guests-gate__error">Неверный пароль</p>}
        <button className="guests-gate__btn" onClick={submit}>Войти</button>
      </div>
    </div>
  );
}

export default function Guests() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem(STORAGE_KEY) === "1");
  const [rows, setRows] = useState<GuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(RSVP_URL);
      const data = await res.json();
      setRows(typeof data === "string" ? JSON.parse(data) : data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const groups = groupRows(rows);
  const coming = groups.filter((g) => g.attending === "yes");
  const notComing = groups.filter((g) => g.attending !== "yes");
  const totalPeople = coming.reduce((s, g) => s + g.members.length, 0);

  return (
    <div className="guests-page">
      <div className="guests-header">
        <a href="/" className="guests-back">
          <Icon name="ArrowLeft" size={18} />
          На главную
        </a>
        <h1 className="guests-title">Ответы гостей</h1>
        <button className="guests-refresh" onClick={load}>
          <Icon name="RefreshCw" size={16} />
        </button>
      </div>

      {loading && (
        <div className="guests-loading">
          <Icon name="Loader2" size={32} />
          <p>Загружаем список…</p>
        </div>
      )}

      {error && (
        <div className="guests-error">
          <Icon name="AlertCircle" size={24} />
          <p>Не удалось загрузить данные</p>
          <button onClick={load}>Попробовать снова</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="guests-stats">
            <div className="guests-stat">
              <span className="guests-stat__num">{coming.length}</span>
              <span className="guests-stat__label">подтвердили</span>
            </div>
            <div className="guests-stat guests-stat--accent">
              <span className="guests-stat__num">{totalPeople}</span>
              <span className="guests-stat__label">человек придут</span>
            </div>
            <div className="guests-stat guests-stat--muted">
              <span className="guests-stat__num">{notComing.length}</span>
              <span className="guests-stat__label">не смогут</span>
            </div>
          </div>

          {coming.length > 0 && (
            <section className="guests-section">
              <h2 className="guests-section__title">
                <Icon name="Check" size={18} />
                Придут
              </h2>
              <div className="guests-list">
                {coming.map((g, i) => (
                  <div className="guests-card" key={i}>
                    <div className="guests-card__top">
                      <span className="guests-card__name">{g.submitter_name}</span>
                      <span className="guests-card__date">{formatDate(g.created_at)}</span>
                    </div>
                    {g.members.map((m, j) => (
                      <div className="guests-card__member" key={j}>
                        <span className="guests-card__member-name">
                          {m.is_primary ? "👤" : "👥"} {m.name}
                        </span>
                        {m.drinks.length > 0 && (
                          <div className="guests-card__drinks">
                            {m.drinks.map((d) => (
                              <span key={d} className="guests-card__drink">
                                {DRINK_LABELS[d] ?? d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {notComing.length > 0 && (
            <section className="guests-section">
              <h2 className="guests-section__title guests-section__title--muted">
                <Icon name="X" size={18} />
                Не смогут
              </h2>
              <div className="guests-list">
                {notComing.map((g, i) => (
                  <div className="guests-card guests-card--muted" key={i}>
                    <div className="guests-card__top">
                      <span className="guests-card__name">{g.submitter_name}</span>
                      <span className="guests-card__date">{formatDate(g.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {groups.length === 0 && (
            <div className="guests-empty">
              <p>Пока никто не ответил</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}