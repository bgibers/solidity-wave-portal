# Wave Portal

Wave portal is a quick project created to practice and improve my solidity/react skills. This uses a real(ish) life scenario. A user can enter my portal to say hey. The message is permanently stored on the blockchain and displayed on the portal. The user also has a small chance to win some eth for visiting and saying hey! 

## Prerequisites 

- Hardhat env configured
- An alchemy account for deploying to the test network

If assistance is needed use the hardhat [tutorial](https://hardhat.org/tutorial/)

## Installation

Pull down this code and run npm install

```bash
git@github.com:bgibers/solidity-wave-portal.git
npm install
```
Add your private key and alchemy key to a .env file, that is located in the `backend` directory


## Usage

All commands ran from within the `backend` directory
```bash
# run local tests in run.js script
npx hardhat run scripts/run.js

# run tests
npx hardhat test

# deploy to rinkeby network
npx hardhat run scripts/deploy.js --network rinkeby
```

## Front End
You can view my working project on [replit](https://waveportal-starter-project.bgibers.repl.co/)

and edit the source code on replit [here](https://replit.com/@bgibers/waveportal-starter-project#src/App.js)

## License
[MIT](https://choosealicense.com/licenses/mit/)
