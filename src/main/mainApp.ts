import type { BrowserWindow } from 'electron'
import { ipcMain, nativeTheme } from 'electron'
import { successJson } from './utils'

export default class MainApp {
  mainWindow: BrowserWindow
  constructor(mainWindow) {
    this.mainWindow = mainWindow
  }

  start() {
    ipcMain.handle('switchFullscreen', async () => {
      const isFullScreen = this.mainWindow.isFullScreen()
      this.mainWindow.setFullScreen(!isFullScreen)
      return successJson({ data: !isFullScreen })
    })

    ipcMain.handle('switchDark', () => {
      if (nativeTheme.shouldUseDarkColors)
        nativeTheme.themeSource = 'light'

      else
        nativeTheme.themeSource = 'dark'

      return successJson({ data: nativeTheme.shouldUseDarkColors })
    })

    return this
  }
}
