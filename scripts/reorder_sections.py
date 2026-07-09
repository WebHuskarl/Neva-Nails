"""
reorder_sections.py
- Переставляет секции в index.html в новый порядок
- Удаляет секцию FAQ
- Убирает ссылку на FAQ из footer
- Убирает FAQ из nav меню

Новый порядок после trust-bar:
  gallery → masters → configurator → services → offers → pricing
  → loyalty → reviews → booking
"""
import re
import pathlib

SRC = pathlib.Path(r'C:\Users\USERR\Desktop\Маникюр\index.html')
html = SRC.read_text(encoding='utf-8')

# ── 1. Вырезаем блок между концом trust-bar и закрывающим </main>
# Trust-bar закрывается тегом:  </section>\n\n\n    <!-- ==
trust_end_marker = '</section>\n\n\n    <!-- ============================================================\n         SERVICES'
main_end_marker  = '\n  </main>'

idx_trust = html.index(trust_end_marker)
idx_main  = html.index(main_end_marker)

before_sections = html[:idx_trust + len('</section>')]
raw_sections    = html[idx_trust + len('</section>'):idx_main]
after_main      = html[idx_main:]

# ── 2. Разбиваем raw_sections на блоки по каждой секции
# Каждый блок начинается с  \n\n\n    <!-- ===...
splitter = re.compile(r'(?=\n\n\n    <!-- ={40,})', re.DOTALL)
blocks = splitter.split(raw_sections)
blocks = [b for b in blocks if b.strip()]

# ── 3. Определяем ID каждого блока
def get_id(block):
    m = re.search(r'<section[^>]+id="([^"]+)"', block)
    return m.group(1) if m else None

section_map = {}
for b in blocks:
    sid = get_id(b)
    if sid:
        section_map[sid] = b

print('Найдены секции:', list(section_map.keys()))

# ── 4. Новый порядок (FAQ исключён)
NEW_ORDER = ['gallery', 'masters', 'configurator', 'services',
             'offers', 'pricing', 'loyalty', 'reviews', 'booking']

missing = [s for s in NEW_ORDER if s not in section_map]
if missing:
    print('ВНИМАНИЕ: не найдены секции:', missing)

new_sections = ''.join(section_map[sid] for sid in NEW_ORDER if sid in section_map)

# ── 5. Убираем ссылку на FAQ из footer nav
after_main = after_main.replace(
    '\n          <li><a href="#faq" class="footer__nav-link">Вопросы</a></li>',
    ''
)

# ── 6. Собираем итоговый HTML
new_html = before_sections + new_sections + after_main
SRC.write_text(new_html, encoding='utf-8')
print(f'Готово! Строк: {len(new_html.splitlines())}')
print('Порядок секций:', NEW_ORDER)
