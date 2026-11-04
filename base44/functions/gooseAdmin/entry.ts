import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const MASTER_PASSPHRASE = 'HONK2026';
const ALLOWED_THEMES = ['forest', 'ocean', 'sunset', 'royal'];
const MAX_SUBJECT = 140;
const MAX_BODY = 4000;
const MAX_RECIPIENTS = 40;

function validEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
  );
}

function greeting(citizen) {
  return `Dear ${citizen.goose_name || citizen.full_name || 'citizen'},`;
}

function newsletterHtml(citizen, subject, message) {
  const paragraphs = message
    .split(/\n{2,}/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#E8F0E6;">${escapeHtml(
          paragraph
        ).replace(/\n/g, '<br/>')}</p>`
    )
    .join('');

  return `<div style="background:#0A0F0D;padding:28px 16px;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;background:#111A15;border:1px solid #26332A;border-radius:6px;overflow:hidden;">
    <div style="border-bottom:1px solid #26332A;padding:18px 24px;">
      <p style="margin:0;font-family:Courier,monospace;font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:#D4AF37;">Republic of Goose · National Post</p>
      <h1 style="margin:10px 0 0;font-size:24px;line-height:1.2;color:#F4F8F2;">${escapeHtml(subject)}</h1>
    </div>
    <div style="padding:22px 24px;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#E8F0E6;">${escapeHtml(greeting(citizen))}</p>
      ${paragraphs}
      <p style="margin:24px 0 0;font-family:Courier,monospace;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#8FA394;">— The Assembly of the Republic of Goose</p>
    </div>
  </div>
</div>`;
}

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

    if (action === 'adjustBread') {
      const amount = Math.round(Number(body.amount));
      if (!body.id || !Number.isFinite(amount) || amount === 0) {
        return Response.json({ error: 'Citizen and a bread amount are required.' }, { status: 400 });
      }
      const citizen = await admin.entities.Citizen.get(body.id);
      if (!citizen) return Response.json({ error: 'Citizen not found.' }, { status: 404 });
      const next = Math.max(0, Math.round(Number(citizen.bread || 0) + amount));
      await admin.entities.Citizen.update(body.id, { bread: next });
      return Response.json({ ok: true, bread: next });
    }

    if (action === 'deleteCitizen') {
      if (!body.id) {
        return Response.json({ error: 'Citizen id required.' }, { status: 400 });
      }
      await admin.entities.Citizen.delete(body.id);
      return Response.json({ ok: true });
    }

    if (action === 'newsletterAudience') {
      const page = await admin.entities.Citizen.list({ limit: 500 });
      const citizens = page?.items ?? [];
      const withEmail = citizens.filter((citizen) => validEmail(citizen.email)).length;
      return Response.json({ ok: true, total: citizens.length, withEmail });
    }

    if (action === 'sendNewsletter') {
      const subject = String(body.subject ?? '').trim().slice(0, MAX_SUBJECT);
      const message = String(body.message ?? '').trim().slice(0, MAX_BODY);
      if (!subject || !message) {
        return Response.json(
          { error: 'Write both a subject and a message before sending.' },
          { status: 400 }
        );
      }

      const page = await admin.entities.Citizen.list({ limit: 500, sort: '-created_date' });
      const recipients = (page?.items ?? [])
        .filter((citizen) => validEmail(citizen.email))
        .slice(0, MAX_RECIPIENTS);

      let sent = 0;
      let failed = 0;
      for (const citizen of recipients) {
        try {
          await admin.integrations.Core.SendEmail({
            to: citizen.email,
            from_name: 'Republic of Goose',
            subject,
            html: newsletterHtml(citizen, subject, message),
            text: `${greeting(citizen)}\n\n${message}\n\n— The Assembly of the Republic of Goose`,
            category: 'transactional',
          });
          sent += 1;
        } catch (error) {
          failed += 1;
        }
      }

      return Response.json({ ok: true, sent, failed, total: recipients.length });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}