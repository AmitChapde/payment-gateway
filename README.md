Payment Gateway UI -- Frontend Assignment
========================================

A production-inspired payment gateway simulation built with Next.js App Router, TypeScript, Redux Toolkit, and Tailwind CSS.

The application simulates a real-world payment workflow including validation, retries, idempotent transactions, timeout handling, transaction history persistence, and accessible UX patterns --- without using any third-party payment SDKs.

* * * * *

Live Features
=============

Payment Form
------------

-   Real-time field validation

-   Card number auto-formatting

-   Dynamic card type detection

-   Currency selection (INR / USD)

-   Expiry validation with past-date prevention

-   Dynamic CVV validation (Amex = 4 digits)

-   Disabled submit until form becomes valid

-   Duplicate submission prevention during processing

Card Preview
------------

-   Live updating card preview

-   Cardholder name preview

-   Expiry preview

-   Card brand logos (Visa / Mastercard / Amex)

Payment Lifecycle
-----------------

Supports complete payment lifecycle states:

-   Idle

-   Processing

-   Success

-   Failed

-   Timeout

Gateway Simulation
------------------

Mock payment gateway implemented using a Next.js Route Handler:

-   ~60% success responses

-   ~25% failed responses

-   ~15% delayed timeout responses

Frontend timeout handling is implemented using `AbortController` with a 6-second cancellation window.

Retry & Idempotency
-------------------

-   Retry support for failed and timed-out payments

-   Maximum 3 retry attempts per transaction

-   Same transaction ID reused across retries

-   Transaction history updates existing transaction instead of creating duplicates

Transaction History
-------------------

-   Persistent transaction history using localStorage

-   Transaction details modal

-   Clickable history items

-   Retry state tracking

-   Timestamped payment records

Accessibility & UX
------------------

-   Proper labels and aria attributes

-   Focus management after payment state transitions

-   Keyboard-friendly modal behavior

-   Responsive design for mobile and desktop

* * * * *

Tech Stack
==========

Frontend
--------

-   Next.js 16 (App Router)

-   React

-   TypeScript

-   Tailwind CSS

-   Redux Toolkit

-   React Redux

-   React Icons

State Management
----------------

Redux Toolkit was chosen because the application contains:

-   Shared async payment lifecycle state

-   Retry orchestration

-   Persistent transaction history

-   Cross-component coordination

-   Idempotent transaction updates

Local component state is used only for temporary form state such as:

-   Input values

-   Validation errors

-   Touched fields

* * * * *

Project Structure
=================

```
src/
│
├── app/
│   ├── api/pay/route.ts
│   ├── page.tsx
│   ├── layout.tsx
│   └── providers.tsx
│
├── components/
│   └── payment/
│       ├── PaymentForm.tsx
│       ├── CardPreview.tsx
│       ├── StatusScreen.tsx
│       ├── TransactionHistory.tsx
│       └── TransactionDetails.tsx
│
├── services/
│   └── payment.service.ts
│
├── store/
│   ├── store.ts
│   ├── hooks.ts
│   └── features/payment/
│       ├── paymentSlice.ts
│       └── paymentThunk.ts
│
├── utils/
│   ├── card.ts
│   ├── format.ts
│   ├── validation.ts
│   └── storage.ts
│
└── types/
    └── payment.ts

```

* * * * *

Payment Flow Architecture
=========================

```
User submits form
        ↓
Transaction ID generated using crypto.randomUUID()
        ↓
Redux async thunk dispatched
        ↓
/api/pay mock gateway called
        ↓
AbortController timeout starts
        ↓
Gateway returns:
  - success
  - failure
  - timeout
        ↓
Redux state updates
        ↓
Transaction history persisted to localStorage
        ↓
Status modal shown

```

* * * * *

Important Engineering Decisions
===============================

1\. Redux Toolkit Over Local State
----------------------------------

Global state was required for:

-   Payment lifecycle tracking

-   Retry coordination

-   Transaction persistence

-   Cross-component communication

Redux Toolkit simplified:

-   Async handling

-   Typed reducers

-   State consistency

-   Predictable updates

* * * * *

2\. Idempotent Transactions
---------------------------

A unique transaction ID is generated before the first request:

```
crypto.randomUUID()

```

Retries reuse the same transaction ID to ensure:

-   No duplicate transaction records

-   Consistent retry tracking

-   Stable transaction history

History updates existing transactions instead of creating new entries.

* * * * *

3\. Timeout Handling
--------------------

The backend intentionally delays some responses to simulate gateway timeouts.

Frontend timeout handling is implemented using:

```
AbortController

```

The request is cancelled after 6 seconds while the mock API may continue processing for 8 seconds.

This mirrors real-world payment gateway timeout behavior.

* * * * *

4\. Separation of Concerns
--------------------------

Business logic is separated from JSX/UI.

### Utilities handle:

-   Validation

-   Formatting

-   Card detection

-   Storage

### Services handle:

-   API communication

-   Timeout orchestration

### Redux handles:

-   Async lifecycle

-   Shared state

-   Transaction orchestration

### Components handle:

-   Presentation

-   User interaction

* * * * *

5\. Accessibility Considerations
--------------------------------

Implemented accessibility improvements include:

-   `aria-describedby`

-   `aria-invalid`

-   Keyboard navigation support

-   Focus management after async transitions

-   Modal accessibility

-   ESC close support

-   Visible focus rings

* * * * *

Validation Rules
================

Card Number
-----------

-   Auto-formatted while typing

-   Visa / Mastercard = 16 digits

-   Amex = 15 digits

CVV
---

-   Standard cards = 3 digits

-   Amex = 4 digits

Expiry
------

-   MM/YY format

-   Past dates rejected

Amount
------

-   Must be greater than 0

* * * * *

Retry Logic
===========

Retries are allowed only for:

-   Failed payments

-   Timed-out payments

Rules:

-   Maximum 3 attempts

-   Retry updates same transaction

-   Success state disables retry

-   Final failure state shown after max attempts

* * * * *

Local Persistence
=================

Transaction history is persisted using localStorage.

On application startup:

-   Existing transactions are hydrated into Redux state

-   New updates automatically persist

* * * * *

Setup Instructions
==================

1\. Clone Repository
--------------------

```
git clone <repository-url>

```

2\. Install Dependencies
------------------------

```
npm install

```

3\. Start Development Server
----------------------------

```
npm run dev

```

4\. Open Application
--------------------

```
http://localhost:3000

```

* * * * *

Available Scripts
=================

```
npm run dev
npm run build
npm run start
npm run lint

```

* * * * *

Future Improvements
===================

If given more time, the following improvements could be added:

-   Proper focus trapping inside modals

-   Unit and integration tests

-   Payment method extensibility

-   Dark mode support

-   Toast notifications

-   Framer Motion transitions

-   Analytics dashboard

-   Better mobile gestures

-   Virtualized transaction history

-   International currency formatting


* * * * *

Notes
=====

This project intentionally avoids using external payment SDKs (Stripe/Razorpay/etc.) in order to simulate the full payment lifecycle manually.

The goal was to focus on:

-   frontend architecture

-   async state management

-   payment UX

-   accessibility

-   edge-case handling

-   production-oriented engineering decisions

* * * * *

Author
======

Amit Chapde