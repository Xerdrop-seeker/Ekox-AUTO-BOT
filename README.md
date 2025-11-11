# Ekox Auto Bot

A powerful automated bot for interacting with the Ekox protocol on the Hoodi testnet. This bot provides seamless automation for deposit, withdrawal, and claim operations with multi-wallet support.

## 🚀 Features

- **Multi-Wallet Support**: Manage multiple wallets simultaneously through environment configuration
- **Automated Operations**: 
  - Deposit ETH to the protocol
  - Withdraw exETH to ETH
  - Claim rewards automatically
- **Batch Processing**: Execute multiple transactions per wallet in sequence
- **Daily Run Mode**: Automated cycle execution (deposit → withdraw → claim)
- **Real-time Balance Monitoring**: Check ETH and exETH balances for all wallets
- **User-friendly Interface**: Interactive menu system with color-coded logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Hoodi testnet ETH for gas fees

## ⚙️ Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Xerdrop-seeker/Ekox-AUTO-BOT.git
cd Ekox-AUTO-BOT
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   - Add your private keys:
```env
PRIVATE_KEY_1=your_first_private_key_here
PRIVATE_KEY_2=your_second_private_key_here
PRIVATE_KEY_3=your_third_private_key_here
```
   Add as many wallets as needed following the `PRIVATE_KEY_X` pattern.

## 🎯 Usage

Run the bot:
```bash
node main.js
```

### Menu Options

1. **Deposit** - Deposit ETH to the protocol
   - Set amount per transaction (in ETH)
   - Set number of transactions per wallet
   - Uses node operator ID 0 by default

2. **Withdraw** - Withdraw exETH to ETH
   - Set amount per transaction (in exETH)
   - Set number of transactions per wallet
   - Automatically handles token approval

3. **Claim** - Claim withdrawn ETH
   - Set number of claim attempts per wallet
   - Handles multiple claim indices

4. **Daily Run** - Automated cycle execution
   - Configure deposit and withdraw amounts
   - Set number of cycles to run
   - Each cycle: Deposit → Wait → Withdraw → Wait → Claim
   - Includes countdown timers between operations

5. **Exit** - Close the application

## 🔧 Configuration

### Network
- **RPC URL**: `https://rpc.hoodi.ethpandaops.io`
- **Chain**: Hoodi Testnet

### Contract Addresses
- **Deposit**: `0x9E2DDb3386D5dCe991A2595E8bc44756F864C6E3`
- **Withdraw**: `0x1D150609EE9EdcC6143506Ba55A4FAaeDd562Cd9`
- **exETH**: `0x4d38Bd670764c49Cce1E59EeaEBD05974760aCbD`

## 🛡️ Security Features

- Private keys stored in environment variables only
- No sensitive data in logs
- Secure transaction signing
- Balance checks before transactions
- Comprehensive error handling

## 📊 Logging

The bot uses color-coded logging for easy monitoring:
- ✅ **Green**: Success messages and confirmations
- ⚠ **Yellow**: Warnings and non-critical issues
- ✗ **Red**: Errors and critical failures
- → **Cyan**: Loading and progress indicators
- ➤ **White**: Step-by-step operations

## ⚠️ Important Notes

- This bot is designed for the Hoodi testnet
- Always verify you have sufficient ETH for gas fees
- Withdrawals typically require ~25 minutes before claiming
- Test with small amounts first
- Keep your private keys secure and never commit them to version control

## 🐛 Troubleshooting

**Insufficient ETH**: Ensure wallets have enough Hoodi ETH for gas fees

**Transaction Failures**: Check RPC connectivity and gas limits

**Balance Not Updating**: Wait for blockchain confirmations

**Private Key Errors**: Verify .env file format and key validity

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is for educational and development purposes. Use at your own risk.

---

**Disclaimer**: This software is provided as-is. Users are responsible for their own actions and should always exercise caution when interacting with blockchain protocols. Always test with small amounts first and understand the risks involved in DeFi operations.
