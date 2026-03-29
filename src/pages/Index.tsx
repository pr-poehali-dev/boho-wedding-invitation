import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

function useFadeUp() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("fade-up--visible"); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const RSVP_URL = "https://functions.poehali.dev/9c6624c2-0e9a-428d-8165-89f64ab6c4e8";

const HERO_IMG = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/5db35806-c75c-407e-9a4f-2233ed2f9d39.jpg";
const FLORAL_DIVIDER = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/4724a437-3f87-4ca4-96da-596aa2e75a81.jpg";

const schedule = [
  { time: "14:00", title: "Сбор гостей", desc: "Приветственные напитки и фотозона" },
  { time: "15:00", title: "Церемония", desc: "Торжественная регистрация брака" },
  { time: "16:00", title: "Фуршет", desc: "Лёгкие закуски, игристое, фотосессия" },
  { time: "17:30", title: "Банкет", desc: "Праздничный ужин и первые танцы" },
  { time: "20:00", title: "Торт", desc: "Разрезание свадебного торта" },
  { time: "21:00", title: "Вечеринка", desc: "Живая музыка и танцы до рассвета" },
];

const menuOptions = [
  { id: "red_wine", label: "Вино красное" },
  { id: "white_wine", label: "Вино белое" },
  { id: "whiskey", label: "Виски" },
  { id: "vodka", label: "Водка" },
];

type FormState = "idle" | "loading" | "success";

