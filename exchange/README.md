# Exchange Server API

## New Order API

- **End Point:** `/api/newOrder`
- **Method:** `POST`
- **Request Headers:**

|    Field     |  Type  |           Description           |
| :----------: | :----: | :-----------------------------: |
| Content-Type | String | Only accept `application/json`. |

- **Request Body**

|   Field   |  Type  |                 Description                 |
| :-------: | :----: | :-----------------------------------------: |
|  account  |  Int   |               User account ID               |
|  broker   |  Int   |                  Broker ID                  |
|  symbol   |  Int   |                  Stock ID                   |
|    BS     | String |         Only accept `buy` or `sell`         |
| orderType | String |       Only accept `limit`       |
| duration  | String |              Only accept `ROD`              |
|   price   | Float  | Price |
| quantity  |  Int   |       Only accept `limit`       |

- **Response**
|   Field   |  Type  |                 Description                 |
| :-------: | :----: | :-----------------------------------------: |
|  orderID  |  Int   |       -       |
|  orderStatus  |  Int   |               1: placing success               |
|  symbol   |  Int   |                  Broker ID                  |
|    BS     | String |         `buy` or `sell`         |
|   price   | Float  | Price |
| quantity  |  Int   |       Order quantity       |
| executionQuantity  |  Int   |       Quantity already traded       |
| orderTime  |  String   |       Timestamp with millisecond       |


