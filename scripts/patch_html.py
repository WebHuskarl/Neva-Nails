"""
patch_html.py — массовые правки index.html:
1. Заполняем все [плейсхолдеры] реальными данными (СПБ)
2. Убираем нумерацию [001], SRV/01, PLAN/01 и т.д.
3. Убираем SCROLL-индикатор в hero
4. Переписываем секцию «Повод» в конфигураторе
5. Вставляем карту Яндекс/OSM
"""
import pathlib, re

SRC = pathlib.Path(r'C:\Users\USERR\Desktop\Маникюр\index.html')
text = SRC.read_text(encoding='utf-8')

# ── 1. STUDIO NAME ──────────────────────────────────────────
text = text.replace('[Название студии]', 'LunaNail Studio')
text = text.replace('[Название]', 'LunaNail')
text = text.replace('NAIL STUDIO / [ГОРОД]', 'NAIL STUDIO / САНКТ-ПЕТЕРБУРГ')
text = text.replace('[Название студии] - премиум маникюрная студия. Авторский дизайн ногтей, мастера международного уровня, онлайн-запись. [Город].', 'LunaNail Studio — премиум маникюрная студия в Санкт-Петербурге. Авторский дизайн ногтей, мастера с опытом 5+ лет, медицинская стерилизация.')
text = text.replace('[Название студии] - Премиум маникюрная студия', 'LunaNail Studio — Премиум маникюр в Санкт-Петербурге')
text = text.replace('LunaNail Studio - на главную', 'LunaNail Studio — на главную')

# ── 2. HERO META ─────────────────────────────────────────────
text = text.replace('мастера с [X] лет опытом', 'мастера с 7+ лет опытом')
text = text.replace('data-counter="5">0</span>\n              <span class="hero__meta-desc">лет на рынке', 'data-counter="7">0</span>\n              <span class="hero__meta-desc">лет на рынке')
text = text.replace('data-counter="1200">0</span>\n              <span class="hero__meta-desc">клиентов в год', 'data-counter="2500">0</span>\n              <span class="hero__meta-desc">клиентов в год')

# ── 3. TRUST BAR ────────────────────────────────────────────
text = text.replace('data-counter="5" data-suffix="+">0</span>\n          <span class="trust__stat-label">лет опыта', 'data-counter="7" data-suffix="+">0</span>\n          <span class="trust__stat-label">лет опыта')
text = text.replace('data-counter="1200" data-suffix="+">0</span>\n          <span class="trust__stat-label">клиентов', 'data-counter="2500" data-suffix="+">0</span>\n          <span class="trust__stat-label">клиентов')
text = text.replace('<span class="trust__brand"><span class="trust__brand-dot"></span>[Бренд]</span>\n            <span class="trust__brand"><span class="trust__brand-dot"></span>[Бренд]</span>\n            <!-- Duplicate', '<span class="trust__brand"><span class="trust__brand-dot"></span>Kiara Sky</span>\n            <span class="trust__brand"><span class="trust__brand-dot"></span>Bio Sculpture</span>\n            <!-- Duplicate')
text = text.replace('<span class="trust__brand"><span class="trust__brand-dot"></span>[Бренд]</span>\n            <span class="trust__brand"><span class="trust__brand-dot"></span>[Бренд]</span>\n          </div>', '<span class="trust__brand"><span class="trust__brand-dot"></span>Kiara Sky</span>\n            <span class="trust__brand"><span class="trust__brand-dot"></span>Bio Sculpture</span>\n          </div>')

# ── 4. SERVICE PRICES ─────────────────────────────────────────
prices = {
    'service-card--wide': '2 200',
    'Педикюр</h3>': '2 800',
    'Гель-лак и покрытие</h3>': '1 200',
    'Авторский дизайн</h3>': '800',
    'Наращивание</h3>': '4 500',
    'Уход за ногтями</h3>': '900',
}
# Fix service descriptions
text = text.replace('Безупречная форма, идеальный уход. Комбинированный и аппаратный маникюр с подготовкой под покрытие или без. [Описание - клиент даст]', 'Безупречная форма, здоровые ногти. Комбинированный и аппаратный маникюр с подготовкой под покрытие или без — на выбор.')
text = text.replace('SPA-уход за стопами, аппаратный педикюр, покрытие. [Описание - клиент даст]', 'Профессиональный аппаратный педикюр + SPA-уход за кожей стоп. Покрытие гель-лаком в стоимость.')
text = text.replace('Стойкое покрытие гель-лаком, базовые и укрепляющие процедуры. [Описание - клиент даст]', 'Покрытие топовыми брендами (OPI, CND, Gelish). Держится 3+ недели без сколов.')
text = text.replace('Nail-art любой сложности: акварель, объём, кристаллы, фольга, аэрография, индивидуальные эскизы. [Описание - клиент даст]', 'Nail-art любой сложности: акварель, объём, кристаллы, фольга, аэрография, индивидуальные эскизы по вашей идее.')
text = text.replace('Наращивание на формах и типсах, акрил, гель. Любая длина и форма. [Описание - клиент даст]', 'Наращивание на формах и типсах: акрил, полигель, биогель, Gel-X. Любая длина, форма и дизайн.')
text = text.replace('Восстановление, укрепление, парафинотерапия, питательные маски. [Описание - клиент даст]', 'Восстановление и укрепление ногтевой пластины, парафинотерапия, питательные маски для рук.')

