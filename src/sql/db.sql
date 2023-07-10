SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE `cancelled` (
  `person_id` int(11) UNSIGNED NOT NULL COMMENT 'Campo que guarda el id de la persona que se va a cancelar la cita.',
  `date` char(19) NOT NULL DEFAULT current_timestamp() COMMENT 'Campo que guarda la fecha y hora en la que se cancela la cita.',
  `cancelled_asunt` varchar(150) NOT NULL COMMENT 'Campo que guarda el asunto por el cual se cancela la cita.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena las citas canceladas.';

CREATE TABLE `categories` (
  `id` tinyint(1) UNSIGNED NOT NULL COMMENT 'Campo que guarda el id del tipo de persona (autoincremental).',
  `category` varchar(15) NOT NULL COMMENT 'Campo que guarda el nombre del tipo de persona, clasificado por categoria.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los diferentes tipos de persona clasificada por categoria, usada para los agendamientos.';

INSERT INTO `categories` (`id`, `category`) VALUES
(1, 'Docente'),
(2, 'Estudiante'),
(3, 'Coordinador'),
(4, 'Decano'),
(5, 'Otro (externo)');

CREATE TABLE `deans` (
  `_id` char(11) NOT NULL COMMENT 'Campo que guarda el numero de cedula del de decano del ITFIP, (unique).',
  `dean` varchar(50) NOT NULL COMMENT 'Campo que guarda el nombre de decano del ITFIP.',
  `facultie_id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id de facultad a la que pertenece el decano del ITFIP.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los datos de decanos del ITFIP, que seran utilizados para el agendamiento de personas mas rapidamente, haciendo un autocompletado.';

CREATE TABLE `documents` (
  `id` tinyint(1) UNSIGNED NOT NULL COMMENT 'Campo que guarda el id del tipo de documento, (autoincremental).',
  `document` varchar(3) NOT NULL COMMENT 'Campo que guarda una abreviacion corta del tipo de documento.',
  `description` varchar(40) NOT NULL COMMENT 'Campo que guarda el nombre detallado del tipo de documento.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los tipos de documentos, que seran utilizados para el agendamiento de personas.';

INSERT INTO `documents` (`id`, `document`, `description`) VALUES
(1, 'CC', 'Cédula Ciudadanía CC'),
(2, 'TI', 'Tarjeta Identidad TI'),
(3, 'CE', 'Cédula Extranjería CE'),
(4, 'PA', 'Pasaporte PA'),
(5, 'NIT', 'Número de identificación tributaria NIT');

CREATE TABLE `faculties` (
  `id` tinyint(1) UNSIGNED NOT NULL COMMENT 'Campo que guarda el id de la facultad, (autoincremental).',
  `facultie` varchar(60) NOT NULL COMMENT 'Campo que guarda el nombre de la facultad.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena las facultades actuales de los programas academicos del ITFIP.';

INSERT INTO `faculties` (`id`, `facultie`) VALUES
(1, 'Facultad de Economía, Administración y Contaduría Pública'),
(2, 'Facultad de Ingeniería y Ciencias Agroindustriales'),
(3, 'Facultad de Ciencias Sociales, Salud y Educación'),
(4, 'No aplica');

CREATE TABLE `people` (
  `id` int(11) UNSIGNED NOT NULL COMMENT 'Campo que guarda el id de las personas agendadas (autoincremental).',
  `name` varchar(50) NOT NULL COMMENT 'Campo que guarda el nombre completo de las personas agendadas.',
  `document_id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id del tipo de documento referenciado de la tabla document.',
  `document_number` char(11) NOT NULL COMMENT 'Campo que guarda el numero de documento de las personas agendadas.',
  `telephone` char(10) DEFAULT NULL COMMENT 'Campo que guarda el numero de telefono de contacto.',
  `email` varchar(30) DEFAULT NULL COMMENT 'Campo que guarda el correo electronico de contacto.',
  `category_id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id del tipo de persona referenciado de la tabla person_type.',
  `facultie_id` tinyint(1) NOT NULL DEFAULT 4 COMMENT 'Campo que guarda el id de la facultad a la que pertenece referenciado de la tabla faculties.',
  `come_asunt` varchar(150) NOT NULL COMMENT 'Campo que guarda el asunto, motivo o razon de la visita a la rectoria, para su posterior agendamiento.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena todos los datos personales de las personas que han sido agendadas.';

CREATE TABLE `roles` (
  `_id` enum('admin','rector','secretaria') NOT NULL COMMENT 'Campo que guarda el rol que tiene el usaurio, existen 3: admin, rector, secretaria.',
  `permissions` set('admin','add','schedule','reports','statistics') NOT NULL COMMENT 'Campo que guarda los permisos que tiene el usaurio'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los roles de la aplicación.';

INSERT INTO `roles` (`_id`, `permissions`) VALUES
('admin', 'admin,add,schedule,reports,statistics'),
('rector', 'schedule'),
('secretaria', 'add,schedule,reports,statistics');

CREATE TABLE `scheduling` (
  `person_id` int(11) UNSIGNED NOT NULL COMMENT 'Campo que almacena el id de la persona agendada, llave foranea del campo id de la tabla registered people.',
  `date_filter` char(19) NOT NULL DEFAULT current_timestamp() COMMENT 'Campo que guarda la fecha del agendamiento, utilizada para hacer busquedas en rango en  la base de datos.',
  `start_date` char(19) NOT NULL DEFAULT current_timestamp() COMMENT 'Campo que guarda la fecha y hora (datetime), de inicio de la visita a la rectoria, de la persona agendada.',
  `end_date` char(19) NOT NULL DEFAULT current_timestamp() COMMENT 'Campo que guarda la fecha y hora (datetime), de finalizacion de la visita a la rectoria, de la persona agendada.',
  `modification` char(19) NOT NULL DEFAULT current_timestamp() COMMENT 'Campo que guarda la ultima hora de modificacion (time), del registro en la base de datos.',
  `status` enum('scheduled','daily','cancelled') NOT NULL COMMENT 'Campo que guarda el tipo de agendamiento realizado, puede ser de dos tipos,agendamiento programado o agendamiento al dia.',
  `color` char(7) NOT NULL DEFAULT '#388cdc' COMMENT 'Campo que guarda un valor de texto correspondiente al color que tendra el registro al ser agendado.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena todos los agendamientos en fecha del aplicativo.';

CREATE TABLE `users` (
  `id` tinyint(1) UNSIGNED NOT NULL COMMENT 'Campo que guarda el id de los usuarios del aplicativo, con acceso permitido (unique).',
  `name` varchar(25) NOT NULL COMMENT 'Campo que guarda el nombre de los usuarios del aplicativo, con acceso permitido.',
  `lastname` varchar(25) NOT NULL COMMENT 'Campo que guarda el apellido de los usuarios del aplicativo, con acceso permitido.',
  `document_id` tinyint(1) NOT NULL COMMENT 'Campo que almacena el id del tipo de documento, de la tabla document.',
  `document_number` char(11) NOT NULL COMMENT 'Campo que guarda el numero de documento.',
  `tel` char(10) NOT NULL COMMENT 'Campo que guarda el numero de telefono de contacto.',
  `email` varchar(30) NOT NULL COMMENT 'Campo que guarda el correo electronico institucional o usuario de acceso al aplicativo.',
  `password` char(60) NOT NULL COMMENT 'Campo que guarda el password de acceso al aplicativo (encriptado).',
  `role` enum('admin','rector','secretaria') NOT NULL COMMENT 'Campo que guarda el rol que tiene el usaurio, existen 3: admin, rector, secretaria.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena los usuarios del aplicativo, y sus respectivos usuarios y password de acceso al aplicativo.';

INSERT INTO `users` (`id`, `name`, `lastname`, `document_id`, `document_number`, `tel`, `email`, `password`, `role`) VALUES
(3, 'Ricardo Andrés', 'Rojas Rico', 1, '1111122448', '3173926578', 'rrojas48@itfip.edu.co', '$2a$10$cKjmKaDB8C.nT1wxJdAeBuhvvgUQXoypmDQKW7JWTzUAoNCT5TQPW', 'admin');


ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `deans`
  ADD PRIMARY KEY (`_id`);

ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `faculties`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `people`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `categories`
  MODIFY `id` tinyint(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id del tipo de persona (autoincremental).', AUTO_INCREMENT=6;

ALTER TABLE `documents`
  MODIFY `id` tinyint(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id del tipo de documento, (autoincremental).', AUTO_INCREMENT=6;

ALTER TABLE `faculties`
  MODIFY `id` tinyint(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id de la facultad, (autoincremental).', AUTO_INCREMENT=5;

ALTER TABLE `people`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id de las personas agendadas (autoincremental).';

ALTER TABLE `users`
  MODIFY `id` tinyint(1) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id de los usuarios del aplicativo, con acceso permitido (unique).', AUTO_INCREMENT=4;
