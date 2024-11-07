/**
 * amount to rise in usd
 */
const targetAmount = 7102023;
/**
 * amount raised in usd
 */
//const amountRaised = 0;

let amountRaised = 0;

let currentWallet = "Metamask";

const baseUrl = 'https://token.exotic-tech.club/v1/public';
//const baseUrl = "http://localhost:3000/v1/public";

import { ethers } from "https://cdn.skypack.dev/ethers@5.7.2";

let GOILPriceInUsd = 0.000604; // in usd
let GOILPrice = GOILPriceInUsd;
let ethUsdRate = 2500;

let ethPrice = 2421;

const maximumBuyAmount = 100000;

const requiredChainId = 11155111; // SEPOLIA

const basieCurrencyInput = document.querySelector(".basie-currency-input");
const convertCurrencyInput = document.querySelector(".convert-currency-input");

let userStage = "new";
let rates = {
  ratesLoaded: false,
  ethUsd: 2500,
  goilUSDT: 0.001209,
  goilETH: 0.000000001,
};

function dropModal(contentObj) {
  const popupModal = new bootstrap.Modal(
    document.getElementById("success-modal")
  );

  document.getElementById("p_headline1").innerText = contentObj.headline1;
  document.getElementById("p_headline2").innerText = contentObj.headline2;
  document.getElementById("p_content").innerText = contentObj.content;
  document.getElementById("p_footer").innerText = contentObj.footer;

  if (contentObj.btn1) {
    document.getElementById("p_btn1_link").href = contentObj.btn1Link;
    document.getElementById("p_btn1_content").innerHTML =
      contentObj.btn1Content;
  } else {
    document.getElementById("p_btn1_box").classList.add("d-none");
  }
  if (contentObj.btn2) {
    document.getElementById("p_btn2_link").href = contentObj.btn2Link;
    document.getElementById("p_btn2_content").innerHTML =
      contentObj.btn2Content;
  } else {
    document.getElementById("p_btn2_box").classList.add("d-none");
  }

  popupModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
  const noWalletSpan = document.getElementById("no_wallet_span");

  // Change cursor to pointer on hover
  noWalletSpan.addEventListener("mouseover", () => {
    noWalletSpan.style.cursor = "pointer";
  });

  // Redirect to Google on click
  noWalletSpan.addEventListener("click", () => {
    window.location.href = "https://www.metamask.io";
  });
});

//updateLeaderBoard()

function updateLeaderBoard() {
  const leaders = [
    {
      acccount: "1039545465411785",
      amount: 45121,
    },
    {
      acccount: "1039545465411785",
      amount: 4513,
    },
    {
      acccount: "1039545465411785",
      amount: 12,
    },
    {
      acccount: "1039545465411785",
      amount: 4765841,
    },
    {
      acccount: "1039545465411785",
      amount: 65746841,
    },
    {
      acccount: "1039545465411785",
      amount: 874615,
    },
  ];

  // amount wise leader
  const amountWiseLeader = leaders.sort((a, b) => b.amount - a.amount)[0];

  document.querySelector(".first-winner h3").innerHTML = maskAccount(
    amountWiseLeader.acccount
  );
  document.querySelector(".first-winner h4").innerHTML =
    "$" + formateNumber(amountWiseLeader.amount) + "GOIL";
  document.querySelector(".second-winner h3").innerHTML = maskAccount(
    leaders[1].acccount
  );
  document.querySelector(".second-winner h4").innerHTML =
    "$" + formateNumber(leaders[1].amount) + "GOIL";
  document.querySelector(".third-winner h3").innerHTML = maskAccount(
    leaders[2].acccount
  );
  document.querySelector(".third-winner h4").innerHTML =
    "$" + formateNumber(leaders[2].amount) + "GOIL";
}

document.querySelectorAll(".wallet-img").forEach((item) => {
  item.addEventListener("click", () => {
    //     const walletModal = new bootstrap.Modal(document.getElementById('wallet-modal'));
    //     console.log(walletModal)
    //    // walletModal.hide()
    const walletName = item.getAttribute("data-wallet");
    walletModal.hide();
    startConnectWallet(walletName);
  });
});

