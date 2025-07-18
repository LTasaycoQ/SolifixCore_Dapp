// enviar.component.ts
import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Contactos, User } from '../../interfaces/wallet.interface';
import { UsuarioService } from '../../services/usuario.service';
import { TraductorService } from '../../services/traductor.service';
import { TransactionContractService } from '../../services/transaction-contract.service';

@Component({
  selector: 'app-enviar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './enviar.component.html',
  styleUrl: './enviar.component.css'
})
export class EnviarComponent implements OnInit {

  @ViewChild('inputDireccion') inputDireccionRef!: ElementRef<HTMLInputElement>;

  userAddress: string | undefined;
  balance: string | undefined;
  valor_dollares: string | undefined;
  toAddress: string = '';
  amount: string = '';
  statusMessage: string = '';
  timerInterval: any;
  isAccordionOpen: boolean = false;
  numero_persona: number | undefined;
  statusContact: string = '';
  statusList: string = '';
  hayError: boolean = false;
  hayContactos: boolean = false;
  user: any;
  traducciones: any = {};
  tipoTransaccion: 'normal' | 'contrato' = 'normal';

  nombreRed: any;




  constructor(@Inject(PLATFORM_ID) private platformId: Object, private transactionService: TransactionContractService,
    private walletService: WalletService, private userService: UsuarioService, private translationService: TraductorService) { }
  public response: Contactos[] = [];

  async ngOnInit() {


    this.translationService.traducciones$.subscribe(traducciones => {
      this.traducciones = traducciones;
    });

    await this.walletService.checkIfWalletIsConnected();
    this.userAddress = this.walletService.getUserAddress();
    this.balance = await this.walletService.getBalance();


    await this.vincularContactos();

    if (isNaN(parseFloat(this.balance || '0'))) {
      this.balance = '0';
    }
  }

  async enviarETH() {

    

    if (this.tipoTransaccion == "contrato") {

      const receipt = await this.transactionService.sendTransaction(this.toAddress, this.amount);
      if (receipt) {
        this.statusMessage = receipt.hash;
        Swal.fire({
          title: 'Éxito',
          text: 'Transacción completada correctamente.',
          icon: 'success'
        });
        this.closeModal();

      } else {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema con la transacción.',
          icon: 'error'
        });
      }
    } else {
      const tx = await this.walletService.sendTransaction(this.toAddress, this.amount);

      if (tx) {
        this.statusMessage = tx.hash;
        this.toAddress = "";
        this.amount = "";
        Swal.fire({
          title: "Good job!",
          text: "Proceso Finalizado!",
          icon: "success"
        });
        this.closeModal();
      } else {
        Swal.fire({
          title: "Opps",
          text: "No se pudo completar la transaccion",
          icon: "error"
        });
      }
    }



    this.nombreRed = await this.walletService.getNetwork();
    if (this.nombreRed == "Sepolia Testnet") {
      this.nombreRed = "sepolia"
    } else {
      if (this.nombreRed == "Holesky Testnet") {
        this.nombreRed = "holesky"

      }
    }
  }

  async vincularContactos() {
    if (!this.userAddress) {
      console.error('Direccion no encontrado');
      return;
    }
    const data_verificacion = await this.traerMisDatos();
    if (data_verificacion != null) {
      this.userService.getAllContactos(this.userAddress).subscribe({
        next: (data) => {
          this.response = data;
          this.statusList = '';
          this.hayContactos = false;
          console.log('Contactos cargados:', this.response);
        },
        error: (err) => {
          this.response = [];
          this.statusList = "No tienes Contactos Registrados";
          this.hayContactos = true;
        }
      });


    } else {
      this.statusContact = "Necesitas crear una cuenta";
      this.hayError = true;

    }

  }


  shortenAddress(address: string | undefined): string {
    if (!address) return 'No conectado';
    return address.slice(0, 14) + '...' + address.slice(-4);
  }


  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  validarCampos() {
    if (!this.toAddress || !this.amount) {

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completar todos los campos!",
      });

      return;
    }

    console.log(this.tipoTransaccion)

    this.openModal();

  }


  async openModal() {

    const precioETH = await this.walletService.getPrecioETH("jpy");

    this.valor_dollares = (Number(this.amount) * precioETH).toFixed(2);

    const modal = document.getElementById('myModal');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  closeModal() {
    this.valor_dollares = "";

    const modal = document.getElementById('myModal');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');
  }





  // contactos



  async openModalContactos() {

    this.vincularContactos();

    const precioETH = await this.walletService.getPrecioETH("jpy");

    this.valor_dollares = (Number(this.amount) * precioETH).toFixed(2);

    const modal = document.getElementById('myModalContactos');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  closeModalContactos() {
    this.valor_dollares = "";

    const modal = document.getElementById('myModalContactos');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');
  }

  obtenerDireccionContac(direccionContact: string | undefined): void {
    if (direccionContact) {
      this.toAddress = direccionContact;
      this.closeModalContactos();
    }
  }











  async openModalContactosRegistrar() {

    const modal = document.getElementById('myModalContactosRegistrar');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  closeModalContactosRegistrar() {

    const modal = document.getElementById('myModalContactosRegistrar');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');
  }




  async traerMisDatos(): Promise<number | null> {
    if (!this.userAddress) {
      console.error('Dirección no encontrada');
      return null;
    }

    try {
      const data: User = await firstValueFrom(this.userService.getUsuario(this.userAddress));



      if (!data || typeof data.id !== 'number') {
        console.error('Usuario no válido:', data);
        return null;
      }
      this.numero_persona = data.id;
      console.log("mi id obtenido es: " + this.numero_persona);
      return this.numero_persona;
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      return null;
    }
  }





  async openModalUsario() {

    const modal = document.getElementById('myModalContactosUsuario');
    modal?.classList.remove('hidden');
    modal?.classList.add('flex');
  }

  closeModalUsuario() {

    const modal = document.getElementById('myModalContactosUsuario');
    modal?.classList.remove('flex');
    modal?.classList.add('hidden');
  }





  async registrarContacto(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.userAddress) {
      console.error('Dirección no encontrada');
      return;
    }

    const idUsuario = await this.traerMisDatos();
    if (idUsuario === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID del usuario.',
      });
      return;
    }

    console.log("Valor Id user: " + idUsuario);

    const contacto: Contactos = {
      Id: 0,
      apodo: (document.getElementById('apodo') as HTMLInputElement).value,
      direccion_eth: (document.getElementById('direccion') as HTMLInputElement).value,
      personaId: idUsuario,
      stado: 'A'
    };

    this.userService.createContac(contacto).subscribe({
      next: (response) => {
        console.log('Contacto registrado', response);
        Swal.fire({
          title: 'Éxito',
          text: 'El contacto ha sido registrado.',
          icon: 'success'
        });
        this.hayContactos = true;
        this.closeModalContactosRegistrar();

        this.vincularContactos();
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al registrar el contacto.',
          icon: 'error'
        });
      }
    });
  }







  async obtenerBalanceContrato() {
    // Obtener el balance del contrato
    const balance = await this.transactionService.getContractBalance();
    this.valor_dollares = balance;
    console.log('Balance del contrato:', this.valor_dollares);
  }

}

