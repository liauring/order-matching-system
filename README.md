# order-matching-system

### New Order API
* **End Point:** `/newOrder`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json`. |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :---: |
| account | Int | User account ID |
| broker | Int | Broker ID |
| symbol | Int | Stock ID |
| BS | String | Only accept `buy` or `sell` |
| orderType | String | Only accept `market` or `limit` |
| duration | String | Only accept `ROD` |
| price | Float | Only accept `price` if orderType is `limit` |
| quantity | Int | Only accept `market` or `limit` |
