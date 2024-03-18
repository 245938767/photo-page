'use client';

import React from 'react';
import Image from 'next/image';
import { Photo } from '@prisma/client';

export function Photos(photo: Photo) {
  return (
    <div className="m-2">
      <div
        className="group relative flex w-full transform-gpu flex-col rounded-3xl bg-transparent ring-1 ring-[--post-image-bg] "
        style={
          {
            '--post-image-fg': '#FFFFFF',
            '--post-image-bg': '#000000',
            '--post-image': `url(${photo.mainImageUrl}`,
          } as React.CSSProperties
        }
      >
        <div className="relative aspect-[240/135] ">
          <Image
            src={photo.mainImageUrl}
            alt=""
            className="rounded-3xl object-cover"
            placeholder="blur"
            blurDataURL={photo.mainImage.toString()}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
        </div>
      </div>
    </div>
  );
}
