# 🏡 REIA Backend (Real Estate Investment Analyzer)

This is the backend server for the **REIA (Real Estate Investment Analyzer)** project. It powers the investment calculations, pricing lookups, and authentication used by the frontend interface.

---

## ⚙️ Tech Stack

- **Node.js** + **Express**
- **MongoDB Atlas** (via Mongoose)
- **JWT** for authentication
- **Node-Cache** for response caching
- **Python + Selenium Scraper** (used only locally)
- **Render** for backend deployment

---

## 🚀 Live Deployment

- Backend: [Render](https://reia-backend.onrender.com)
- Frontend: [Vercel](https://reia-frontend.vercel.app/)

---

## Related repositories

- **Scraper**: [reia-scraper](https://github.com/prateekbalawat/reia-scraper)
- **Backend**: [reia-frontend](https://github.com/prateekbalawat/reia-frontend)

---

## 📦 Installation & Setup (Local)

### 1. Clone the repository

```bash
git clone https://github.com/prateekbalawat/reia-backend.git
cd reia-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in the root directory

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
npm start
```

Server will run on `http://localhost:5000`.

---

## 📌 API Endpoints

### 🔐 Auth Routes

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| POST   | `/api/auth/register` | Register new user  |
| POST   | `/api/auth/login`    | Login, returns JWT |

---

### 💰 Investment Routes

> All these require a JWT token in the `Authorization: Bearer <token>` header.

| Method | Endpoint                           | Description                                 |
| ------ | ---------------------------------- | ------------------------------------------- |
| POST   | `/api/invest/submit`               | Calculate ROI + size + price                |
| GET    | `/api/invest/current-price`        | Get price info for a location               |
| GET    | `/api/invest/roi`                  | Return ROI projection for investment + rate |
| GET    | `/api/invest/competitive-analysis` | Compare nearby property prices              |

#### ✅ Sample `/submit` Body

```json
{
  "investment_amount": 1000000,
  "location": "Whitefield Bangalore"
}
```

---

### 📊 Report Routes

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/reports/my-reports` | Fetch saved reports (auth) |
| DELETE | `/api/reports/:id`        | Delete report by ID        |

---

## 💡 Scraper Note (Local Only)

Originally, we used a **Python Selenium script** to scrape Housing.com live.

However:

- ❌ Hosting the scraper online failed due to headless browser limitations on platforms like Render or Cloudflare
- ✅ So we scraped sample data locally and stored it in a **`data`** collection in MongoDB
- 📥 The backend now retrieves data from this DB instead of scraping live

> Scraper script is still available in: `../reia-scraper/price_scraper.py`

You can run it manually like this:

```bash
python3 price_scraper.py
```

---

## 🧠 ROI & Caching

- Backend uses `node-cache` to cache API responses for **1 hour**
- Annual ROI growth rate is now customized per area
- ROI logic is handled in `roiService.js`

---

## 🧪 Testing with Postman

1. **Register/Login** → Get JWT token
2. **Set Header** → `Authorization: Bearer <your_token>`
3. Use `/api/invest/submit` or others with the required body/query.

---

## ⚠️ Deployment Notes

- The frontend uses a deployed backend URL (no CORS needed manually)
- All routes auto-deploy using **Render Git integration**

---

## 📁 Folder Structure

```
reia-backend/
├── controllers/
├── routes/
├── models/
├── services/
├── utils/
├── .env
├── server.js
└── README.md
```

---

## 👤 Author

- [Prateek Balawat](https://github.com/prateekbalawat)

---

## 📄 License

MIT
