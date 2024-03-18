'use client';

import React from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import { useSnapshot } from 'valtio';

import { clsxm } from '@/lib/helper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';

import useFilter, { state } from './useFilter';

function Desktop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const filter = useSnapshot(state);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);
  const handleMouseMove = React.useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - bounds.left);
      mouseY.set(clientY - bounds.top);
      radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5);
    },
    [mouseX, mouseY, radius]
  );
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`;

  return (
    <nav
      onMouseMove={handleMouseMove}
      className={clsxm(
        'group relative',
        'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
        'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
        'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
        '[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]',
        className
      )}
      {...props}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
        aria-hidden="true"
      />

      <ul className="flex bg-transparent  text-sm font-medium text-zinc-800 dark:text-zinc-200 ">
        <li>
          <Input
            className={clsxm(
              'text-lime-600 dark:text-lime-400',
              'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
              'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90'
            )}
            placeholder="请输入图片关键字"
            onChange={(e) => {
              state.slug = e.target.value;
            }}
          />
        </li>
        <li className="ml-10">
          <AnimatePresence>
            <motion.div
              onMouseMove={handleMouseMove}
              className={clsxm(
                'pointer-events-auto relative flex h-10 rounded-full transition-opacity duration-500 hover:opacity-100',
                'rounded-full bg-gradient-to-b from-zinc-50/70 to-white/90',
                'shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur-md',
                'dark:from-zinc-900/70 dark:to-zinc-800/90 dark:ring-zinc-100/10',
                '[--spotlight-color:rgb(236_252_203_/_0.6)] dark:[--spotlight-color:rgb(217_249_157_/_0.07)]'
              )}
              style={{ background }}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
            >
              <Button
                variant="secondary"
                className=" bg-transparent px-4 py-2.5 text-sm font-medium hover:text-lime-600 dark:hover:text-lime-400"
              >
                搜索
              </Button>
            </motion.div>
          </AnimatePresence>
        </li>
      </ul>
    </nav>
  );
}

export const NavigationBar = {
  Desktop,
} as const;
