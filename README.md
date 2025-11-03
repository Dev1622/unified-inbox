# 📬 Unified Inbox 

A production-ready unified messaging dashboard built with **Next.js**, **Prisma**, **Docker**, and **Twilio**. This unified inbox supports real-time WhatsApp messaging, scheduled messages, notes, and email previews — all in a clean, tabbed interface.

# Video Walkthrough Link

https://www.loom.com/share/c12bc73ebc344a5eb2eed4ebaa1fac6d

---

## 🚀 Features

- ✅ WhatsApp-style chat interface with live refresh  
- ✅ Sticky ComposeBox for seamless message sending  
- ✅ Notes and scheduled messages with timeline history  
- ✅ Tabbed layout: Chat, Notes, Schedule, Email  
- ✅ Stylish login page with social buttons  
- ✅ Modular architecture with clean folder structure  
- ✅ Analytics dashboard to visualize per-contact and global activity trends

---

## 🧩 Tech Stack

| Layer        | Tech Used                     |
|--------------|-------------------------------|
| Frontend     | Next.js, Tailwind CSS         |
| Backend      | Node.js, Prisma, REST API     |
| Messaging    | Twilio (WhatsApp, Email)      |
| Scheduling   | Custom DB + cron-like logic   |
| Auth         | JWT-based (custom)            |
| Database     | PostgreSQL                    |
| DevOps       | Docker                        |

---

## 🔌 Integration Comparison

| Channel     | Latency (avg) | Cost (per msg) | Reliability | Notes                          |
|-------------|---------------|----------------|-------------|--------------------------------|
| WhatsApp    | ~1s           | $0.005         | High        | Powered by Twilio              |
| Email       | ~2–5s         | Free (SMTP)    | Medium      | Powered by Twilio        |
| SMS         | ~1s           | $0.007         | High        | Not implemented (carrier restrictions)         |
| Notes       | Instant       | Free           | Internal    | Stored locally in DB           |
| Scheduled   | Delayed       | Free           | Internal    | Triggered via polling/cron     |

---

## 🧠 Key Decisions

- **Auth**: Simplified auth flow to unblock MVP progress and avoid type conflicts.  
- **Live polling for chat**: Chosen over WebSockets for speed and simplicity.  
- **Modular timeline model**: Unified messages, notes, and scheduled items under a single timeline for clean rendering.  
- **Tabbed layout**: Improves UX by separating concerns and reducing visual clutter.  
- **Analytics-first mindset**: Designed the dashboard to support per-contact and global metrics from the start, with scalable data modeling for future channels.
- **Minimalist UX**: Prioritized clarity and responsiveness — sticky ComposeBox, intuitive tab navigation, and clean spacing for message bubbles and forms.
 

---

## 🧪 Demo Tips
 
- Try sending a WhatsApp message via Twilio  
- Add notes and scheduled messages to see them appear in the timeline  
- Switch tabs to explore the full layout  

---

## 📄 License

MIT — feel free to use, modify, and build on top of it.

