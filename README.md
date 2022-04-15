# order-matching-system

### New Order API
* **End Point:** `/stock/newOrder`

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


* **Request Body Example:**

```
{
  "account":"native",
  "broker":"test@test.com",
  "symbol":"test"
}
```
or
```
{
  "provider":"facebook",
  "access_token": "EAACEdEose0cBAHc6hv9kK8bMNs4XTrT0kVC1RgDZCVBptXW12AI"
}
```

* **Success Response: 200**

| Field | Type | Description |
| :---: | :---: | :--- |
| access_token | String | Access token from server. |
| access_expired | Number | Access token expired time in seconds. |
| user | `User Object` | User information |

* **Success Response Example:**

```
{
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6joiYXJ0aHVIjoxNjEzNTY3MzA0fQ.6EPCOfBGynidAfpVqlvbHGWHCJ5LZLtKvPaQ",
    "access_expired": 3600,
    "user": {
      "id": 11245642,
      "provider": "facebook",
      "name": "Pei",
      "email": "pei@appworks.tw",
      "picture": "https://schoolvoyage.ga/images/123498.png"
    }
  }
}
```

* **Sign In Failed: 403**

| Field | Type | Description |
| :---: | :---: | :--- |
| error | String | Error message. |

* **Client Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :--- |
| error | String | Error message. |

* **Server Error Response: 500**

| Field | Type | Description |
| :---: | :---: | :--- |
| error | String | Error message. |

----