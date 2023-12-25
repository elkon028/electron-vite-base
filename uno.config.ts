// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      }
    })
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
            }
          }
        }
      }
    }
  ]
})
