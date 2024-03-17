'use server';

import { ImageToBlue } from '@/lib/imageBlue';
import prismaClient from '@/lib/prisma';

export async function getPhotos(
  slug: string,
  page: number = 0,
  pageCount: number = 10
): Promise<any[]> {
  return await prismaClient.photo.findMany({
    skip: page * pageCount,
    take: pageCount,
    where: {},
  });
}

type PostCreateState = 'error' | 'sucess' | 'database error';
export async function createPhoto(
  photo: any,
  isChange: boolean
): Promise<PostCreateState> {
  if (isChange) {
    const imageList = photo.mainImage.split(',');
    let buffer = Buffer.from(imageList[1], 'base64');
    const { data: bluedata, info } = await ImageToBlue(buffer);
    const newdata = `${imageList[0]},${Buffer.from(bluedata).toString('base64')}`;
    // base64 string convert buffer
    photo.mainImage = Buffer.from(newdata, 'utf-8');
  } else {
    photo.mainImage = Buffer.from(photo.mainImage, 'utf-8');
  }
  photo.updatedAt = new Date();
  await prismaClient.photo.create({
    data: photo,
  });
  return 'sucess';
}
