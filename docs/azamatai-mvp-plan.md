# AzamatAI MVP Plan

## 1. Product Foundation

### 1.1. Зафиксировать структуру продукта

#### Основной user flow
- Welcome screen
- Login / Register
- Dashboard Home
- Переход в 4 модуля
- Получение результата анализа

#### Основная навигация
- Dashboard
- Document Decoder
- eGov Navigator
- Loan Analyzer
- Job Offer Scanner

#### Базовый продуктовый принцип
- MVP = desktop-first + clean SaaS UI

### 1.2. Зафиксировать визуальную систему

#### Цвета
- Основной акцент: blue / teal
- Светлый фон
- Нейтральные серые карточки / бордеры
- Цвета статусов risk: low / medium / high

#### Типографика
- Большой заголовок hero/home
- Подзаголовки секций
- Текст карточек
- Подписи инпутов и кнопок

#### Базовые UI-принципы
- Скругления
- Тени
- 8px spacing system
- Единые отступы

#### Тон интерфейса
- Надёжный
- Спокойный
- Профессиональный
- Не перегруженный

### 1.3. Определить MVP scope

#### Обязательно
- Welcome
- Auth screens
- Dashboard Home
- Sidebar navigation
- 4 module screens
- Loading state
- Empty state
- Result cards

#### Необязательно на первом этапе
- Полноценный профиль
- Настройки
- Реальная аналитика
- История пользователя
- Мобильная адаптация уровня production

## 2. Figma / UI Design Phase

### 2.1. Экран Welcome
- Логотип AzamatAI
- Заголовок продукта
- Подзаголовок
- Кнопка Get Started
- Кнопка Sign In
- 4 feature highlights:
  - Document Decoder
  - eGov Navigator
  - Loan Analyzer
  - Job Offer Scanner

### 2.2. Экран Login
- Карточка входа
- Email field
- Password field
- Sign In button
- Link to Sign Up

### 2.3. Экран Register
- Карточка регистрации
- Email field
- Password field
- Confirm password
- Create Account button
- Link to Sign In

### 2.4. Main Dashboard Layout

#### Левый sidebar
- Dashboard
- Document Decoder
- eGov Navigator
- Loan Analyzer
- Job Offer Scanner

#### Верхняя панель
- Название текущей страницы
- RU / KZ toggle
- User avatar

#### Основная content area
- Контент активного модуля или dashboard

### 2.5. Dashboard Home Screen
- Welcome block:
  - "Welcome to AzamatAI"
  - Краткое описание продукта
- 4 feature cards:
  - Document Decoder
  - eGov Navigator
  - Loan Analyzer
  - Job Offer Scanner
- Optional recent activity block
- Optional quick actions block

### 2.6. Module Screen: Document Decoder

#### Left input panel
- Textarea
- Upload button
- Analyze button
- Try Demo button

#### Right result panel
- Document type badge
- Summary block
- Actions list
- Deadline block
- Risk badge
- Warnings block

### 2.7. Module Screen: eGov Navigator

#### Left input panel
- Goal input / textarea
- Examples hints
- Show Steps button
- Try Demo button

#### Right result panel
- Goal
- Required documents
- Steps
- Where to apply
- Notes / warnings

### 2.8. Module Screen: Loan Analyzer

#### Left input panel
- Loan amount
- Duration
- Monthly payment
- Fees
- Insurance
- Analyze button
- Try Demo button

#### Right result panel
- Total payment
- Overpayment
- Overpayment percentage
- Risk badge
- Recommendation
- Warnings

### 2.9. Module Screen: Job Offer Scanner

#### Left input panel
- Job description textarea
- Scan button
- Try Demo button

#### Right result panel
- Risk score
- Risk badge
- Red flags list
- Explanation
- Recommendation

### 2.10. UI Kit / Components in Figma

#### Buttons
- Primary
- Secondary
- Disabled

#### Inputs
- Text input
- Textarea
- Select / optional
- Input label + helper text

#### Status components
- RiskBadge Low
- RiskBadge Medium
- RiskBadge High

#### Cards
- Feature card
- Result card
- Warning card
- Empty state card

#### States
- Loading skeleton
- Empty state
- Error state

## 3. Frontend Architecture in Vue 3

### 3.1. Project setup
- Create Vue 3 + Vite app
- Setup router
- Setup UI styling strategy:
  - Tailwind or custom CSS
  - Or component library if needed
- Setup assets
- Setup env variables

### 3.2. Folder structure

```text
src/
  assets/
  components/
  layouts/
  pages/
  views/
  router/
  services/
  composables/
  stores/
  types/
```

### 3.3. Layout system

#### AuthLayout
- For Welcome / Login / Register
- Centered content layout

#### DashboardLayout
- Sidebar
- TopBar
- Main content wrapper

#### Responsive layout rules
- Базовые desktop-first правила для MVP

