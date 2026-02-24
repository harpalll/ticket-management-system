import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const apisPath = path.resolve(process.cwd(), "src/modules/**/*.routes.ts");

console.log("Swagger scanning:", apisPath);

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Support Ticket Management API",
      version: "1.0.0",
      description:
        "Support Ticket Management built by harpalsinh sindhav (https://github.com/harpalll)",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Role: {
          type: "string",
          enum: ["MANAGER", "SUPPORT", "USER"],
        },
        TicketStatus: {
          type: "string",
          enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
        },
        TicketPriority: {
          type: "string",
          enum: ["LOW", "MEDIUM", "HIGH"],
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            role: { $ref: "#/components/schemas/Role" },
          },
        },
        Ticket: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string", minLength: 5 },
            description: { type: "string", minLength: 10 },
            status: { $ref: "#/components/schemas/TicketStatus" },
            priority: { $ref: "#/components/schemas/TicketPriority" },
            created_by: { type: "integer" },
            assigned_to: { type: "integer", nullable: true },
          },
        },
        Comment: {
          type: "object",
          properties: {
            id: { type: "integer" },
            ticket_id: { type: "integer" },
            user_id: { type: "integer" },
            comment: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // apis: [path.join(process.cwd(), "src/routes/**/*.ts")],
  apis: [apisPath],
});