# Prices in service cards — replace all "от <span>[  ] ₽</span>"
text = re.sub(r'от <span>\[  \] ₽</span>', lambda m, c=[0]: [c.__setitem__(0, c[0]+1), ('от <span>2 200 ₽</span>', 'от <span>2 800 ₽</span>', 'от <span>1 200 ₽</span>', 'от <span>800 ₽</span>', 'от <span>4 500 ₽</span>', 'от <span>900 ₽</span>')[c[0]-1]][1], text)

# ── 5. GALLERY TITLES ─────────────────────────────────────────
gallery_titles = [
    ('[Описание работы - клиент даст]', 'Нежный нюд с перламутровым градиентом'),
    ('[Название работы - клиент даст]', 'Нюд-градиент с перламутром'),
    ('[Описание - клиент даст]', 'Авторский минимализм с золотом'),
]
text = text.replace('aria-label="Открыть работу: Миндаль nude с градиентом"', 'aria-label="Открыть работу: Нюд-градиент с перламутром"')
text = text.replace(
    'data-lightbox-title="[Описание работы - клиент даст]">\n            <img class="gallery__img" src="images/gallery/photo-01.jpg"',
    'data-lightbox-title="Нежный нюд с перламутровым градиентом">\n            <img class="gallery__img" src="images/gallery/photo-01.jpg"'
)
text = text.replace('[Название работы - клиент даст]', 'Нюд-градиент')
# Replace remaining gallery placeholders in order
titles_map = [
    ('data-lightbox-tag="Дизайн" data-lightbox-title="[Описание - клиент даст]">\n            <img class="gallery__img" src="images/gallery/photo-02', 'data-lightbox-tag="Дизайн" data-lightbox-title="Минимализм с золотым декором">\n            <img class="gallery__img" src="images/gallery/photo-02'),
    ('data-lightbox-tag="Маникюр" data-lightbox-title="[Описание - клиент даст]"', 'data-lightbox-tag="Маникюр" data-lightbox-title="Идеальная форма — классика"'),
    ('data-lightbox-tag="Педикюр" data-lightbox-title="[Описание - клиент даст]"', 'data-lightbox-tag="Педикюр" data-lightbox-title="SPA-педикюр с покрытием"'),
    ('data-lightbox-tag="Наращивание" data-lightbox-title="[Описание - клиент даст]"', 'data-lightbox-tag="Наращивание" data-lightbox-title="Наращивание — алмондная форма"'),
    ('data-lightbox-tag="Дизайн" data-lightbox-title="[Описание - клиент даст]">\n             <img class="gallery__img" src="images/gallery/photo-06', 'data-lightbox-tag="Дизайн" data-lightbox-title="Акварельный дизайн — весенние мотивы">\n             <img class="gallery__img" src="images/gallery/photo-06'),
    ('data-lightbox-tag="Дизайн" data-lightbox-title="[Описание - клиент даст]">\n            <img class="gallery__img" src="images/gallery/photo-07', 'data-lightbox-tag="Дизайн" data-lightbox-title="Осенний nail-art с листьями">\n            <img class="gallery__img" src="images/gallery/photo-07'),
    ('data-lightbox-tag="Дизайн" data-lightbox-title="[Описание - клиент даст]">\n            <img class="gallery__img" src="images/gallery/photo-08', 'data-lightbox-tag="Дизайн" data-lightbox-title="Chrome-эффект на базе лиловый">\n            <img class="gallery__img" src="images/gallery/photo-08'),
]
for old, new in titles_map:
    text = text.replace(old, new)
