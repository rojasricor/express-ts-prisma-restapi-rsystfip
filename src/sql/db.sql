SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `cancelled` (
  `person_id` int(11) NOT NULL COMMENT 'Campo que guarda el id de la persona que se va a cancelar la cita.',
  `date` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Campo que guarda la fecha y hora en la que se cancela la cita.',
  `cancelled_asunt` varchar(150) NOT NULL COMMENT 'Campo que guarda el asunto por el cual se cancela la cita.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Tabla que almacena las citas canceladas.';

INSERT INTO `cancelled` (`person_id`, `date`, `cancelled_asunt`) VALUES
(4, '2023-05-23 20:28:37', 'Le dice la maestra a Jaimito: Jaimito, ¿cómo se dice en inglés \"el gato se cayó al agua y se ahogó?\"'),
(5, '2023-05-23 20:42:32', 'El rector no va asistir el dia de hoy a la institución.'),
(2, '2023-05-23 20:48:19', 'Manuel es bot'),
(6, '2023-05-23 20:49:16', 'El rector no va venir'),
(7, '2023-05-23 20:53:25', 'No viene el rector porque se le presentó un inconveniento inesperado'),
(8, '2023-05-23 21:03:45', 'Pues cagamos en el ITFIP'),
(9, '2023-05-23 21:08:08', 'Vamos a echar pvp, NO.'),
(10, '2023-05-23 21:09:16', 'Me voy a dormir'),
(11, '2023-05-23 21:12:34', 'ajaj3333333333333'),
(18, '2023-06-11 08:40:59', 'adsadasad'),
(18, '2023-06-11 08:41:00', 'adsadasad'),
(18, '2023-06-11 08:41:00', 'adsadasad'),
(15, '2023-06-11 08:41:06', 'ssssssssssssssss'),
(13, '2023-06-11 08:42:05', 'sssssssssssssss'),
(14, '2023-06-11 08:44:46', 'Hola mundo ratas jsjjsj'),
(14, '2023-06-11 08:45:09', 'Hola mundo ratas jsjjsj'),
(14, '2023-06-11 08:46:09', 'Hola mundo ratas jsjjsj'),
(14, '2023-06-11 08:46:10', 'Hola mundo ratas jsjjsj');

CREATE TABLE `categories` (
  `id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id del tipo de persona (autoincremental).',
  `category` varchar(15) NOT NULL COMMENT 'Campo que guarda el nombre del tipo de persona, clasificado por categoria.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena los diferentes tipos de persona clasificada por categoria, usada para los agendamientos.';

INSERT INTO `categories` (`id`, `category`) VALUES
(1, 'Docente'),
(2, 'Estudiante'),
(3, 'Coordinador'),
(4, 'Decano'),
(5, 'Otro (externo)');

CREATE TABLE `deans` (
  `_id` varchar(12) NOT NULL COMMENT 'Campo que guarda el numero de cedula del de decano del ITFIP, (unique).',
  `dean` varchar(50) NOT NULL COMMENT 'Campo que guarda el nombre de decano del ITFIP.',
  `facultie_id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id de facultad a la que pertenece el decano del ITFIP.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena los datos de decanos del ITFIP, que seran utilizados para el agendamiento de personas mas rapidamente, haciendo un autocompletado.';

INSERT INTO `deans` (`_id`, `dean`, `facultie_id`) VALUES
('1111122448', 'Holman Reyes Puentes', 2),
('1111122449', 'Cesar Julio Bravo Saavedra', 1),
('1111122450', 'Luz Mery Vega Bustamante', 3),
('65701167', 'Ignacia Ramirez', 1);

CREATE TABLE `documents` (
  `id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id del tipo de documento, (autoincremental).',
  `document` varchar(3) NOT NULL COMMENT 'Campo que guarda una abreviacion corta del tipo de documento.',
  `description` varchar(40) NOT NULL COMMENT 'Campo que guarda el nombre detallado del tipo de documento.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena los tipos de documentos, que seran utilizados para el agendamiento de personas.';

INSERT INTO `documents` (`id`, `document`, `description`) VALUES
(1, 'CC', 'Cédula Ciudadanía CC'),
(2, 'TI', 'Tarjeta Identidad TI'),
(3, 'CE', 'Cédula Extranjería CE'),
(4, 'PA', 'Pasaporte PA'),
(5, 'NIT', 'Número de identificación tributaria NIT');

CREATE TABLE `faculties` (
  `id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id de la facultad, (autoincremental).',
  `facultie` varchar(60) NOT NULL COMMENT 'Campo que guarda el nombre de la facultad.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena las facultades actuales de los programas academicos del ITFIP.';

INSERT INTO `faculties` (`id`, `facultie`) VALUES
(1, 'Facultad de Economía, Administración y Contaduría Pública'),
(2, 'Facultad de Ingeniería y Ciencias Agroindustriales'),
(3, 'Facultad de Ciencias Sociales, Salud y Educación'),
(4, 'No aplica');

CREATE TABLE `people` (
  `id` int(11) NOT NULL COMMENT 'Campo que guarda el id de las personas agendadas (autoincremental).',
  `name` varchar(50) NOT NULL COMMENT 'Campo que guarda el nombre completo de las personas agendadas.',
  `document_id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id del tipo de documento referenciado de la tabla document.',
  `document_number` char(11) NOT NULL COMMENT 'Campo que guarda el numero de documento de las personas agendadas.',
  `telephone` char(10) DEFAULT NULL COMMENT 'Campo que guarda el numero de telefono de contacto.',
  `email` varchar(30) DEFAULT NULL COMMENT 'Campo que guarda el correo electronico de contacto.',
  `category_id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id del tipo de persona referenciado de la tabla person_type.',
  `facultie_id` tinyint(1) NOT NULL DEFAULT 4 COMMENT 'Campo que guarda el id de la facultad a la que pertenece referenciado de la tabla faculties.',
  `come_asunt` varchar(150) NOT NULL COMMENT 'Campo que guarda el asunto, motivo o razon de la visita a la rectoria, para su posterior agendamiento.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena todos los datos personales de las personas que han sido agendadas.';

INSERT INTO `people` (`id`, `name`, `document_id`, `document_number`, `telephone`, `email`, `category_id`, `facultie_id`, `come_asunt`) VALUES
(1, 'Ricardo Andrés Rojas Ricardito', 1, '1111122448', NULL, NULL, 2, 2, 'Programar sistema de agendamientos visita rectoría itfip'),
(2, 'José Manuel Mendoza Vásquez', 1, '1005773423', '3186329851', 'jmendoza23@itfip.edu.co', 2, 2, 'Programar sistema de agendamiento visitas rectoría itfip'),
(3, 'Quis Rem Non Et Voluptatum Consequa', 1, '27747644', NULL, NULL, 5, 4, 'Est consequuntur labore sed voluptatum aut magnam odio beatae et ducimus quaerat at similique exer'),
(4, 'Ricardo Andrés Rojas Rico', 1, '1111122448', '3173926578', 'rojasricor@gmail.com', 1, 2, 'Saludos'),
(5, 'Ricardo Andrés Rojas Rico', 1, '1111122448', '3173926575', 'rrojas48@itfip.edu.co', 2, 1, 'Hola'),
(6, 'Ricardo Andres Rojas Rico', 1, '65701167', '3173926578', 'rrojas48@itfip.edu.co', 2, 3, 'Voluptatem mollitia lorem dolore ducimus sed aliquip ut dolore id'),
(7, 'Ricardo Andres Rojas Rico', 4, '65701167', '3173926578', 'rrojas48@itfip.edu.co', 3, 1, 'Unde magni harum exercitation dolor et sint officiis soluta enim optio aliquam quae'),
(8, 'Ricardo Andres Rojas Rico', 4, '65701167', '3173926578', 'rojasricor@gmail.com', 2, 4, 'Ssjsjsjs'),
(9, 'Jose Manuel Mendoza Vasquez', 1, '1005773423', '3186329851', 'jmendoza23@itfip.edu.co', 2, 2, 'Tenetur sunt odio non et non dignissimos earum cumque quibusdam aliquip illum ratione consectetur q'),
(10, 'Holman Reyes Puentes', 1, '1111122448', '3173926578', 'rrojas48@itfip.edu.co', 4, 2, 'Repudiandae sunt cillum et voluptatem qui quia dolorem facere quia necessitatibus sed lorem'),
(11, 'Holman Reyes Puentes', 1, '1111122448', '97', 'rrojas48@itfip.edu.co', 2, 2, 'Consectetur est excepturi deleniti lorem ullamco rem veritatis ratione sint ea asperiores et sunt p'),
(12, 'Nulla Reiciendis Cupidatat Exercita', 5, '65701167', NULL, NULL, 2, 2, 'Earum dolorum illo tempor facilis fugiat provident unde suscipit'),
(13, 'Holman Reyes Puentes', 1, '1111122448', '44', 'rrojas48@itfip.edu.co', 2, 2, 'Nostrum omnis dolore error aliquam molestias quia non consequatur itaque'),
(14, 'Minim Do Laudantium Ullamco Non Ne', 1, '65701167', '3173926578', 'rojasricor@gmail.com', 2, 4, 'Quis fugiat fugit unde occaecat aliquip omnis magnam mollit quo sed est veritatis tempora sint sit'),
(15, 'Delectus Veniam Eum Numquam A Dol', 3, '65701167', '3173926578', 'kosuroz@mailinator.com', 5, 1, 'Quia non enim consequat omnis nihil qui nam'),
(16, 'Patricia Klein', 5, '65701167', NULL, NULL, 3, 3, 'Dolore amet consequuntur aut voluptatem dolores ab facere possimus quibusdam omnis et sit asperna'),
(17, 'Raymond Monroe', 1, '3173926578', NULL, NULL, 2, 2, 'Accusantium consequat possimus ratione eum delectus fugit'),
(18, 'Ferris Meyer', 5, '65701167', '3173926578', 'bysugopel@mailinator.com', 3, 3, 'Dolorum aut labore id illo laudantium inventore eveniet et est aut at adipisicing rerum deleniti q'),
(19, 'Macey Mcbride', 1, '65701168', NULL, NULL, 5, 3, 'Vitae deserunt ipsum saepe molestiae officia tempore est accusamus'),
(20, 'Kylynn Valdez', 4, '65701167', NULL, NULL, 3, 3, 'Perferendis magni in ducimus non fuga impedit id commodo minim iste est qui quidem sit sunt laud'),
(21, 'Amos Shaw', 1, '65701167', '3173926578', 'siviwo@mailinator.com', 3, 2, 'Ut possimus quia dolor quia voluptatum voluptatibus rerum quibusdam sit'),
(22, 'Daniel Lopez', 4, '65701167', NULL, NULL, 5, 3, 'Dolore quasi fugiat sit qui sunt sunt repellendus excepturi quisquam quia officiis sit maxime in'),
(23, 'Orlando Stanton', 5, '65701167', NULL, NULL, 5, 1, 'Consequuntur voluptatem fugiat ut mollit ut adipisci labore qui do in omnis consectetur sunt qui e'),
(24, 'Ignacia Ramirez', 1, '65701167', '3173926578', 'juzixehek@mailinator.com', 4, 1, 'Dolorum delectus consequuntur quibusdam enim doloremque omnis ratione tempor consequatur aut rerum '),
(25, 'Ignacia Ramirez', 1, '65701167', '3173926578', 'vasyxejof@mailinator.com', 2, 1, 'Laboriosam ut id voluptates magna odio dignissimos modi eu et voluptates perspiciatis vel soluta'),
(26, 'Jescie Mcintyre', 2, '65701167', NULL, NULL, 2, 4, 'Quibusdam omnis maiores vitae aliquid minim dolores eum molestias in nihil tenetur nobis sunt magnam'),
(27, 'Castor Rosales', 2, '65701167', '3173926578', 'cezofosod@mailinator.com', 1, 2, 'Repudiandae aliquid nihil vero perferendis ex sit cum excepteur voluptas tempor dolor iste aspernat');

CREATE TABLE `scheduling` (
  `person_id` int(11) UNSIGNED NOT NULL COMMENT 'Campo que almacena el id de la persona agendada, llave foranea del campo id de la tabla registered people.',
  `date_filter` char(10) NOT NULL COMMENT 'Campo que guarda la fecha del agendamiento, utilizada para hacer busquedas en rango en  la base de datos.',
  `start_date` datetime NOT NULL COMMENT 'Campo que guarda la fecha y hora (datetime), de inicio de la visita a la rectoria, de la persona agendada.',
  `end_date` datetime NOT NULL COMMENT 'Campo que guarda la fecha y hora (datetime), de finalizacion de la visita a la rectoria, de la persona agendada.',
  `modification` char(8) NOT NULL COMMENT 'Campo que guarda la ultima hora de modificacion (time), del registro en la base de datos.',
  `status` enum('scheduled','daily','cancelled') NOT NULL COMMENT 'Campo que guarda el tipo de agendamiento realizado, puede ser de dos tipos,agendamiento programado o agendamiento al dia.',
  `color` char(7) NOT NULL DEFAULT '#388cdc' COMMENT 'Campo que guarda un valor de texto correspondiente al color que tendra el registro al ser agendado.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena todos los agendamientos en fecha del aplicativo.';

INSERT INTO `scheduling` (`person_id`, `date_filter`, `start_date`, `end_date`, `modification`, `status`, `color`) VALUES
(1, '2023-05-23', '2023-05-23 19:52:13', '2023-05-23 19:52:13', '02:55:07', 'daily', '#388cdc'),
(2, '2023-05-23', '2023-05-23 21:00:00', '2023-05-23 21:30:00', '02:56:57', 'cancelled', '#388cdc'),
(3, '2023-05-23', '2023-05-23 19:59:55', '2023-05-23 19:59:55', '03:00:02', 'daily', '#388cdc'),
(4, '2023-05-23', '2023-05-23 20:30:00', '2023-05-23 21:00:00', '03:27:11', 'cancelled', '#302048'),
(5, '2023-05-23', '2023-05-23 20:30:00', '2023-05-23 21:00:00', '03:31:44', 'cancelled', '#dc8278'),
(6, '2023-05-23', '2023-05-23 21:00:00', '2023-05-23 21:30:00', '03:48:58', 'cancelled', '#ae8b36'),
(7, '2023-05-23', '2023-05-23 21:00:00', '2023-05-23 21:30:00', '03:52:59', 'cancelled', '#e25754'),
(8, '2023-05-24', '2023-05-24 09:00:00', '2023-05-24 11:30:00', '04:03:30', 'cancelled', '#db83b3'),
(9, '2023-05-24', '2023-05-24 08:00:00', '2023-05-24 08:30:00', '04:07:41', 'cancelled', '#d1e2f8'),
(10, '2023-05-24', '2023-05-24 07:00:00', '2023-05-24 07:30:00', '04:09:03', 'cancelled', '#b633d1'),
(11, '2023-05-24', '2023-05-24 08:00:00', '2023-05-24 08:30:00', '04:12:25', 'cancelled', '#1e81f6'),
(12, '2023-05-24', '2023-05-24 10:47:28', '2023-05-24 10:47:28', '05:47:36', 'daily', '#388cdc'),
(13, '2023-05-24', '2023-05-24 13:00:00', '2023-05-24 15:00:00', '05:54:32', 'cancelled', '#695dc8'),
(14, '2023-05-24', '2023-05-24 12:00:00', '2023-05-24 12:30:00', '05:59:32', 'cancelled', '#263555'),
(15, '2023-06-09', '2023-06-09 20:00:00', '2023-06-09 21:30:00', '06:56:10', 'cancelled', '#a0531f'),
(16, '2023-06-10', '2023-06-10 14:37:46', '2023-06-10 14:37:46', '02:38:18', 'daily', '#388cdc'),
(17, '2023-06-10', '2023-06-10 14:52:35', '2023-06-10 14:52:35', '02:52:53', 'daily', '#388cdc'),
(18, '2023-06-10', '2023-06-10 17:30:00', '2023-06-10 20:30:00', '02:53:17', 'cancelled', '#4c524b'),
(19, '2023-06-10', '2023-06-10 15:01:57', '2023-06-10 15:01:57', '03:02:15', 'daily', '#388cdc'),
(20, '2023-06-11', '2023-06-11 09:47:27', '2023-06-11 09:47:27', '09:48:23', 'daily', '#388cdc'),
(21, '2023-06-11', '2023-06-11 11:00:00', '2023-06-11 16:00:00', '09:49:01', 'scheduled', '#93d8cc'),
(22, '2023-06-11', '2023-06-11 10:07:23', '2023-06-11 10:07:23', '10:07:46', 'daily', '#388cdc'),
(23, '2023-06-11', '2023-06-11 10:07:23', '2023-06-11 10:07:23', '10:08:17', 'daily', '#388cdc'),
(24, '2023-06-11', '2023-06-11 17:30:00', '2023-06-11 20:30:00', '10:08:54', 'scheduled', '#b71986'),
(25, '2023-06-11', '2023-06-11 21:00:00', '2023-06-11 21:30:00', '10:10:44', 'scheduled', '#c8822d'),
(26, '2023-06-11', '2023-06-11 10:11:31', '2023-06-11 10:11:31', '10:12:09', 'daily', '#388cdc'),
(27, '2023-06-12', '2023-06-12 06:30:00', '2023-06-12 07:00:00', '10:12:49', 'scheduled', '#be1daa');

CREATE TABLE `users` (
  `id` tinyint(1) NOT NULL COMMENT 'Campo que guarda el id de los usuarios del aplicativo, con acceso permitido (unique).',
  `name` varchar(25) NOT NULL COMMENT 'Campo que guarda el nombre de los usuarios del aplicativo, con acceso permitido.',
  `lastname` varchar(25) NOT NULL COMMENT 'Campo que guarda el apellido de los usuarios del aplicativo, con acceso permitido.',
  `document_id` tinyint(1) NOT NULL COMMENT 'Campo que almacena el id del tipo de documento, de la tabla document.',
  `document_number` char(11) NOT NULL COMMENT 'Campo que guarda el numero de documento.',
  `tel` char(10) NOT NULL COMMENT 'Campo que guarda el numero de telefono de contacto.',
  `email` varchar(30) NOT NULL COMMENT 'Campo que guarda el correo electronico institucional o usuario de acceso al aplicativo.',
  `password` varchar(80) NOT NULL COMMENT 'Campo que guarda el password de acceso al aplicativo (encriptado).',
  `role` enum('admin','rector','secretaria') NOT NULL COMMENT 'Campo que guarda el rol que tiene el usaurio, existen 3: admin, rector, secretaria.',
  `permissions` set('admin','add','schedule','reports','statistics') NOT NULL,
  `reset_token` varchar(50) DEFAULT NULL,
  `reset_token_expiration` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci COMMENT='Tabla que almacena los usuarios del aplicativo, y sus respectivos usuarios y password de acceso al aplicativo.';

INSERT INTO `users` (`id`, `name`, `lastname`, `document_id`, `document_number`, `tel`, `email`, `password`, `role`, `permissions`, `reset_token`, `reset_token_expiration`) VALUES
(1, 'Mario Fernando', 'Díaz Pava', 1, '7223309043', '3100000000', 'mdiaz@itfip.edu.co', '$2y$10$nVt.zHvx75MsrsZzwj642OiQy2/LP5YH6Hzz8ns/YdKhjQBGI2weG', 'rector', 'schedule', NULL, NULL),
(3, 'Ricardo Andrés', 'Rojas Rico', 1, '1111122448', '3173926578', 'rrojas48@itfip.edu.co', '$2y$10$nVt.zHvx75MsrsZzwj642OiQy2/LP5YH6Hzz8ns/YdKhjQBGI2weG', 'admin', 'admin,add,schedule,reports,statistics', '7e462685b194083f3070ee4601705925', '2023-06-11 11:02:24');


ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `deans`
  ADD PRIMARY KEY (`_id`),
  ADD UNIQUE KEY `ID CARD` (`_id`) USING BTREE;

ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `faculties`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `people`
  ADD PRIMARY KEY (`id`),
  ADD KEY `document` (`document_id`),
  ADD KEY `id_facultied` (`facultie_id`) USING BTREE,
  ADD KEY `person_type` (`category_id`) USING BTREE;

ALTER TABLE `scheduling`
  ADD KEY `people_id` (`person_id`) USING BTREE;

ALTER TABLE `users`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `id_doc` (`document_id`);


ALTER TABLE `categories`
  MODIFY `id` tinyint(1) NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id del tipo de persona (autoincremental).', AUTO_INCREMENT=6;

ALTER TABLE `documents`
  MODIFY `id` tinyint(1) NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id del tipo de documento, (autoincremental).', AUTO_INCREMENT=6;

ALTER TABLE `faculties`
  MODIFY `id` tinyint(1) NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id de la facultad, (autoincremental).', AUTO_INCREMENT=5;

ALTER TABLE `people`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Campo que guarda el id de las personas agendadas (autoincremental).', AUTO_INCREMENT=28;
COMMIT;
