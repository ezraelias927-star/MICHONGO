# MICHONGO - Community-Driven Opportunity & Wealth Hub (Tanzania)

## 1. Project Overview
**MICHONGO** is a high-engagement, community-driven web platform designed for Tanzanian entrepreneurs, farmers, and business seekers. It provides a localized space to share actionable business ideas, farming insights, investment opportunities, and digital hustles—avoiding the operational complexities and logistics nightmares of traditional B2B e-commerce platforms (like Alibaba).

* **Core Mission:** Connect people seeking real, actionable economic opportunities in Tanzania without high operational friction or heavy physical fieldwork.
* **Ecosystem Beneficiary:** Acts as a traffic magnet to promote **Core Digital** (the founder's web design, application development, and branding agency).

---

## 2. Tech Stack
* **Backend Framework:** Python (Flask)
* **ORM:** Flask-SQLAlchemy
* **Database:** PostgreSQL hosted on Supabase
* **Media Storage:** Cloudinary (for storing profile pictures, post images, and ad banners)
* **Frontend:** Bootstrap (Mobile-first responsive design) + Jinja2 Templates

---

## 3. Database Architecture (5 Core Tables)

### A. `users`
* `id` (Integer, Primary Key)
*`is_admin` = db.Column(db.Boolean, default=False, nullable=False)
* `username` (String, Unique)
* `email` (String, Unique)
* `password_hash` (String)
* `is_verified_business` (Boolean, Default: `false`) — Trust badge for verified merchants/entrepreneurs.
* `created_at` (DateTime)

### B. `categories`
* `id` (Integer, Primary Key)
* `name` (String, Unique) — e.g., *Kilimo & Ufugaji*, *Biashara & Mitaji*, *Uwekezaji & Ardhi*, *Tech & Digital*
* `slug` (String, Unique)

### C. `posts`
* `id` (Integer, Primary Key)
* `title` (String)
* `content` (Text) — Detailed breakdown of the opportunity or discussion.
* `image_url` (String, Nullable) — Cloudinary asset URL.
* `is_pinned` (Boolean, Default: `false`) — Used for promoted/official posts or admin announcements.
* `views_count` (Integer, Default: `0`)
* `user_id` (Integer, Foreign Key -> `users.id`)
* `category_id` (Integer, Foreign Key -> `categories.id`)
* `created_at` (DateTime), `updated_at` (DateTime)

### D. `comments`
* `id` (Integer, Primary Key)
* `content` (Text) — Ujumbe wa maoni au mjadala.
* `user_id` (Integer, Foreign Key -> `users.id`) — Mtumiaji aliyeandika maoni.
* `post_id` (Integer, Foreign Key -> `posts.id`) — Mada husika inayojadiliwa.
* `parent_id` (Integer, Foreign Key -> `comments.id`, Nullable) — Inatumika kwa ajili ya **Threaded Replies** (kumwezesha mtumiaji kujibu comment ya mwenzake chini kwa chini bila kikomo).
* `created_at` (DateTime)

### E. `site_ads` (Core Digital Ad Engine)
* `id` (Integer, Primary Key)
* `title` (String)
* `banner_url` (String) — Cloudinary banner URL.
* `target_link` (String) — Redirect URL (WhatsApp, Core Digital website, etc.).
* `position` (String, Default: `'header'`) — Display placement (`header`, `sidebar`, `in-feed`).
* `is_active` (Boolean, Default: `true`)
* `created_at` (DateTime)

---

## 4. Key Strategic Rules for AI & Developers
1. **No Heavy Operations / Logistics:** Do not suggest adding shipping, escrow payments, or inventory tracking. Keep it community-first (Discussions, Opportunities, and Connections).
2. **Use SQLAlchemy:** Always use Flask-SQLAlchemy models and ORM practices instead of raw SQL queries.
3. **Cloudinary Integration:** Never store local image binaries. All uploaded assets must go to Cloudinary, and only the resulting secure URL is saved in the database (`image_url` or `banner_url`).




             FRONTEND DESIGN OF MICHONGO WEBSITE APPLICATION


This document outlines the technical architecture, UI/UX principles, and file structure for the client-side (Frontend) of the MICHONGO platform, designed to seamlessly interface with a modular Flask REST API Backend.
1. Core Architectural Principles

    Single Page Application (SPA): The application relies on a single index.html file acting as the App Shell / Skeleton. All dynamic content is rendered and manipulated seamlessly via JavaScript without full page reloads.

    Strict Separation of Concerns: Clean boundary separation between HTML, CSS, and JavaScript. Avoid inline styles or embedded JavaScript logic.

    Modular Code & Low Line Count: Maintain concise, single-responsibility files. Utilize ES6 Modules (import/export) to share state, API handlers, and UI components across modular files.

    Spatial Memory Preservation: The primary skeletal layout and core navigation elements remain stable post-launch to preserve user habits and muscle memory.

2. Design System & Color Palette (Clean Light Mode)

To ensure optimal readability and eliminate eye fatigue associated with heavy dark themes, the application adopts a modern Clean Light Theme:

    Main Background: #F8FAFC (Off-white / Soft light slate for a clean backdrop).

    Cards & Containers: #FFFFFF (Pure white for crisp component separation).

    Primary Text: #0F172A (Deep Charcoal / Navy for high-contrast legibility).

    Subtexts / Meta Data: #64748B (Muted gray for timestamps and secondary details).

    Primary Accent / CTA Buttons: #2563EB (Royal Blue) or #059669 (Vibrant Green for key action triggers like post submission and logins).

3. UI Layout & Skeleton Structure (index.html)

The main interface is structured into three primary layout zones:

    Top Header:

        A fixed header containing the MICHONGO logo, a central search input bar, and a hamburger menu for secondary options.

    Main Feed Area:

        The central viewport container where deal cards and posts dynamically render using an Infinite / Endless Scroll mechanism.

    Floating Bottom Navigation Bar (No Traditional Footer):

        Due to the endless scrolling feed, traditional footers are omitted. Instead, a sleek Floating Bottom Nav Bar provides rapid access to essential actions:

            New Post / Opportunity

            Categories

            Profile / Login / Register (Dynamically adapts based on user authentication state: Logged In vs Logged Out).

4. Backend Integration (Flask REST APIs)

The frontend communicates directly with the Flask Backend using standard Fetch API calls under the following conventions:

    Session Management: All fetch requests include credentials: 'same-origin' to naturally pass and validate cookie-based Flask sessions.

    Core Endpoints:

        POST /auth/login & POST /auth/register (User Authentication).

        GET /posts & POST /posts/create (Feed retrieval and Cloudinary media uploading).

        GET /posts/<id>/comments & POST /posts/comments/create (Comment threads and nested reply handling via parent_id)



5.UI layout(Pre analysis of UI layout according to available data)


frontend/
├── index.html                 ← App Shell pekee (HTML safi, hakuna CSS/JS ndani)
├── css/
│   ├── tokens.css             ← rangi, spacing, fonts (CSS variables)
│   ├── base.css               ← reset na typography
│   ├── layout.css             ← mpangilio wa shell: header / main / bottom nav
│   ├── header.css             ← search bar + hamburger
│   ├── drawer.css             ← menu ya hamburger
│   ├── bottom-nav.css         ← floating navbar
│   ├── post-card.css          ← kadi ya post
│   ├── forms.css              ← inputs na buttons
│   └── sheet.css              ← bottom sheet ya Categories
└── js/
    ├── main.js                ← entry: boot, mount components, anza router
    ├── router.js              ← hash router (#/login, #/register, #/new)
    ├── store.js               ← state ndogo: user, category, search query
    ├── api/
    │   ├── client.js          ← fetch wrapper (CSRF, JSON, makosa)
    │   ├── auth.js
    │   ├── posts.js
    │   └── categories.js
    ├── components/
    │   ├── header.js          ← search + hamburger
    │   ├── drawer.js
    │   ├── bottomNav.js       ← inabadilika kulingana na hali ya login
    │   ├── postCard.js        ← inatengeneza kadi moja
    │   └── categorySheet.js
    ├── views/
    │   ├── feed.js            ← endless scroll
    │   ├── register.js
    │   ├── login.js
    │   └── newPost.js
    └── utils/
        ├── dom.js             ← helpers (el, clear, mount)
        ├── format.js          ← tarehe, truncate
        └── infiniteScroll.js  ← IntersectionObserver