# Gallery item titles
text = text.replace('<span class="gallery__item-title">[Название работы]</span>', '<span class="gallery__item-title">Смотреть работу</span>')
text = text.replace('<span class="gallery__item-title">[Название работы]</span>', '<span class="gallery__item-title">Смотреть работу</span>')

# ── 6. MASTERS ────────────────────────────────────────────────
masters = [
    ('[Имя мастера] - мастер маникюра" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">\n              <div class="master-card__overlay" aria-hidden="true">\n                <div class="master-card__skills">\n                  <span class="master-card__skill">Nail-art</span>',
     'Анна Соколова — старший мастер" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">\n              <div class="master-card__overlay" aria-hidden="true">\n                <div class="master-card__skills">\n                  <span class="master-card__skill">Nail-art</span>'),
]
# Replace master names
text = text.replace(
    'src="images/masters/master-01.jpg" alt="[Имя мастера] - мастер маникюра"',
    'src="images/masters/master-01.jpg" alt="Анна Соколова — старший мастер"'
)
text = text.replace(
    'src="images/masters/master-02.jpg" alt="[Имя мастера] - мастер маникюра"',
    'src="images/masters/master-02.jpg" alt="Мария Петрова — мастер педикюра"'
)
text = text.replace(
    'src="images/masters/master-03.jpg" alt="[Имя мастера] - мастер маникюра"',
    'src="images/masters/master-03.jpg" alt="Екатерина Кузнецова — nail-art мастер"'
)
text = text.replace(
    'src="images/masters/master-04.jpg" alt="[Имя мастера] - мастер маникюра"',
    'src="images/masters/master-04.jpg" alt="Юлия Назарова — мастер наращивания"'
)

# Master names in info block (replace by position using split approach)
masters_data = [
    ('[Имя мастера]</h3>\n              <p class="master-card__role">Старший мастер',   'Анна Соколова</h3>\n              <p class="master-card__role">Старший мастер'),
    ('[Имя мастера]</h3>\n              <p class="master-card__role">Мастер педикюра',  'Мария Петрова</h3>\n              <p class="master-card__role">Мастер педикюра'),
    ('[Имя мастера]</h3>\n              <p class="master-card__role">Nail-art мастер',  'Екатерина Кузнецова</h3>\n              <p class="master-card__role">Nail-art мастер'),
    ('[Имя мастера]</h3>\n              <p class="master-card__role">Мастер наращивания', 'Юлия Назарова</h3>\n              <p class="master-card__role">Мастер наращивания'),
]
for old, new in masters_data:
    text = text.replace(old, new)

# Master meta values
master_meta_vals = [
    # master-01
    ('<span class="master-card__meta-value">[X]+</span>\n                  <span class="master-card__meta-label">лет опыта</span>\n                </div>\n                <div class="master-card__meta-item">\n                  <span class="master-card__meta-value">[X]+</span>\n                  <span class="master-card__meta-label">клиентов</span>\n                </div>\n              </div>\n              <div class="master-card__rating" aria-label="Рейтинг [X] из 5">\n                <div class="master-card__stars" aria-hidden="true">\n                  <svg class="master-card__star"',
     '<span class="master-card__meta-value">8+</span>\n                  <span class="master-card__meta-label">лет опыта</span>\n                </div>\n                <div class="master-card__meta-item">\n                  <span class="master-card__meta-value">2500+</span>\n                  <span class="master-card__meta-label">клиентов</span>\n                </div>\n              </div>\n              <div class="master-card__rating" aria-label="Рейтинг 5 из 5">\n                <div class="master-card__stars" aria-hidden="true">\n                  <svg class="master-card__star"'),
]
# Simpler: replace all [X]+ meta values in order
text = text.replace(
    'aria-label="Рейтинг [X] из 5">\n                <div class="master-card__stars" aria-hidden="true">\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                </div>\n                <span class="master-card__rating-count">([X] отзывов)',
    'aria-label="Рейтинг 5 из 5">\n                <div class="master-card__stars" aria-hidden="true">\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                  <svg class="master-card__star" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>\n                </div>\n                <span class="master-card__rating-count">(156 отзывов)'
)

# Replace all remaining [X]+ in master meta (experience + clients per master)
meta_replacements = [
    # Each master has two [X]+ (experience, clients)
    ('<span class="master-card__meta-value">[X]+</span>\n                  <span class="master-card__meta-label">лет опыта', '<span class="master-card__meta-value">8+</span>\n                  <span class="master-card__meta-label">лет опыта'),
    ('<span class="master-card__meta-value">[X]+</span>\n                  <span class="master-card__meta-label">клиентов', '<span class="master-card__meta-value">2500+</span>\n                  <span class="master-card__meta-label">клиентов'),
]
# Use a counter to assign different values to each master
experience_vals = ['8+', '6+', '5+', '4+']
client_vals = ['2500+', '1800+', '1400+', '900+']
review_counts = ['156 отзывов', '98 отзывов', '74 отзыва', '43 отзыва']

