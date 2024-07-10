import { useState, useEffect } from "react";
import { ethers } from "ethers";
import assessmentAbi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferStatus, setTransferStatus] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = assessmentAbi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // Once wallet is set, get a reference to the deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Adjust port if necessary
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm && account) {
      const userBalance = await atm.getBalance(account);
      setBalance(userBalance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm && account) {
      const tx = await atm.deposit(depositAmount, { value: depositAmount });
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm && account) {
      const tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
    }
  };

  const transferFunds = async () => {
    if (atm && account) {
      try {
        const tx = await atm.transferFunds(transferAddress, transferAmount);
        await tx.wait();
        getBalance();
        setTransferStatus(`${transferAmount} ETH has been transferred to ${transferAddress}.`);
      } catch (error) {
        console.error("Transfer error:", error);
        setTransferStatus("Transfer failed. Please try again.");
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>Connect MetaMask</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div>
          <input
            type="number"
            placeholder="Deposit Amount"
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button onClick={deposit}>Deposit</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Withdraw Amount"
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button onClick={withdraw}>Withdraw</button>
        </div>
        <div>
          <input
            type="number"
            placeholder="Transfer Amount"
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recipient Address"
            onChange={(e) => setTransferAddress(e.target.value)}
          />
          <button onClick={transferFunds}>Transfer</button>
        </div>
        {transferStatus && <p>{transferStatus}</p>}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to my ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
        input {
          margin: 5px;
        }
      `}</style>
    </main>
  );
}
