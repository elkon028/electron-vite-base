import { join } from 'node:path'
import process from 'node:process'
import { BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { is } from '@electron-toolkit/utils'
import { successJson } from './utils'

export default class MainApp {
  baseURL: string = ''
  mainWindow: BrowserWindow
  constructor(mainWindow) {
    if (is.dev && process.env.ELECTRON_RENDERER_URL) {
      this.baseURL = process.env.ELECTRON_RENDERER_URL
    }
    else {
      this.baseURL = join(__dirname, '../renderer/index.html')
    }

    this.mainWindow = mainWindow
  }

  start() {
    ipcMain.handle('switchFullscreen', async () => {
      const isFullScreen = this.mainWindow.isFullScreen()
      this.mainWindow.setFullScreen(!isFullScreen)
      return successJson({ data: !isFullScreen })
    })

    ipcMain.handle('switchDark', () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      }
      else {
        nativeTheme.themeSource = 'dark'
      }

      return successJson({ data: nativeTheme.shouldUseDarkColors })
    })

    ipcMain.handle('openWindow', (_, jsonString: string) => {
      const args = JSON.parse(jsonString)
      const win = new BrowserWindow({
        width: args.width || 500,
        height: args.height || 500,
        show: true,
        autoHideMenuBar: true,
        webPreferences: {
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false,
        },
      })

      if (is.dev && process.env.ELECTRON_RENDERER_URL) {
        win.loadURL(`${process.env.ELECTRON_RENDERER_URL}#${args.url}`)
      }
      else {
        win.loadFile(join(__dirname, `../renderer/index.html#${args.url}`))
      }
    })

    return this
  }
}