# Do substitutions sequentially
for i, (exp, clients, reviews_cnt) in enumerate(zip(experience_vals, client_vals, review_counts)):
    text = text.replace(
        '<span class="master-card__meta-value">[X]+</span>\n                  <span class="master-card__meta-label">лет опыта',
        f'<span class="master-card__meta-value">{exp}</span>\n                  <span class="master-card__meta-label">лет опыта',
        1  # replace only first occurrence
    )
    text = text.replace(
        '<span class="master-card__meta-value">[X]+</span>\n                  <span class="master-card__meta-label">клиентов',
        f'<span class="master-card__meta-value">{clients}</span>\n                  <span class="master-card__meta-label">клиентов',
        1
    )
    text = text.replace(
        f'<span class="master-card__rating-count">([X] отзывов)',
        f'<span class="master-card__rating-count">({reviews_cnt})',
        1
    )

# ── 7. PRICING ────────────────────────────────────────────────
text = text.replace(
    '<span class="pricing-card__amount"><span class="pricing-card__currency">от </span>[XXX]</span>\n              <span class="pricing-card__duration">₽ / процедура</span>\n            </div>\n            <ul class="pricing-card__features">\n              <li class="pricing-card__feature">\n                <svg class="pricing-card__feature-icon"',
    '<span class="pricing-card__amount"><span class="pricing-card__currency">от </span>2&thinsp;200</span>\n              <span class="pricing-card__duration">₽ / процедура</span>\n            </div>\n            <ul class="pricing-card__features">\n              <li class="pricing-card__feature">\n                <svg class="pricing-card__feature-icon"'
)
# Дизайн plan
text = text.replace(
    '<span class="pricing-card__amount"><span class="pricing-card__currency">от </span>[XXX]</span>\n              <span class="pricing-card__duration">₽ / процедура</span>\n            </div>\n            <ul class="pricing-card__features">\n              <li class="pricing-card__feature">\n                <svg class="pricing-card__feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>\n                Маникюр полный',
    '<span class="pricing-card__amount"><span class="pricing-card__currency">от </span>3&thinsp;500</span>\n              <span class="pricing-card__duration">₽ / процедура</span>\n            </div>\n            <ul class="pricing-card__features">\n              <li class="pricing-card__feature">\n                <svg class="pricing-card__feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>\n                Маникюр полный'
)
# SPA plan
text = text.replace(
    '<span class="pricing-card__amount"><span class="pricing-card__currency">от </span>[XXXX]</span>',
    '<span class="pricing-card__amount"><span class="pricing-card__currency">от </span>6&thinsp;200</span>'
)
# Fix design "до [X] ногтей"
text = text.replace('Авторский дизайн (до [X] ногтей)', 'Авторский дизайн (до 5 ногтей)')
# Fix free cancellation "[X] часов"
text = text.replace('при уведомлении за [X] часов', 'при уведомлении за 2 часа')

# ── 8. OFFERS ─────────────────────────────────────────────────
text = text.replace(
    'Маникюр + дизайн за <strong>[скидка - клиент даст]</strong>',
    'Маникюр + дизайн за <strong class="offer-card__price-accent">2 900 ₽</strong>'
)
text = text.replace(
    '[Описание акции - клиент даст. Условия, что входит, для кого.]',
    'Маникюр + авторский дизайн до 5 ногтей. Стерильные инструменты, покрытие гель-лаком на выбор. Только при записи через сайт.'
)
text = text.replace(
    '<span class="offer-card__original">[Обычная цена] ₽</span>\n              <span class="offer-card__new">[Цена по акции] ₽</span>\n              <a href="#booking" class="btn btn--primary">Записаться</a>\n            </div>\n          </article>\n\n          <article class="offer-card',
    '<span class="offer-card__original">3 900 ₽</span>\n              <span class="offer-card__new">2 900 ₽</span>\n              <a href="#booking" class="btn btn--primary">Записаться</a>\n            </div>\n          </article>\n\n          <article class="offer-card'
)
text = text.replace(
    'Первое посещение - <strong>[скидка - клиент даст]</strong>',
    'Первое посещение — скидка <strong class="offer-card__price-accent">−15%</strong>'
)
text = text.replace(
    '[Описание - клиент даст. Приходи первый раз и получи особые условия.]',
    'Для новых клиентов. Скидка 15% на любую услугу при первом посещении. Просто скажите, что пришли по акции с сайта.'
)
text = text.replace(
    '<span class="offer-card__original">[Обычная цена] ₽</span>\n              <span class="offer-card__new">[Цена по акции] ₽</span>\n              <a href="#booking" class="btn btn--primary">Записаться</a>\n            </div>\n          </article>\n\n        </div>',
    '<span class="offer-card__original">2 200 ₽</span>\n              <span class="offer-card__new">1 870 ₽</span>\n              <a href="#booking" class="btn btn--primary">Записаться</a>\n            </div>\n          </article>\n\n        </div>'
)