async function updateAmountRaised() {
  amountRaised = await fetchUsdRaised();
  if (!amountRaised) {
    amountRaised = 0;
  }
  //console.log(amountRaised)

  document.querySelector(".amount-to-rise").innerHTML =
    "$" + targetAmount.toLocaleString();
  /*** set text of amount raised element*/
  document.querySelector(".amount-raised").innerHTML =
    "$" + amountRaised.toLocaleString();

  /*** calculate percentage of amount raised vs amount to rise*/
  const targetAmountPercent = (amountRaised / targetAmount) * 100;
  /*** set width of progress bar to the percentage*/
  document.querySelector(".progress-bar").style.width =
    targetAmountPercent + "%";
  /** * set text of progress bar to the percentage */
  document.querySelector(".progress-bar").innerHTML = targetAmountPercent + "%";

  /*** set text of GOIL price element */
  document.querySelector(".GOIL-price").innerHTML = "$" + rates.goilUSDT;
}

async function getContractAbi(contractName) {

    const contracts = {

    }

  const response = await axios.post(`${baseUrl}/getContractAbi`, {
    contractName: contractName,
  });

  if (!response.data.result) {
    console.error("Error fetching contract abi:", response.data);
    return;
  }

  return response.data;
}

basieCurrencyInput.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  if (!isNaN(value) && GOILPrice > 0) {
    const selectedCurrency = document.getElementById("floatingSelect").value;
    convertCurrencyInput.value = (value / GOILPrice).toFixed(4);
  } else {
    convertCurrencyInput.value = "";
  }
});

convertCurrencyInput.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  if (!isNaN(value) && GOILPrice > 0) {
    basieCurrencyInput.value = (value * GOILPrice).toFixed(4);
  } else {
    basieCurrencyInput.value = "";
  }
});

async function fetchUsdRaised() {
  try {
    const response = await axios.get(`${baseUrl}/getUsdRaised`);

    if (response.data.result) {
      return response.data.amount;
    }
    return false;
  } catch (error) {
    console.error("Error fetching USD raised:", error);
    return 0;
  }
}

async function getRateData() {
  try {
    const response = await axios.get(`${baseUrl}/getRateData`);

    if (response.data.result) {
      rates = response.data;
      rates.ratesLoaded = true;

      //return response.data.rate;
    }
    return false;
  } catch (error) {
    console.error("Error fetching USD raised:", error);
    return 0;
  }
}

async function checkIfWalletConnected() {
  if (typeof window.ethereum !== "undefined") {
    const walletModal = new bootstrap.Modal(
      document.getElementById("wallet-modal")
    );
    walletModal.hide();
    handleConnection(walletName);
  }
}

async function handleConnection(walletName) {
  let provider;
  if (walletName === "Wallet") {
    const walletConnectProvider = new WalletConnectProvider.default({
      rpc: {
        11155111:
          "https://sepolia.infura.io/v3/03c0562fae984892aab8f70931052ffe",
      },
    });
    await walletConnectProvider.enable();
    provider = new ethers.providers.Web3Provider(walletConnectProvider);
    currentWallet = walletName;
  } else {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    currentWallet = walletName;
  }

  const network = await provider.getNetwork();

  if (network.chainId !== requiredChainId) {
    dropModal({
      headline1: "Your Support Means everything!",
      headline2: "Wrong network detected",
      content: "Please switch to Ethereum Mainnet on your wallet",
      footer: "",
      btn1: false,
      btn2: false,
    });

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(requiredChainId) }],
      });
    } catch (switchError) {
      console.error(
        "User rejected the network switch or it failed:",
        switchError
      );
    }
    return; // Stop further execution if on the wrong network
  }

  // Get the connected wallet address
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();

  userStage = "connected";

  document.getElementById("connect_wallet").textContent = `Purchase $GOIL`;
}

