import { docClient, TABLE_NAME } from "../config/database";

export const findAll = async () => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "begins_with(PK, :user)",
      ExpressionAttributeValues: {
        ":user": "USER#"
      }
    })
  );
  return result.Items || [];
};

export const findById = async (id: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `USER#${id}`,
        SK: `USER#${id}`
      }
    })
  );
  return result.Item;
};

export const create = async (data: any) => {
  const { id, name, email } = data;
  const userId = id || Date.now().toString();
  const user = {
    PK: `USER#${userId}`,
    SK: `USER#${userId}`,
    id: userId,
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).PutCommand({
      TableName: TABLE_NAME,
      Item: user
    })
  );
  
  return user;
};
