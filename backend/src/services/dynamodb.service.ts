// DynamoDB Service Layer
import { 
  docClient, 
  TABLE_NAME, 
  QueryCommand, 
  PutCommand,
  TransactWriteCommand 
} from "../config/database";
import { 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand 
} from "@aws-sdk/lib-dynamodb";

export class DynamoDBService {
  
  /**
   * Get item by partition key and sort key
   */
  async getItem(pk: string, sk: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk }
    });
    
    const response = await docClient.send(command);
    return response.Item;
  }

  /**
   * Query items by partition key
   */
  async queryByPK(pk: string, limit?: number) {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": pk
      },
      Limit: limit
    });
    
    const response = await docClient.send(command);
    return response.Items;
  }

  /**
   * Put item into table
   */
  async putItem(item: Record<string, any>) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });
    
    const response = await docClient.send(command);
    return response;
  }

  /**
   * Update item
   */
  async updateItem(
    pk: string, 
    sk: string, 
    updates: Record<string, any>
  ) {
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updates).forEach((key, index) => {
      const placeholder = `#attr${index}`;
      const valuePlaceholder = `:val${index}`;
      updateExpressionParts.push(`${placeholder} = ${valuePlaceholder}`);
      expressionAttributeNames[placeholder] = key;
      expressionAttributeValues[valuePlaceholder] = updates[key];
    });

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    });

    const response = await docClient.send(command);
    return response.Attributes;
  }

  /**
   * Delete item
   */
  async deleteItem(pk: string, sk: string) {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk }
    });
    
    const response = await docClient.send(command);
    return response;
  }

  /**
   * Scan table (use sparingly)
   */
  async scanTable(limit?: number) {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: limit
    });
    
    const response = await docClient.send(command);
    return response.Items;
  }

  /**
   * Transaction write (multiple operations atomically)
   */
  async transactWrite(items: Array<{ Put?: any; Delete?: any; Update?: any }>) {
    const transactItems = items.map(item => {
      if (item.Put) {
        return { Put: { TableName: TABLE_NAME, Item: item.Put } };
      }
      if (item.Delete) {
        return { Delete: { TableName: TABLE_NAME, Key: item.Delete } };
      }
      if (item.Update) {
        return { Update: { TableName: TABLE_NAME, ...item.Update } };
      }
      return item;
    });

    const command = new TransactWriteCommand({
      TransactItems: transactItems
    });
    
    const response = await docClient.send(command);
    return response;
  }
}

export const dynamoDBService = new DynamoDBService();
