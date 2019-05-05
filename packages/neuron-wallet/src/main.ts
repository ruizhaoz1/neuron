import { app, Menu } from 'electron'
import 'reflect-metadata'

import initApp from './utils/initApp'
import createWindow from './utils/createWindow'
import i18n from './utils/i18n'
import mainmenu from './utils/mainmenu'
import createLoopTask from './utils/createLoopTask'

let mainWindow: Electron.BrowserWindow | null

initApp()

const openWindow = () => {
  i18n.changeLanguage(app.getLocale())
  Menu.setApplicationMenu(mainmenu())
  if (!mainWindow) {
    mainWindow = createWindow()
    mainWindow.on('closed', () => {
      if (mainWindow) {
        mainWindow = null
      }
    })
  }
}

app.on('ready', () => {
  openWindow()
  createLoopTask()
})

app.on('activate', openWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
