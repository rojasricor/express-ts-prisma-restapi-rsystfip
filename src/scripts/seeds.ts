import { prisma } from "../db.prisma";
import * as CategoryService from "../services/Category.service";
import * as DocumentService from "../services/Document.service";
import * as RoleService from "../services/Role.service";
import * as UserService from "../services/User.service";
import * as FacultyService from "../services/Faculty.service";
import * as StateScheduleService from "../services/StateSchedule.service";

async function seedData() {
    await DocumentService.createManyDocuments(
        {
            document: "CC",
            description: "Cédula Ciudadanía",
        },
        {
            document: "TI",
            description: "Tarjeta de Identidad",
        },
        {
            document: "CE",
            description: "Cédula Extranjería",
        },
        {
            document: "PA",
            description: "Pasaporte",
        },
        {
            document: "NIT",
            description: "Número de identificación tributaria",
        }
    );
    await RoleService.createManyRoles(
        {
            name: "admin",
            permissions: JSON.stringify([
                "admin",
                "add",
                "schedule",
                "reports",
                "statistics",
            ]),
        },
        {
            name: "rector",
            permissions: JSON.stringify(["schedule"]),
        },
        {
            name: "secretaria",
            permissions: JSON.stringify([
                "add",
                "schedule",
                "reports",
                "statistics",
            ]),
        }
    );
    await CategoryService.createManyCategories(
        { category: "Docente" },
        { category: "Estudiante" },
        { category: "Coordinador" },
        { category: "Decano" },
        { category: "Otro (externo)" }
    );
    await FacultyService.createManyFaculties(
        { facultie: "Economía, Administración y Contaduría Pública" },
        { facultie: "Ingeniería y Ciencias Agroindustriales" },
        { facultie: "Ciencias Sociales, Salud y Educación" },
        { facultie: "No aplica" }
    );
    await StateScheduleService.createManyStateSchedules(
        { state: "scheduled" },
        { state: "daily" },
        { state: "cancelled" }
    );
    await UserService.createUser({
        id: 3,
        name: "Ricardo Andrés",
        lastname: "Rojas Rico",
        document_id: 1,
        document_number: "1111122448",
        tel: "3173926578",
        email: "rrojas48@itfip.edu.co",
        password:
            "$2a$10$cKjmKaDB8C.nT1wxJdAeBuhvvgUQXoypmDQKW7JWTzUAoNCT5TQPW",
        role_id: 1,
    });
}

seedData()
    .then(() => console.log("Seeds executed successfully"))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
        process.exit(0);
    });
