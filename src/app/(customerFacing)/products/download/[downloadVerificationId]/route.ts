import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  })

  if (data == null) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url))
  }

  const absolutePath = `${process.cwd()}/public${data.product.filePath}`;
  
  const { size } = await fs.stat(absolutePath)
  const file = await fs.readFile(absolutePath)
  const extension = absolutePath.split(".").pop()

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size.toString(),
    },
  })
}