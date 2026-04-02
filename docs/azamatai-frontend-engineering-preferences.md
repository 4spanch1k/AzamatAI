# AzamatAI Frontend Engineering Preferences

Source: `/Users/aspanch1k/Downloads/AzamatAI_Frontend_Engineering_Preferences.docx`

Нормализованная Markdown-версия документа с инженерными правилами для дальнейшей работы в репозитории.

## 1. Базовые инженерные принципы

- Без Tailwind.
- Визуальная система должна быть читаемой в коде и удобной для поддержки.
- Компоненты должны быть маленькими и предсказуемыми: одна ответственность, минимум скрытой магии.
- Логика не должна смешиваться с представлением: UI, state, API и бизнес-правила разделяются.
- Сначала понятность и скорость разработки, затем декоративность.
- Красота строится на иерархии, отступах, типографике и чистых карточках.
- Производительность закладывается сразу: ленивые маршруты, минимум глобального состояния, никакого лишнего ререндера.

## 2. Рекомендуемый frontend stack

- Vue 3 + Vite
- Vue Router
- Pinia, только для реально общего состояния
- Axios или fetch-wrapper для API
- SCSS modules или scoped SCSS
- Heroicons или Lucide icons
- Опционально: VueUse для удобных composables

## 3. Что не использовать

- Tailwind utility-first подход
- Гигантские UI-киты, если они ломают контроль над стилем
- Смешивание запросов, вычислений и DOM-логики внутри одного SFC
- Огромные универсальные компоненты, которые делают всё сразу

## 4. Архитектурная модель проекта

Предпочтительный подход: feature-first, но с общим слоем shared-компонентов и сервисов.

```text
src/
├── app/                  # bootstrap, router, providers, global styles
├── layouts/              # AuthLayout, DashboardLayout
├── pages/                # route-level pages
├── features/             # document-decoder, egov, loan, job-scanner, auth
│   ├── auth/
│   ├── dashboard-home/
│   ├── document-decoder/
│   ├── egov-navigator/
│   ├── job-offer-scanner/
│   └── loan-analyzer/
├── entities/             # user, analysis
├── shared/
│   ├── ui/               # Button, Card, InputField, TextArea, RiskBadge
│   ├── api/              # api client, endpoints, interceptors
│   ├── lib/              # helpers, formatters, constants
│   ├── composables/      # useAsyncState, useRiskColor, etc.
│   ├── types/
│   └── styles/           # variables, mixins, reset, typography
└── stores/               # только действительно глобальные store
```

## 5. Правила по структуре компонентов

- Route page: только компоновка страницы и orchestration
- Feature component: логика конкретного модуля, работа с формой и API
- Shared UI component: тупой переиспользуемый элемент без бизнес-логики
- Composable: повторяемая логика состояния или поведения
- Service/API layer: все HTTP-запросы вне компонентов

## 6. Стиль кода

- Composition API, `script setup`
- Понятные имена: `DocumentDecoderPage.vue`, `LoanForm.vue`, `useLoanAnalyzer.ts`
- Минимум вложенности и длинных watcher-цепочек
- Один файл = одна ясная ответственность
- Типы выносить рядом с feature или в `shared/types`, если они общие
- Сложные вычисления держать в composables или utils, а не в template

## 7. Подход к стилизации без Tailwind

- Оптимальный выбор: SCSS modules или scoped SCSS + design tokens
- Создать единый набор токенов: colors, spacing, radius, shadows, z-index, typography
- Использовать BEM-подобные имена или модульные классы
- Не дублировать стили кнопок и карточек по страницам
- Держать глобальные utility-классы только для действительно базовых вещей
- Основа визуального качества: ритм отступов, ровные сетки, спокойные цвета, акцентные badges

## 8. Design tokens, которые стоит завести сразу

- Colors: `--color-bg`, `--color-card`, `--color-primary`, `--risk-high`
- Spacing: `--space-2`, `--space-4`, `--space-6`, `--space-8`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Shadow: `--shadow-sm`, `--shadow-md`
- Typography: `--font-size-sm`, `--font-size-base`, `--font-size-lg`

## 9. Производительность

- Lazy-load для route pages и тяжёлых модулей
- API-запросы вызывать по действию пользователя, а не через лишние watch
- Не использовать Pinia как мусорный контейнер всего приложения
- Большие блоки UI дробить на небольшие компоненты без лишних reactive-связей
- Derived data держать в computed, а не плодить `ref` + `watch`
- Skeleton/loading state делать лёгким, без тяжёлых анимаций
- Избегать огромных универсальных form-компонентов, если их сложно оптимизировать

## 10. Рекомендуемый набор layout'ов

- `AuthLayout` - welcome, login, register
- `DashboardLayout` - sidebar слева, topbar сверху, main-content справа
- `PageSection` - унифицированный контейнер страницы с title, subtitle, actions
- `SplitWorkspace` - двухколоночный layout для модулей: input слева, result справа

## 11. UI philosophy для AzamatAI

- Не перегружать интерфейс декоративностью
- Каждый модуль должен выглядеть как часть одной системы
- Самые важные сущности: input, primary action, result summary, warnings, risk badge
- Главный экран кабинета должен объяснять продукт и вести пользователя в 4 инструмента
- Финансовые цифры в Loan Analyzer должны быть визуально сильнее обычного текста

## 12. Минимальные shared UI-компоненты

- AppLogo
- SidebarNav
- TopBar
- BaseButton
- BaseInput
- BaseTextarea
- BaseCard
- RiskBadge
- ResultSection
- EmptyState
- LoadingState
- ErrorAlert

## 13. API integration conventions

- Все endpoint-функции хранить в `shared/api` или внутри `feature/api.ts`, если они специфичны
- Компонент страницы не должен знать детали HTTP-клиента
- Ответы нормализовать в service/composable слое, а не в template
- Для каждого модуля иметь свой typed request / response interface

## 14. Definition of done для frontend

- Маршруты чисто организованы и читаются с первого взгляда
- Нет копипасты больших стилей между страницами
- Компоненты переиспользуемы и не перегружены ответственностью
- UI выглядит спокойно, современно и профессионально без Tailwind noise
- Страница открывается быстро, модули подгружаются лениво, основные действия отзывчивы

## 15. Короткое решение по умолчанию

Если нужен один стандарт без лишних споров:

- Vue 3
- Vite
- Vue Router
- Pinia
- SCSS modules
- Feature-first architecture
- Shared design tokens

Это даёт чистый код, читаемый UI и хорошую производительность для MVP и дальнейшего роста.