document.getElementById("buyNowBtn").addEventListener("click", function () {
  document.getElementById("buyModal").scrollIntoView({ behavior: "smooth" });
});

let walletModal;
document.addEventListener("DOMContentLoaded", function () {
  walletModal = new bootstrap.Modal(document.getElementById("wallet-modal"));
});

//setTimeout(() => walletModal.hide(), 1000);

document.getElementById("bottom_btn").addEventListener("click", function () {
  document.getElementById("buyModal").scrollIntoView({ behavior: "smooth" });
});

async function startConnectWallet(walletName) {
    if (isMobile()) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await handleConnection();
            return;
        } catch (error) {
            dropModal({
                headline1: 'Your Support Means Everything!',
                headline2: 'Wallet Not Detected',
                content: 'Please connect through your wallet app',
                footer: '',
                btn1: false,
                btn2: false
            });
            return;
        }
    }

  if (walletName !== "Wallet") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
  await handleConnection(walletName);
}

const formatNumber = (num) =>
  Math.abs(num) >= 1.0e9
    ? (num / 1.0e9).toFixed(1).replace(/\.0$/, "") + "B"
    : Math.abs(num) >= 1.0e6
    ? (num / 1.0e6).toFixed(1).replace(/\.0$/, "") + "M"
    : Math.abs(num) >= 1.0e3
    ? (num / 1.0e3).toFixed(1).replace(/\.0$/, "") + "K"
    : num.toString();

function isMetaMaskInAppBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check if it's a mobile browser
  const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);

  // Check if the MetaMask app is the browser
  const isMetaMaskBrowser = /MetaMask/i.test(userAgent);

  return isMobile && isMetaMaskBrowser;
}

function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isMobile = /android|iphone|ipad|ipod/i.test(userAgent);
  return isMobile;
}