export default function Index() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    guests: "1",
    menu: "red_wine",
    dietNote: "",
    attending: "yes",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const refWhen = useFadeUp();
  const refProgram = useFadeUp();
  const refRsvp = useFadeUp();
  const refContacts = useFadeUp();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    try {
      await fetch(RSVP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setFormState("success");
    } catch {
      setFormState("success");
    }
  };

  return (
    <div className="boho-root">
      {/* ── HERO ── */}
      <section className="boho-hero">
        <div
          className="boho-hero__bg"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="boho-hero__overlay" />
        <div className="boho-hero__content">
          <p className="boho-eyebrow">Мы счастливы пригласить вас</p>
          <h1 className="boho-hero__names">
            Александр
            <span className="boho-hero__amp"> & </span>
            Виктория
          </h1>
          <div className="boho-hero__divider" />
          <p className="boho-hero__date">4 июля 2026</p>
          <p className="boho-hero__sub">Разделите с нами этот особенный день</p>
        </div>
        <a href="#when" className="boho-scroll-hint">
          <Icon name="ChevronDown" size={28} />
        </a>
      </section>

      {/* ── DIVIDER ── */}
      <div className="boho-divider">
        <img src={FLORAL_DIVIDER} alt="" />
      </div>

      {/* ── ДАТА & МЕСТО ── */}
      <section ref={refWhen as React.RefObject<HTMLElement>} className="boho-section boho-section--cream fade-up" id="when">
        <div className="boho-container boho-two-col">
          <div className="boho-info-card">
            <h2 className="boho-section__title">Когда</h2>
            <p className="boho-info-card__big">4 июля 2026</p>
            <p className="boho-info-card__sub">Суббота · Начало в 14:00</p>
          </div>
          <div className="boho-info-card">
            <h2 className="boho-section__title">Где</h2>
            <p className="boho-info-card__big">Вилла «Небеса»</p>
            <p className="boho-info-card__sub">Казань, ул. Техническая, 4Б</p>
            <a
              href="https://maps.google.com/?q=Казань+Техническая+4Б"
              target="_blank"
              rel="noopener noreferrer"
              className="boho-map-btn"
            >
              <Icon name="MapPin" size={16} />
              Открыть карту
            </a>
          </div>
        </div>

      </section>

      {/* ── DIVIDER ── */}
      <div className="boho-divider flipped">
        <img src={FLORAL_DIVIDER} alt="" />
      </div>

      {/* ── ПРОГРАММА ── */}
      <section ref={refProgram as React.RefObject<HTMLElement>} className="boho-section boho-section--rose fade-up" id="program">
        <div className="boho-container boho-container--narrow">
          <p className="boho-eyebrow boho-eyebrow--center">День свадьбы</p>
          <h2 className="boho-section__title boho-section__title--center">Программа</h2>
          <div className="boho-timeline">
            {schedule.map((item, i) => (
              <div className="boho-timeline__item" key={i}>
                <div className="boho-timeline__time">{item.time}</div>
                <div className="boho-timeline__dot" />
                <div className="boho-timeline__body">
                  <p className="boho-timeline__event">{item.title}</p>
                  <p className="boho-timeline__desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="boho-divider">
        <img src={FLORAL_DIVIDER} alt="" />
      </div>

      {/* ── RSVP ── */}
      <section ref={refRsvp as React.RefObject<HTMLElement>} className="boho-section boho-section--sage fade-up" id="rsvp">
        <div className="boho-container boho-container--narrow">
          <p className="boho-eyebrow boho-eyebrow--center">Ответ гостя</p>
          <h2 className="boho-section__title boho-section__title--center">Подтверждение</h2>
          <p className="boho-rsvp__hint">
            Пожалуйста, подтвердите ваше присутствие до 1 июня 2026
          </p>

          {formState === "success" ? (
            <div className="boho-rsvp__success">
              <div className="boho-rsvp__success-icon">🌸</div>
              <h3>Спасибо!</h3>
              <p>Мы получили ваш ответ и с нетерпением ждём встречи!</p>
            </div>
          ) : (
            <form className="boho-form" onSubmit={handleSubmit}>
              <div className="boho-form__field">
                <label>Вы придёте?</label>
                <div className="boho-radio-group">
                  <label className={`boho-radio ${form.attending === "yes" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="attending"
                      value="yes"
                      checked={form.attending === "yes"}
                      onChange={handleChange}
                    />
                    С радостью приду
                  </label>
                  <label className={`boho-radio ${form.attending === "no" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="attending"
                      value="no"
                      checked={form.attending === "no"}
                      onChange={handleChange}
                    />
                    К сожалению, не смогу
                  </label>
                </div>
              </div>

              <div className="boho-form__row">
                <div className="boho-form__field">
                  <label htmlFor="name">Ваше имя *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Имя и фамилия"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="boho-form__field">
                  <label htmlFor="phone">Телефон *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+7 (999) 000-00-00"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {form.attending === "yes" && (
                <>
                  <div className="boho-form__row">
                    <div className="boho-form__field">
                      <label htmlFor="guests">Количество гостей</label>
                      <select id="guests" name="guests" value={form.guests} onChange={handleChange}>
                        <option value="1">Только я</option>
                        <option value="2">Я + 1 гость</option>
                        <option value="3">Я + 2 гостя</option>
                      </select>
                    </div>
                    <div className="boho-form__field">
                      <label htmlFor="menu">Предпочитаемый алкоголь</label>
                      <select id="menu" name="menu" value={form.menu} onChange={handleChange}>
                        {menuOptions.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="boho-form__field">
                    <label htmlFor="dietNote">Пищевые ограничения или аллергии</label>
                    <textarea
                      id="dietNote"
                      name="dietNote"
                      placeholder="Укажите, если есть..."
                      value={form.dietNote}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="boho-submit" disabled={formState === "loading"}>
                {formState === "loading" ? (
                  <span className="boho-submit__loading">
                    <Icon name="Loader2" size={18} />
                    Отправляем...
                  </span>
                ) : form.attending === "yes" ? (
                  "Подтвердить присутствие"
                ) : (
                  "Отправить ответ"
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section ref={refContacts as React.RefObject<HTMLElement>} className="boho-section boho-section--cream fade-up" id="contacts">
        <div className="boho-container boho-container--narrow boho-center">
          <p className="boho-eyebrow boho-eyebrow--center">Есть вопросы?</p>
          <h2 className="boho-section__title boho-section__title--center">Контакты</h2>
          <p className="boho-contacts__text">Мы с радостью ответим на все ваши вопросы</p>
          <div className="boho-contacts-list">
            <a href="tel:+79872101312" className="boho-contact-item">
              <Icon name="Phone" size={20} />
              <div>
                <span className="boho-contact-item__name">Александр</span>
                <span>+7 (987) 210-13-12</span>
              </div>
            </a>
            <a href="tel:+79274473211" className="boho-contact-item">
              <Icon name="Phone" size={20} />
              <div>
                <span className="boho-contact-item__name">Виктория</span>
                <span>+7 (927) 447-32-11</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="boho-footer">
        <div className="boho-divider boho-divider--sm">
          <img src={FLORAL_DIVIDER} alt="" />
        </div>
        <p className="boho-footer__names">Александр & Виктория</p>
        <p className="boho-footer__date">4 · 07 · 2026</p>
        <p className="boho-footer__tagline">С любовью ждём вас</p>
      </footer>
    </div>
  );
}