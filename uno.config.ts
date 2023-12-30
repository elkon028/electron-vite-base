// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import { compareColors, stringToColor } from '@iconify/utils/lib/colors'
import type { IconSet } from '@iconify/tools'
import {
  deOptimisePaths,
  importDirectory,
  parseColors,
  runSVGO,
} from '@iconify/tools'
import type { CustomIconLoader } from '@iconify/utils/lib/loader/types'

function loadCustomIconSet(): CustomIconLoader {
  const promise = new Promise<IconSet>((resolve, reject) => {
    importDirectory('src/renderer/assets/icons', {
      prefix: 'svg',
    }).then((iconSet) => {
      // 分析所有图标：优化、清理
      iconSet
        .forEachSync((name) => {
          const svg = iconSet.toSVG(name)!

          // Change color to `currentColor`
          const blackColor = stringToColor('black')!

          parseColors(svg, {
            defaultColor: 'currentColor',
            callback: (attr, colorStr, color) => {
              // console.log('Color:', colorStr, color);

              // Change black to 'currentColor'
              if (color && compareColors(color, blackColor))
                return 'currentColor'

              switch (color?.type) {
                case 'none':
                case 'current':
                  return color
              }

              throw new Error(
								`Unexpected color "${colorStr}" in attribute ${attr}`,
              )
            },
          })

          // Optimise
          runSVGO(svg)

          // Update paths for compatibility with old software
          deOptimisePaths(svg)

          // Update icon in icon set
          iconSet.fromSVG(name, svg)
        })

      // Resolve with icon set
      resolve(iconSet)
    }).catch((err) => {
      reject(err)
    })
  })

  return async (name) => {
    const iconSet = await promise
    return iconSet.toSVG(name)?.toMinifiedString()
  }
}

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // see: https://antfu.me/posts/icons-in-pure-css-zh
      // see: https://unocss.dev/presets/icons
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        svg: loadCustomIconSet(),
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 以下配置是为了可以直接使用标签 <i-ep-edit /> | <el-button icon="i-ep-edit" > edit </el-button>
  variants: [
    {
      match: (s) => {
        if (s.startsWith('i-')) {
          return {
            matcher: s,
            selector: (s) => {
              return s.startsWith('.') ? `${s.slice(1)},${s}` : s
            },
          }
        }
      },
    },
  ],
})
