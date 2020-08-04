const { app, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;


async function realizarImpressao(pedido){
  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "//localhost//FRATELLI",
  });

  printer.alignCenter();
  await printer.printImage(`${__dirname}/dist/DesktopPanel/assets/icons/logo_impressora.png`);
  printer.printVerticalTab();
  printer.println("Rua José Domingues, nº 87");
  printer.println("Bragança Paulista");
  printer.newLine();
  printer.println("CUPOM NÃO FISCAL");
  printer.newLine();
  printer.alignLeft();
  printer.println('________________________________________________');
    printer.tableCustom([
      { text:"#", align:"LEFT", width:0.025 },
      { text:"DESCRIÇÃO", align:"CENTER", width:0.45 },
      { text:"QUANT", align:"LEFT", width:0.16 },
      { text:"PREÇO", align:"LEFT", width:0.16 },
      { text:"TOTAL", align:"RIGHT", width:0.13 }
    ]);
  printer.drawLine();
  let i = 1;
  for(var item of pedido.pedido) {
    printer.tableCustom([
      { text: i, align:"LEFT", width:0.05 },
      { text: item.name, align:"LEFT", width:0.46 },
      { text: item.qtd, align:"LEFT", width:0.10 },
      { text: item.price, align:"RIGHT", width:0.14 },
      { text: item.qtd*item.price, align:"RIGHT", width:0.20 }
    ]);
    if(item.obs && item.obs != ''){
      printer.bold(true);
      printer.println("    Obs: "+item.obs);
      printer.bold(false);
    }
    i++;
  }
  let qtdTotal = pedido.pedido.reduce((total, item) => total + item.qtd,0);
  console.log(JSON.stringify(qtdTotal));
  printer.newLine();
  printer.tableCustom([
    { text:"Total itens", align:"LEFT", width:0.35 },
    { text: qtdTotal, align:"LEFT", width:0.15 },
    { text:"Total", align:"LEFT", width:0.30 },
    { text:pedido.subtotal, align:"RIGHT", width:0.15 }
  ]);
  printer.leftRight('CUPOM', pedido.cupom ? pedido.cupom : 'NÃO');
  printer.leftRight('Entrega','R$ ' + pedido.taxa_entrega);
  printer.drawLine();
  printer.leftRight('Pagamento',pedido.pagamento);
  printer.leftRight('Total','R$ '+pedido.total);
  printer.leftRight('Troco', pedido.troco ? 'R$ ' + ((pedido.troco - pedido.total).toFixed(2)) : 'NÃO');
  printer.println('________________________________________________');
  printer.alignCenter();
  printer.newLine();
  printer.println('CLIENTE');
  printer.println(pedido.nome_usuario + ', tel: '+ pedido.contato);
  printer.println('Endereço: '+pedido.endereco);
  printer.newLine();
  printer.println('________________________________________________');
  printer.newLine();
  printer.println('OBRIGADO PELA PREFERÊNCIA');
  printer.println('BOM APETITE!');
  printer.newLine();
  printer.println('________________________________________________');
  
  printer.cut();

  try {
    printer.execute();
    return "Print done!";
  } catch (error) {
    return error;
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
    let returned = realizarImpressao(pedido);
    res.json({'status' : returned});
  });

  server.use((err, req, res, next) => res.json(err.message));

  server.listen(8111, ()=>{
    console.log('server started');
  });
}

let win;


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1240,
    height: 700,
    backgroundColor: '#ffffff',
    webPreferences: {
      webSecurity: false
    }
  });

  // win.setMenu(null);

  win.loadURL(`file://${__dirname}/dist/DesktopPanel/index.html`);


  win.on('closed', function () {
    win = null;
  })
}

// Create window on electron intialization
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
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