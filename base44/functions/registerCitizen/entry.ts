import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const DISTRICTS = [
  'Honkton',
  'Bread Valley',
  'Great Goose Forest',
  'Lake HONK',
  'Feather Mountains',
  'Outside the Republic',
];

const LEVELS = ['Not yet honking', 'Apprentice honker', 'Fluent honker', 'Native honker'];

function clientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for') || '';
  const first = forwarded.split(',')[0].trim();
  return (
    first ||
    (req.headers.get('cf-connecting-ip') || '').trim() ||
    (req.headers.get('x-real-ip') || '').trim() ||
    ''
  );
}

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const admin = createClientFromRequest(req).asServiceRole;

    const fullName = String(body.full_name ?? '').trim().slice(0, 120);
    const gooseName = String(body.goose_name ?? '').trim().slice(0, 60);
    const district = String(body.district ?? '');
    const level = String(body.honkish_level ?? '');
    const email = String(body.email ?? '').trim().slice(0, 160);

    if (fullName.length < 2) {
      return Response.json(
        { error: 'Enter your full name as it should appear on the national register.' },
        { status: 400 }
      );
    }
    if (!DISTRICTS.includes(district)) {
      return Response.json({ error: 'Choose a district of residence.' }, { status: 400 });
    }
    if (!LEVELS.includes(level)) {
      return Response.json({ error: 'Choose your HONKISH proficiency.' }, { status: 400 });
    }
    if (body.oath_accepted !== true) {
      return Response.json(
        { error: "You must take the Citizen's Oath before joining." },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'That email address does not look valid.' }, { status: 400 });
    }

    const ip = clientIp(req);

    if (ip) {
      const existing = await admin.entities.Citizen.filter({ ip_address: ip }, { limit: 1 });
      if (existing?.items?.length) {
        return Response.json(
          {
            error:
              'A citizen has already been registered from this network. Only one citizen is admitted per address.',
          },
          { status: 409 }
        );
      }
    }

    const citizen = await admin.entities.Citizen.create({
      full_name: fullName,
      goose_name: gooseName,
      district,
      honkish_level: level,
      email,
      oath_accepted: true,
      ip_address: ip,
    });

    return Response.json({ citizen });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}