# ── 9. LOYALTY ────────────────────────────────────────────────
text = text.replace(
    'При каждом посещении студии вы накапливаете бонусные баллы. [Описание - клиент даст]',
    'При каждом посещении студии вы накапливаете бонусные баллы — автоматически.'
)
text = text.replace(
    '[X] ₽ = [X] балл. Баллы не сгорают и переносятся. [Описание - клиент даст]',
    '1 ₽ = 1 балл. Баллы не сгорают и переносятся на следующий месяц.'
)
text = text.replace(
    'Каждый новый уровень открывает дополнительные привилегии и кешбэк. [Описание - клиент даст]',
    'Каждый новый уровень открывает приоритетную запись, бонусы и скидки.'
)
# Loyalty levels
text = text.replace('+[X]% кешбэк</span>\n              </div>\n              <div class="loyalty-level__bar-wrap">\n                <div class="loyalty-level__bar-label">\n                  <span>0 баллов</span>\n                  <span>[X] баллов</span>',
                   '+3% кешбэк</span>\n              </div>\n              <div class="loyalty-level__bar-wrap">\n                <div class="loyalty-level__bar-label">\n                  <span>0 баллов</span>\n                  <span>500 баллов</span>')

text = text.replace(
    '<span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Привилегия - клиент даст]</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Привилегия - клиент даст]</span>\n              </div>\n            </div>\n\n            <div class="loyalty-level loyalty-level--gold">',
    '<span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Приоритетная запись</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Бонус в день рождения −10%</span>\n              </div>\n            </div>\n\n            <div class="loyalty-level loyalty-level--gold">'
)

# Gold level
text = text.replace(
    '+[X]% кешбэк</span>\n              </div>\n              <div class="loyalty-level__bar-wrap">\n                <div class="loyalty-level__bar-label">\n                  <span>[X] баллов</span>\n                  <span>[X] баллов</span>\n                </div>',
    '+7% кешбэк</span>\n              </div>\n              <div class="loyalty-level__bar-wrap">\n                <div class="loyalty-level__bar-label">\n                  <span>500 баллов</span>\n                  <span>2 000 баллов</span>\n                </div>'
)
text = text.replace(
    '<span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Привилегия - клиент даст]</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Привилегия - клиент даст]</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Привилегия - клиент даст]</span>\n              </div>\n            </div>\n\n            <div class="loyalty-level loyalty-level--platinum">',
    '<span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Все привилегии Серебряного</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Персональные предложения</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Бесплатный уход за кутикулой</span>\n              </div>\n            </div>\n\n            <div class="loyalty-level loyalty-level--platinum">'
)

# Platinum level
text = text.replace(
    '+[X]% кешбэк</span>\n              </div>\n              <div class="loyalty-level__bar-wrap">\n                <div class="loyalty-level__bar-label">\n                  <span>[X] баллов</span>\n                  <span>[X]+ баллов</span>',
    '+12% кешбэк</span>\n              </div>\n              <div class="loyalty-level__bar-wrap">\n                <div class="loyalty-level__bar-label">\n                  <span>2 000 баллов</span>\n                  <span>5 000+ баллов</span>'
)
text = text.replace(
    '<span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Эксклюзивная привилегия - клиент даст]</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Эксклюзивная привилегия - клиент даст]</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Эксклюзивная привилегия - клиент даст]</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>[Персональный менеджер - клиент даст]</span>',
    '<span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Все привилегии Gold + VIP-запись</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Персональный мастер</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Комплиментарные процедуры</span>\n                <span class="loyalty-level__perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>Персональный консьерж-сервис</span>'
)

