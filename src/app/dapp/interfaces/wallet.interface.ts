
export interface User {
  id: number | undefined;
  usuario: string | undefined;
  correo: string | undefined;
  contrasena: string | undefined;
  codigo: string | undefined;
  stado: string | undefined;
}

export interface Contactos {
  Id: number | undefined;
  apodo: string | undefined;
  direccion_eth: string | undefined;
  personaId: number | undefined;
  stado: string | undefined;
}






// HHistorial Transacciones
export interface Transaction {
  blockNumber: string;
  blockHash: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  input: string;
  methodId: string;
  functionName: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  txreceipt_status: string;
  gasUsed: string;
  confirmations: string;
  isError: string;
}

export interface EtherscanResponse {
  status: string;
  message: string;
  result: Transaction[];
}


