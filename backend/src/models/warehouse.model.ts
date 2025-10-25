import { docClient, TABLE_NAME } from "../config/database";

export interface Warehouse {
  warehouseId: string;
  name: string;
  price: number;
  size: string;
  location?: string;
  description?: string;
  totalRooms?: number;
  imageUrl?: string;
}

export interface Room {
  warehouseId: string;
  roomId: string;
  roomNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED';
  size: string;
}

// Get all warehouses
export const findAll = async () => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": "WAREHOUSE#LIST"
      }
    })
  );
  return result.Items || [];
};

// Get warehouse by ID
export const findById = async (warehouseId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: "WAREHOUSE#LIST",
        SK: `WAREHOUSE#${warehouseId}`
      }
    })
  );
  return result.Item;
};

// Create a new warehouse
export const create = async (data: Omit<Warehouse, 'warehouseId'>) => {
  const warehouseId = `WH${Date.now()}`;
  const warehouse = {
    PK: "WAREHOUSE#LIST",
    SK: `WAREHOUSE#${warehouseId}`,
    type: "Warehouse",  // GSI1 Partition Key
    GSI1SK: `WAREHOUSE#${warehouseId}`,  // GSI1 Sort Key
    Type: "Warehouse",
    warehouseId,
    ...data
  };
  
  await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).PutCommand({
      TableName: TABLE_NAME,
      Item: warehouse
    })
  );
  
  // Automatically create rooms if totalRooms is specified
  if (data.totalRooms && data.totalRooms > 0) {
    const { PutCommand } = await import("@aws-sdk/lib-dynamodb");
    const roomPromises = [];
    
    for (let i = 1; i <= data.totalRooms; i++) {
      const roomId = `R${Date.now()}_${i}`;
      const room = {
        PK: `WAREHOUSE#${warehouseId}`,
        SK: `ROOM#${roomId}`,
        Type: "Room",
        warehouseId,
        roomId,
        roomNumber: `${i}`,
        status: 'AVAILABLE',
        size: data.size || 'N/A' // Use warehouse size or default
      };
      
      roomPromises.push(
        docClient.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: room
          })
        )
      );
      
      // Add small delay to avoid timestamp collisions
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    
    await Promise.all(roomPromises);
  }
  
  return warehouse;
};

// Get all rooms in a warehouse
export const getRoomsByWarehouseId = async (warehouseId: string) => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `WAREHOUSE#${warehouseId}`,
        ":sk": "ROOM#"
      }
    })
  );
  return result.Items || [];
};

// Create a room in a warehouse
export const createRoom = async (warehouseId: string, data: Omit<Room, 'warehouseId' | 'roomId'>) => {
  const roomId = `R${Date.now()}`;
  const room = {
    PK: `WAREHOUSE#${warehouseId}`,
    SK: `ROOM#${roomId}`,
    Type: "Room",
    warehouseId,
    roomId,
    ...data
  };
  
  await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).PutCommand({
      TableName: TABLE_NAME,
      Item: room
    })
  );
  
  return room;
};

// Update room status
export const updateRoomStatus = async (warehouseId: string, roomId: string, status: 'AVAILABLE' | 'OCCUPIED') => {
  const result = await docClient.send(
    new (await import("@aws-sdk/lib-dynamodb")).UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `WAREHOUSE#${warehouseId}`,
        SK: `ROOM#${roomId}`
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": status
      },
      ReturnValues: "ALL_NEW"
    })
  );
  
  return result.Attributes;
};

// Get available rooms count
export const getAvailableRoomsCount = async (warehouseId: string) => {
  const rooms = await getRoomsByWarehouseId(warehouseId);
  return rooms.filter((room: any) => room.status === 'AVAILABLE').length;
};

// Update a warehouse
export const update = async (warehouseId: string, data: Partial<Warehouse>) => {
  const { UpdateCommand, PutCommand } = await import("@aws-sdk/lib-dynamodb");
  
  // If totalRooms is being updated, we need to adjust the actual rooms
  if (data.totalRooms !== undefined) {
    const currentRooms = await getRoomsByWarehouseId(warehouseId);
    const currentCount = currentRooms.length;
    const newCount = data.totalRooms;
    
    if (newCount > currentCount) {
      // Add new rooms
      const roomsToAdd = newCount - currentCount;
      for (let i = 1; i <= roomsToAdd; i++) {
        const roomNumber = currentCount + i;
        const roomId = `R${Date.now()}_${roomNumber}`;
        const room = {
          PK: `WAREHOUSE#${warehouseId}`,
          SK: `ROOM#${roomId}`,
          Type: "Room",
          warehouseId,
          roomId,
          roomNumber: `${roomNumber}`,
          status: 'AVAILABLE',
          size: data.size || 'N/A'
        };
        
        await docClient.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: room
          })
        );
        
        // Add small delay to avoid timestamp collisions
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    } else if (newCount < currentCount) {
      // Remove excess rooms (only if they're AVAILABLE)
      const { DeleteCommand } = await import("@aws-sdk/lib-dynamodb");
      const roomsToRemove = currentCount - newCount;
      const availableRooms = currentRooms
        .filter((room: any) => room.status === 'AVAILABLE')
        .slice(0, roomsToRemove);
      
      if (availableRooms.length < roomsToRemove) {
        throw new Error(`Cannot reduce room count. Only ${availableRooms.length} available rooms can be removed.`);
      }
      
      for (const room of availableRooms) {
        await docClient.send(
          new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
              PK: `WAREHOUSE#${warehouseId}`,
              SK: `ROOM#${(room as any).roomId}`
            }
          })
        );
      }
    }
  }
  
  // Build update expression
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};
  
  Object.keys(data).forEach((key, index) => {
    if (key !== 'warehouseId' && key !== 'PK' && key !== 'SK') {
      updateExpressions.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = (data as any)[key];
    }
  });
  
  if (updateExpressions.length === 0) {
    throw new Error('No fields to update');
  }
  
  const result = await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: "WAREHOUSE#LIST",
        SK: `WAREHOUSE#${warehouseId}`
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW"
    })
  );
  
  return result.Attributes;
};

// Delete a warehouse
export const deleteWarehouse = async (warehouseId: string) => {
  const { DeleteCommand } = await import("@aws-sdk/lib-dynamodb");
  
  // First, delete all rooms
  const rooms = await getRoomsByWarehouseId(warehouseId);
  for (const room of rooms) {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `WAREHOUSE#${warehouseId}`,
          SK: `ROOM#${room.roomId}`
        }
      })
    );
  }
  
  // Then delete the warehouse
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: "WAREHOUSE#LIST",
        SK: `WAREHOUSE#${warehouseId}`
      }
    })
  );
  
  return { success: true, message: 'Warehouse deleted successfully' };
};

// Get stats
export const getStats = async () => {
  const warehouses = await findAll();
  const total = warehouses.length;
  
  let availableCount = 0;
  let occupiedCount = 0;
  
  for (const warehouse of warehouses) {
    const rooms = await getRoomsByWarehouseId((warehouse as any).warehouseId);
    availableCount += rooms.filter((room: any) => room.status === 'AVAILABLE').length;
    occupiedCount += rooms.filter((room: any) => room.status === 'OCCUPIED').length;
  }
  
  return { 
    total, 
    available: availableCount, 
    rented: occupiedCount 
  };
};
