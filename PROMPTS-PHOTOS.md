# Промпты для генерации всех фото — маникюрная студия

Скинь этот файл в Antigravity целиком.  
После генерации сохраняй файлы **точно по путям ниже** — сайт уже на них настроен.

---

## Общие настройки (для всех фото)

- **Стиль:** премиум beauty / editorial, фотореализм, не иллюстрация
- **Свет:** яркий, воздушный, тёплый естественный свет, белые/кремовые интерьеры
- **Палитра сайта:** белый, крем, мягкий лиловый (#7C5CFF), перламутр, акцент тил (#1DB59A) — дозированно
- **Качество:** 4K, ultra-detailed, sharp focus, professional photography
- **Запрещено:** тёмный фон, неон, stock-look, watermark, текст на изображении, логотипы брендов (OPI и т.д.)
- **Лица мастеров:** естественные, без «AI-uncanny», профессиональный вид

---

## 1. HERO — `images/hero/`

### hero-poster.jpg
**Путь:** `images/hero/hero-poster.jpg`  
**Формат:** 16:9 (рекомендуется 1920×1080 или 2560×1440)

```
Premium nail studio interior, wide cinematic shot. Bright airy space with large windows, warm natural light flooding in. White marble surfaces, soft cream and ivory tones. A close-up of elegant female hands resting on a light marble table, nails with a sophisticated lilac-to-pearl gradient gel manicure. Shallow depth of field. Photorealistic, editorial photography style, ultra-high quality, 4K, --ar 16:9
```

### hero.mp4 (видео — отдельная генерация)
**Путь:** `images/hero/hero.mp4`  
**Формат:** 16:9, loop ~8 сек, seamless start/end frame

```
Slow cinematic loop, 8 seconds, seamless. A pair of beautiful feminine hands with a pearl-lilac gel manicure gently resting on a white marble surface with subtle veins. Soft bokeh background of a bright nail studio interior — white walls, frosted glass, green plants. Light particles and nail glitter floating slowly in the air. Warm natural sunlight from the left. Ultra-premium, editorial beauty photography motion, 4K.
```

**Примечание:** после генерации видео раскомментируй блок `<video>` в `index.html` и закомментируй/убери только poster если нужно.

---

## 2. УСЛУГИ — `images/services/`

Единый стиль: чистый светлый салон, профессиональная съёмка, 4:3.

### service-manicure.jpg
**Путь:** `images/services/service-manicure.jpg`  
**Формат:** 4:3 (1200×900)

```
Close-up of a professional nail technician carefully shaping nails with a crystal file. Bright clean nail studio. Client's hand resting on a white cushion, natural nude-pink short square nails, immaculate cuticles. Soft natural window light. Clean white background. High-end beauty photography, editorial quality, 4K, --ar 4:3
```

### service-pedicure.jpg
**Путь:** `images/services/service-pedicure.jpg`  
**Формат:** 4:3

```
Luxury spa pedicure setup. Female feet resting in a white porcelain basin with rose petals and essential oil. Nails painted in soft blush pink. Warm candle light and fresh white towels in the background. Serene spa atmosphere. Beauty editorial photography, high-end, photorealistic, 4K, --ar 4:3
```

### service-gel.jpg
**Путь:** `images/services/service-gel.jpg`  
**Формат:** 4:3

```
Macro close-up of nail technician applying UV gel top coat on perfectly shaped almond nails under a pink UV lamp. Milky white gel coat, high gloss finish. Background is slightly blurred bright nail studio. Professional beauty photography, ultra-detailed, 4K, --ar 4:3
```

### service-design.jpg
**Путь:** `images/services/service-design.jpg`  
**Формат:** 4:3

```
Stunning close-up of nail art in progress. Ultra-detailed floral design in white and lilac on nude base, fine nail art brush held by elegant fingers. Scattered rhinestones and gold foil pieces on a white marble surface. Bright soft studio light. Luxury beauty photography, 4K, --ar 4:3
```

### service-extension.jpg
**Путь:** `images/services/service-extension.jpg`  
**Формат:** 4:3

```
Nail extension process. Nail technician sculpting a beautiful long stiletto nail with clear builder gel. Client's hand is relaxed on a white cushion. Very detailed, sharp focus on the nail form. Bright professional studio light. Clean, premium, photorealistic, 4K, --ar 4:3
```

### service-care.jpg
**Путь:** `images/services/service-care.jpg`  
**Формат:** 4:3

```
Luxury nail care treatment. Female hands receiving a warm paraffin bath with rose petals. White towel, fresh flowers, glass bowl of paraffin wax. Warm spa ambiance. High-end beauty editorial photography, 4K, --ar 4:3
```

---

## 3. ПОРТФОЛИО — `images/gallery/`

Разные пропорции — как в masonry-сетке сайта.

### photo-01.jpg
**Путь:** `images/gallery/photo-01.jpg`  
**Формат:** 3:4 (900×1200)  
**Тег на сайте:** маникюр, дизайн

```
Beautiful close-up of almond-shaped nails with a soft lilac-to-white ombre gradient gel manicure. Subtle iridescent shimmer. Hands resting on a light grey linen fabric. Natural diffused light. Ultra-detailed, photorealistic, nail art photography, 4K, --ar 3:4
```

### photo-02.jpg
**Путь:** `images/gallery/photo-02.jpg`  
**Формат:** 4:3  
**Тег:** дизайн

```
Close-up of 10 nails featuring intricate minimalist abstract nail art: thin gold lines, negative space, tiny black dots on nude base. Square shape, medium length. Hands resting on a white marble slab with a single white tulip. Editorial beauty photography, 4K, --ar 4:3
```

### photo-03.jpg
**Путь:** `images/gallery/photo-03.jpg`  
**Формат:** 3:4  
**Тег:** маникюр

```
Elegant short round nails with glossy deep cherry red gel polish. Hands gently holding a white ceramic coffee cup. Warm soft lighting. Clean, minimal composition. Premium nail photography, photorealistic, 4K, --ar 3:4
```

### photo-04.jpg
**Путь:** `images/gallery/photo-04.jpg`  
**Формат:** 1:1 (1200×1200)  
**Тег:** педикюр

```
Luxury spa pedicure result. Feet with perfectly shaped oval toenails in soft pearl pink gel. White marble floor background, scattered fresh rose petals. Elegant and clean composition. Beauty photography, editorial quality, 4K, --ar 1:1
```

### photo-05.jpg
**Путь:** `images/gallery/photo-05.jpg`  
**Формат:** 3:4  
**Тег:** наращивание, дизайн

```
Stunning long stiletto nail extensions with 3D floral nail art — tiny sculpted white flowers with gold leaf accents on a sheer pink base. Extreme close-up, ultra-detailed. Hands against a blurred white satin fabric background. Luxury nail art photography, 4K, --ar 3:4
```

### photo-06.jpg
**Путь:** `images/gallery/photo-06.jpg`  
**Формат:** 4:3  
**Тег:** дизайн, маникюр

```
Close-up of medium square nails with a glamorous French manicure twist — thick milky French tip with a thin violet glitter line at the edge. High gloss finish. Hands relaxed on a light lavender silk. Natural morning light. Elegant, premium nail photography, 4K, --ar 4:3
```

### photo-07.jpg (дополнительно — можно добавить в HTML)
**Путь:** `images/gallery/photo-07.jpg`  
**Формат:** 3:4

```
Autumn-inspired nail art close-up. Burnt orange, burgundy, and gold leaf nail design on medium almond nails. Warm earthy tones. Hands holding a small dried herb bouquet. Cosy editorial photography, warm tones, 4K, --ar 3:4
```

### photo-08.jpg (дополнительно)
**Путь:** `images/gallery/photo-08.jpg`  
**Формат:** 1:1

```
Minimalist navy blue and silver chrome powder nail art on short square nails. Sharp clean lines. Hands against a white background with a single silver ring. High contrast, editorial, 4K, --ar 1:1
```

---

## 4. МАСТЕРА — `images/masters/`

**Важно:** один стиль для всех 4 фото — светлый студийный фон, портрет 3/4 или поясной, белый/чёрный фартук салона, одинаковое освещение.  
**Формат всех:** 3:4 (900×1200)

### master-01.jpg
**Путь:** `images/masters/master-01.jpg`  
**Роль на сайте:** Старший мастер

```
Portrait of a young professional female nail technician, 25-30 years old, light skin, dark hair pulled back neatly, wearing a clean white salon apron. She is holding her hands up with a beautiful almond nail manicure visible. Bright, clean, minimal studio background, soft professional lighting. Confident, friendly expression. Real photo style, editorial quality, 4K, --ar 3:4
```

### master-02.jpg
**Путь:** `images/masters/master-02.jpg`  
**Роль:** Мастер педикюра

```
Portrait of a professional female nail technician, 30-35 years old, medium skin tone, auburn hair, wearing a white salon uniform. Slightly tilted head, warm professional smile. Clean bright studio background with soft shadows. She is shown mid-work, applying nail polish with precision. Editorial quality, photorealistic, 4K, --ar 3:4
```

### master-03.jpg
**Путь:** `images/masters/master-03.jpg`  
**Роль:** Nail-art мастер

```
Portrait of a young female nail artist, 23-28 years old, fair skin, blonde hair in a bun, wearing a black salon apron. She is holding nail art brushes and showing her own elaborate nail art — tiny flowers in lilac and white. Minimalist studio background, natural daylight from left. Professional beauty photography, 4K, --ar 3:4
```

### master-04.jpg
**Путь:** `images/masters/master-04.jpg`  
**Роль:** Мастер наращивания

```
Portrait of a professional female nail technician, 28-33 years old, olive skin, dark straight hair, wearing a clean white salon coat. She is demonstrating a freshly extended stiletto nail set on her own hand. Clean bright studio background, even professional lighting. Warm, confident expression. Photorealistic, editorial quality, 4K, --ar 3:4
```

---

## 5. ЛОГОТИПЫ БРЕНДОВ — `images/logo/`

**НЕ генерировать через AI.** Скачать официальные brand assets или монохромные SVG с сайтов брендов:

| Файл | Бренд |
|------|--------|
| `images/logo/opi.svg` | OPI |
| `images/logo/cnd.svg` | CND Shellac |
| `images/logo/gelish.svg` | Gelish |
| `images/logo/ibd.svg` | IBD |
| `images/logo/naomi.svg` | Naomi |

Для trust-marquee на сайте сейчас текстовые плейсхолдеры — логотипы опционально.

---

## Чеклист после генерации

```
[ ] images/hero/hero-poster.jpg
[ ] images/hero/hero.mp4 (видео, опционально на первом этапе)
[ ] images/services/service-manicure.jpg
[ ] images/services/service-pedicure.jpg
[ ] images/services/service-gel.jpg
[ ] images/services/service-design.jpg
[ ] images/services/service-extension.jpg
[ ] images/services/service-care.jpg
[ ] images/gallery/photo-01.jpg
[ ] images/gallery/photo-02.jpg
[ ] images/gallery/photo-03.jpg
[ ] images/gallery/photo-04.jpg
[ ] images/gallery/photo-05.jpg
[ ] images/gallery/photo-06.jpg
[ ] images/gallery/photo-07.jpg (опционально)
[ ] images/gallery/photo-08.jpg (опционально)
[ ] images/masters/master-01.jpg
[ ] images/masters/master-02.jpg
[ ] images/masters/master-03.jpg
[ ] images/masters/master-04.jpg
```

**Итого обязательно:** 17 файлов (16 фото + 1 poster; видео отдельно).

---

## Краткая инструкция для Antigravity

1. Сгенерируй все изображения по промптам выше.
2. Сохрани каждый файл **строго по указанному пути** в папке проекта `Маникюр/`.
3. Формат: **JPG**, качество 85-95%, без watermark.
4. Для мастеров — **одинаковый стиль освещения и фона** на всех 4 портретах.
5. Hero video — loop 8 сек, 16:9, muted-friendly (без резких вспышек).
6. Логотипы брендов — только официальные, не AI.

После загрузки файлов открой `index.html` в браузере — placeholder'ы исчезнут, фото подтянутся автоматически.