### 3.4. Routing
- `/` -> Welcome page
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/document-decoder`
- `/dashboard/egov-navigator`
- `/dashboard/loan-analyzer`
- `/dashboard/job-offer-scanner`

### 3.5. Global state
- Auth state
- Current user placeholder
- Current language
- Sidebar active item
- Optional recent analysis state

## 4. Frontend Implementation by Screens

### 4.1. Welcome Page
- Build hero block
- Add CTA buttons
- Add feature highlights
- Connect buttons to router

### 4.2. Login Page
- Build login form
- Add validation
- Add submit button
- Add redirect to dashboard
- Add link to register

### 4.3. Register Page
- Build register form
- Add password confirmation
- Add validation
- Add create account action
- Add link to login

### 4.4. Dashboard Layout
- Build sidebar component
- Build topbar component
- Build route outlet
- Build page title logic

### 4.5. Dashboard Home
- Welcome title
- Product description section
- Feature cards grid
- Quick action buttons
- Optional recent activity placeholder

### 4.6. Document Decoder Page
- Build input panel
- Build result panel
- Add empty state
- Add loading state
- Add mocked result rendering

### 4.7. eGov Navigator Page
- Build input panel
- Build result panel
- Add empty state
- Add loading state
- Add mocked result rendering

### 4.8. Loan Analyzer Page
- Build form inputs
- Build result panel
- Emphasize numeric blocks
- Add empty state
- Add loading state
- Add mocked result rendering

### 4.9. Job Offer Scanner Page
- Build textarea input
- Build result panel
- Add risk score UI
- Add red flags list
- Add loading state
- Add mocked result rendering

### 4.10. Shared components implementation
- AppLogo
- SidebarNav
- TopBar
- PrimaryButton
- SecondaryButton
- InputField
- TextAreaField
- ResultCard
- RiskBadge
- EmptyState
- LoadingState
- ErrorAlert

## 5. API Integration Stage

### 5.1. API service layer
- Create api client
- Setup base URL
- Setup request helpers
- Setup error handling

### 5.2. Connect Document Decoder
- Send textarea content to backend
- Receive structured result
- Render result card dynamically

### 5.3. Connect eGov Navigator
- Send goal request
- Receive steps data
- Render structured guidance

### 5.4. Connect Loan Analyzer
- Send loan form values
- Receive calculations + AI summary
- Render financial result panel

### 5.5. Connect Job Offer Scanner
- Send job text
- Receive risk analysis
- Render flags and explanation

### 5.6. Fallback UX
- Handle request failure
- Handle empty backend response
- Handle validation errors
- Show graceful error messages

## 6. Authentication and Supabase Stage

### 6.1. Supabase setup
- Create project
- Configure auth
- Add environment keys
- Connect frontend client

### 6.2. Auth integration
- Register user
- Login user
- Persist session
- Logout user
- Protect dashboard routes

### 6.3. User dashboard state
- Show current user
- Redirect unauthorized users
- Keep session on refresh

### 6.4. Optional MVP additions
- Store analysis history
- Show recent analyses on dashboard
- Save demo usage records

## 7. Content and UX Copy Stage

### 7.1. Welcome copy
- Strong title
- Clear subtitle
- Action-oriented CTA labels

### 7.2. Dashboard home copy
- Product description
- Module descriptions
- Friendly onboarding language

### 7.3. Module placeholders
- Input placeholder text
- Empty state messages
- Loading messages
- Error copy

### 7.4. Demo content
- Demo tax notice text
- Demo eGov task
- Demo loan values
- Demo suspicious job posting

## 8. Polish Stage

### 8.1. Visual polish
- Fix spacing
- Align cards
- Normalize buttons
- Improve typography hierarchy
- Improve icon consistency

### 8.2. UX polish
- Disable buttons during loading
- Add hover states
- Add active nav state
- Add form validation messages
- Add success / failure feedback

### 8.3. Demo polish
- Add Try Demo to each module
- Prepare best-looking outputs
- Ensure risk badges look consistent
- Ensure dashboard home looks full and convincing

### 8.4. Responsive polish
- Tablet layout fixes
- Sidebar collapse option
- Stack columns on smaller screens
- Ensure auth screens remain centered

## 9. Testing Stage

### 9.1. Navigation test
- Welcome -> Login
- Welcome -> Register
- Login -> Dashboard
- Sidebar navigation between modules

### 9.2. UI state test
- Empty state
- Loading state
- Success state
- Error state

### 9.3. Form test
- Required fields
- Wrong input formats
- Disabled button states
- Demo button behaviour

### 9.4. API test
- All 4 modules hit backend correctly
- Response renders correctly
- Error handling works
- Auth state doesn’t break requests

## 10. Demo Readiness

### 10.1. Demo flow
- Open Welcome screen
- Show login
- Enter dashboard
- Show product description
- Open one strong module
- Run demo example
- Show result

### 10.2. Screens that must look finished
- Welcome
- Login
- Dashboard Home
- Loan Analyzer
- Job Offer Scanner

### 10.3. Backup plan
- Mock data version if backend fails
- Static screenshots in Figma
- Pre-filled demo input

### 10.4. Presentation framing
- Explain problem
- Explain 4 modules
- Explain user journey
- Explain stack
- Explain why Kazakhstan-specific AI matters

## Приоритетный порядок работы

### Этап 1. Сначала дизайн-оболочка
- Welcome
- Login / Register
- Dashboard layout
- Dashboard Home
- Один модуль как эталон
- Потом остальные три по шаблону

### Этап 2. Потом перенос в Vue
- layouts
- routes
- sidebar
- home
- module pages
- shared components

### Этап 3. Потом подключение API
- Сначала Loan Analyzer
- Потом Job Offer Scanner
- Потом Document Decoder
- Потом eGov Navigator

### Этап 4. Потом auth и polish
- Supabase Auth
- route guards
- session
- demo state
- error state

## Что критично для MVP

### Критично
- Welcome
- Login / Register
- Dashboard sidebar
- Dashboard home с описанием продукта
- 4 страницы модулей
- Хотя бы 2-3 рабочих интеграции
- Loading / empty / error states

### Можно упростить
- Профиль
- История
- Полноценные настройки
- Сложная адаптивность
- Продвинутая аналитика