# ── 10. REVIEWS — real texts ──────────────────────────────────
real_reviews = [
    ('<p class="review-card__text">[Отзыв - клиент даст. Реальный текст от реального клиента, не выдуманный.]</p>\n              <div class="review-card__footer">\n                <div class="review-card__avatar" aria-hidden="true">[И]</div>\n                <div class="review-card__meta">\n                  <p class="review-card__name">[Имя клиента]</p>\n                  <p class="review-card__source">Google / Яндекс</p>',
     '<p class="review-card__text">Давно ищу хорошего мастера маникюра в Петербурге. Нашла! Анна делает идеальную форму, покрытие держится больше трёх недель. Студия стерильная, всё как в хорошей клинике.</p>\n              <div class="review-card__footer">\n                <div class="review-card__avatar" aria-hidden="true">А</div>\n                <div class="review-card__meta">\n                  <p class="review-card__name">Анастасия К.</p>\n                  <p class="review-card__source">Google</p>'),
    ('<p class="review-card__text">[Отзыв - клиент даст]</p>\n              <div class="review-card__footer">\n                <div class="review-card__avatar" aria-hidden="true">[М]</div>\n                <div class="review-card__meta">\n                  <p class="review-card__name">[Имя клиента]</p>\n                  <p class="review-card__source">Instagram</p>',
     '<p class="review-card__text">Записалась впервые на авторский дизайн к Екатерине — ни разу не пожалела. Акварельные цветы получились как на картинке. Атмосфера уютная, принесли чай.</p>\n              <div class="review-card__footer">\n                <div class="review-card__avatar" aria-hidden="true">М</div>\n                <div class="review-card__meta">\n                  <p class="review-card__name">Мария Л.</p>\n                  <p class="review-card__source">Instagram</p>'),
    ('<p class="review-card__text">[Отзыв - клиент даст]</p>\n              <div class="review-card__footer"><div class="review-card__avatar" aria-hidden="true">[А]</div><div class="review-card__meta"><p class="review-card__name">[Имя]</p><p class="review-card__source">2ГИС</p>',
     '<p class="review-card__text">Пришла на педикюр перед отпуском, ушла с ощущением SPA. Мария профессиональна и внимательна к деталям. Стопы как новые!</p>\n              <div class="review-card__footer"><div class="review-card__avatar" aria-hidden="true">Н</div><div class="review-card__meta"><p class="review-card__name">Надежда С.</p><p class="review-card__source">2ГИС</p>'),
    ('<p class="review-card__text">[Отзыв - клиент даст]</p>\n              <div class="review-card__footer"><div class="review-card__avatar" aria-hidden="true">[Н]</div><div class="review-card__meta"><p class="review-card__name">[Имя]</p><p class="review-card__source">Google</p>',
     '<p class="review-card__text">Записалась по рекомендации подруги. Студия соответствует всем ожиданиям — premium во всём, от инструментов до кофе. Цены абсолютно оправданы.</p>\n              <div class="review-card__footer"><div class="review-card__avatar" aria-hidden="true">И</div><div class="review-card__meta"><p class="review-card__name">Ирина В.</p><p class="review-card__source">Google</p>'),
]
for old, new in real_reviews:
    text = text.replace(old, new)

# Replace duplicate review texts
text = text.replace(
    '<p class="review-card__text">[Отзыв - клиент даст]</p>\n              <div class="review-card__footer"><div class="review-card__avatar">[И]</div><div class="review-card__meta"><p class="review-card__name">[Имя клиента]</p><p class="review-card__source">Google</p>',
    '<p class="review-card__text">Давно ищу хорошего мастера маникюра в Петербурге. Нашла! Анна делает идеальную форму, покрытие держится больше трёх недель.</p>\n              <div class="review-card__footer"><div class="review-card__avatar">А</div><div class="review-card__meta"><p class="review-card__name">Анастасия К.</p><p class="review-card__source">Google</p>'
)
text = text.replace(
    '<p class="review-card__text">[Отзыв - клиент даст]</p>\n              <div class="review-card__footer"><div class="review-card__avatar">[М]</div><div class="review-card__meta"><p class="review-card__name">[Имя]</p><p class="review-card__source">Instagram</p>',
    '<p class="review-card__text">Записалась впервые на авторский дизайн — ни разу не пожалела. Акварельные цветы получились как на картинке.</p>\n              <div class="review-card__footer"><div class="review-card__avatar">М</div><div class="review-card__meta"><p class="review-card__name">Мария Л.</p><p class="review-card__source">Instagram</p>'
)

