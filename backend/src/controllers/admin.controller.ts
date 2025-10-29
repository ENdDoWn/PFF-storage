import * as rentalModel from '../models/booking.model';
import * as warehouseModel from '../models/warehouse.model';
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { getPresignedUrl } from '../utils/s3Upload';

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    const warehouseStats = await warehouseModel.getStats();

    const allRentals = await rentalModel.findAll();
    const activeRentals = allRentals.filter((r: any) => r.status === 'ACTIVE');
    const pendingRentals = allRentals.filter((r: any) => r.status === 'PENDING');
 
    const uniqueUsers = new Set(allRentals.map((r: any) => r.userId)).size;
 
    let monthlyRevenue = 0;
    for (const rental of activeRentals) {
      const rentalData = rental as any;
      const warehouse = await warehouseModel.findById(rentalData.warehouseId);
      if (warehouse) {
        monthlyRevenue += (warehouse as any).price || 0;
      }
    }
    
    return {
      success: true,
      stats: {
        totalWarehouses: warehouseStats.total,
        availableWarehouses: warehouseStats.available,
        available: warehouseStats.available,
        rented: warehouseStats.rented,
        totalUsers: uniqueUsers,
        activeRentals: activeRentals.length,
        pendingApprovals: pendingRentals.length,
        monthlyRevenue: monthlyRevenue,
        newUsersThisMonth: Math.floor(uniqueUsers * 0.2),
        expiredThisMonth: Math.floor(activeRentals.length * 0.1)
      }
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return {
      error: "Failed to fetch dashboard stats",
      details: error.message,
      status: 500
    };
  }
};

