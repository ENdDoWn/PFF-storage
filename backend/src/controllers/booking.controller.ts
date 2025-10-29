import * as rentalModel from "../models/booking.model";
import * as warehouseModel from "../models/warehouse.model";

// ============= RENTAL CONTROLLERS =============

export const createRental = async ({ body }: any) => {
  try {
    const { userId, roomId, warehouseId, startDate, endDate } = body;

    // Validate required fields
    if (!userId || !roomId || !warehouseId || !startDate || !endDate) {
      return { 
        error: "Missing required fields",
        status: 400 
      };
    }

    // Check if room exists and is available
    const rooms = await warehouseModel.getRoomsByWarehouseId(warehouseId);
    const room = rooms.find((r: any) => r.roomId === roomId);
    
    if (!room) {
      return { 
        error: "Room not found",
        status: 404 
      };
    }

    if (room.status !== 'AVAILABLE') {
      return { 
        error: "Room is not available",
        status: 400 
      };
    }

    // Create rental with PENDING status (waiting for admin approval)
    const rental = await rentalModel.create({
      userId,
      roomId,
      warehouseId,
      startDate,
      endDate,
      status: 'PENDING',  // Changed from 'ACTIVE' to 'PENDING'
      createdAt: new Date().toISOString()
    });

    return { 
      success: true,
      rental,
      message: "Rental request submitted successfully. Waiting for admin approval."
    };
  } catch (error: any) {
    console.error("Error creating rental:", error);
    return { 
      error: "Failed to create rental",
      details: error.message,
      status: 500 
    };
  }
};

export const getUserRentals = async ({ params }: any) => {
  try {
    const rentals = await rentalModel.findByUserId(params.userId);
    return { 
      success: true,
      rentals,
      count: rentals.length
    };
  } catch (error: any) {
    console.error("Error fetching user rentals:", error);
    return { 
      error: "Failed to fetch rentals",
      details: error.message,
      status: 500 
    };
  }
};

export const getActiveRentals = async ({ params }: any) => {
  try {
    const rentals = await rentalModel.findActiveRentals(params.userId);
    return { 
      success: true,
      rentals,
      count: rentals.length
    };
  } catch (error: any) {
    console.error("Error fetching active rentals:", error);
    return { 
      error: "Failed to fetch rentals",
      details: error.message,
      status: 500 
    };
  }
};

export const updateRentalStatus = async ({ params, body }: any) => {
  try {
    const { status } = body;
    const { userId, rentalId } = params;
    
    if (!['ACTIVE', 'EXPIRED', 'CANCELLED'].includes(status)) {
      return { 
        error: "Invalid status value",
        status: 400 
      };
    }

    // Get rental to find room info
    const rental = await rentalModel.findById(userId, rentalId);
    if (!rental) {
      return { 
        error: "Rental not found",
        status: 404 
      };
    }

    // If cancelling or expiring, make room available again
    if ((status === 'CANCELLED' || status === 'EXPIRED') && rental.status === 'ACTIVE') {
      await warehouseModel.updateRoomStatus(
        rental.warehouseId,
        rental.roomId,
        'AVAILABLE'
      );
    }

    const updatedRental = await rentalModel.updateStatus(userId, rentalId, status);
    
    return { 
      success: true,
      rental: updatedRental,
      message: `Rental ${status.toLowerCase()} successfully`
    };
  } catch (error: any) {
    console.error("Error updating rental status:", error);
    return { 
      error: "Failed to update rental",
      details: error.message,
      status: 500 
    };
  }
};

// Update rental payment slip
export const updateRentalPaymentSlip = async ({ params, body }: any) => {
  try {
    const { rentalId } = params;
    const { paymentSlip } = body;

    if (!paymentSlip) {
      return {
        error: "Payment slip URL is required",
        status: 400
      };
    }

    console.log(`Updating rental ${rentalId} with payment slip:`, paymentSlip);

    const updatedRental = await rentalModel.updatePaymentSlip(rentalId, paymentSlip);

    return {
      success: true,
      rental: updatedRental,
      message: "Payment slip updated successfully"
    };
  } catch (error: any) {
    console.error("Error updating payment slip:", error);
    return {
      error: "Failed to update payment slip",
      details: error.message,
      status: 500
    };
  }
};

export const getAllRentals = async () => {
  try {
    const rentals = await rentalModel.findAll();
    return { 
      success: true,
      rentals,
      count: rentals.length
    };
  } catch (error: any) {
    console.error("Error fetching all rentals:", error);
    return { 
      error: "Failed to fetch rentals",
      details: error.message,
      status: 500 
    };
  }
};

// ============= PRODUCT CONTROLLERS =============

export const createProduct = async ({ body }: any) => {
  try {
    const { userId, name, importDate, expiryDate, quantity, status, roomId } = body;

    if (!userId || !name || !importDate || !quantity || !roomId) {
      return { 
        error: "Missing required fields",
        status: 400 
      };
    }

    const product = await rentalModel.createProduct({
      userId,
      name,
      importDate,
      expiryDate: expiryDate || "",
      quantity,
      status: status || "in-stock",
      roomId
    });

    return { 
      success: true,
      product,
      message: "Product created successfully"
    };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { 
      error: "Failed to create product",
      details: error.message,
      status: 500 
    };
  }
};

export const getUserProducts = async ({ params }: any) => {
  try {
    const products = await rentalModel.findProductsByUserId(params.userId);
    return { 
      success: true,
      products,
      count: products.length
    };
  } catch (error: any) {
    console.error("Error fetching user products:", error);
    return { 
      error: "Failed to fetch products",
      details: error.message,
      status: 500 
    };
  }
};

export const updateProduct = async ({ params, body }: any) => {
  try {
    const { userId, productId } = params;
    
    const updatedProduct = await rentalModel.updateProduct(userId, productId, body);
    
    return { 
      success: true,
      product: updatedProduct,
      message: "Product updated successfully"
    };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { 
      error: "Failed to update product",
      details: error.message,
      status: 500 
    };
  }
};

export const deleteProduct = async ({ params }: any) => {
  try {
    const { userId, productId } = params;
    
    await rentalModel.deleteProduct(userId, productId);
    
    return { 
      success: true,
      message: "Product deleted successfully"
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { 
      error: "Failed to delete product",
      details: error.message,
      status: 500 
    };
  }
};
