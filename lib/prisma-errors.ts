/**
 * Maneja errores de Prisma y los convierte en respuestas HTTP amigables
 * Mapea códigos de error de Prisma a status HTTP y mensajes descriptivos
 */
export function handlePrismaError(error: any): { status: number; message: string } {
  // Si no es un error de Prisma, retornar error genérico
  if (!error.code || !error.code.startsWith("P")) {
    console.error("Error no manejado:", error);
    return {
      status: 500,
      message: "Error interno del servidor",
    };
  }

  // Mapear códigos de error de Prisma a respuestas HTTP
  switch (error.code) {
    case "P2002": {
      // Unique constraint violation
      const target = error.meta?.target;
      let message = "El registro ya existe";

      if (target) {
        if (target.includes("walletAddress")) {
          message = "Este wallet ya está registrado";
        } else if (target.includes("fromWallet") && target.includes("adId")) {
          message = "Ya has calificado este anuncio";
        }
      }

      return {
        status: 409,
        message,
      };
    }

    case "P2025": {
      // Record not found
      return {
        status: 404,
        message: "Registro no encontrado",
      };
    }

    case "P2003": {
      // Foreign key constraint violation
      return {
        status: 400,
        message: "Referencia inválida: el registro relacionado no existe",
      };
    }

    case "P2021": {
      // Table does not exist
      return {
        status: 500,
        message: "Error de configuración de base de datos: tabla no existe",
      };
    }

    case "P2024": {
      // Timed out fetching from database
      return {
        status: 504,
        message: "Timeout de base de datos: la operación tardó demasiado",
      };
    }

    case "P1001": {
      // Can't reach database server
      return {
        status: 503,
        message: "No se puede conectar a la base de datos",
      };
    }

    case "P1008": {
      // Operations timed out
      return {
        status: 504,
        message: "Operación de base de datos expiró",
      };
    }

    default: {
      console.error("Error de Prisma no manejado:", error.code, error.message);
      return {
        status: 500,
        message: "Error de base de datos",
      };
    }
  }
}
