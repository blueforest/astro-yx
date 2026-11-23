export type Inquiry = {
  id: number;
  name: string;
  email: string;
  country: string | null;
  application_details: string;
  created_at: string;
};

const CREATE_INQUIRIES_TABLE = `
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  application_details TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)
`;

const CREATE_INQUIRIES_INDEX = `
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC)
`;

export async function ensureInquiriesSchema(db: D1Database): Promise<void> {
  const createTable = await db.prepare(CREATE_INQUIRIES_TABLE).run();
  if (!createTable.success) {
    throw new Error("Failed to ensure inquiries table exists");
  }

  const createIndex = await db.prepare(CREATE_INQUIRIES_INDEX).run();
  if (!createIndex.success) {
    throw new Error("Failed to ensure inquiries index exists");
  }
}

export async function insertInquiry(
  db: D1Database,
  input: {
    name: string;
    email: string;
    country?: string;
    application_details: string;
  },
): Promise<void> {
  await ensureInquiriesSchema(db);

  const result = await db
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

  if (!result.success) {
    throw new Error("D1 insert failed");
  }
}

export async function listInquiries(db: D1Database): Promise<Inquiry[]> {
  await ensureInquiriesSchema(db);

  const { results } = await db
    .prepare(
      `SELECT id, name, email, country, application_details, created_at
       FROM inquiries
       ORDER BY datetime(created_at) DESC, id DESC`,
    )
    .all<Inquiry>();

  return results ?? [];
}
