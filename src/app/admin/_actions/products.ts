"use server"

import { z } from 'zod';
import fs from "fs/promises";
import path from "path";
import db from '@/db/db';
import { notFound, redirect } from 'next/navigation';

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
  if(result.success === false) return result.error.formErrors.fieldErrors;
 
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

  redirect("/admin/products");
}


export async function toggleProductAvailability (id: string, isAvailableForPurchase: boolean){
  await db.product.update({ where: {id}, data: {
    isAvailableForPurchase
  }})
}

export async function deleteProduct(id: string){
  const product = await db.product.delete({ where: {id}} )
  if(product == null) return notFound();
}