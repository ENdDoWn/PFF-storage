import * as warehouseModel from "../models/warehouse.model";

export const getAllWarehouses = async ({ query }: any) => {
  try {
    const warehouses = await warehouseModel.findAll();
    
    // Fetch room counts for each warehouse
    let warehousesWithRooms = await Promise.all(
      warehouses.map(async (warehouse) => {
        const rooms = await warehouseModel.getRoomsByWarehouseId(warehouse.warehouseId);
        const availableRooms = rooms.filter(room => room.status === 'AVAILABLE').length;
        const totalRooms = rooms.length;
        
        return {
          ...warehouse,
          id: warehouse.warehouseId, // Add id for frontend compatibility
          availableRooms,
          totalRooms
        } as any; // Type assertion to avoid TypeScript issues with spread
      })
    );

    // Apply filters
    if (query) {
      // Filter by size
      if (query.size && query.size !== 'all') {
        warehousesWithRooms = warehousesWithRooms.filter((w: any) => {
          const sizeNum = parseInt(w.size) || 0;
          if (query.size === 'small') return sizeNum < 200;
          if (query.size === 'medium') return sizeNum >= 200 && sizeNum <= 500;
          if (query.size === 'big') return sizeNum > 500;
          return true;
        });
      }

      // Filter by location
      if (query.location && query.location !== 'all') {
        warehousesWithRooms = warehousesWithRooms.filter((w: any) => {
          const location = w.location?.toLowerCase() || '';
          const queryLocation = query.location.toLowerCase();
          // Map Thai names to English
          const locationMap: Record<string, string[]> = {
            'bangkok': ['กรุงเทพ', 'bangkok'],
            'nonthaburi': ['นนทบุรี', 'nonthaburi'],
            'nakhonpathom': ['นครปฐม', 'nakhonpathom'],
            'chachoengsao': ['ฉะเชิงเทรา', 'chachoengsao'],
            'rayong': ['ระยอง', 'rayong'],
            'khonkaen': ['ขอนแก่น', 'khonkaen'],
            'nakhonratchasima': ['นครราชสีมา', 'nakhonratchasima'],
            'chiangmai': ['เชียงใหม่', 'chiangmai'],
            'lamphun': ['ลำพูน', 'lamphun'],
            'songkhla': ['สงขลา', 'songkhla'],
            'suratthani': ['สุราษฎร์ธานี', 'suratthani'],
            'chumphon': ['ชุมพร', 'chumphon']
          };
          
          const matchTerms = locationMap[queryLocation] || [queryLocation];
          return matchTerms.some(term => location.includes(term.toLowerCase()));
        });
      }

      // Filter by price range
      if (query.priceRange && query.priceRange !== 'all') {
        warehousesWithRooms = warehousesWithRooms.filter((w: any) => {
          const price = w.price || 0;
          if (query.priceRange === 'under10000') return price < 10000;
          if (query.priceRange === '10000-30000') return price >= 10000 && price <= 30000;
          if (query.priceRange === '30000-60000') return price >= 30000 && price <= 60000;
          if (query.priceRange === '60000-100000') return price >= 60000 && price <= 100000;
          if (query.priceRange === 'over100000') return price > 100000;
          return true;
        });
      }
    }
    
    return { 
      success: true,
      warehouses: warehousesWithRooms,
      count: warehousesWithRooms.length
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

export const getWarehouseById = async ({ params }: any) => {
  try {
    const warehouse = await warehouseModel.findById(params.id);
    if (!warehouse) {
      return { 
        error: "Warehouse not found",
        status: 404 
      };
    }
    return warehouse;
  } catch (error: any) {
    console.error("Error fetching warehouse:", error);
    return { 
      error: "Failed to fetch warehouse",
      details: error.message,
      status: 500 
    };
  }
};

export const createWarehouse = async ({ body }: any) => {
  try {
    const warehouse = await warehouseModel.create(body);
    return { 
      success: true,
      warehouse,
      message: "Warehouse created successfully"
    };
  } catch (error: any) {
    console.error("Error creating warehouse:", error);
    return { 
      error: "Failed to create warehouse",
      details: error.message,
      status: 500 
    };
  }
};

export const getWarehouseStats = async () => {
  try {
    const stats = await warehouseModel.getStats();
    return { 
      success: true,
      stats
    };
  } catch (error: any) {
    console.error("Error fetching warehouse stats:", error);
    return { 
      error: "Failed to fetch warehouse stats",
      details: error.message,
      status: 500 
    };
  }
};

export const getWarehouseRooms = async ({ params }: any) => {
  try {
    const rooms = await warehouseModel.getRoomsByWarehouseId(params.id);
    return { 
      success: true,
      rooms,
      count: rooms.length
    };
  } catch (error: any) {
    console.error("Error fetching warehouse rooms:", error);
    return { 
      error: "Failed to fetch rooms",
      details: error.message,
      status: 500 
    };
  }
};

export const createRoom = async ({ params, body }: any) => {
  try {
    const room = await warehouseModel.createRoom(params.id, body);
    return { 
      success: true,
      room,
      message: "Room created successfully"
    };
  } catch (error: any) {
    console.error("Error creating room:", error);
    return { 
      error: "Failed to create room",
      details: error.message,
      status: 500 
    };
  }
};

export const updateWarehouse = async ({ params, body }: any) => {
  try {
    const warehouse = await warehouseModel.update(params.id, body);
    return { 
      success: true,
      warehouse,
      message: "Warehouse updated successfully"
    };
  } catch (error: any) {
    console.error("Error updating warehouse:", error);
    return { 
      error: "Failed to update warehouse",
      details: error.message,
      status: 500 
    };
  }
};

export const deleteWarehouse = async ({ params }: any) => {
  try {
    const result = await warehouseModel.deleteWarehouse(params.id);
    return { 
      success: true,
      message: "Warehouse deleted successfully"
    };
  } catch (error: any) {
    console.error("Error deleting warehouse:", error);
    return { 
      error: "Failed to delete warehouse",
      details: error.message,
      status: 500 
    };
  }
};
