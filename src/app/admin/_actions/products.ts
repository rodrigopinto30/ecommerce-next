"use server"

import { z } from 'zod';
import fs from "fs/promises";
import path from "path";
import db from '@/db/db';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

 const fileSchema = z.object({
   name: z.string(),
   size: z.number().min(1, { message: "Required" }),
   type: z.string()
});
 const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"), {
   message: "Invalid image type",
 });

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema,
  image: imageSchema
});

export async function addProduct(prevState: unknown, formData: FormData) {

  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) return result.error.formErrors.fieldErrors;

  const file = formData.get('file') as File;
  const image = formData.get('image') as File;

  const productDir = path.join(process.cwd(), "public", "products");
  await fs.mkdir(productDir, { recursive: true });

  const filePath = path.join(productDir, `${crypto.randomUUID()}-${file.name}`);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const imagePath = path.join(productDir, `${crypto.randomUUID()}-${image.name}`);
  await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      priceInCents: parseInt(formData.get('priceInCents') as string, 10),
      filePath: `/products/${path.basename(filePath)}`, // Guarda solo la ruta relativa
      imagePath: `/products/${path.basename(imagePath)}` // Guarda solo la ruta relativa
    }
  });

  revalidatePath("/");
  revalidatePath("/products")
  redirect("/admin/products");
}


export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({
    where: { id }, data: {
      isAvailableForPurchase
    }
  })
  revalidatePath("/");
  revalidatePath("/products")
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })
  if (product == null) return notFound();

  console.log(product)
  await fs.unlink(product.filePath);
  await fs.unlink(`public${product.imagePath}`);

  revalidatePath("/");
  revalidatePath("/products")
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional()
});

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) return result.error.formErrors.fieldErrors;
  const file = formData.get('file') as File;
  const image = formData.get('image') as File;
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const productDir = path.join(process.cwd(), "public", "products");
  await fs.mkdir(productDir, { recursive: true });
  
  // let filePath = product.filePath;
  let filePath = path.join(process.cwd(), product.filePath);

  if (result.data.file != null && result.data.file.size > 0) {
    await fs.unlink(product.filePath);

    filePath = path.join(productDir, `${crypto.randomUUID()}-${file.name}`);
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  }
  let imagePath = product.imagePath
  if (result.data.image != null && result.data.image.size > 0) {
    await fs.unlink(`public${product.filePath}`);

    imagePath = path.join(productDir, `${crypto.randomUUID()}-${image.name}`);
    await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));
  }

  await db.product.update({
    where: { id },
    data: {
      isAvailableForPurchase: false,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      priceInCents: parseInt(formData.get('priceInCents') as string, 10),
      filePath: `/products/${path.basename(filePath)}`,
      imagePath: `/products/${path.basename(imagePath)}`
    }
  });

  revalidatePath("/");
  revalidatePath("/products")

  redirect("/admin/products");
}

