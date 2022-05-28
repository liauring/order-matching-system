# Order Matching System
A system written in Node.js matches buy and sell orders for a stock market. The repository includes three roles:
1. Exchange
2. Broker
3. Order webpage

# Language and Tools
<img src="https://user-images.githubusercontent.com/20513954/170839330-dd457cfa-5fad-4f59-bf54-944eb8a00c87.png" title="Nodejs" alt="Nodejs" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839333-dedcb8c9-4e7e-4b7a-a59f-dc42ca912802.png" title="React" alt="React" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839732-969eeff4-6cab-470d-8857-751b737a5e76.png" title="Redis" alt="Redis" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839211-67faef21-ed92-4ded-b778-528a8c5c1676.png" title="MongoDB" alt="MongoDB" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839212-08016e0d-0593-4d3c-9ca5-efcf4e30a26f.png" title="MySQL" alt="MySQL" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839864-77e1b0f7-484e-4f7b-b043-669878048e27.svg" title="RabbitMQ" alt="RabbitMQ" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839801-7ddb772e-b727-4e50-94d0-f0b30a6ebaee.png" alt="EC2" height="40"/>&nbsp;
<img src="https://user-images.githubusercontent.com/20513954/170839683-01133667-44a4-43b1-a974-dff6d177c547.png" alt="SocketIO" height="40"/>&nbsp;


# Table of Contents
- [Features](#Features)
- [Techniques](#Techniques)
  - [Order Book](#Order-Book)
    - [Price-Time FIFO Matching](#Price-Time-FIFO-Matching)
    - [Five Ticks](#Five-Ticks)
  - [Sequence Diagram of A New Order Request](#Sequence-Diagram-of-A-New-Order-Request)
  - [Matching Flow Chart ](#Matching-Flow-Chart)
  - [Infrastructure Architecture](#Infrastructure-Architecture)
  - [Matching Class Diagram](#Matching-Class-Diagram)
  - [Race Condition Solution](#Race-Condition-Solution)
  - [Data Transmission](#Data-Transmission)
- [Performance Test of Exchange Server](#Performance-Test-of-Exchange-Server )
- [Demo](#Demo)
- [Installation](#Installation)


# Features
**1. Exchange**
  - Limit Orders
  - Market Orders (planning)
  - Price-Time FIFO matching

**2. Broker**
  - Transmit order data between exchange and order webpage
  - Store order requests for placing and updating

**3. Order webpage**
  - K-Line
  - Five Ticks
  - Order Placing and Updating Section
  - Order History

# Techniques
## Order Book
### Price-Time FIFO Matching
- **Buy-side:** ascending in price, descending in time.
- **Sell-side:** ascending in price, ascending in time.
- **Redis Sorted Set** 
  - Key: StockID-buyer, StockID-seller
  - Buy-side-Score: Price concatenates (Midnight 23:59 - Placing Time )
    Sell-side-Score: Price concatenates (Placing Time - Midnight 00:00)
  - Value: orderID
  - Example: a sell order of stock 2330 with ID B-123, price 500, and placing time 5/28 9:00:00:000 AM (GMT)
  
  ![Redis Sorted Set for order book](https://user-images.githubusercontent.com/20513954/170835083-2f82c28e-9775-45cb-ac25-204c0b7a90ea.png)



### Five Ticks
- **Buy-side:** quantity of the five highest buyer prices
- **Sell-side:** quantity of the five lowest seller prices
- **Redis Sorted Set**
  - Key: StockID-buyer-fiveTicks, StockID-seller-fiveTicks
  - Score: Price
  - Value: Size
  
  ![Redis Sorted Set for five ticks](https://user-images.githubusercontent.com/20513954/170835124-1188d1f4-f134-4d47-83a9-c55600b24a0a.png)

## Sequence Diagram of A New Order Request
![Sequence Diagram of A New Order Request](https://user-images.githubusercontent.com/20513954/170836906-506530ff-6392-4209-9496-588eeb6f2906.png)


## Matching Flow Chart 
![Matching Flow Chart ](https://user-images.githubusercontent.com/20513954/170835145-5974a1c0-2e3b-42f1-b187-5dc3d09cbaba.png)

## Infrastructure Architecture
![Infrastructure Architecture](https://user-images.githubusercontent.com/20513954/170836721-4f194d19-52b1-45e8-ab1c-baf6b6f587ea.png)

## Matching Class Diagram
- **MatchLogic Class:** responsible for the `main matching workflow`
- **DealerProvider Class:** provide the order info of the best dealer
- **SellerInfo/BuyerInfo Class:** inherit from DealerInfo class to provide the condition of the best dealer
- **ExecutionUpdate Class:** handle and send the execution result 
- **RabbitMQ/Redis Class:** service providers
- DealerProvider, ExecutionUpdate, and Redis are injected into MatchLogic.
- DealerInfo and Redis are injected into DealerProvider.
- RabbitMQ and Redis are injected into DealerProvider.

![Matching Class UML](https://user-images.githubusercontent.com/20513954/170836193-f98e9cb0-6b0f-462c-b06f-5aa678c567b7.png)

## Race Condition Solution
- **Redis:** SETNX method
- **MySQL:** Lock-For-Update method
- **API response & Socket.IO conflict on the order list (webpage):** record the order list status to sustain the latest result

## Data Transmission
- RESTful API (document is in the progress)
- Socket.IO

# Performance Test of Exchange Server 
## Test Scenario 
Calculate the duration from receiving a request to sending the execution result under the condition of 250 executions per second.
> 2021/5/1 - 5/30 on average 250 executions per second in Taiwan stock market.
>

## Test Circumstances
- Exchange server on an EC2 t2-medium in Singapore
- Exchange worker and Redis on an EC2 t2-medium in Singapore

## Test Procedure
1. Record timestamp of start and end time when the order is passed to the next step.
2. Clear all data in all services.
3. Send a sell order with 1 dollar and 250 quantities by Postman.
4. Send 250 buy orders with 1 dollar and 1 quantity by javascript for-loop (concurrent operation) so that each order would be ensured to match.
5. Send the timestamp result to RabbitMQ so that the result processing would not block the matching process.
6. A worker consumes the result from RabbitMQ and exports the data to a CSV file.
7. Analyze the result file.

## Test Result
- On average an order **processing duration**: lower than 20 milliseconds
- On average an order **matching duration**: 2.5 milliseconds seconds

![Performance Test](https://user-images.githubusercontent.com/20513954/170837849-b73fcd71-a339-4816-bd32-1521626ff200.png)

# Demo
https://user-images.githubusercontent.com/20513954/170835348-77f79ec4-0592-4534-86f7-02205cd1b3bf.mov


# Installation
