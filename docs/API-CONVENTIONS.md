# API-Konventionen — AppFabrik Base

> Standard-Richtlinien für alle REST-API-Endpoints in AppFabrik-Projekten.  
> Gültig für: `appfabrik-base`, `ka-forstmanager`, alle Kunden-Forks.

---

## 📐 Grundprinzipien

1. **REST-konform** — Ressourcen als Substantive, HTTP-Verben für Aktionen
2. **JSON-only** — Request/Response immer `Content-Type: application/json`
3. **Auth per Session** — NextAuth.js Session (JWT) für alle geschützten Routen
4. **Konsistente Fehler** — Einheitliches Error-Format über alle Endpoints
5. **Tenant-aware** — Multi-Tenant-Unterstützung wo nötig (tenantId in Session)

---

## 🛤️ URL-Struktur

```
/api/{ressource}                 → Collection (GET list, POST create)
/api/{ressource}/{id}            → Item (GET one, PATCH update, DELETE remove)
/api/{ressource}/{id}/{sub}      → Sub-Resource
/api/{ressource}/{id}/{aktion}   → Custom Action (POST)
```

### Beispiele

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/auftraege` | GET | Liste aller Aufträge |
| `/api/auftraege` | POST | Neuen Auftrag erstellen |
| `/api/auftraege/123` | GET | Einzelnen Auftrag abrufen |
| `/api/auftraege/123` | PATCH | Auftrag aktualisieren |
| `/api/auftraege/123` | DELETE | Auftrag löschen |
| `/api/auftraege/123/material` | GET | Material eines Auftrags |
| `/api/auftraege/123/rechnung-erstellen` | POST | Rechnung für Auftrag generieren |

---

## 📨 HTTP-Methoden

| Methode | Zweck | Idempotent | Body |
|---------|-------|------------|------|
| `GET` | Ressource(n) abrufen | ✅ Ja | ❌ Nein |
| `POST` | Ressource erstellen, Custom Action | ❌ Nein | ✅ Ja |
| `PATCH` | Ressource teilweise aktualisieren | ✅ Ja | ✅ Ja |
| `PUT` | Ressource vollständig ersetzen | ✅ Ja | ✅ Ja |
| `DELETE` | Ressource löschen | ✅ Ja | ❌ Nein |

> ⚠️ **Bevorzuge PATCH über PUT** — Partial Updates sind sicherer und flexibler.

---

## 🔐 Authentifizierung

### Session-basiert (Standard)

```typescript
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // session.user enthält: id, email, role, tenantId, permissions
}
```

### Öffentliche Endpoints

Endpoints ohne Auth-Check nur für:
- `/api/auth/*` — Login/Logout/Register
- `/api/app/auth` — Mobile App Login
- Explizit öffentliche Daten (z.B. Wizard-Konfig)

### API-Keys (für Integrationen)

```http
Authorization: Bearer {api_key}
X-Tenant-ID: {tenant_id}
```

---

## 📥 Request-Format

### Query-Parameter (GET)

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `search` | string | Volltextsuche |
| `status` | string | Filter nach Status |
| `typ` | string | Filter nach Typ |
| `limit` | number | Max. Ergebnisse (default: 50, max: 200) |
| `offset` | number | Pagination Offset |
| `sort` | string | Sortierfeld (z.B. `createdAt`) |
| `order` | string | `asc` oder `desc` |

```http
GET /api/auftraege?status=aktiv&search=Wald&limit=20&offset=0
```

### Request Body (POST/PATCH)

```json
{
  "titel": "Pflanzung Waldgebiet Nord",
  "typ": "pflanzung",
  "flaeche_ha": 12.5,
  "startDatum": "2026-04-01"
}
```

---

## 📤 Response-Format

### Erfolg — Einzelnes Objekt

```json
{
  "id": "clx123...",
  "titel": "Pflanzung Waldgebiet Nord",
  "typ": "pflanzung",
  "status": "anfrage",
  "createdAt": "2026-03-30T18:00:00.000Z",
  "updatedAt": "2026-03-30T18:00:00.000Z"
}
```

### Erfolg — Liste

```json
[
  { "id": "clx123...", "titel": "Auftrag 1", ... },
  { "id": "clx456...", "titel": "Auftrag 2", ... }
]
```

**Header bei Listen:**
```http
X-Total-Count: 142
```

### Fehler

```json
{
  "error": "Kurze Fehlermeldung",
  "details": "Optionale technische Details (nur in dev)"
}
```

---

## 🚦 HTTP-Status-Codes

| Code | Bedeutung | Verwendung |
|------|-----------|------------|
| `200` | OK | GET erfolgreich, PATCH erfolgreich |
| `201` | Created | POST erfolgreich (neue Ressource) |
| `204` | No Content | DELETE erfolgreich |
| `400` | Bad Request | Ungültige Eingabedaten, Validierungsfehler |
| `401` | Unauthorized | Nicht eingeloggt |
| `403` | Forbidden | Keine Berechtigung für diese Aktion |
| `404` | Not Found | Ressource existiert nicht |
| `409` | Conflict | Konflikt (z.B. Duplikat, veraltete Daten) |
| `422` | Unprocessable Entity | Semantischer Fehler (Daten valide aber nicht verarbeitbar) |
| `500` | Internal Server Error | Unerwarteter Serverfehler |

---

## ✅ Validierung

### Pflichtfeld-Prüfung

```typescript
if (!body.titel?.trim()) {
  return NextResponse.json(
    { error: "titel ist ein Pflichtfeld" },
    { status: 400 }
  )
}
```

### Typ-Konvertierung

```typescript
// Zahlen explizit parsen
flaeche_ha: body.flaeche_ha ? parseFloat(body.flaeche_ha) : null

// Datum parsen
startDatum: body.startDatum ? new Date(body.startDatum) : null
```

---

## 🔄 Pagination

### Request

```http
GET /api/auftraege?limit=20&offset=40
```

### Response

```http
HTTP/1.1 200 OK
X-Total-Count: 142
Content-Type: application/json

[...20 Aufträge...]
```

### Client-Berechnung

```javascript
const totalPages = Math.ceil(totalCount / limit)
const currentPage = Math.floor(offset / limit) + 1
```

---

## 🔍 Suche & Filter

### Volltextsuche

```http
GET /api/auftraege?search=Waldgebiet
```

Durchsucht typischerweise: `titel`, `nummer`, `beschreibung`, `standort`

### Filterung

```http
GET /api/auftraege?status=aktiv&typ=pflanzung&bundesland=BY
```

Mehrere Werte pro Feld (OR):
```http
GET /api/auftraege?status=aktiv,abgeschlossen
```

---

## 📁 Datei-Upload

### Multipart Form-Data

```typescript
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const kategorie = formData.get("kategorie") as string
  
  // Datei verarbeiten...
}
```

### Response

```json
{
  "id": "doc_123",
  "dateiname": "vertrag.pdf",
  "url": "/uploads/2026/03/vertrag.pdf",
  "groesse": 245000,
  "mimeType": "application/pdf"
}
```

---

## ⚡ Cron/Background Jobs

Cron-Endpoints unter `/api/cron/*`:

```typescript
// /api/cron/sync-auftraege/route.ts
export async function GET(req: NextRequest) {
  // Optional: Bearer Token Check
  const authHeader = req.headers.get("authorization")
  const expectedToken = process.env.CRON_SECRET
  
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Job ausführen...
}
```

---

## 📱 Mobile App Endpoints

App-spezifische Endpoints unter `/api/app/*`:

| Endpoint | Beschreibung |
|----------|--------------|
| `/api/app/auth` | Login für Mobile App |
| `/api/app/me` | Aktueller User + Berechtigungen |
| `/api/app/auftraege` | Aufträge für App (optimiert) |
| `/api/app/stunden` | Zeiterfassung |

Diese Endpoints sind optimiert für:
- Geringere Payload-Größe
- Offline-Sync-Unterstützung
- Push-Token-Registrierung

---

## 🧪 Beispiel-Implementierung

```typescript
// /api/ressource/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200)
  const offset = parseInt(searchParams.get("offset") ?? "0")
  const search = searchParams.get("search")

  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {}

  const [items, total] = await Promise.all([
    prisma.ressource.findMany({ where, take: limit, skip: offset }),
    prisma.ressource.count({ where }),
  ])

  return NextResponse.json(items, {
    headers: { "X-Total-Count": String(total) },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validierung
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "name ist ein Pflichtfeld" }, { status: 400 })
    }

    const item = await prisma.ressource.create({
      data: {
        name: body.name.trim(),
        beschreibung: body.beschreibung ?? null,
        tenantId: session.user.tenantId, // Multi-Tenant
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("[Ressource POST]", error)
    return NextResponse.json(
      { error: "Interner Serverfehler", details: String(error) },
      { status: 500 }
    )
  }
}
```

---

## 📋 Checkliste für neue Endpoints

- [ ] Auth-Check implementiert (falls nicht öffentlich)
- [ ] Validierung der Pflichtfelder
- [ ] Korrekte HTTP-Status-Codes
- [ ] Error-Format einheitlich
- [ ] Pagination bei Listen (limit/offset)
- [ ] X-Total-Count Header bei Listen
- [ ] TypeScript-Typen korrekt
- [ ] In OpenAPI-Spec dokumentiert

---

## 📚 Weiterführend

- [OpenAPI-Spec](./openapi.yaml) — Maschinenlesbare API-Dokumentation
- [SECURITY-CHECKLIST.md](./SECURITY-CHECKLIST.md) — Sicherheitsrichtlinien
- [TENANT-SETUP-CHECKLIST.md](./TENANT-SETUP-CHECKLIST.md) — Neuen Tenant einrichten
