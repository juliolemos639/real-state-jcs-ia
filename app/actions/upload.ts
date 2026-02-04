"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

function getExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) return ext;
  return ".jpg";
}

export async function uploadPropertyImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) {
    return { error: "Nenhuma imagem enviada." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Imagem deve ter no máximo 5 MB." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Formato inválido. Use JPG, PNG, GIF ou WebP." };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = getExtension(file.name);
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  return { url: `/uploads/${filename}` };
}
