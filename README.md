```markdown
# Full-Stack Event Booking System

A highly scalable, decoupled full-stack web application designed to manage event listings, real-time capacity tracking, and secure ticket bookings. Built with a **React (Vite)** frontend and a **Django REST Framework** API backend, featuring asynchronous background processing and secure payment integration.

## 🚀 Key Features

* **Decoupled Architecture:** Seamless communication between a standalone React SPA and a Django REST API using strict CORS configurations.
* **Secure Authentication:** Stateless JSON Web Token (JWT) authentication for secure user sessions and role-based data access (Admin vs. Standard User).
* **Automated Background Processing:** Utilizes Celery and a Redis message broker to automatically expire unpaid ticket reservations and release capacity back to the pool.
* **Payment Integration:** Integrated Razorpay checkout flow with synchronous backend transaction verification.
* **Real-time Capacity Tracking:** Relational database schema designed to prevent double-booking and dynamically update available ticket counts.

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework:** React.js (Bootstrapped with Vite)
* **Routing & State:** React Router, Context API / Hooks
* **HTTP Client:** Axios
* **Hosting:** Vercel

### Backend (API)
* **Framework:** Python, Django 5.x, Django REST Framework (DRF)
* **Database:** PostgreSQL (Hosted on Supabase via IPv4 connection pooler)
* **Task Queue:** Celery
* **Message Broker:** Redis (Hosted on Upstash via TLS connection)
* **Authentication:** JWT (Simple JWT)
* **Payments:** Razorpay Python SDK
* **Hosting:** Render

---

## 🏗️ Architecture Overview

1. **Client Layer:** Users interact with the React frontend hosted on Vercel. Sensitive environment variables (like `VITE_API_URL`) are safely routed to the public application.
2. **API Layer:** Axios intercepts requests and communicates with the Django REST API hosted on Render. 
3. **Data Layer:** Django maps object-relational data to a cloud PostgreSQL database hosted on Supabase using `dj_database_url`.
4. **Worker Layer:** Heavy or time-sensitive tasks (like booking timeouts) are offloaded from the main Django thread to a Celery worker, communicating through an Upstash Redis broker.

---

## 💻 Local Setup & Installation

### Prerequisites
* Python 3.10+
* Node.js (v18+)
* PostgreSQL
* Redis (Running locally on port 6379 or via Docker)

### 1. Backend Setup (Django)

```bash
# Clone the repository
git clone [https://github.com/bhanuprasad1211/event-booking-system.git](https://github.com/bhanuprasad1211/event-booking-system.git)
cd event-booking-system/backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create a superuser for the Django Admin panel
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver

```

**Start the Celery Worker (In a separate terminal):**

```bash
cd backend
source venv/bin/activate
celery -A your_project_name worker --loglevel=info

```

### 2. Frontend Setup (React)

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev

```

---

## 🔐 Environment Variables

You will need to create `.env` files in both your frontend and backend directories.

**Backend (`backend/.env`):**

```env
DEBUG=True
SECRET_KEY=your_django_secret_key
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
CELERY_BROKER_URL=redis://localhost:6379/0  # Use Upstash TLS URL in production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com
CORS_ALLOWED_ORIGINS=http://localhost:5173,[https://your-vercel-app.vercel.app](https://your-vercel-app.vercel.app)

```

**Frontend (`frontend/.env`):**

```env
VITE_API_URL=http://localhost:8000/api/  # Use Render API URL in production

```

*(Note: Ensure `VITE_API_URL` is set as a standard Config variable in Vercel without markdown formatting.)*

---

## 🧑‍💻 Author

**Bandaru Bhanuprasad**

* **GitHub:** [@bhanuprasad1211](https://github.com/bhanuprasad1211)
