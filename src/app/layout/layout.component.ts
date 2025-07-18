import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WalletService } from '../dapp/services/wallet.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TraductorService } from '../dapp/services/traductor.service';
import { UsuarioService } from '../dapp/services/usuario.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  userAddress: string | undefined;
  balance: any;
  traducciones: any = {};

  valor_pais: any;
  precio_eth: any;
  paisSeleccionado: any = 'pe';
  paisConfig: any = {
    pe: { idioma: 'es', moneda: 'PEN', iconMoneda: 'S/' },
    us: { idioma: 'en', moneda: 'USD', iconMoneda: '$' },
    cn: { idioma: 'cn', moneda: 'CNY', iconMoneda: '¥' },
    jp: { idioma: 'jp', moneda: 'JPY', iconMoneda: '¥' },
    de: { idioma: 'de', moneda: 'EUR', iconMoneda: '€' }
  };
  idioma: string | undefined;
  iconsMoneda: string | undefined;
  moneda: string | undefined;
  pais: string | undefined;
  moneda_minuscula: any;
  usuario: string | undefined;
  llave: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private walletService: WalletService, private http: HttpClient, private translationService: TraductorService, private usuarioService: UsuarioService
  ) { }


  async ngOnInit() {
    this.actualizarIdioma();
    await this.walletService.initializeEthereum();
    await this.walletService.checkIfWalletIsConnected();
    this.userAddress = await this.walletService.getUserAddress() || 'No conectado';

    await this.getUsuario(this.userAddress);




    if (isPlatformBrowser(this.platformId)) {
      try {
        const script = document.createElement('script');
        script.src = 'https://chat-flow.app/chatflow-chatbot.js';
        script.async = true;
        script.setAttribute('data-chatbot', '41a5a8b4-cc2a-4c90-8df3-64411a01f312');
        document.body.appendChild(script);
      } catch (error) {
        console.log(`error en el audio: ${error} `);
      }

    }


    this.translationService.traducciones$.subscribe(traducciones => {
      this.traducciones = traducciones;
    });
    setInterval(async () => {
      await this.obtnerPrecioBalance();
    }, 4000);



    if (isNaN(parseFloat(this.valor_pais || '0'))) {
      this.balance = '0';
    }
  }


  getUsuario(codigo: string) {
    this.usuarioService.getUsuario(codigo).subscribe({
      next: (response) => {
        this.usuario = response.usuario;



      },
      error: (error) => {
        console.error('No encontrado', error);
      }
    });;
  }



  shortenAddress(address: string | undefined): string {
    if (!address) return 'No conectado';
    return address.slice(0, 6) + '...' + address.slice(-4);
  }


  getIntegerBalance(): string {
    const numericBalance = parseFloat(this.balance || '0');
    return Math.floor(numericBalance).toString();
  }

  openModal() {
    const modal = document.getElementById('myModalQR');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  closeModal() {
    const modal = document.getElementById('myModalQR');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');

  }

  onBackdropClick(event: MouseEvent) {
    const content = document.getElementById('modalContent');
    if (!content?.contains(event.target as Node)) {
      this.closeModal();
    }
  }



  openModalIdiomas() {
    const modal = document.getElementById('myModalIdioma');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
    this.llave = true;
  }

  closeModalIdionas() {
    const modal = document.getElementById('myModalIdioma');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');
    this.llave = false;

  }


  async actualizarIdioma() {
    this.idioma = this.paisConfig[this.paisSeleccionado]?.idioma || 'es';
    console.log("El país seleccionado es:", this.paisSeleccionado);

    const config = this.paisConfig[this.paisSeleccionado];

    if (!config) return;





    await this.translationService.cambiarIdioma(config.idioma);

    this.pais = this.paisSeleccionado;
    this.idioma = config.idioma;
    this.iconsMoneda = config.iconMoneda;
    this.moneda = config.moneda;
    this.moneda_minuscula = this.moneda?.toLowerCase();

    this.precio_eth = await this.walletService.getPrecioETH(this.moneda_minuscula) || 0;

    await this.obtnerPrecioBalance();

    if (this.llave) {
      this.closeModalIdionas();

    }

  }

  async obtnerPrecioBalance() {
    this.balance = await this.walletService.getBalance() || 0;
    this.valor_pais = Number((this.precio_eth * this.balance).toFixed(2));
  }

}
