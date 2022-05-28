# order-matching-system

A system written in Node.js matches buy and sell orders for a stock market. 
The repository includes three roles:
1. Exchange
2. Broker
3. Order webpage

# Features
1. Exchange
  - Limit Orders
  - Market Orders (planning)
  - Price-Time FIFO matching

2. Broker
  - Transmit order data between exchange and order webpage
  - Store order requests for placing and updating

3. Order webpage
  - K-Line
  - Five Ticks
  - Order Placing and Updating Section
  - Order History

# Requirements
- Redis
- RabbitMQ
- MongoDB
- MySQL

# Techniques
## Order Book
### Price-Time FIFO Matching
- **Buy-side:** ascending in price, descending in time.
  **Sell-side:** ascending in price, ascending in time.
- **Redis Sorted Set** 
  - Key: StockID-buyer, StockID-seller
  - Buy-side-Score: Price concatenates (Midnight 23:59 - Placing Time )
    Sell-side-Score: Price concatenates (Placing Time - Midnight 00:00)
  - Value: orderID
  - Example: a sell order of stock 2330 with ID B-123, price 500, and placing time 5/28 9:00:00:000 AM (GMT)
  
  ![Redis Sorted Set for order book](https://user-images.githubusercontent.com/20513954/170835083-2f82c28e-9775-45cb-ac25-204c0b7a90ea.png)



### Five Ticks
- **Buy-side:** quantity of the five highest buyer prices
  **Sell-side:** quantity of the five lowest seller prices
- **Redis Sorted Set**
  - Key: StockID-buyer-fiveTicks, StockID-seller-fiveTicks
  - Score: Price
  - Value: Size
  
  ![Redis Sorted Set for five ticks](https://user-images.githubusercontent.com/20513954/170835124-1188d1f4-f134-4d47-83a9-c55600b24a0a.png)

## Sequence Diagram of A New Order Request
![Sequence Diagram of A New Order Request](https://user-images.githubusercontent.com/20513954/170835531-91ed5390-23e7-4462-b92d-6e7e18893fa2.png)


## Matching Flow Chart 
![Matching Flow Chart ](https://user-images.githubusercontent.com/20513954/170835145-5974a1c0-2e3b-42f1-b187-5dc3d09cbaba.png)

## Infrastructure Architecture
![Infrastructure Architecture](https://user-images.githubusercontent.com/20513954/170835158-bd86070b-8d40-44f6-9e41-6411df8f8b40.png)

## Matching Class Diagram
- **MatchLogic Class:** responsible for the main matching workflow
- **DealerProvider Class:** provide the order info of the best dealer
- **SellerInfo/BuyerInfo Class:** inherit from DealerInfo class to provide the condition of the best dealer
- **ExecutionUpdate Class:** handle and send the execution result 
- **RabbitMQ/Redis Class:** service providers
- DealerProvider, ExecutionUpdate, and Redis are injected into MatchLogic.
- DealerInfo and Redis are injected into DealerProvider.
- RabbitMQ and Redis are injected into DealerProvider.

![Matching Class UML](https://user-images.githubusercontent.com/20513954/170835174-72fcc8c3-7e82-4c16-9ab5-f364686955be.png)

## Race Condition Solution
- Redis: SETNX method
- MySQL: Lock-For-Update method
- API response & Socket.IO conflict on the order list (webpage): record the order list status to sustain the latest result

## Data Transmission
- RESTful API (document is in the progress)
- Socket.IO

# Demo
https://user-images.githubusercontent.com/20513954/170835348-77f79ec4-0592-4534-86f7-02205cd1b3bf.mov


# Installation
