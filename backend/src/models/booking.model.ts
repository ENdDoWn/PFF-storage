import { docClient, TABLE_NAME } from "../config/database";

export interface Rental {
  userId: string;
  rentalId: string;
  roomId: string;
  warehouseId: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'REJECTED';
  paymentSlip?: string;
  createdAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface Product {
  userId: string;
  productId: string;
  name: string;
  importDate: string;
  expiryDate: string;
  quantity: number;
  status: string;
  roomId: string;
}

// Create a new rental
export const create = async (data: Omit<Rental, 'rentalId'>) => {
  const rentalId = `RNT${Date.now()}`;
  const rental = {
    PK: `USER#${data.userId}`,
    SK: `RENTAL#${rentalId}`,
    type: "Rental",  // GSI1 Partition Key
    GSI1SK: `STATUS#${data.status}#${new Date().toISOString()}`,  // GSI1 Sort Key
    Type: "Rental",
    rentalId,
    ...data
  };
  
  await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).PutCommand({
      TableName: TABLE_NAME,
      Item: rental
    })
  );
  
  return rental;
};

// Get rental by ID
export const findById = async (userId: string, rentalId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `RENTAL#${rentalId}`
      }
    })
  );
  return result.Item;
};

// Get all rentals for a user
export const findByUserId = async (userId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "RENTAL#"
      }
    })
  );
  return result.Items || [];
};

// Get active rentals for a user
export const findActiveRentals = async (userId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      FilterExpression: "#status = :status",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "RENTAL#",
        ":status": "ACTIVE"
      }
    })
  );
  return result.Items || [];
};

// Update rental status
export const updateStatus = async (userId: string, rentalId: string, status: Rental['status']) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `RENTAL#${rentalId}`
      },
      UpdateExpression: "SET #status = :status, GSI1SK = :gsi1sk",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":gsi1sk": `STATUS#${status}#${new Date().toISOString()}`
      },
      ReturnValues: "ALL_NEW"
    })
  );
  
  return result.Attributes;
};

// Get all rentals (admin) - Using GSI1
export const findAll = async () => {
  const { QueryCommand } = await import("@aws-sdk/lib-dynamodb");
  
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    // 1. ระบุว่าให้ค้นบน Index
    IndexName: "GSI1_By_Type_and_Status",
    
    // 2. ค้นหาโดยใช้ Key ของ GSI (ไม่ใช่การ Scan)
    KeyConditionExpression: "#type = :type",
    ExpressionAttributeNames: {
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":type": "Rental"
    }
  });
  
  const result = await docClient.send(command);
  return result.Items || [];
};

// Get pending rentals (admin) - Using GSI1
export const findPendingRentals = async () => {
  const { QueryCommand } = await import("@aws-sdk/lib-dynamodb");
  
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    // 1. ระบุว่าให้ค้นบน Index
    IndexName: "GSI1_By_Type_and_Status",
    
    // 2. ค้นหาโดยใช้ Key ของ GSI พร้อมกรอง Status
    KeyConditionExpression: "#type = :type AND begins_with(GSI1SK, :status)",
    ExpressionAttributeNames: {
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":type": "Rental",
      ":status": "STATUS#PENDING"
    }
  });
  
  const result = await docClient.send(command);
  return result.Items || [];
};

// Approve rental (changes status to ACTIVE)
export const approveRental = async (userId: string, rentalId: string, approvedBy: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `RENTAL#${rentalId}`
      },
      UpdateExpression: "SET #status = :status, approvedAt = :approvedAt, approvedBy = :approvedBy, GSI1SK = :gsi1sk",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": "ACTIVE",
        ":approvedAt": new Date().toISOString(),
        ":approvedBy": approvedBy,
        ":gsi1sk": `STATUS#ACTIVE#${new Date().toISOString()}`
      },
      ReturnValues: "ALL_NEW"
    })
  );
  
  return result.Attributes;
};

// Reject rental
export const rejectRental = async (userId: string, rentalId: string, rejectedBy: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `RENTAL#${rentalId}`
      },
      UpdateExpression: "SET #status = :status, rejectedAt = :rejectedAt, rejectedBy = :rejectedBy, GSI1SK = :gsi1sk",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": "REJECTED",
        ":rejectedAt": new Date().toISOString(),
        ":rejectedBy": rejectedBy,
        ":gsi1sk": `STATUS#REJECTED#${new Date().toISOString()}`
      },
      ReturnValues: "ALL_NEW"
    })
  );
  
  return result.Attributes;
};

// ============= PRODUCT FUNCTIONS =============

// Create a product
export const createProduct = async (data: Omit<Product, 'productId'>) => {
  const productId = `PRD${Date.now()}`;
  const product = {
    PK: `USER#${data.userId}`,
    SK: `PRODUCT#${productId}`,
    Type: "Product",
    productId,
    ...data
  };
  
  await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).PutCommand({
      TableName: TABLE_NAME,
      Item: product
    })
  );
  
  return product;
};

// Get all products for a user
export const findProductsByUserId = async (userId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":sk": "PRODUCT#"
      }
    })
  );
  return result.Items || [];
};

// Get product by ID
export const findProductById = async (userId: string, productId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`
      }
    })
  );
  return result.Item;
};

// Update product
export const updateProduct = async (userId: string, productId: string, updates: Partial<Product>) => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: any = {};
  const expressionAttributeValues: any = {};
  
  Object.keys(updates).forEach((key, index) => {
    if (key !== 'userId' && key !== 'productId') {
      updateExpressions.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = (updates as any)[key];
    }
  });
  
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    })
  );
  
  return result.Attributes;
};

// Delete product
export const deleteProduct = async (userId: string, productId: string) => {
  await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${userId}`,
        SK: `PRODUCT#${productId}`
      }
    })
  );
};
