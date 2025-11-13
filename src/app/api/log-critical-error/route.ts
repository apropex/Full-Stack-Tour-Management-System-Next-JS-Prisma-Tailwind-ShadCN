//

// app/api/log-critical-error/route.ts
export async function POST(req: Request) {
  //   const body = await req.json();
  // Save to DB / Slack / Email
  //   await prisma.errorLog.create({ data: body });
  return Response.json({ ok: true });
}
