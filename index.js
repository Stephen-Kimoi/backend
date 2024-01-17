const ethers = require('ethers'); 
const express = require('express');   
const CC = require('currency-converter-lt')
const cors = require('cors'); 
require('dotenv').config();  
const ALCHEMY_API = process.env.ALCHEMY_API; 
const PRIVATE_KEY = process.env.PRIVATE_KEY; 

const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API); 
const signer = new ethers.Wallet(PRIVATE_KEY, provider); 
const abi = require ('./FarmDAO.json'); 
const contractAddress = require('./contracts-address.json'); 

// MAIN CONTRACT BEING USED IN DEPLOYMENT 
// const mainContractAddress = require('./main-contract-address.json'); 
// const mainAbi = require('./MainFarmDAO.json'); 

// const contractInstance = new ethers.Contract(contractAddress.FarmDAO, abi.abi, signer); 
const contractInstance = new ethers.Contract(contractAddress.FarmDAO, abi.abi, signer); 

const priceConsumerV3Address = "0x1ad9d4269E0Ce5b4c30483244c261F31fbD5b6f5"; 
const priceConsumerABI = require('./PriceConsumerV3.json'); 
const priceConsumer = new ethers.Contract(priceConsumerV3Address, priceConsumerABI.abi, provider); 


const app = express(); 
app.use(express.json()); 

// const corsOptions = {
//     origin: "*",
//     methods: ['GET','POST']
// };
app.use(cors());


// app.options('*', cors(corsOptions));

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*"); 
//     res.setHeader( "Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE" ); 
//     res.setHeader("Access-Control-Allow-Headers", "*"); 
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     next(); 
// });  

const mpesaPaymentData = [];
const mpesaWithdrawData = []; 

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  
    // Log all request headers
    const requestHeaders = req.headers;
    // logger.info(`[${req.method}] [${req.originalUrl}] [REQUEST HEADERS] ${JSON.stringify(requestHeaders)}`, { headers: requestHeaders });
  
    // Log error responses with red color
  
    // Apply rate limiting middleware
    // const limiter = rateLimit({
    //   windowMs: 1 * 60 * 1000, // 1 minute window
    //   max: 100, // 100 requests per window
    // });
  
    // const userSource = req.headers["user-source"];
    // const device = req.headers["user-device"];
    // const ipAddress =
    //   req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  
    console.log(
      `[${req.method}] [${req.originalUrl}] [REQUEST HEADERS] ${
        /*JSON.stringify(requestHeaders) */ ""
      }`, 
      { headers: requestHeaders }
    );
    // app.set("trust proxy", true);
    // app.use(limiter);
    const originalJson = res.json;
    res.json = function (body) {
      if (res.statusCode >= 400) {
        const errorMessage = body?.error || "Error response";
        console.error(
          `[${req.method}] [${req.originalUrl}] [${res.statusCode}] [ERROR RESPONSE] ${errorMessage}`,
          { response: body }
        );
      } else {
        console.log(
          `[${req.method}] [${req.originalUrl}] [${res.statusCode}] [SUCCESS RESPONSE]`,
          { response: body }
        );
      }
      return originalJson.apply(res, arguments);
    };
      
  
    next();
});

app.get('/', async(req, res) => {
    try {
      res.send("Welcome to Investa Farm API! Check out our documentation for more info. \n Register at: \n 1. register-investor \n 2. register-farmer \n Check registered daos at: \n 1. registered-daos \n 3. registered-farmers")
    } catch (error){
       res.status(500).send(error)
    }
}); 

// Calling registered DAOs
app.get('/registered-daos/', async(req, res) => { // http://localhost:8080/registered-daos
    try {
        const registeredDaos = await contractInstance.getAllDaos();  
        res.send(registeredDaos); 
    } catch (error) {
        res.status(500).send(error); 
    }
}); 

