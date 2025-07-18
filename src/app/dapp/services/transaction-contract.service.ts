import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import contractAbi from '../abi/Transaction.json';

@Injectable({
  providedIn: 'root',
})
export class TransactionContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  private contractAddress: string = '0x60d78b3103c565407ba7b0ce7c26bbeab590aa54';

  constructor() {
    this.init();
  }

  async init() {
    if ((window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);

      try {
        await this.provider.send('eth_requestAccounts', []);
        this.signer = await this.provider.getSigner();

        this.contract = new ethers.Contract(this.contractAddress, contractAbi, this.signer);
        console.log('Contrato instanciado correctamente:', this.contract);
      } catch (error) {
        console.error('Error al conectar con MetaMask');
      }
    } else {
      console.error('MetaMask no está instalado');
    }
  }

  async sendTransaction(to: string, amount: string): Promise<ethers.TransactionReceipt | null> {
    if (!this.contract || !this.signer) {
      console.error('Contrato o signer no están inicializados');
      return null;
    }

    try {
      if (!ethers.isAddress(to)) {
        console.error('Dirección de destino inválida:', to);
        return null;
      }

      const ethValue = ethers.parseEther(amount);

      const tx = await this.contract['sendTransaction'](to, ethValue, { value: ethValue });
      console.log('Transacción enviada:', tx);

      
      return tx;
    } catch (err) {
      console.error('Error al enviar la transacción:', err);
      return null;
    }
  }

  async getContractBalance(): Promise<string> {
    if (!this.contract) {
      console.error('Contrato no inicializado');
      return '0';
    }

    try {
      const balance = await this.contract['getContractBalance']();
      console.log('Balance del contrato:', balance.toString());

      return ethers.formatEther(balance);
    } catch (err) {
      console.error('Error al obtener el balance del contrato:', err);
      return '0';
    }
  }
}