function listenWallet() {
  document
    .getElementById("connect_wallet")
    .addEventListener("click", async () => {
      console.log(userStage);
      if (typeof window.ethereum !== "undefined") {
        try {
          if (userStage === "new") {
            // const walletModal = new bootstrap.Modal(document.getElementById('wallet-modal'));
            walletModal.show();
          } else if (userStage === "connected") {
            // Get the selected currency
            const selectedCurrency =
              document.getElementById("floatingSelect").value;

            // Get the amount user wants to pay and the token amount

            const tokenAmountInput = parseFloat(convertCurrencyInput.value);

            if (isNaN(tokenAmountInput)) {
              console.error("Invalid amount entered");
              return;
            }

            // Fetch the contract ABI
            //const resAbi = await getContractAbi("judaVendor");
            const abi = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"address","name":"_priceAddress","type":"address"},{"internalType":"address","name":"_usdtAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountOfETH","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOfTokens","type":"uint256"}],"name":"BuyTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountOfUSDT","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOfTokens","type":"uint256"}],"name":"BuyTokensUSDT","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint64","name":"_roundAmount","type":"uint64"},{"internalType":"uint64","name":"_roundPrice","type":"uint64"}],"name":"addRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"_amount","type":"uint64"}],"name":"buyEthTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint64","name":"_amount","type":"uint64"}],"name":"buyTokenErc20","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentRoundIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCurrentRoundData","outputs":[{"internalType":"uint256","name":"roundAmount","type":"uint256"},{"internalType":"uint256","name":"roundPrice","type":"uint256"},{"internalType":"uint256","name":"roundIndex","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenPriceInUSD","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenAmount","type":"uint256"}],"name":"getUsdtPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getWeiPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isSaleOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"passRound","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rounds","outputs":[{"internalType":"uint64","name":"roundAmount","type":"uint64"},{"internalType":"uint64","name":"roundPrice","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"newIndex","type":"uint256"}],"name":"updateCurrentRoundIndex","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_max","type":"uint256"}],"name":"updateMaxBuy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isPassRound","type":"bool"}],"name":"updatePassRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint64","name":"_roundAmount","type":"uint64"},{"internalType":"uint64","name":"_roundPrice","type":"uint64"}],"name":"updateRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isSaleOpen","type":"bool"}],"name":"updateSaleStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"name":"updateTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawUsdt","outputs":[],"stateMutability":"nonpayable","type":"function"}];
            const contractAddress = '0xA2835D4C4325031b7851E73ED0279C1a6Cd72285'; // sepolia

            let provider;

            if (currentWallet === "Wallet") {
              const walletConnectProvider = new WalletConnectProvider.default({
                rpc: {
                  11155111:
                    "https://sepolia.infura.io/v3/03c0562fae984892aab8f70931052ffe",
                },
              });
              await walletConnectProvider.enable();
              provider = new ethers.providers.Web3Provider(
                walletConnectProvider
              );
            } else {
              // Set up ethers provider and signer
              provider = new ethers.providers.Web3Provider(window.ethereum);
            }
            const signer = provider.getSigner();

            // Initialize the contract
            const contract = new ethers.Contract(contractAddress, abi, signer);

            if (selectedCurrency === "ETH") {
              // For ETH transactions
              const tokenDecimals = 18;
              const tokenAmountInputInt = Math.floor(Number(tokenAmountInput));
              const tokenAmount = ethers.utils.parseUnits(
                tokenAmountInput.toString(),
                tokenDecimals
              );
               
              const weiAmount = await contract.getWeiPrice(tokenAmountInputInt);
              console.log("token Amount:", tokenAmountInput);
              console.log("Wei Amount:", weiAmount.toString());

              document.getElementById(
                "connect_wallet"
              ).textContent = `Processing...`;

              // Call buyTokensEth
              const tx = await contract.buyEthTokens(tokenAmountInputInt, {
                value: weiAmount,
              });

              await tx.wait();

              const txId = tx.hash;

              dropModal({
                headline1: "Your Support Means everything!",
                headline2: "You Successfully bought",
                content: `${formatNumber(tokenAmountInput)} $Goil`,
                footer: "Your wallet balance has been updated",

                btn1: true,
                btn1Link: `https://etherscan.com/tx/${txId}`,
                btn1Content: "Show transaction",

                btn2: true,
                btn2Link: "https://x.com/",
                btn2Content: "Share<br>on X",
              });

              document.getElementById(
                "connect_wallet"
              ).textContent = `Purchase Successful!`;
              setTimeout(() => {
                document.getElementById(
                  "connect_wallet"
                ).textContent = `Purchase $GOIL`;
              }, 3000);
            } 
            else if (selectedCurrency === "USDT") {
              // For USDT transactions

              const usdtContractAddress =
                "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
              const usdtAbi = [
                {
                  inputs: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "uint8", name: "decimals", type: "uint8" },
                    { internalType: "address", name: "owner", type: "address" },
                  ],
                  stateMutability: "nonpayable",
                  type: "constructor",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "owner",
                      type: "address",
                    },
                    {
                      indexed: true,
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "value",
                      type: "uint256",
                    },
                  ],
                  name: "Approval",
                  type: "event",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "previousOwner",
                      type: "address",
                    },
                    {
                      indexed: true,
                      internalType: "address",
                      name: "newOwner",
                      type: "address",
                    },
                  ],
                  name: "OwnershipTransferred",
                  type: "event",
                },
                {
                  anonymous: false,
                  inputs: [
                    {
                      indexed: true,
                      internalType: "address",
                      name: "from",
                      type: "address",
                    },
                    {
                      indexed: true,
                      internalType: "address",
                      name: "to",
                      type: "address",
                    },
                    {
                      indexed: false,
                      internalType: "uint256",
                      name: "value",
                      type: "uint256",
                    },
                  ],
                  name: "Transfer",
                  type: "event",
                },
                {
                  inputs: [],
                  name: "DOMAIN_SEPARATOR",
                  outputs: [
                    { internalType: "bytes32", name: "", type: "bytes32" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "EIP712_REVISION",
                  outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "PERMIT_TYPEHASH",
                  outputs: [
                    { internalType: "bytes32", name: "", type: "bytes32" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                  ],
                  name: "allowance",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                  ],
                  name: "approve",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "account",
                      type: "address",
                    },
                  ],
                  name: "balanceOf",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "decimals",
                  outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "subtractedValue",
                      type: "uint256",
                    },
                  ],
                  name: "decreaseAllowance",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "addedValue",
                      type: "uint256",
                    },
                  ],
                  name: "increaseAllowance",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "account",
                      type: "address",
                    },
                    { internalType: "uint256", name: "value", type: "uint256" },
                  ],
                  name: "mint",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "uint256", name: "value", type: "uint256" },
                  ],
                  name: "mint",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "name",
                  outputs: [
                    { internalType: "string", name: "", type: "string" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "owner", type: "address" },
                  ],
                  name: "nonces",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "owner",
                  outputs: [
                    { internalType: "address", name: "", type: "address" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    { internalType: "address", name: "owner", type: "address" },
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    { internalType: "uint256", name: "value", type: "uint256" },
                    {
                      internalType: "uint256",
                      name: "deadline",
                      type: "uint256",
                    },
                    { internalType: "uint8", name: "v", type: "uint8" },
                    { internalType: "bytes32", name: "r", type: "bytes32" },
                    { internalType: "bytes32", name: "s", type: "bytes32" },
                  ],
                  name: "permit",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "renounceOwnership",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "symbol",
                  outputs: [
                    { internalType: "string", name: "", type: "string" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [],
                  name: "totalSupply",
                  outputs: [
                    { internalType: "uint256", name: "", type: "uint256" },
                  ],
                  stateMutability: "view",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "recipient",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                  ],
                  name: "transfer",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "sender",
                      type: "address",
                    },
                    {
                      internalType: "address",
                      name: "recipient",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                  ],
                  name: "transferFrom",
                  outputs: [{ internalType: "bool", name: "", type: "bool" }],
                  stateMutability: "nonpayable",
                  type: "function",
                },
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "newOwner",
                      type: "address",
                    },
                  ],
                  name: "transferOwnership",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },];

              const usdtContract = new ethers.Contract(
                usdtContractAddress,
                usdtAbi,
                signer
              );

              const usdtAmount = await contract.getUsdtPrice(tokenAmountInput);
              const signerAddress = await signer.getAddress();
              const usdtBalance = await usdtContract.balanceOf(signerAddress);

              console.log("User USDT Balance:", usdtBalance.toString());
              if (usdtBalance < usdtAmount) {
                console.log("insufficient balance!!");
              }

              // Approve the vendor contract to spend USDT
              const allowanceTx = await usdtContract.approve(
                contractAddress,
                usdtAmount
              );
              await allowanceTx.wait();
              console.log("USDT Approved for spending.");

              // Get USDT contract address and ABI

              // Approve the vendor contract to spend USDT
              //const allowanceTx = await usdtContract.approve(contractAddress, usdtAmount);
              document.getElementById(
                "connect_wallet"
              ).textContent = `Processing...`;
              //await allowanceTx.wait();

              // Call buyTokensUsdt
              const tx = await contract.buyTokensErc20(tokenAmountInput);
              await tx.wait();

              document.getElementById(
                "connect_wallet"
              ).textContent = `Purchase Successful!`;
              setTimeout(() => {
                document.getElementById(
                  "connect_wallet"
                ).textContent = `Purchase $GOIL`;
              }, 3000);
            }
          }
        } catch (error) {
          console.error("Transaction failed:", error);

          dropModal({
            headline1: "Your Support Means everything!",
            headline2: "Something went wrong!",
            content: "Please check your balance and wallet connection",
            footer: "",
            btn1: false,
            btn2: false,
          });
          document.getElementById(
            "connect_wallet"
          ).textContent = `Please Try Again!`;
          setTimeout(() => {
            document.getElementById(
              "connect_wallet"
            ).textContent = `Purchase $GOIL`;
          }, 3500);
        }
      } else {
        document.getElementById(
          "connect_wallet"
        ).textContent = `Wallet Not Detected!`;
        setTimeout(() => {
          document.getElementById(
            "connect_wallet"
          ).textContent = `Purchase $GOIL`;
        }, 3000);
        console.error("MetaMask is not installed!");
      }
    });
}

