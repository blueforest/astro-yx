export type Inquiry = {
  id: number;
  name: string;
  email: string;
  country: string | null;
  application_details: string;
  created_at: string;
};

export async function insertInquiry(
  db: D1Database,
  input: {
    name: string;
    email: string;
    country?: string;
    application_details: string;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO inquiries (name, email, country, application_details)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(
      input.name,
      input.email,
      input.country ?? null,
      input.application_details,
    )
    .run();
}

export async function listInquiries(db: D1Database): Promise<Inquiry[]> {
  const { results } = await db
    .prepare(
      `SELECT id, name, email, country, application_details, created_at
       FROM inquiries
       ORDER BY datetime(created_at) DESC, id DESC`,
    )
    .all<Inquiry>();

  return results ?? [];
}