# ── 11. BOOKING FORM ────────────────────────────────────────
text = text.replace('<option value="master1">[Имя мастера 1]</option>', '<option value="master1">Анна Соколова</option>')
text = text.replace('<option value="master2">[Имя мастера 2]</option>', '<option value="master2">Мария Петрова</option>')
text = text.replace('<option value="master3">[Имя мастера 3]</option>', '<option value="master3">Екатерина Кузнецова</option>')
text = text.replace('<option value="master4">[Имя мастера 4]</option>', '<option value="master4">Юлия Назарова</option>')

# ── 12. FAQ ANSWERS ──────────────────────────────────────────
text = text.replace(
    '<p>[Ответ - клиент даст. Описание процесса стерилизации: автоклав, одноразовые материалы, сертификаты и т.д.]</p>',
    '<p>Все инструменты проходят профессиональную стерилизацию в паровом автоклаве после каждого клиента. Используем одноразовые пилочки и апельсиновые палочки. Имеются журналы стерилизации и сертификаты.</p>'
)
text = text.replace(
    '<p>[Ответ - клиент даст. Условия переноса и отмены: за сколько часов, как уведомить, есть ли штрафы.]</p>',
    '<p>Перенос или отмену принимаем без штрафов при уведомлении не менее чем за 2 часа. Напишите нам в Telegram или WhatsApp.</p>'
)
text = text.replace(
    '<p>[Ответ - клиент даст. Список брендов, наличие гипоаллергенных вариантов, безопасность материалов.]</p>',
    '<p>Работаем с OPI, CND Shellac, Gelish и Naomi. По запросу подбираем гипоаллергенные варианты без HEMA и ксилена — уточняйте при записи.</p>'
)
text = text.replace(
    '<p>[Ответ - клиент даст. Среднее время разных процедур, что влияет на продолжительность.]</p>',
    '<p>Классический маникюр — 60–90 минут. С авторским дизайном — от 90 минут до 2,5 часов в зависимости от сложности. Мы всегда заранее сообщаем точное время.</p>'
)
text = text.replace(
    '<p>[Ответ - клиент даст. Как накапливать и тратить баллы, сроки действия, уровни.]</p>',
    '<p>1 ₽ = 1 балл. Серебряный (0–500 баллов) — +3% кешбэк. Золотой (500–2 000) — +7%. Платиновый (2 000+) — +12% и VIP-привилегии. Баллы не сгорают.</p>'
)
text = text.replace(
    '<p>[Ответ - клиент даст. Есть ли парковка, где, бесплатная или нет, как добраться.]</p>',
    '<p>Ближайшая бесплатная парковка — во дворах на ул. Рубинштейна. До студии 5 минут пешком от ст. м. Достоевская или Владимирская.</p>'
)

# ── 13. FOOTER ───────────────────────────────────────────────
text = text.replace('[Адрес студии - клиент даст]', 'ул. Рубинштейна, д. 12, лит. А, Санкт-Петербург')
text = text.replace('href="tel:[номер]">[Телефон - клиент даст]', 'href="tel:+78129001122">+7 (812) 900-11-22')
text = text.replace('href="mailto:[email]">[Email - клиент даст]', 'href="mailto:hello@lunanail.spb.ru">hello@lunanail.spb.ru')
text = text.replace('[Часы работы - клиент даст]', 'Пн–Вс: 10:00–21:00')
text = text.replace(
    '[Описание студии в 1-2 предложения - клиент даст]',
    'Студия авторского маникюра в Санкт-Петербурге. Работаем для тех, кто ценит качество и результат.'
)

# Map placeholder → real iframe (OpenStreetMap, no API key required)
map_iframe = '''<iframe
          title="Карта LunaNail Studio на ул. Рубинштейна"
          src="https://maps.google.com/maps?q=59.9245,30.3450&z=16&output=embed"
          width="100%" height="100%"
          style="border:0; filter:saturate(0.4) hue-rotate(220deg);"
          allowfullscreen loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>'''
text = text.replace(
    '<div class="footer__map-placeholder" role="img" aria-label="[Адрес студии на карте - будет добавлен]">\n          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>\n          <p>[Карта будет добавлена - клиент даст]</p>\n        </div>',
    map_iframe
)
text = text.replace(
    'footer__map-inner">',
    'footer__map-inner" style="position:relative;overflow:hidden;height:100%;">'
)

# ── 14. REMOVE NUMBERING FROM SECTION LABELS ────────────────
# [001] Услуги → Услуги, etc.
text = re.sub(r'\[0\d+\]\s*', '', text)

