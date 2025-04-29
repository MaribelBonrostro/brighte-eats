# Brighte GraphQL API

- **Database Schema**:
  - `leads`: Stores lead information.
  - `services`: Stores available services. ["delivery", "pick_up", "payment"]
  - `lead_services`: Junction table to associate leads with services.

## Database Tables

### `leads` Table

| Column       | Type                       | Constraints                 |
| ------------ | -------------------------- | --------------------------- |
| `id`         | `uuid`                     | Primary key, auto-generated |
| `name`       | `text`                     | Not null                    |
| `email`      | `text`                     | Not null, unique            |
| `mobile`     | `text`                     | Not null                    |
| `postcode`   | `text`                     | Not null                    |
| `created_at` | `timestamp with time zone` | Default: `now()`            |

### `services` Table

| Column | Type           | Constraints                                       |
| ------ | -------------- | ------------------------------------------------- |
| `id`   | `serial`       | Primary key                                       |
| `name` | `service_name` | Not null, enum (`delivery`, `pick_up`, `payment`) |

### `lead_services` Table

| Column       | Type      | Constraints                                             |
| ------------ | --------- | ------------------------------------------------------- |
| `lead_id`    | `uuid`    | Foreign key references `leads(id)` on delete cascade    |
| `service_id` | `integer` | Foreign key references `services(id)` on delete cascade |

---

# There are 3 services defined in this docker-compose file

| url                   | service     | dependencies          |
| --------------------- | ----------- | --------------------- |
| http://localhost:5432 | **db**      | N/A                   |
| http://localhost:4000 | **app**     | _(depends on **db**)_ |
| http://localhost:8080 | **pgAdmin** | _(depends on **db**)_ |

## Running the Services

### 1. Set Up Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
PORT=4000
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Start the Services

Use the following command to start the services:

```bash
docker-compose up
```

use this command to create the schema

```bash
docker-compose exec app npm run init-db
```

**Note:** In the meantime, you can manually add the services to the database using the following SQL query in your database query tool:

```sql
INSERT INTO "services" ("name")
VALUES
  ('pick_up'),
  ('payment'),
  ('delivery');
```

### 4. Stop the Services

To stop the services, use:

```bash
docker-compose down
```

# Example Queries

## Fetch All Leads with Services

```graphql
query {
  lead {
    leads {
      id
      name
      email
      mobile
      postcode
      services
    }
  }
}
```

## Fetch a Single Lead by ID

```graphql
query {
  lead {
    lead(id: "id") {
      id
      name
      email
      mobile
      postcode
      services
    }
  }
}
```

## Create a New Lead

```graphql
mutation {
  lead {
    create(
      input: {
        name: "Jane Doe"
        email: "jane.doe@example.com"
        mobile: "092791243"
        postcode: "3024"
        services: ["pick_up", "delivery"]
      }
    ) {
      id
      name
      email
      mobile
      postcode
      services
    }
  }
}
```
