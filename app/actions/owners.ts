"use server";

import { revalidatePath } from "next/cache";
import { uploadPropertyImage } from "@/app/actions/upload";
import prisma from "@/lib/db";

function serializeOwner<T extends { createdAt: Date; updatedAt: Date }>(o: T) {
    return {
        ...o,
        createdAt: (o as any).createdAt.toISOString(),
        updatedAt: (o as any).updatedAt.toISOString(),
    };
}

function serializeProperty<T extends { price: unknown; createdAt: Date; updatedAt: Date }>(p: T) {
    return {
        ...p,
        price: String((p as any).price),
        createdAt: (p as any).createdAt.toISOString(),
        updatedAt: (p as any).updatedAt.toISOString(),
    };
}

export async function getOwners() {
    const list = await prisma.owner.findMany({
        include: { properties: true },
        orderBy: { createdAt: "desc" },
    });
    return list.map((o) => ({
        ...serializeOwner(o),
        properties: o.properties.map(serializeProperty),
    }));
}

export async function getOwnerById(id: string) {
    const owner = await prisma.owner.findUnique({
        where: { id },
        include: { properties: true },
    });
    if (!owner) return null;
    return {
        ...serializeOwner(owner),
        properties: owner.properties.map(serializeProperty),
    };
}

export async function createPropertyOwnerWithUpload(formData: FormData) {
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

    const owner = await prisma.owner.create({
        data: {
            name: formData.get("name") as string,
            address: (formData.get("address") as string) || null,
            phone: (formData.get("phone") as string) || null,
            email: (formData.get("email") as string) || null,
            imageUrl: imageUrl || null,
        },
    });

    // If a propertyId was provided, link the property to this owner
    const propertyId = (formData.get("propertyId") as string) || null;
    if (propertyId) {
        try {
            await prisma.property.update({
                where: { id: propertyId },
                data: { ownerId: owner.id },
            });
            revalidatePath(`/property/${propertyId}`);
        } catch (err) {
            // ignore update errors but still return created owner
        }
    }

    revalidatePath("/owners");
    revalidatePath("/properties");
    revalidatePath("/");

    return owner;
}

export async function updatePropertyOwnerWithUpload(id: string, formData: FormData) {
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

    const owner = await prisma.owner.update({
        where: { id },
        data: {
            name: formData.get("name") as string,
            address: (formData.get("address") as string) || null,
            phone: (formData.get("phone") as string) || null,
            email: (formData.get("email") as string) || null,
            imageUrl: imageUrl || undefined,
        },
    });

    revalidatePath("/owners");
    revalidatePath(`/owners/${id}`);
    revalidatePath("/properties");
    revalidatePath("/");

    return owner;
}

export async function deleteOwner(id: string) {
    // First, unlink any properties from this owner
    await prisma.property.updateMany({
        where: { ownerId: id },
        data: { ownerId: null },
    });

    // Then delete the owner
    const owner = await prisma.owner.delete({
        where: { id },
    });

    revalidatePath("/owners");
    revalidatePath("/properties");
    revalidatePath("/");

    return owner;
}
