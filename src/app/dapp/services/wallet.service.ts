import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Observable } from 'rxjs';
import { EtherscanResponse, Transaction } from '../interfaces/wallet.interface';


@Injectable({
  providedIn: 'root',
})


export class WalletService {
  private provider: ethers.BrowserProvider | undefined;
  private signer: ethers.JsonRpcSigner | undefined;
  private userAddress: string | undefined;
  public networkName: string | undefined;



  moneda: string | undefined;
  pais: string | undefined;
  balance: any;
  respuesta: any;
  constructor(private http: HttpClient) {

  }

  public initializeEthereum() {

    if (typeof window !== 'undefined' && (window as any).ethereum) {
      console.log('MetaMask detectado.');
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      this.provider.getSigner().then((signer) => {
        this.signer = signer;
      }).catch((error) => {
        console.error('Error al obtener el signer:', error);
      });
    } else {
      console.warn('MetaMask no está disponible.');
    }
  }

  async connectMetamask() {


    if (!this.provider) {
      console.error('MetaMask no está disponible.');
      return;
    }

    try {
      const accounts = await this.provider.send('eth_requestAccounts', []);
      this.userAddress = accounts[0];
      console.log('Conectado con:', this.userAddress);
    } catch (error) {
      console.error('Error al conectar con MetaMask:', error);
    }
  }

  async checkIfWalletIsConnected():Promise<string | void> {
    if (!this.provider) {
      console.error('MetaMask no está disponible.');
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        this.userAddress = accounts[0];
        this.respuesta = "ok"
        console.log('Cuenta conectada:', this.userAddress);
        return this.respuesta;
      } else {
      
        this.userAddress = 'No conectado';
        console.log('No hay cuenta conectada.');
      }
    } catch (error) {
      console.error('Error al verificar conexión con MetaMask:', error);
      this.userAddress = 'No conectado';
    }
  }

  getUserAddress() {
    return this.userAddress;
  }

  async getBalance(): Promise<string> {
    if (!this.userAddress || !this.provider) {
      return '0';
    }

    try {
      const balance = await this.provider.getBalance(this.userAddress);
      console.log("new: " + balance);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error al obtener balance:', error);
      return '0';
    }
  }


  async sendTransaction(to: string, amount: string) {
    if (!this.userAddress || !this.signer) {
      console.error('No hay usuario conectado o signer no disponible.');
      return null;
    }

    const tx = {
      to: to,
      value: ethers.parseEther(amount),
    };

    try {
      const transaction = await this.signer.sendTransaction(tx);
      console.log('Transacción enviada:', transaction);
      return transaction;
    } catch (error) {
      return null;
    }
  }

  async changeNetwork(chainId: string) {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
        console.log(`Cambiado a la red con chainId: ${chainId}`);
        this.networkName = chainId;
        this.getHistorial();
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
        this.signer = await this.provider.getSigner();

      } catch (error) {
        console.error('Error al cambiar la red:', error);
      }
    } else {
      console.warn('MetaMask no está disponible.');
    }
  }

  async getNetwork() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        console.log("codigo red: " + chainId);
        this.networkName = chainId;
        const name_red = await this.getNombreRed(chainId);
        await this.getHistorial();
        return name_red;
      } catch (error) {
        console.error('Error al obtener la red:', error);
        return null;
      }
    }
    return null;
  }




  async getPrecioETH(moneda_pais: string): Promise<number> {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,pen,eur,jpy,cny,ars,brl,mxn,clp,gbp,krw,inr,cad,aud,chf');
      const data = await res.json();
      const valor = data.ethereum[moneda_pais]
      console.log("llamado funcion precio : " + valor);
      return valor;
    } catch (error) {
      console.error('Error al obtener el precio de ETH:', error);
      return 0;
    }
  }


  async getNombreRed(chainId: string): Promise<string> {
    const redes: { [key: string]: string } = {
      "0x1": "Ethereum Mainnet",
      "0xaa36a7": "Sepolia Testnet",
      "0x4268": "Holesky Testnet",
      "0x259c742": "Ephemery Testnet"
      
    };



    return redes[chainId] || "Red desconocida";
  }



  public getHistorial():  Observable<EtherscanResponse>  {
    let red = "";
    if (this.networkName == "0xaa36a7" ) {
      red = "-sepolia"
    }
    else if (this.networkName == "0x4268") {
      red = "-holesky"
    }
    
    return this.http.get<EtherscanResponse>(`https://api${red}.etherscan.io/api?module=account&action=txlist&address=${this.userAddress}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=9H1GMB9IEKDBD59FZRQ6IMCMXEJ2QBAQVB`);
    
  
  }


  // Obtener el precio de ETH en la moneda seleccionada
  
}
