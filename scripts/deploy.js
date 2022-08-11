//imports
const { ethers, run, network } = require("hardhat")

//async main function
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const contract = await SimpleStorageFactory.deploy()
  await contract.deployed()

  console.log(`Deployed contract to address: ${contract.address}`)
  //console.log(network.config)
  /*in javascript, 4==4 and 4=="4" are true but 4==="4" is false*/
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await contract.deployTransaction.wait(6)
    await verify(contract.address, [])
  }

  const currentValue = await contract.retrieve()
  console.log(`Current Value is : ${currentValue}`)

  //updating currentValue
  const transactionResponse = await contract.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await contract.retrieve()
  console.log(`Updated Value : ${updatedValue}`)
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

//main function call
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
