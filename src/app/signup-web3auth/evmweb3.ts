import type { SafeEventEmitterProvider } from "@web3auth/base";
import Web3 from "web3";

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }
  async getAccounts(): Promise<string[]> {
    try {
      const web3 = new Web3(this.provider as any);
      const accounts = await web3.eth.getAccounts();
      return accounts;
    } catch (error: unknown) {
      return error as string[];
    }
  }

  async getBalance(): Promise<string> {
    try {
        const web3 = new Web3(this.provider as any);
    
        // Get user's Ethereum public address
        const address = (await web3.eth.getAccounts())[0];
    
        // Get user's balance in ether
        const balance = web3.utils.fromWei(
          await web3.eth.getBalance(address), // Balance is in wei
          'ether' // Specify the unit as 'ether'
        );
    
        return balance;
      } catch (error) {
        return error as string;
      }
    
  }

  async signMessage(): Promise<string | undefined> {
    try {
      const web3 = new Web3(this.provider as any);
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage = [
        {
          type: "string",
          name: "fullName",
          value: "Satoshi Nakamoto",
        },
        {
          type: "uint32",
          name: "userId",
          value: "1212",
        },
      ];
      const params = [originalMessage, fromAddress];
      const method = "eth_signTypedData";

      const signedMessage = await (web3.currentProvider as any)?.sendAsync({
        id: 1,
        method,
        params,
        fromAddress,
      });
      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
        const web3 = new Web3(this.provider as any);
    
        // Get user's Ethereum public address
        const fromAddress = (await web3.eth.getAccounts())[0];
    
        const destination = fromAddress;
    
        const amount = web3.utils.toWei("0.001", 'ether'); // Specify the unit as 'ether'
    
        // Submit transaction to the blockchain and wait for it to be mined
        const receipt = await web3.eth.sendTransaction({
          from: fromAddress,
          to: destination,
          value: amount,
          maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
          maxFeePerGas: "6000000000000", // Max fee per gas
        });
    
        return receipt;
      } catch (error) {
        return error as string;
      }
  }

  getPrivateKey = async (): Promise<string> => {
    const privateKey = await this.provider.request({
      method: "eth_private_key",
    });

    return privateKey as string;
  };
}