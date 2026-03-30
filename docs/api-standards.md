# API Routes Standardisierung — AppFabrik / Feldhub Base

> Stand: März 2026 | Gilt für alle Tenants

---

## Konventionen

### URL-Struktur

```
/api/{resource}              → Collection (GET list, POST create)
/api/{resource}/{id}         → Item (GET, PUT/PATCH, DELETE)
/api/{resource}/{id}/{sub}   → Nested Resource
/api/auth/{action}           → Auth-Routen (NextAuth)
/api/cron/{action}           → Cron-Jobs (intern)
/api/export/{format}         → Daten-Export
```

### HTTP-Methoden

| Methode | Bedeutung | Beispiel |
|---------|-----------|---------|
| GET | Lesen (liste oder einzeln) | `GET /api/auftraege` |
| POST | Erstellen | `POST /api/auftraege` |
| PATCH | Teilupdate | `PATCH /api/auftraege/123` |
| PUT | Vollständiges Update | `PUT /api/auftraege/123` |
| DELETE | Löschen (soft) | `DELETE /api/auftraege/123` |

> **WICHTIG:** Kein Hard-Delete in Production. Immer `deletedAt` setzen.

### Antwort-Format (Standard)

```typescript
// Erfolg (Liste)
{
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}

// Erfolg (Einzeln)
{
  "data": { ... }
}

// Fehler
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Auftrag nicht gefunden",
    "details": {}  // optional, nur in dev
  }
}
```

### Error Codes

| Code | HTTP Status | Beschreibung |
|------|-------------|--------------|
| `UNAUTHORIZED` | 401 | Nicht eingeloggt |
| `FORBIDDEN` | 403 | Keine Berechtigung |
| `NOT_FOUND` | 404 | Ressource nicht gefunden |
| `VALIDATION_ERROR` | 422 | Eingabefehler |
| `CONFLICT` | 409 | Duplikat / Konflikt |
| `INTERNAL_ERROR` | 500 | Server-Fehler |
| `RATE_LIMITED` | 429 | Zu viele Anfragen |

---

## Standard Route Handler (Vorlage)

```typescript
// src/app/api/{resource}/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateSchema = z.object({
  // Felder hier
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Nicht authentifiziert" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    prisma.resource.findMany({
      where: { deletedAt: null, tenantId: session.user.tenantId },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.resource.count({
      where: { deletedAt: null, tenantId: session.user.tenantId },
    }),
  ]);

  return NextResponse.json({
    data: items,
    meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Nicht authentifiziert" } },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Validierungsfehler", details: parsed.error.flatten() } },
      { status: 422 }
    );
  }

  const item = await prisma.resource.create({
    data: { ...parsed.data, tenantId: session.user.tenantId },
  });

  return NextResponse.json({ data: item }, { status: 201 });
}
```

---

## Query Parameter Konventionen

| Parameter | Typ | Beschreibung | Beispiel |
|-----------|-----|--------------|---------|
| `page` | number | Seitennummer (1-basiert) | `?page=2` |
| `pageSize` | number | Einträge pro Seite (max 100) | `?pageSize=50` |
| `search` | string | Freitextsuche | `?search=Eiche` |
| `sortBy` | string | Sortierfeld | `?sortBy=createdAt` |
| `sortDir` | `asc`\|`desc` | Sortierrichtung | `?sortDir=desc` |
| `filter[field]` | string | Filterfeld | `?filter[status]=active` |
| `include` | string | Related Resources | `?include=mitarbeiter,auftraege` |

---

## Authentifizierung

Alle API-Routen außer `/api/auth/*` und `/api/health` erfordern:
- Session-Cookie (NextAuth, Browser)
- oder `Authorization: Bearer <token>` (für App/API-Clients)

Tenant-Isolation: Alle Queries filtern automatisch auf `session.user.tenantId`.

---

## Rate Limiting

| Tier | Limit | Fenster |
|------|-------|---------|
| Standard (Browser) | 200 req | 1 min |
| App-Client | 500 req | 1 min |
| Cron/intern | unbegrenzt | — |

Implementierung via Upstash Redis (Middleware).

---

## Versionierung

- Aktuelle Version: v1 (implizit, kein Prefix)
- Breaking Changes → neues Prefix `/api/v2/`
- Deprecation: 6 Monate Ankündigung via Header `Deprecation: true`

---

## Health Check

```
GET /api/health
→ { "status": "ok", "version": "1.0.0", "tenant": "ka" }
```

Kein Auth erforderlich. Für Uptime-Monitoring.

---

*Erstellt: 30.03.2026 | Sprint IM*
