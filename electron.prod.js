const {app, BrowserWindow, globalShortcut, Menu} = require('electron');
const path = require('path');
const url = require('url');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let win;
let opened = false;

const createWindow = () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    // Menu.setMainMenu();
    // set timeout to render the window not until the Angular
    // compiler is ready to show the project
    setTimeout(() => {
        // Create the browser window.
        win = new BrowserWindow({
            title: 'Feili Monitor',
            width: 1250,
            height: 800,
            minWidth: 1000,
            minHeight: 650,
            icon: path.join(__dirname, './assets/images/wave.png'),
            frame:true,
            center: true,
            titleBarStyle: 'hidden',
            backgroundColor: '#000000',
            // transparent: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true
            }
        });

        // and load the index.html of the app.
        win.loadURL(url.format({
            pathname: path.join(__dirname, './index.html'),
            protocol: 'file:',
            slashes: true
        })).catch(err => {
            console.log(err);
        });

        // win.webContents.openDevTools();

        // Emitted when the window is closed.
        win.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            win = null;
        });
    }, 10000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.whenReady().then(() => {
    // Register a 'CommandOrControl+Y' shortcut listener.
    globalShortcut.register('CommandOrControl+R', () => {
        // Do stuff when Y and either Command/Control is pressed.
    })
})


// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
    opened = false;
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null && opened === false) {
        opened = true;
        createWindow();
    }
});


const isMac = process.platform === 'darwin'

const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services'},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    }] : []),
    // { role: 'fileMenu' }
    {
        label: 'File',
        submenu: [
            isMac ? {role: 'close'} : {role: 'quit'}
        ]
    },
    // { role: 'editMenu' }
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            ...(isMac ? [
                {role: 'pasteAndMatchStyle'},
                {role: 'delete'},
                {role: 'selectAll'},
                {type: 'separator'},
                {
                    label: 'Speech',
                    submenu: [
                        {role: 'startSpeaking'},
                        {role: 'stopSpeaking'}
                    ]
                }
            ] : [
                {role: 'delete'},
                {type: 'separator'},
                {role: 'selectAll'}
            ])
        ]
    },
    // { role: 'viewMenu' }
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forceReload'},
            {role: 'toggleDevTools'},
            {type: 'separator'},
            {role: 'resetZoom'},
            {role: 'zoomIn'},
            {role: 'zoomOut'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    // { role: 'windowMenu' }
    {
        label: 'Window',
        submenu: [
            {role: 'minimize'},
            {role: 'zoom'},
            ...(isMac ? [
                {type: 'separator'},
                {role: 'front'},
                {type: 'separator'},
                {role: 'window'}
            ] : [
                {role: 'close'}
            ])
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const {shell} = require('electron')
                    await shell.openExternal('https://bingcheng.openmc.cn')
                }
            }
        ]
    }
]
