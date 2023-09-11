"use client"
import { useState, useEffect } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import {
    WALLET_ADAPTERS,
    CHAIN_NAMESPACES,
    SafeEventEmitterProvider,
} from "@web3auth/base";
import RPC from "./evmweb3";


// Web3Auth app new client ID 
const _clientId =
  "BBnQWGgiJ0DsZ_MX322IlvvhiUNPUNIGe9YZfV_MA9kpOqubz6zSAODBu9wBlkuXmjXA3towBL7lK2pghtEG1x0"; // get from https://dashboard.web3auth.io


export default function Signup(){

    const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
    const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const init = async () => {
          try {
            const chainConfig = {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0x5", // Please use 0x1 for Mainnet
              rpcTarget: "https://rpc.ankr.com/eth_goerli",
              displayName: "Goerli Testnet",
              blockExplorer: "https://goerli.etherscan.io/",
              ticker: "ETH",
              tickerName: "Ethereum",
            };
    
            const web3auth = new Web3AuthNoModal({
              clientId: _clientId,
              chainConfig,
              web3AuthNetwork: "testnet",
              useCoreKitKey: false,
            });
    
            const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
    
            // const openloginAdapter = new OpenloginAdapter({
            //   privateKeyProvider,
            //   adapterSettings: {
            //     uxMode: "redirect",
            //     loginConfig: {
            //       jwt: {
            //         verifier: "gameone-testing-verifier", // Verifier name
            //         typeOfLogin: "jwt",
            //         clientId: "3pVx063EIVHQ0Ph8zLKU25IBUtc6xSoA", // Auth0 client id
            //       }
            //     }
            //   },
            // });


            const openloginAdapter = new OpenloginAdapter({
                privateKeyProvider,
                adapterSettings: {
                  clientId: _clientId,
                  uxMode: "redirect",
                  loginConfig: {
                    google: {
                      verifier: "gameone-aggregate-verifier",
                      verifierSubIdentifier: "gampus-google-aggregate",
                      typeOfLogin: "google",
                      clientId:
                        "432684640768-6sp0vucbhchq4cpb4rjj2hf50l7cfoer.apps.googleusercontent.com",
                    },
                    auth0github: {
                      verifier: "gameone-aggregate-verifier",
                      verifierSubIdentifier: "gamepus-auth0-aggregate",
                      typeOfLogin: "jwt",
                      clientId: "3pVx063EIVHQ0Ph8zLKU25IBUtc6xSoA", // Auth0 client id
                    },
                    auth0apple: {
                      verifier: "gameone-aggregate-verifier",
                      verifierSubIdentifier: "gamepus-apple-aggregate",
                      typeOfLogin: "jwt",
                      clientId: "3pVx063EIVHQ0Ph8zLKU25IBUtc6xSoA", // Auth0 client id
                    },
                 
                  },
                },
              });
            console.log("Open login adapter is here ", openloginAdapter);
            
            web3auth.configureAdapter(openloginAdapter);
            setWeb3auth(web3auth);
            console.log("Web 3 auth is here ", web3auth);
            
    
            await web3auth.init();
            setProvider(web3auth.provider);
    
            if (web3auth.connected) {
              setLoggedIn(true);
            }
          } catch (error) {
            console.error(error);
          }
        };
    
        init();
    }, []);


    const loginGoogle = async () => {
        if (!web3auth) {
          alert("web3auth not initialized yet");
          return;
        }
        const web3authProvider = await web3auth.connectTo(
          WALLET_ADAPTERS.OPENLOGIN,
          {
            loginProvider: "google",
          }
        );
        setProvider(web3authProvider);
        setLoggedIn(true);
      };

      const loginAuth0GitHub = async () => {
        if (!web3auth) {
          alert("web3auth not initialized yet");
          return;
        }
        const web3authProvider = await web3auth.connectTo(
          WALLET_ADAPTERS.OPENLOGIN,
          {
            loginProvider: "auth0github",
            extraLoginOptions: {
              domain: "https://dev-c056h3qtwxbiffvq.us.auth0.com",
              // this corresponds to the field inside jwt which must be used to uniquely
              // identify the user. This is mapped b/w google and github logins
              verifierIdField: "email",
              isVerifierIdCaseSensitive: false,
              connection: "github",
            },
          }
        );
        setProvider(web3authProvider);
        setLoggedIn(true);
      };

      const loginAuth0Apple = async () => {
        if (!web3auth) {
          alert("web3auth not initialized yet");
          return;
        }
        const web3authProvider = await web3auth.connectTo(
          WALLET_ADAPTERS.OPENLOGIN,
          {
            loginProvider: "auth0apple",
            extraLoginOptions: {
              domain: "https://dev-c056h3qtwxbiffvq.us.auth0.com",
              // this corresponds to the field inside jwt which must be used to uniquely
              // identify the user. This is mapped b/w google and github logins
              verifierIdField: "email",
              isVerifierIdCaseSensitive: false,
              connection: "apple",
            },
          }
        );
        setProvider(web3authProvider);
        setLoggedIn(true);
      };

    const getUserInfo = async () => {
        if (!web3auth) {
          alert("web3auth not initialized yet");
          return;
        }
        const user = await web3auth.getUserInfo();
        console.log("User info is",user);
      };


    ///------------ Blockchain
    
    
  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const privateKey = await rpc.getPrivateKey();
    console.log("Private key is", privateKey);
    
    uiConsole(privateKey);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const userAccount = await rpc.getAccounts();
    console.log("User account", userAccount);
    uiConsole(userAccount);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    console.log("Balance is", balance);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.signMessage();
    uiConsole(result);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const result = await rpc.sendTransaction();
    uiConsole(result);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

    return(
        <div>
            <div>Check status of web3Auth {loggedIn}</div><br/><br/><br/>
            <button onClick={loginGoogle} className="bg-green-200"> LOGIN with Google</button><br/><br/><br/>

            <button onClick={loginAuth0GitHub} className="bg-red-200"> LOGIN with Auth0 Github</button><br/><br/><br/>

            <button onClick={loginAuth0Apple} className="bg-blue-200"> LOGIN with Auth0 Apple</button><br/><br/><br/>

            <button onClick={getUserInfo}>GET user info</button><br/><br/><br/>

            <button onClick={getPrivateKey}>GET private key</button><br/><br/><br/>

            <button onClick={getAccounts}>GET Account</button><br/><br/><br/>
            <button onClick={getBalance}>GET Balance</button><br/><br/><br/>

            <button onClick={logout}>Logout</button><br/><br/><br/>
        </div>
    )
}