import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { User } from '../../interfaces/wallet.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  correo: string | undefined;
  contrasena: string | undefined;
  direccion: any;
  modo: 'registro' | 'login' = 'registro';
  constructor(
    private router: Router,
    private walletService: WalletService, private userService: UsuarioService
  ) { }




  async connectMetamask() {
    await this.walletService.initializeEthereum();
    await this.walletService.connectMetamask();
    const userAddress = this.walletService.getUserAddress();
    if (userAddress) {
      this.router.navigate(['/dashboard/cartera']);
    } else {


      this.router.navigate(['/dashboard/cartera']);
      console.error("No se pudo conectar a Metamask");
    }
  }
  iniciarSesion() {
    if (this.correo != "" && this.contrasena != "") {
      console.log(this.correo + " y" + this.contrasena);
      this.userService.login(this.correo, this.contrasena).subscribe({
        next: async (response) => {
          if (response) {
            await this.walletService.initializeEthereum();
            const verificacionConnect = await this.walletService.checkIfWalletIsConnected();
            console.log("verificacion: "+verificacionConnect)
            if (verificacionConnect == "ok") {
              this.router.navigate(['/dashboard/cartera']);
            }else{
               Swal.fire({
              title: 'Ops',
              text: 'No connectad Metamask',
              icon: 'warning'
            });
            }


          } else {
            Swal.fire({
              title: 'Ops',
              text: 'Usario no encontrado.',
              icon: 'warning'
            });
          }

        },
        error: (error) => {
          console.error('No encontrado', error);
        }
      });
    }

  }




  async registrarPersona(event: Event): Promise<void> {
    event.preventDefault();
    await this.walletService.initializeEthereum();
    await this.walletService.checkIfWalletIsConnected();

    this.direccion = await this.walletService.getUserAddress();
    console.log("new_ " + this.direccion);
    if (this.direccion != null) {
      const user: User = {
        usuario: (document.getElementById('usuario') as HTMLInputElement).value,
        correo: (document.getElementById('correoRegistro') as HTMLInputElement).value,
        contrasena: (document.getElementById('contrasenaRegistro') as HTMLInputElement).value,
        codigo: this.direccion,
        stado: "A",

        id: undefined,

      };

      this.userService.create(user).subscribe({
        next: async (response) => {

          Swal.fire({
            title: 'Éxito',
            text: 'Cuenta Creada Correctamente',
            icon: 'success'
          });

          await this.connectMetamask();
        },
        error: (error) => {
          console.error('Error al registrar:', error);
        }
      });

      console.log('Datos enviados:', user);

    }



  }





}
