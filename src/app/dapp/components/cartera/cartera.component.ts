import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TraductorService } from '../../services/traductor.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cartera.component.html',
  styleUrl: './cartera.component.css'
})
export class CarteraComponent implements OnInit {
  userAddress: string | undefined;
  balance: any;
  red: string | null = null;
  conectarRed: any;
  traducciones: any = {};
  mensaje: boolean = false;
  direccion : any;
  functionReturn: boolean = false
  constructor(private walletService: WalletService, private translationService: TraductorService) { }

  response: any[] = [];

  async ngOnInit(): Promise<void> {
    this.translationService.traducciones$.subscribe(traducciones => {
      this.traducciones = traducciones;
    });


    await this.walletService.initializeEthereum();

    this.userAddress = await this.walletService.getUserAddress();
  
    this.red = await this.walletService.getNetwork();
    await this.fetchBalance();
    this.verificacionLis();
    this.direccion = await this.walletService.getUserAddress()

  }

  async fetchBalance() {
    this.balance = await this.walletService.getBalance();
  }



  async verificacionLis() {
    this.walletService.getHistorial().subscribe({
      next: (dataHistorial) => {
        console.log(dataHistorial);
        if (dataHistorial.message == "OK") {
          this.response = dataHistorial.result;
        } else {
          console.log("no se pudo listar");
          this.response = [];
        }

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("terminó");
      },
    });
  }


  async cambiarRed() {
    try {
      await this.walletService.changeNetwork(this.conectarRed);
      this.red = await this.walletService.getNetwork();
      await this.fetchBalance();
      await this.verificacionLis();
      this.closeModalRed();
    } catch (error) {
      console.log('problemas con la red');
    }
  }


  openModalRed() {
    const modal = document.getElementById('mymodalRed');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  closeModalRed() {
    const modal = document.getElementById('mymodalRed');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');
  }


  shorteHash(hash: string): string {
    if (hash == "" || hash == "0x447b6FE8EC60fA2060b67c4FAF4245136FDA5b05") {
      this.mensaje = true;

    }
    else {

      this.mensaje = false;

      return hash.slice(0, 6) + '...' + hash.slice(-4);
    }
    return "";
  }


  transformarValor(valor: string) {

    const dividendo = 1000000000000000000;

    const convertirIntger = Number(valor);

    const division = convertirIntger / dividendo;
    return String(division) + " ETH";

  }


  gasGastado(gas: string, gasPrice: string) {
    const gasConvert = Number(gas);
    const gasPriceConvert = Number(gasPrice);
    const operacionMultplicacion = gasConvert * gasPriceConvert;
    const operacionDivision = operacionMultplicacion / 1000000000000000000;

    return operacionDivision.toFixed(8);
  }

  obtenerDiaHoraTransaccion(segundos: string): string {
    const ahora = Date.now();
    const timestampMs = Number(segundos) * 1000;
    const diferencia = ahora - timestampMs;

    let resultado = "";

    if (diferencia < 60000) {
      const secs = Math.floor(diferencia / 1000);
      resultado = `${secs} seg`;
    } else if (diferencia < 3600000) {
      const mins = Math.floor(diferencia / 60000);
      resultado = `${mins} min`;
    } else if (diferencia < 86400000) {
      const horas = Math.floor(diferencia / 3600000);
      resultado = `${horas} hrs`;
    } else {
      const dias = Math.floor(diferencia / 86400000);
      resultado = `${dias} dias`;
    }

    return resultado;
  }

  separaFuncion(functionName: string) {

    if (functionName == "") {
      this.functionReturn = true;
      return "Transaction";
    } else {
      this.functionReturn = false;

      return functionName.split('(')[0];
    }

  }

  openModalDetalle() { }
  closeModalDetalle() { }

}
