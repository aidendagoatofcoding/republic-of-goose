import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const MASTER_PASSPHRASE = 'HONK2026';
const ALLOWED_THEMES = ['forest', 'ocean', 'sunset', 'royal'];

async function readConfig(admin) {
  const page = await admin.entities.NationConfig.list({ sort: '-created_date', limit: 1 });
  return page?.items?.[0] ?? null;
}

async function writeConfig(admin, patch) {
  const current = await readConfig(admin);
  if (current) {
    return admin.entities.NationConfig.update(current.id, patch);
  }
  return admin.entities.NationConfig.create({ announcement: '', theme: 'forest', ...patch });
}

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const passphrase = typeof body.passphrase === 'string' ? body.passphrase : '';

    if (!passphrase) {
      return Response.json({ error: 'Administrator password required.' }, { status: 400 });
    }
    if (passphrase !== MASTER_PASSPHRASE) {
      return Response.json({ error: 'Access denied. Incorrect Master Goose password.' }, { status: 403 });
    }

    const base44 = createClientFromRequest(req);
    const admin = base44.asServiceRole;
    const action = body.action;

    if (action === 'ping') {
      return Response.json({ ok: true });
    }

    if (action === 'saveAnnouncement') {
      const announcement = String(body.announcement ?? '').slice(0, 4000);
      const config = await writeConfig(admin, { announcement });
      return Response.json({ ok: true, announcement: config.announcement });
    }

    if (action === 'saveTheme') {
      if (!ALLOWED_THEMES.includes(body.theme)) {
        return Response.json({ error: 'Unknown theme.' }, { status: 400 });
      }
      const config = await writeConfig(admin, { theme: body.theme });
      return Response.json({ ok: true, theme: config.theme });
    }

    if (action === 'saveLaw') {
      const law = body.law || {};
      const title = String(law.title ?? '').trim().slice(0, 200);
      const description = String(law.description ?? '').trim().slice(0, 2000);

      if (!title || !description) {
        return Response.json({ error: 'Enter both a law title and description.' }, { status: 400 });
      }

      if (law.id) {
        const existing = await admin.entities.Law
          .get(law.id)
          .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
        if (!existing) {
          return Response.json({ error: 'That law no longer exists.' }, { status: 404 });
        }
        const updated = await admin.entities.Law.update(law.id, { title, description });
        return Response.json({ ok: true, law: updated });
      }

      const total = await admin.entities.Law.count();
      const created = await admin.entities.Law.create({
        title,
        description,
        position: (total ?? 0) + 1,
      });
      return Response.json({ ok: true, law: created });
    }

    if (action === 'deleteLaw') {
      if (!body.id) {
        return Response.json({ error: 'Law id required.' }, { status: 400 });
      }
      await admin.entities.Law.delete(body.id);
      return Response.json({ ok: true });
    }

    if (action === 'listCitizens') {
      const page = await admin.entities.Citizen.list({ sort: '-created_date', limit: 300 });
      return Response.json({ ok: true, citizens: page?.items ?? [] });
    }

    if (action === 'deleteCitizen') {
      if (!body.id) {
        return Response.json({ error: 'Citizen id required.' }, { status: 400 });
      }
      await admin.entities.Citizen.delete(body.id);
      return Response.json({ ok: true });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}