// Get all users with rentals
export const getAllUsers = async () => {
  try {
    const allRentals = await rentalModel.findAll();
    const userMap = new Map<string, any>();

    for (const rental of allRentals) {
      const userId = (rental as any).userId;

      if (!userMap.has(userId)) {
        const warehouse = await warehouseModel.findById((rental as any).warehouseId);
        
        userMap.set(userId, {
          userId: userId,
          email: `${userId}@example.com`,
          company: "บริษัทตัวอย่าง จำกัด",
          warehouseName: warehouse?.name || 'Unknown',
          startDate: (rental as any).startDate,
          endDate: (rental as any).endDate,
          status: (rental as any).status,
          totalRentals: 0
        });
      }
      
      const user = userMap.get(userId);
      user.totalRentals++;
    }
    
    return {
      success: true,
      users: Array.from(userMap.values())
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return {
      error: "Failed to fetch users",
      details: error.message,
      status: 500
    };
  }
};

// Get all pending rentals
export const getPendingRentals = async () => {
  try {
    const pendingRentals = await rentalModel.findPendingRentals();
    
    console.log('📋 Found pending rentals:', pendingRentals.length);

    const enrichedRentals = await Promise.all(
      pendingRentals.map(async (rental: any) => {
        try {
          const warehouse = await warehouseModel.findById(rental.warehouseId);
          const rooms = await warehouseModel.getRoomsByWarehouseId(rental.warehouseId);
          const room = rooms.find((r: any) => r.roomId === rental.roomId);
          
          // Generate presigned URL if payment slip exists
          let paymentSlipUrl = null;
          if (rental.paymentSlip) {
            try {
              // Extract S3 key from URL
              const url = new URL(rental.paymentSlip);
              const key = url.pathname.substring(1); // Remove leading slash
              
              // Generate presigned URL (valid for 1 hour)
              paymentSlipUrl = await getPresignedUrl(key, 3600);
              console.log(`✅ Generated presigned URL for ${rental.rentalId}`);
            } catch (error) {
              console.error(`❌ Error generating presigned URL:`, error);
              paymentSlipUrl = rental.paymentSlip; // Fallback to original URL
            }
          }
          
          console.log(`📄 Rental ${rental.rentalId}:`, {
            hasPaymentSlip: !!rental.paymentSlip,
            paymentSlipUrl: paymentSlipUrl
          });
          
          return {
            ...rental,
            warehouseName: warehouse?.name || 'Unknown',
            roomNumber: room?.roomNumber || 'Unknown',
            roomSize: room?.size || 'Unknown',
            paymentSlip: paymentSlipUrl // Use presigned URL
          };
        } catch (error) {
          return rental;
        }
      })
    );

    return {
      success: true,
      rentals: enrichedRentals
    };
  } catch (error: any) {
    console.error("Error fetching pending rentals:", error);
    return {
      error: "Failed to fetch pending rentals",
      details: error.message,
      status: 500
    };
  }
};

// Approve a rental
export const approveRental = async ({ params, body }: any) => {
  try {
    const { userId, rentalId } = params;
    const { approvedBy } = body;

    if (!userId || !rentalId) {
      return {
        error: "Missing userId or rentalId",
        status: 400
      };
    }

    if (!approvedBy) {
      return {
        error: "approvedBy (admin ID) is required",
        status: 400
      };
    }

    // Get rental details to update room status
    const rental = await rentalModel.findById(userId, rentalId);
    
    if (!rental) {
      return {
        error: "Rental not found",
        status: 404
      };
    }

    if (rental.status !== 'PENDING') {
      return {
        error: `Rental is already ${rental.status}`,
        status: 400
      };
    }

    // Check if room is still available
    const rooms = await warehouseModel.getRoomsByWarehouseId(rental.warehouseId);
    const room = rooms.find((r: any) => r.roomId === rental.roomId);
    
    if (!room) {
      return {
        error: "Room not found",
        status: 404
      };
    }

    if (room.status !== 'AVAILABLE') {
      return {
        error: "Room is no longer available",
        status: 400
      };
    }

    // Approve the rental
    await rentalModel.approveRental(userId, rentalId, approvedBy);

    // Update room status to OCCUPIED
    await warehouseModel.updateRoomStatus(rental.warehouseId, rental.roomId, 'OCCUPIED');

    return {
      success: true,
      message: "Rental approved successfully"
    };
  } catch (error: any) {
    console.error("Error approving rental:", error);
    return {
      error: "Failed to approve rental",
      details: error.message,
      status: 500
    };
  }
};

// Reject a rental
export const rejectRental = async ({ params, body }: any) => {
  try {
    const { userId, rentalId } = params;
    const { rejectedBy } = body;

    if (!userId || !rentalId) {
      return {
        error: "Missing userId or rentalId",
        status: 400
      };
    }

    if (!rejectedBy) {
      return {
        error: "rejectedBy (admin ID) is required",
        status: 400
      };
    }

    // Get rental to verify it exists and is pending
    const rental = await rentalModel.findById(userId, rentalId);
    
    if (!rental) {
      return {
        error: "Rental not found",
        status: 404
      };
    }

    if (rental.status !== 'PENDING') {
      return {
        error: `Rental is already ${rental.status}`,
        status: 400
      };
    }

    // Reject the rental
    await rentalModel.rejectRental(userId, rentalId, rejectedBy);

    return {
      success: true,
      message: "Rental rejected successfully"
    };
  } catch (error: any) {
    console.error("Error rejecting rental:", error);
    return {
      error: "Failed to reject rental",
      details: error.message,
      status: 500
    };
  }
};

// Get all warehouses (admin)
export const getAllWarehouses = async () => {
  try {
    const warehouses = await warehouseModel.findAll();
    
    // Fetch room counts for each warehouse
    const warehousesWithDetails = await Promise.all(
      warehouses.map(async (warehouse: any) => {
        const rooms = await warehouseModel.getRoomsByWarehouseId(warehouse.warehouseId);
        const availableRooms = rooms.filter((room: any) => room.status === 'AVAILABLE').length;
        const occupiedRooms = rooms.filter((room: any) => room.status === 'OCCUPIED').length;
        
        return {
          ...warehouse,
          totalRooms: rooms.length,
          availableRooms,
          occupiedRooms
        };
      })
    );

    return {
      success: true,
      warehouses: warehousesWithDetails
    };
  } catch (error: any) {
    console.error("Error fetching warehouses:", error);
    return {
      error: "Failed to fetch warehouses",
      details: error.message,
      status: 500
    };
  }
};

// Get all users from Cognito User Pool (admin)
export const getAllCognitoUsers = async () => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({ 
      region: process.env.AWS_REGION || "us-east-1" 
    });

    const userPoolId = process.env.USER_POOL_ID;
    
    if (!userPoolId) {
      console.error("USER_POOL_ID environment variable is not set");
      return {
        error: "User pool configuration missing",
        status: 500
      };
    }

    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      Limit: 60 // Get up to 60 users
    });

    const response = await cognitoClient.send(command);
    
    // Get all rentals to enrich user data
    const allRentals = await rentalModel.findAll();
    
    // Process users
    const users = (response.Users || []).map((cognitoUser: any) => {
      const email = cognitoUser.Attributes?.find((attr: any) => attr.Name === 'email')?.Value || '';
      const sub = cognitoUser.Attributes?.find((attr: any) => attr.Name === 'sub')?.Value || '';
      const name = cognitoUser.Attributes?.find((attr: any) => attr.Name === 'name')?.Value || '';
      
      // Find rentals for this user
      const userRentals = allRentals.filter((rental: any) => 
        rental.userId === sub || rental.userId === cognitoUser.Username
      );
      
      const activeRentals = userRentals.filter((r: any) => r.status === 'ACTIVE');
      const pendingRentals = userRentals.filter((r: any) => r.status === 'PENDING');
      
      return {
        userId: sub || cognitoUser.Username,
        username: cognitoUser.Username,
        email,
        name,
        status: cognitoUser.UserStatus,
        enabled: cognitoUser.Enabled,
        createdAt: cognitoUser.UserCreateDate,
        lastModified: cognitoUser.UserLastModifiedDate,
        totalRentals: userRentals.length,
        activeRentals: activeRentals.length,
        pendingRentals: pendingRentals.length
      };
    });

    return {
      success: true,
      users,
      count: users.length
    };
  } catch (error: any) {
    console.error("Error fetching Cognito users:", error);
    return {
      error: "Failed to fetch users from Cognito",
      details: error.message,
      status: 500
    };
  }
};