async function mainer() {
  const selectedCurrency = document.getElementById("floatingSelect").value;
  curBarName.innerText = selectedCurrency;
  await getRateData();
  await updateAmountRaised();
  //await updateGOILPrice()

  setInterval(async () => {
    await updateAmountRaised();
  }, 30000);

  setInterval(async () => {
    await getRateData();
  }, 120000);

  //await checkIfWalletConnected();

  listenWallet();
}

mainer();

/*** set text of amount to rise element*/

/**
 * change active plan
 * @param {number} index index of plan to activate
 */
function changePlan(index) {
  const plans = document.querySelectorAll(".buy-tab .buy-stage h3");
  [...plans].forEach((e) => e.classList.remove("active"));
  plans[index].classList.add("active");
}

/**
 * handle input event for basie currency input
 */
basieCurrencyInput.addEventListener("input", (e) => {
  const valueField = e.target.value;
  const value = parseFloat(valueField);

  const selectedCurrency = document.getElementById("floatingSelect").value;
  const keyName = `goil${selectedCurrency}`;
  const rate = rates[keyName];

  // console.log(e.target)

  if (!isNaN(value)) {
    convertCurrencyInput.value = (value / rate).toFixed(0);
  }
});

convertCurrencyInput.addEventListener("input", (e) => {
  const valueField = e.target.value;
  const value = parseFloat(valueField);

  const selectedCurrency = document.getElementById("floatingSelect").value;
  let fixedNum;
  if (selectedCurrency === "ETH") {
    fixedNum = 8;
  } else {
    fixedNum = 4;
  }
  const keyName = `goil${selectedCurrency}`;
  const rate = rates[keyName];
  
  if (!isNaN(value)) {
    basieCurrencyInput.value = (value * rate).toFixed(fixedNum);
  }
});

