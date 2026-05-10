import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

function useFadeUp() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("fade-up--visible"); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const RSVP_URL = "https://functions.poehali.dev/9c6624c2-0e9a-428d-8165-89f64ab6c4e8";

const HERO_IMG        = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/5db35806-c75c-407e-9a4f-2233ed2f9d39.jpg";
const GYPSOPHILA_IMG  = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/cbe036f9-9c3d-4d1b-9561-07c6d641373e.jpg";
const CHANDELIER_IMG  = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/d54d25b7-08dc-4fdd-9f1e-7f962b0b9b9f.jpg";

const WEDDING_DATE = new Date("2026-07-04T16:00:00");

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, WEDDING_DATE.getTime() - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(Math.max(0, WEDDING_DATE.getTime() - Date.now())), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    days:    Math.floor(timeLeft / 86400000),
    hours:   Math.floor((timeLeft % 86400000) / 3600000),
    minutes: Math.floor((timeLeft % 3600000) / 60000),
    seconds: Math.floor((timeLeft % 60000) / 1000),
  };
}

const schedule = [
  { time: "16:00", title: "Сбор гостей",    desc: "Фуршет" },
  { time: "16:30", title: "Церемония",       desc: "Торжественная регистрация брака" },
  { time: "17:30", title: "Банкет",          desc: "Праздничный ужин и первые танцы" },
  { time: "22:00", title: "Вечеринка",       desc: "Танцы и музыка" },
];

const menuOptions = [
  { id: "red_wine",   label: "Вино красное" },
  { id: "white_wine", label: "Вино белое" },
  { id: "whiskey",    label: "Виски" },
  { id: "vodka",      label: "Водка" },
  { id: "martini",    label: "Мартини" },
];

type FormState = "idle" | "loading" | "success";