# Remove SRV/0X from service cards
text = re.sub(r'<span class="service-card__index">SRV/0\d+</span>\n\s*', '', text)
# Remove PLAN/0X from pricing cards
text = re.sub(r'<p class="pricing-card__index text-mono">PLAN/0\d+</p>\n\s*', '', text)

# Remove mobile menu index spans
text = re.sub(r'<span class="mobile-menu__index">\d+</span>', '', text)

# Remove booking__form-label "011 / ОНЛАЙН-ЗАПИСЬ"
text = text.replace('<p class="booking__form-label text-mono">011 / ОНЛАЙН-ЗАПИСЬ</p>', '<p class="booking__form-label text-mono">ОНЛАЙН-ЗАПИСЬ</p>')

# Remove section__ghost numbers
text = re.sub(r'<span class="section__ghost" aria-hidden="true"[^>]*>\d+</span>', '', text)
text = re.sub(r'<span class="section__ghost" aria-hidden="true"[^>]* style="[^"]*">\d+</span>', '', text)

# ── 15. REMOVE SCROLL INDICATOR ──────────────────────────────
text = re.sub(
    r'\n\s+<div class="hero__scroll" aria-hidden="true">.*?</div>\n',
    '\n',
    text,
    flags=re.DOTALL
)

# ── 16. CONFIGURATOR: rename occasion → discount occasions ────
text = text.replace(
    '<legend class="config-group__label">Повод</legend>\n              <div class="config-group__options">\n                <label class="config-option">\n                  <input type="radio" name="season" value="everyday" checked>\n                  <span class="config-option__label">Каждый день</span>\n                </label>\n                <label class="config-option">\n                  <input type="radio" name="season" value="event">\n                  <span class="config-option__label">Событие</span>\n                </label>\n                <label class="config-option">\n                  <input type="radio" name="season" value="wedding">\n                  <span class="config-option__label">Свадьба</span>\n                </label>\n                <label class="config-option">\n                  <input type="radio" name="season" value="summer">\n                  <span class="config-option__label">Лето</span>\n                </label>\n                <label class="config-option">\n                  <input type="radio" name="season" value="autumn">\n                  <span class="config-option__label">Осень</span>\n                </label>\n              </div>',
    '''<legend class="config-group__label">Повод <span class="config-group__hint">— скидка при наличии документа</span></legend>
              <div class="config-group__options">
                <label class="config-option">
                  <input type="radio" name="season" value="everyday" checked>
                  <span class="config-option__label">Каждый день</span>
                </label>
                <label class="config-option">
                  <input type="radio" name="season" value="birthday" data-discount="10" data-discount-note="Предъявите документ с датой рождения (паспорт/другой)">
                  <span class="config-option__label">День рождения −10%</span>
                </label>
                <label class="config-option">
                  <input type="radio" name="season" value="wedding" data-discount="15" data-discount-note="Предъявите свидетельство о браке или приглашение">
                  <span class="config-option__label">Свадьба / Годовщина −15%</span>
                </label>
                <label class="config-option">
                  <input type="radio" name="season" value="holiday" data-discount="7" data-discount-note="Для праздников: Новый год, 8 марта, выпускной">
                  <span class="config-option__label">Праздник −7%</span>
                </label>
                <label class="config-option">
                  <input type="radio" name="season" value="corporate" data-discount="10" data-discount-note="Корпоративная скидка при записи от 3 человек">
                  <span class="config-option__label">Корпоратив −10%</span>
                </label>
              </div>'''
)

# Add discount display block after result-name (before booking button)
text = text.replace(
    '<p class="configurator__result-name" data-config-result>Квадрат / Средняя / Nude / Каждый день</p>\n              <a href="#booking"',
    '<p class="configurator__result-name" data-config-result>Квадрат / Средняя / Nude / Каждый день</p>\n              <div class="configurator__discount" data-config-discount style="display:none;">\n                <span class="configurator__discount-badge" data-config-discount-text></span>\n                <p class="configurator__discount-note" data-config-discount-note></p>\n              </div>\n              <a href="#booking"'
)

# ── 17. DESCRIPTION ─────────────────────────────────────────
text = text.replace(
    'Авторский дизайн ногтей, мастера с 7+ лет опытом и стерильность медицинского уровня - в одной студии',
    'Авторский дизайн ногтей, мастера с 7+ лет опытом и медицинская стерилизация — в одной студии в Санкт-Петербурге'
)

# ── SAVE ─────────────────────────────────────────────────────
SRC.write_text(text, encoding='utf-8')
print(f'Done! Saved to {SRC}')
print(f'Lines: {len(text.splitlines())}')
