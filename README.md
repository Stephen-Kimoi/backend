# Investa Farm API Documentation

Welcome to the documentation for the Investa Farm API. This API allows interaction with the FarmDAO smart contract deployed on the Ethereum blockchain. The smart contract facilitates the creation and management of decentralized autonomous organizations (DAOs) for farmers and investors.

Main API Link: https://backend-api-hfoigmtv6a-de.a.run.app/ 

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
   - [1. Get Root](#1-get-root)
   - [2. Get Registered DAOs](#2-get-registered-daos)
   - [3. Register Farmer DAO](#3-register-farmer-dao)
   - [4. Register Investor](#4-register-investor)
   - [5. Get Registered Investors](#5-get-registered-investors)
   - [6. Get Total Investment by Investor](#6-get-total-investment-by-investor)
   - [7. Get Total DAOs Invested by Investor](#7-get-total-daos-invested-by-investor)
   - [8. Check if Investor is Registered](#8-check-if-investor-is-registered)
   - [9. Withdraw Funds from DAO](#9-withdraw-funds-from-dao)
   - [10. Get Current Amount Available in DAO](#10-get-current-amount-available-in-dao)
   - [11. Repay Funds to DAO](#11-repay-funds-to-dao)
   - [12. Get Total Investment in DAO](#12-get-total-investment-in-dao)
3. [Usage Examples](#usage-examples)
4. [Conclusion](#conclusion)

## Introduction

The Investa Farm API interacts with the FarmDAO smart contract, allowing users to register farmers and investors, create and manage DAOs, and perform various operations related to investments and fund management.

## API Endpoints

### 1. Get Root

- **Endpoint:** `/`
- **Method:** `GET`
- **Description:** Welcome message and API overview.

### 2. Get Registered DAOs

- **Endpoint:** `/registered-daos/`
- **Method:** `GET`
- **Description:** Retrieve a list of all registered DAOs.

### 3. Register Farmer DAO

- **Endpoint:** `/register-farmer`
- **Method:** `POST`
- **Description:** Register a new farmer DAO.
- **Request Body:**
  ```json
  {
    "walletAddress1": "0xYourAddress1",
    "walletAddress2": "0xYourAddress2",
    "farmerName1": "FarmerName1",
    "farmerName2": "FarmerName2",
    "description": "DAO Description",
    "farmReports": "Farm Reports",
    "financialReports": "Financial Reports",
    "daoName": "DAO Name"
  }
  ```
- **Response:**
  ```json
  {
    "success": true
  }
  ```

### 4. Register Investor

- **Endpoint:** `/register-investor`
- **Method:** `POST`
- **Description:** Register a new investor.
- **Request Body:**
  ```json
  {
    "name": "InvestorName"
  }
  ```
- **Response:**
  ```json
  {
    "success": true
  }
  ```

### 5. Get Registered Investors

- **Endpoint:** `/registered-investors`
- **Method:** `GET`
- **Description:** Retrieve a list of all registered investors.

### 6. Get Total Investment by Investor

- **Endpoint:** `/total-investment-by-investor`
- **Method:** `GET`
- **Description:** Get the total investment by a specific investor.
- **Request Body:**
  ```json
  {
    "investor": "0xInvestorAddress"
  }
  ```

### 7. Get Total DAOs Invested by Investor

- **Endpoint:** `/total-number-of-daos-by-investor`
- **Method:** `GET`
- **Description:** Get the total number of DAOs invested by a specific investor.
- **Request Body:**
  ```json
  {
    "investor": "0xInvestorAddress"
  }
  ```

### 8. Check if Investor is Registered

- **Endpoint:** `/is-investor-registered`
- **Method:** `GET`
- **Description:** Check if a specific investor is registered.
- **Request Body:**
  ```json
  {
    "investor": "0xInvestorAddress"
  }
  ```

### 9. Withdraw Funds from DAO

- **Endpoint:** `/withdraw-funds`
- **Method:** `POST`
- **Description:** Withdraw funds from a specific DAO.
- **Request Body:**
  ```json
  {
    "daoId": 1,
    "amountToWithdraw": 100
  }
  ```
- **Response:**
  ```json
  {
    "success": true
  }
  ```

### 10. Get Current Amount Available in DAO

- **Endpoint:** `/get-current-amount-in-dao`
- **Method:** `GET`
- **Description:** Get the current amount available in a specific DAO.
- **Request Body:**
  ```json
  {
    "daoId": 1
  }
  ```

### 11. Repay Funds to DAO

- **Endpoint:** `/repay-funds`
- **Method:** `POST`
- **Description:** Repay funds to a specific DAO.
- **Request Body:**
  ```json
  {
    "daoId": 1,
    "amountToRepay": 50
  }
  ```
- **Response:**
  ```json
  {
    "success": true
  }
  ```

### 12. Get Total Investment in DAO

- **Endpoint:** `/get-total-investment`
- **Method:** `GET`
- **Description:** Get the total investment in a specific DAO.
- **Request Body:**
  ```json
  {
    "daoId": 1
  }
  ```

## Usage Examples


  ```

## Conclusion

The Investa Farm API provides a simple and effective way to interact with the FarmDAO smart contract on the Ethereum blockchain. Users can