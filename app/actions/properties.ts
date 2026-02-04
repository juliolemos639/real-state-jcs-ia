"use server";

import { revalidatePath } from "next/cache";
import { uploadPropertyImage } from "@/app/actions/upload";
import prisma from "@/lib/db";

/** Serializa um imóvel para ser passado a Client Components (evita Decimal/Date). */
function serializeProperty<T extends { price: unknown; createdAt: Date; updatedAt: Date }>(
  p: T
) {
  return {
    ...p,
    price: String(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

/** Serializa uma consulta para ser passada a Client Components. */
function serializeEnquiry<T extends { createdAt: Date }>(e: T) {
  return {
    ...e,
    createdAt: e.createdAt.toISOString(),
  };
}

export async function getProperties() {
  const list = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
  return list.map(serializeProperty);
}

export async function getPropertyById(id: string) {
  console.log("Fetching property with id:", id);
  const property = await prisma.property.findUnique({
    where: { id },
    include: { enquiries: { orderBy: { createdAt: "desc" } } },
  });
  if (!property) return null;
  return {
    ...serializeProperty(property),
    enquiries: property.enquiries.map(serializeEnquiry),
  };
}

export type CreatePropertyInput = {
  title: string;
  description?: string;
  address: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  imageUrl?: string;
};

export async function createProperty(data: CreatePropertyInput) {
  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description || null,
      address: data.address,
      price: data.price,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area ?? null,
      imageUrl: data.imageUrl || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/properties");
  return property;
}

/** Cria imóvel a partir do formulário; faz upload da imagem se um arquivo for enviado. */
export async function createPropertyWithUpload(formData: FormData) {
  let imageUrl: string | undefined;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const result = await uploadPropertyImage(formData);
    if ("error" in result) throw new Error(result.error);
    imageUrl = result.url;
  } else {
    const url = (formData.get("imageUrl") as string)?.trim();
    if (url) imageUrl = url;
  }
  await createProperty({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    address: formData.get("address") as string,
    price: formData.get("price") as string,
    bedrooms: Number(formData.get("bedrooms")),
    bathrooms: Number(formData.get("bathrooms")),
    area: formData.get("area") ? Number(formData.get("area")) : undefined,
    imageUrl,
  }
  );
}

export async function deleteProperty(id: string) {
  await prisma.property.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/properties");
}
