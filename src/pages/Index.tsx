import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/18e4a4df-9420-4450-8fdc-cb4ce053bbb9.jpg";
const FLORAL_DIVIDER = "https://cdn.poehali.dev/projects/92bc181d-cd5b-4eef-b748-686b087dabef/files/2c7e7619-b432-4db2-b69d-59615321ccfc.jpg";

const schedule = [
  { time: "14:00", title: "Сбор гостей", desc: "Приветственные напитки и фотозона" },
  { time: "15:00", title: "Церемония", desc: "Торжественная регистрация брака" },
  { time: "16:00", title: "Фуршет", desc: "Лёгкие закуски, игристое, фотосессия" },
  { time: "17:30", title: "Банкет", desc: "Праздничный ужин и первые танцы" },
  { time: "20:00", title: "Торт", desc: "Разрезание свадебного торта" },
  { time: "21:00", title: "Вечеринка", desc: "Живая музыка и танцы до рассвета" },
];

const menuOptions = [
  { id: "meat", label: "Мясное меню" },
  { id: "fish", label: "Рыбное меню" },
  { id: "veg", label: "Вегетарианское меню" },
];

type FormState = "idle" | "loading" | "success";

export default function Index() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    guests: "1",
    menu: "meat",
    dietNote: "",
    attending: "yes",
  });
  const [formState, setFormState] = useState<FormState>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    setTimeout(() => setFormState("success"), 1200);
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
      <section className="boho-section boho-section--cream" id="when">
        <div className="boho-container boho-two-col">
          <div className="boho-info-card">
            <span className="boho-info-card__icon">🌸</span>
            <h2 className="boho-section__title">Когда</h2>
            <p className="boho-info-card__big">4 июля 2026</p>
            <p className="boho-info-card__sub">Суббота · Начало в 14:00</p>
          </div>
          <div className="boho-info-card">
            <span className="boho-info-card__icon">🌿</span>
            <h2 className="boho-section__title">Где</h2>
            <p className="boho-info-card__big">Усадьба «Берёзовая роща»</p>
            <p className="boho-info-card__sub">Рублёво-Успенское ш., 42, Подмосковье</p>
            <a
              href="https://maps.google.com/?q=Рублёво-Успенское+шоссе+42+Подмосковье"
              target="_blank"
              rel="noopener noreferrer"
              className="boho-map-btn"
            >
              <Icon name="MapPin" size={16} />
              Открыть карту
            </a>
          </div>
        </div>
        <div className="boho-container boho-map-wrap">
          <div className="boho-map-placeholder">
            <Icon name="MapPin" size={40} />
            <p>Усадьба «Берёзовая роща»</p>
            <p className="boho-map-placeholder__sub">Рублёво-Успенское ш., 42</p>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="boho-divider flipped">
        <img src={FLORAL_DIVIDER} alt="" />
      </div>

      {/* ── ПРОГРАММА ── */}
      <section className="boho-section boho-section--rose" id="program">
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

      {/* ── ПОДАРКИ ── */}
      <section className="boho-section boho-section--cream" id="gifts">
        <div className="boho-container boho-container--narrow">
          <p className="boho-eyebrow boho-eyebrow--center">Наши пожелания</p>
          <h2 className="boho-section__title boho-section__title--center">Подарки</h2>
          <p className="boho-gifts__text">
            Самый дорогой подарок для нас — ваше присутствие. Если вы хотите порадовать нас чем-то
            особенным, мы будем благодарны за денежный подарок на исполнение наших общих мечт.
          </p>
          <div className="boho-gifts-grid">
            <div className="boho-gift-card">
              <span>💳</span>
              <h3>Денежный подарок</h3>
              <p>Переведите на карту или вручите в конверте на торжестве</p>
            </div>
            <div className="boho-gift-card">
              <span>✈️</span>
              <h3>Медовый месяц</h3>
              <p>Мы мечтаем о путешествии — любой вклад будет очень дорог</p>
            </div>
            <div className="boho-gift-card">
              <span>🌺</span>
              <h3>Живые цветы</h3>
              <p>Выбирайте полевые цветы и пастельные тона</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="boho-divider flipped">
        <img src={FLORAL_DIVIDER} alt="" />
      </div>

      {/* ── RSVP ── */}
      <section className="boho-section boho-section--sage" id="rsvp">
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
                    С радостью приду 🌿
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
                      <label htmlFor="menu">Предпочтение меню</label>
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
      <section className="boho-section boho-section--cream" id="contacts">
        <div className="boho-container boho-container--narrow boho-center">
          <p className="boho-eyebrow boho-eyebrow--center">Есть вопросы?</p>
          <h2 className="boho-section__title boho-section__title--center">Контакты</h2>
          <p className="boho-contacts__text">Мы с радостью ответим на все ваши вопросы</p>
          <div className="boho-contacts-list">
            <a href="tel:+79990001122" className="boho-contact-item">
              <Icon name="Phone" size={20} />
              <div>
                <span className="boho-contact-item__name">Александр</span>
                <span>+7 (999) 000-11-22</span>
              </div>
            </a>
            <a href="tel:+79993334455" className="boho-contact-item">
              <Icon name="Phone" size={20} />
              <div>
                <span className="boho-contact-item__name">Виктория</span>
                <span>+7 (999) 333-44-55</span>
              </div>
            </a>
            <a href="mailto:wedding@example.com" className="boho-contact-item">
              <Icon name="Mail" size={20} />
              <div>
                <span className="boho-contact-item__name">Почта</span>
                <span>wedding@example.com</span>
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