document.getElementById("maxBtn").addEventListener("click", () => {
  const selectElement = document.getElementById("floatingSelect");
  const selectedCur = selectElement.value.toUpperCase();
  let maxAmount;

  if (selectedCur === "ETH") {
    maxAmount = maximumBuyAmount / rates.ethUsd / rates.goilETH;
  } else {
    maxAmount = maximumBuyAmount / rates.goilUSDT;
  }

  convertCurrencyInput.value = maxAmount.toFixed(4);
  selectElement.dispatchEvent(new Event("change"));
});

/**
 * set maximum amount of GOIL that can be bought
 */

// mask acccountId
function maskAccount(id) {
  const idStr = id.toString();
  const maskId = idStr.slice(0, 4) + "xxxxx" + idStr.slice(-4);
  return maskId;
}

// convert ammount to Word
function formateNumber(number) {
  const units = ["", "k", "M", "B", "T"];
  const index = Math.floor(Math.log10(number) / 3);
  const value = (number / Math.pow(10, index * 3)).toFixed(1);
  return value + units[index];
}

// designe section

// change currency image

// Currency change handler

//const currencySelectImage = [...document.querySelectorAll('.currency-image .select-currncy')]
const currencySelectImage = [...document.querySelectorAll(".select-currncy")];
document.getElementById("floatingSelect").onchange = async (e) => {
  currencySelectImage.forEach((el) =>
    el.classList[el.classList.contains(e.target.value) ? "remove" : "add"](
      "d-none"
    )
  );
  const selectedCurrency = document.getElementById("floatingSelect").value;
  curBarName.innerText = selectedCurrency;
  convertCurrencyInput.dispatchEvent(new Event("input"));

  if (selectedCurrency === "ETH") {
    document.getElementById("usdtBar").classList.add("d-none");
    document.getElementById("ethBar").classList.remove("d-none");
  } else {
    document.getElementById("usdtBar").classList.remove("d-none");
    document.getElementById("ethBar").classList.add("d-none");
  }

  await getRateData();
};
