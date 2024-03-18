'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarIcon, HourglassIcon } from '@/assets';
import { Photo } from '@prisma/client';
import moment from 'moment';

export function Photos(photo: Photo) {
  return (
    <div className="m-2">
      <div
        className="group relative flex w-full transform-gpu flex-col rounded-3xl bg-transparent ring-1 ring-[--post-image-bg] "
        style={
          {
            '--post-image-fg': '#000000',
            '--post-image-bg': '#D3D3D3',
            '--post-image': `url(${photo.mainImageUrl}`,
          } as React.CSSProperties
        }
      >
        <div className="relative aspect-[240/135] ">
          <Image
            src={photo.mainImageUrl}
            alt=""
            className="rounded-t-3xl object-cover"
            placeholder="blur"
            blurDataURL={photo.mainImage.toString()}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
          />
        </div>
        <span className="relative z-10 flex w-full flex-1 shrink-0 flex-col justify-between gap-0.5 rounded-b-[calc(1.5rem+1px)] bg-cover bg-bottom bg-no-repeat p-3 bg-blend-overlay [background-image:var(--post-image)] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:select-none before:rounded-b-[calc(1.5rem-1px)] before:bg-[--post-image-bg] before:opacity-70 before:transition-opacity after:pointer-events-none after:absolute after:inset-0 after:z-10 after:select-none after:rounded-b-[calc(1.5rem-1px)] after:bg-gradient-to-b after:from-transparent after:to-[--post-image-bg] after:backdrop-blur after:transition-opacity group-hover:before:opacity-30 ">
          <span className="relative z-20 flex items-center justify-between opacity-50 transition-opacity group-hover:opacity-80">
            <span className="inline-flex items-center space-x-3">
              <span className="inline-flex items-center space-x-1 text-[12px] font-medium text-[--post-image-fg] md:text-sm">
                <CalendarIcon />
                {photo.width} x {photo.height}
              </span>
            </span>
            <span className="inline-flex items-center space-x-3 text-[12px] font-medium text-[--post-image-fg] md:text-xs">
              <span className="inline-flex items-center space-x-1">
                <HourglassIcon />
                <span>{moment(photo.createdAt).format('YYYY-MM-DD')}</span>
              </span>
            </span>
          </span>

          <h2 className="z-20 text-base font-bold tracking-tight text-[--post-image-fg] opacity-70 transition-opacity group-hover:opacity-100 md:text-xl">
            {photo.title}
          </h2>
        </span>
      </div>
    </div>
  );
}
