'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';

import { clsxm } from '@/lib/helper';
import { clamp } from '@/lib/math';
import { Container } from '@/components/ui/Container';
import { ThemeSwitcher } from '@/components/site/ThemeSwitcher';
import { NavigationBar } from '@/app/(main)/NavigationBar';

import PhotoModal from './PhotoModal';

export function Header() {
  const isHomePage = usePathname() === '/';

  const headerRef = React.useRef<HTMLDivElement>(null);
  const avatarRef = React.useRef<HTMLDivElement>(null);
  const isInitial = React.useRef(true);

  const avatarX = useMotionValue(0);
  const avatarScale = useMotionValue(1);
  const avatarBorderX = useMotionValue(0);
  const avatarBorderScale = useMotionValue(1);

  React.useEffect(() => {
    const downDelay = avatarRef.current?.offsetTop ?? 0;
    const upDelay = 64;

    function setProperty(property: string, value: string | null) {
      document.documentElement.style.setProperty(property, value);
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property);
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return;
      }

      const { top, height } = headerRef.current.getBoundingClientRect();
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      );

      if (isInitial.current) {
        setProperty('--header-position', 'sticky');
      }

      setProperty('--content-offset', `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`);
        setProperty('--header-mb', `${-downDelay}px`);
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay);
        setProperty('--header-height', `${offset}px`);
        setProperty('--header-mb', `${height - offset}px`);
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`);
        setProperty('--header-mb', `${-scrollY}px`);
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed');
        removeProperty('--header-top');
        removeProperty('--avatar-top');
      } else {
        removeProperty('--header-inner-position');
        setProperty('--header-top', '0px');
        setProperty('--avatar-top', '0px');
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return;
      }

      const fromScale = 1;
      const toScale = 36 / 64;
      const fromX = 0;
      const toX = 2 / 16;

      const scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      avatarX.set(x);
      avatarScale.set(scale);

      const borderScale = 1 / (toScale / scale);

      avatarBorderX.set((-toX + x) * borderScale);
      avatarBorderScale.set(borderScale);

      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0');
    }

    function updateStyles() {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    }

    updateStyles();
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', updateStyles);

    return () => {
      window.removeEventListener('scroll', updateStyles);
      window.removeEventListener('resize', updateStyles);
    };
  }, [isHomePage]);

  const avatarTransform = useMotionTemplate`translate3d(${avatarX}rem, 0, 0) scale(${avatarScale})`;
  const avatarBorderTransform = useMotionTemplate`translate3d(${avatarBorderX}rem, 0, 0) scale(${avatarBorderScale})`;

  const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false);
  const onAvatarContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsShowingAltAvatar((prev) => !prev);
    },
    []
  );

  return (
    <>
      <motion.header
        className={clsxm(
          'pointer-events-none relative z-50 mb-[var(--header-mb,0px)] flex flex-col',
          isHomePage
            ? 'h-[var(--header-height,180px)]'
            : 'h-[var(--header-height,64px)]'
        )}
        layout
        layoutRoot
      >
        <AnimatePresence>
          {isHomePage && (
            <>
              <div
                ref={avatarRef}
                className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
              />
              <Container
                className="top-0 order-last -mb-3 pt-3"
                style={{
                  position:
                    'var(--header-position)' as React.CSSProperties['position'],
                }}
              >
                <motion.div
                  className="top-[var(--avatar-top,theme(spacing.3))] w-full select-none"
                  style={{
                    position:
                      'var(--header-inner-position)' as React.CSSProperties['position'],
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                  }}
                >
                  <motion.div
                    className="relative inline-flex"
                    layoutId="avatar"
                    layout
                    // onContextMenu={onAvatarContextMenu}
                  >
                    <motion.div
                      className="block size-16 origin-left"
                      style={{
                        transform: avatarTransform,
                      }}
                    >
                      <div className="pointer-events-auto">
                        <PhotoModal />
                      </div>
                      {/* <Avatar.Image
                        large
                        alt={isShowingAltAvatar}
                        className="block size-full"
                      /> */}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Container>
            </>
          )}
        </AnimatePresence>
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position'],
          }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{
              position:
                'var(--header-inner-position)' as React.CSSProperties['position'],
            }}
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1 justify-end">
                <NavigationBar.Desktop className="pointer-events-auto relative z-50 " />
              </div>
              <motion.div
                className="flex justify-end gap-3 md:flex-1"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                {/*  create photo */}
                <div className="pointer-events-auto">
                  <ThemeSwitcher />
                </div>
              </motion.div>
            </div>
          </Container>
        </div>
      </motion.header>
      {isHomePage && <div className="h-[--content-offset]" />}
    </>
  );
}
