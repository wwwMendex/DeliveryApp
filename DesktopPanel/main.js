const { app, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;


function realizarImpressao(){
  let printer = new ThermalPrinter({
    type: PrinterTypes.STAR,
    interface: '\\.\COM1',
  });
  
  
  printer.alignCenter();
  printer.println("Hello world");
  printer.cut();
  
  try {
    printer.execute();
    console.log("Print done!");
  } catch (error) {
    console.log("Print failed:", error);
  }
}
function initServer(){
  const server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: true}));
  const corsOptions={
    origin: '*',
    optionsSuccessStatus: 200
  };
  server.use(cors(corsOptions));

  server.post('/imprimir', (req, res) => {
    const pedido = req.body;
    console.log(pedido);
    res.json(req.body);
    realizarImpressao();
  });

  server.use((err, req, res, next) => res.json(err.message));

  server.listen(8111, ()=>{
    console.log('server started');
  });
}
// const printer = require("node-thermal-printer").printer;
// const types = require("node-thermal-printer").types;
let win;


// function imprimir() {
  // let impressora = new printer({
  //   type: types.EPSON,                                  // Printer type: 'star' or 'epson'
  //   interface: '\\.\COM1',                       // Printer interface
  //   characterSet: 'PC860_PORTUGUESE',                                 // Printer character set - default: SLOVENIA
  //   removeSpecialCharacters: false,                           // Removes special characters - default: false
  //   lineCharacter: "=",                                       // Set character for lines - default: "-"
  //   options:{                                                 // Additional options
  //     timeout: 5000                                           // Connection timeout (ms) [applicable only for network printers] - default: 3000
  //   }
  // });

  // impressora.alignCenter();
  // impressora.println("Hello world");
  // impressora.cut();

  // try {
  //   let execute = impressora.execute()
  //   console.error("Print done!");
  // } catch (error) {
  //   console.log("Print failed:", error);
  // }
  // console.log('imprimiu');
// }

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1240, 
    height: 700,
    backgroundColor: '#ffffff',
  });


  win.loadURL(`file://${__dirname}/dist/DesktopPanel/index.html`);

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  
  win.on('closed', function () {
    win = null;
  })
}

// Create window on electron intialization
app.on('ready', () =>{
  createWindow(); 
  initServer();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
})