export default function Index() {
  const [form, setForm] = useState({
    name: "", guests: "1", drinks: [] as string[],
    attending: "yes", guestName: "", guestDrinks: [] as string[], track: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const { days, hours, minutes, seconds } = useCountdown();
  const refWhen     = useFadeUp();
  const refProgram  = useFadeUp();
  const refRsvp     = useFadeUp();
  const refContacts = useFadeUp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleDrink = (field: "drinks" | "guestDrinks", id: string) =>
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(id) ? prev[field].filter((x) => x !== id) : [...prev[field], id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    try {
      await fetch(RSVP_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setFormState("success");
    } catch { setFormState("success"); }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="eng-root">

      {/* ── HERO ── */}
      <section className="eng-hero">
        <div className="eng-hero__bg" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="eng-hero__overlay" />
        <div className="eng-hero__content">
          <p className="eng-eyebrow">We joyfully invite you to celebrate</p>
          <h1 className="eng-hero__names">
            Александр
            <span className="eng-hero__amp">& </span>
            Виктория
          </h1>
          <div className="eng-hero__rule">
            <div className="eng-hero__rule-diamond" />
          </div>
          <p className="eng-hero__date">4 · July · 2026</p>
          <p className="eng-hero__sub">Разделите с нами этот особенный день</p>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <div className="eng-countdown">
              <div className="eng-countdown__item">
                <span className="eng-countdown__num">{pad(days)}</span>
                <span className="eng-countdown__label">дней</span>
              </div>
              <div className="eng-countdown__sep">:</div>
              <div className="eng-countdown__item">
                <span className="eng-countdown__num">{pad(hours)}</span>
                <span className="eng-countdown__label">часов</span>
              </div>
              <div className="eng-countdown__sep">:</div>
              <div className="eng-countdown__item">
                <span className="eng-countdown__num">{pad(minutes)}</span>
                <span className="eng-countdown__label">минут</span>
              </div>
              <div className="eng-countdown__sep">:</div>
              <div className="eng-countdown__item">
                <span className="eng-countdown__num">{pad(seconds)}</span>
                <span className="eng-countdown__label">секунд</span>
              </div>
            </div>
          </div>
        </div>
        <a href="#when" className="eng-scroll-hint">
          <Icon name="ChevronDown" size={26} />
        </a>
      </section>

      {/* ── GYPSOPHILA ── */}
      <div className="eng-gypsophila">
        <img src={GYPSOPHILA_IMG} alt="" />
      </div>

      {/* ── КОГДА & ГДЕ ── */}
      <section ref={refWhen as React.RefObject<HTMLElement>} className="eng-section eng-section--white fade-up" id="when">
        <div className="eng-container eng-two-col">
          <div className="eng-info-card">
            <span className="eng-info-card__title">Когда</span>
            <p className="eng-info-card__big">4 июля 2026</p>
            <p className="eng-info-card__sub">Суббота · Начало в 16:00</p>
          </div>
          <div className="eng-info-card">
            <span className="eng-info-card__title">Где</span>
            <p className="eng-info-card__big">Вилла «Небеса»</p>
            <p className="eng-info-card__sub">Казань, ул. Техническая, 4Б</p>
            <a href="https://maps.google.com/?q=Казань+Техническая+4Б" target="_blank" rel="noopener noreferrer" className="eng-map-btn">
              <Icon name="MapPin" size={14} />
              Открыть карту
            </a>
          </div>
        </div>
      </section>

      {/* ── CHANDELIER ── */}
      <div className="eng-chandelier">
        <img src={CHANDELIER_IMG} alt="" />
      </div>

      {/* ── ПРОГРАММА ── */}
      <section ref={refProgram as React.RefObject<HTMLElement>} className="eng-section eng-section--ivory fade-up" id="program">
        <div className="eng-container eng-container--narrow">
          <div className="eng-center">
            <span className="eng-overline">День свадьбы</span>
            <h2 className="eng-title">Программа</h2>
            <div className="eng-rule eng-rule--center">
              <div className="eng-rule__diamond" />
            </div>
          </div>
          <div className="eng-timeline">
            {schedule.map((item, i) => (
              <div className="eng-timeline__item" key={i}>
                <div className="eng-timeline__time">{item.time}</div>
                <div className="eng-timeline__dot" />
                <div>
                  <p className="eng-timeline__event">{item.title}</p>
                  <p className="eng-timeline__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GYPSOPHILA ── */}
      <div className="eng-gypsophila">
        <img src={GYPSOPHILA_IMG} alt="" />
      </div>

      {/* ── RSVP ── */}
      <section ref={refRsvp as React.RefObject<HTMLElement>} className="eng-section eng-section--paper fade-up" id="rsvp">
        <div className="eng-container eng-container--narrow">
          <div className="eng-center">
            <span className="eng-overline">Ответ гостя</span>
            <h2 className="eng-title">Подтверждение</h2>
            <div className="eng-rule eng-rule--center">
              <div className="eng-rule__diamond" />
            </div>
          </div>
          <p className="eng-rsvp__hint">Пожалуйста, подтвердите ваше присутствие до 1 июня 2026</p>

          {formState === "success" ? (
            <div className="eng-rsvp__success">
              <div className="eng-rsvp__success-icon">✦</div>
              <h3>Благодарим вас</h3>
              <p>Мы получили ваш ответ и с нетерпением ждём встречи</p>
            </div>
          ) : (
            <form className="eng-form" onSubmit={handleSubmit}>
              <div className="eng-form__field">
                <label>Вы придёте?</label>
                <div className="eng-radio-group">
                  <label className={`eng-radio ${form.attending === "yes" ? "active" : ""}`}>
                    <input type="radio" name="attending" value="yes" checked={form.attending === "yes"} onChange={handleChange} />
                    С радостью приду
                  </label>
                  <label className={`eng-radio ${form.attending === "no" ? "active" : ""}`}>
                    <input type="radio" name="attending" value="no" checked={form.attending === "no"} onChange={handleChange} />
                    К сожалению, не смогу
                  </label>
                </div>
              </div>

              <div className="eng-form__field">
                <label htmlFor="name">Ваше имя *</label>
                <input id="name" name="name" type="text" placeholder="Имя и фамилия" value={form.name} onChange={handleChange} required />
              </div>

              {form.attending === "yes" && (
                <>
                  <div className="eng-form__field">
                    <label>Предпочитаемый напиток</label>
                    <div className="eng-chips">
                      {menuOptions.map((m) => (
                        <button key={m.id} type="button"
                          className={`eng-chip ${form.drinks.includes(m.id) ? "eng-chip--active" : ""}`}
                          onClick={() => toggleDrink("drinks", m.id)}
                        >{m.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="eng-form__field">
                    <label htmlFor="guests">Количество гостей</label>
                    <select id="guests" name="guests" value={form.guests} onChange={handleChange}>
                      <option value="1">Только я</option>
                      <option value="2">Я + 1 гость</option>
                    </select>
                  </div>

                  {form.guests === "2" && (
                    <div className="eng-guest2-block">
                      <p className="eng-guest2-block__title">Данные второго гостя</p>
                      <div className="eng-form__field">
                        <label htmlFor="guestName">Имя гостя *</label>
                        <input id="guestName" name="guestName" type="text" placeholder="Имя и фамилия"
                          value={form.guestName} onChange={handleChange} required />
                      </div>
                      <div className="eng-form__field">
                        <label>Предпочитаемый напиток</label>
                        <div className="eng-chips">
                          {menuOptions.map((m) => (
                            <button key={m.id} type="button"
                              className={`eng-chip ${form.guestDrinks.includes(m.id) ? "eng-chip--active" : ""}`}
                              onClick={() => toggleDrink("guestDrinks", m.id)}
                            >{m.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="eng-form__field">
                <label htmlFor="track">Трек, который хотели бы услышать на свадьбе</label>
                <input id="track" name="track" type="text" placeholder="Исполнитель — Название песни"
                  value={form.track} onChange={handleChange} />
              </div>

              <button type="submit" className="eng-submit" disabled={formState === "loading"}>
                {formState === "loading" ? (
                  <span className="eng-submit__loading">
                    <Icon name="Loader2" size={16} />
                    Отправляем...
                  </span>
                ) : form.attending === "yes" ? "Подтвердить присутствие" : "Отправить ответ"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section ref={refContacts as React.RefObject<HTMLElement>} className="eng-section eng-section--white fade-up" id="contacts">
        <div className="eng-container eng-container--narrow eng-center">
          <span className="eng-overline">Есть вопросы?</span>
          <h2 className="eng-title">Контакты</h2>
          <div className="eng-rule eng-rule--center">
            <div className="eng-rule__diamond" />
          </div>
          <p className="eng-contacts__text">Мы с радостью ответим на все ваши вопросы</p>
          <div className="eng-contacts-list">
            <a href="tel:+79872101312" className="eng-contact-item">
              <Icon name="Phone" size={18} />
              <div>
                <span className="eng-contact-item__name">Александр</span>
                <span>+7 (987) 210-13-12</span>
              </div>
            </a>
            <a href="tel:+79274473211" className="eng-contact-item">
              <Icon name="Phone" size={18} />
              <div>
                <span className="eng-contact-item__name">Виктория</span>
                <span>+7 (927) 447-32-11</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="eng-footer">
        <div className="eng-footer__gypsophila">
          <img src={GYPSOPHILA_IMG} alt="" />
        </div>
        <p className="eng-footer__names">Александр & Виктория</p>
        <p className="eng-footer__date">4 · 07 · 2026</p>
        <p className="eng-footer__tagline">С любовью ждём вас</p>
      </footer>

    </div>
  );
}