//  Registering farmer DAOs
app.post('/register-farmer', async(req, res) => { //http://localhost:8080/register-farmer
    try { 
        const { farmerId, farmerName1, description, farmReports, financialReports, daoName } = req.body; 
        // console.log(
        //     farmerId, 
        //     farmerName1, 
        //     description, 
        //     farmReports,
        //     financialReports, 
        //     daoName
        // )
        const tx = await contractInstance.registerFarmerFromGoogleSignIn(
            farmerId,
            description,  
            farmerName1,  
            daoName, 
            farmReports,
            financialReports, 
        )
        console.log("Loggin in transaction...."); 
        await tx.wait(); 
        res.json({success: true})
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}); 

// Registering investors 
app.post('/register-investor', async(req, res) => { //http://localhost:8080/register-investor
    try {
      const { name, investorId } = req.body; 
      const tx = await contractInstance.registerInvestorFromGoogleSignIn(investorId, name); 
      await tx.wait(); 
      res.json({success: true}); 
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// Getting registered investors
app.get('/registered-investors', async(req, res) => { //http://localhost:8080/registered-investors
    try {
        const registeredInvestors = await contractInstance.getAllInvestorInfo();  
        res.send(registeredInvestors); 
    } catch(error) {
        res.status(500).send(error.message)
    }
}); 
 
app.post('/add-investment', async(req, res) => { // http://localhost:8080/add-investment
  try {
    const { daoId, investorId, amount } = req.body; 
    console.log(daoId, investorId, amount ); 
    const tx = await contractInstance.addInvestment(daoId, investorId, amount); 
    console.log(tx)
    await tx.wait(); 
    res.json({ success: true }); 
  } catch (error){
    res.status(500).send(error.message)
  }
})

// Getting total investment by Investor
app.post('/total-investment-by-investor', async(req, res) => { // http://localhost:8080/total-investment-by-investor
    try {
       const { googleId } = req.body; 
       const totalInvestmentByInvestor = await contractInstance.getTotalInvestmentByGoogleInvestor(googleId); 
       res.send(totalInvestmentByInvestor); 
    } catch (error) {
      res.status(500).send(error.message); 
    }
})

// Getting total Daos invested by a single investor
app.post('/total-number-of-daos-by-investor', async(req,res) => { // http://localhost:8080/total-number-of-daos-by-investor 
    try {
      const { googleId } = req.body; 
      const totalNumberOfDaosByInvestor = await contractInstance.getTotalNumberOfDaosByGoogleInvestor(googleId); 
      console.log("Total number of daos by investor: ", totalNumberOfDaosByInvestor)
      res.send(totalNumberOfDaosByInvestor)
    } catch (error) {
      res.status(500).send(error.message)
    }
})

// Checking whether investor is registered
app.get('/is-investor-registered', async(req, res) => {
    try {
      const { investor } = req.body; 
      const isInvestorRegistered = await contractInstance.isInvestorRegistered(investor); 
      res.send(isInvestorRegistered); 
    } catch(error) {
      res.status(500).send(error.message); 
    }
})

// FUnction for withdrawing funds 
app.post('/withdraw-funds', async(req, res) => {
    try {
       const { daoId, amountToWithdraw } = req.body; 
       const tx = await contractInstance.withDrawDFunds(daoId, amountToWithdraw); 
       await tx.wait(); 
       res.json({success: true}); 
    } catch(error) {
        res.status(500).send(error.message); 
    }
})

// Returning current amount available in the DAO  
app.post('/get-current-amount-in-dao', async(req, res) => {
    try {
      const { daoId } = req.body; 
      const currentAmountAvailable = await contractInstance.getCurrentAmountAvailable(daoId); 
      res.send(currentAmountAvailable); 
    }catch(error) {
      res.status(500).send(error.message); 
    }
})

// Repaying funds 
app.post('/repay-funds', async(req, res) => {
    try {
       const { daoId, amountToRepay } = req.body; 
       const tx = await contractInstance.repayFunds(daoId, amountToRepay); 
       await tx.wait(); 
       res.json({success: true}); 
    }catch (error) {
        res.status(500).send(error.message); 
    }
})

// Function for getting total investment
app.get('/get-total-investment', async(req, res) => {
    try {
       const { daoId } = req.body; 
       const totalInvestment = await contractInstance.getTotalInvestment(daoId); 
       res.send(totalInvestment); 
    }catch(error){
       res.status(500).send(error.message); 
    }
})

// Function for getting total amount withdrawn 
app.post('/get-total-amount-withdrawn', async(req, res) => { // http://localhost:8080//get-total-amount-withdrawn
  try {
    const { daoId } = req.body;  
    const totalAmountWithdrawn = await contractInstance.getTotalAmountWithdrawn(daoId); 
    res.send(totalAmountWithdrawn)
  } catch (error) {
    res.status(500).send(error.message); 
  }
})

// Function for calling price consumer ABI
app.get('/get-price-consumer', async(req, res) => { // http://localhost:8080/get-price-consumer
  try {
    const price = await priceConsumer.getLatestPrice();
    const priceInt = parseInt(price) / 100000000;
    const priceIntJSON = { 
      priceInt: priceInt.toString()
    }

    res.send(priceIntJSON); 
  } catch (error){ 
    res.status(500).send(error.message); 
  }
})

// MPESA DATA PAYMENTS FUNCTIONS

// Convert KES to USD
app.post('/convert-kes-to-usd', async (req, res) => { // http://Localhost:8080/convert-kes-to-usd 
  try {
    const { amount } = req.body; 
    let currencyConverter = new CC({from:"KES", to:"USD", amount: amount}); 

    let responseJSON = {
      amount: null
    }

    currencyConverter.convert().then((response) => {
      responseJSON = {
        amount: response
      }
      res.send(responseJSON)
    }); 
    
  } catch (error) {
    console.error(error)
  }
})

app.post('/callback-url', (req, res) => { // http://Localhost:8080/callback-url
  try {
      const { body } = req; 
      mpesaPaymentData.push(body);
      console.log("Payment data is: ", mpesaPaymentData); 
      res.json({success: true});
  } catch (error) {
      res.status(500).send(error); 
  }
})

app.get('/mpesa-payment-data', (req, res) => { // http://Localhost:8080/mpesa-payment-data 
  try {
    const data = {
      "Mpesa Payment Data": mpesaPaymentData
    } 
    res.send(data); 
  } catch (error) {
    res.status(500).send(error); 
  }
})

app.post('/mpesa-queue-timeout-url', (req, res) => { // http://Localhost:8080/mpesa-queue-timeout-url 
  try {
    res.json({success: true});
  } catch (error){
    res.status(500).send(error); 
  }
})

app.post('/mpesa-withdraw-result', (req, res) => { // http://Localhost:8080/mpesa-withdraw-result 
  try {
    const { body } = req; 
    mpesaWithdrawData.push(body); 
    console.log("Withdraw data is: ", mpesaWithdrawData); 
    res.json({success: true});
  } catch (error){
    res.status(500).send(error); 
  }
})

const port = parseInt(process.env.PORT) || 8080; // Use this in production 

app.listen(port, () => {
    console.log(`Investa Farm API server is starting on port ${port}`)
}); 


