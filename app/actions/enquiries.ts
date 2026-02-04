"use server";

import prisma from "@/lib/db";
// import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getEnquiries() {
  const list = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { id: true, title: true } } },
  });
  return list.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }));
}

export type CreateEnquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId: string;
};

export async function createEnquiry(data: CreateEnquiryInput) {
  const enquiry = await prisma.enquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message,
      propertyId: data.propertyId,
    },
  });
  revalidatePath("/");
  revalidatePath("/enquiries");
  revalidatePath(`/properties/${data.propertyId}`);
  return enquiry;
}
