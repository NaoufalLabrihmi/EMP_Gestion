-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2025 at 03:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employees_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `city` varchar(100) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `company_number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `name`, `street`, `postal_code`, `city`, `contact_person`, `phone`, `reference`, `company_number`) VALUES
(1, 'Fyonka Barber', 'Wallstraße 15', '2000', 'Dresden', 'Max Mustermann', '01234 567890', 'AB-123', '82444003');

-- --------------------------------------------------------

--
-- Table structure for table `einkommensbescheinigung`
--

CREATE TABLE `einkommensbescheinigung` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `eintritt` varchar(20) DEFAULT NULL,
  `stkl` varchar(10) DEFAULT NULL,
  `krankenkasse` varchar(255) DEFAULT NULL,
  `betrag` varchar(20) DEFAULT NULL,
  `kv_brutto` varchar(20) DEFAULT NULL,
  `sv_abzug` varchar(20) DEFAULT NULL,
  `netto` varchar(20) DEFAULT NULL,
  `monat` varchar(2) DEFAULT NULL,
  `jahr` varchar(4) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `einkommensbescheinigung`
--

INSERT INTO `einkommensbescheinigung` (`id`, `employee_id`, `eintritt`, `stkl`, `krankenkasse`, `betrag`, `kv_brutto`, `sv_abzug`, `netto`, `monat`, `jahr`, `created_at`) VALUES
(2, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '12', '2024', '2025-06-24 19:33:57'),
(3, 5, '01.11.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '11', '2024', '2025-06-24 19:43:00'),
(4, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '200,00', '72,69', '300,66', '01', '2024', '2025-06-28 13:37:38'),
(5, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '07', '2024', '2025-06-28 13:37:43'),
(6, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '15,00', '273,44', '09', '2024', '2025-06-28 13:37:47'),
(7, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '08', '2024', '2025-06-28 13:37:50'),
(8, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '06', '2024', '2025-06-28 13:37:58'),
(9, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '04', '2024', '2025-06-28 13:59:08'),
(10, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '03', '2024', '2025-06-28 13:59:14'),
(11, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '02', '2024', '2025-06-28 13:59:18'),
(12, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '10', '2025', '2025-06-28 13:59:52'),
(13, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '10', '2024', '2025-06-30 13:33:47'),
(15, 5, '01.10.24', '1', 'AOK PLUS Die Gesundhei', '346,13', '346,13', '72,69', '273,44', '10', '2024', '2025-06-30 13:37:17');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `personal_number` varchar(255) DEFAULT NULL,
  `vorname` varchar(255) DEFAULT NULL,
  `geburtsname` varchar(255) DEFAULT NULL,
  `strasse_hausnummer` varchar(255) DEFAULT NULL,
  `plz_ort` varchar(255) DEFAULT NULL,
  `geburtsdatum` date DEFAULT NULL,
  `geschlecht` enum('männlich','weiblich','divers') DEFAULT NULL,
  `versicherungsnummer` varchar(100) DEFAULT NULL,
  `familienstand` varchar(100) DEFAULT NULL,
  `geburtsort_land` varchar(255) DEFAULT NULL,
  `schwerbehindert` tinyint(1) DEFAULT NULL,
  `staatsangehoerigkeit` varchar(100) DEFAULT NULL,
  `arbeitnehmernummer` varchar(100) DEFAULT NULL,
  `iban` varchar(100) DEFAULT NULL,
  `bic` varchar(100) DEFAULT NULL,
  `eintrittsdatum` date DEFAULT NULL,
  `ersteintrittsdatum` date DEFAULT NULL,
  `betriebsstaette` varchar(255) DEFAULT NULL,
  `berufsbezeichnung` varchar(255) DEFAULT NULL,
  `taetigkeit` varchar(255) DEFAULT NULL,
  `hauptbeschaeftigung` tinyint(1) DEFAULT NULL,
  `nebenbeschaeftigung` tinyint(1) DEFAULT NULL,
  `weitere_beschaeftigungen` tinyint(1) DEFAULT NULL,
  `schulabschluss` enum('ohne Schulabschluss','Haupt-/Volksschulabschluss','Mittlere Reife','Abitur/Fachabitur') DEFAULT NULL,
  `berufsausbildung` enum('ohne Abschluss','Anerkannte Berufsausbildung','Meister/Techniker','Bachelor','Diplom/Magister/Master/Staatsexamen','Promotion') DEFAULT NULL,
  `ausbildung_beginn` date DEFAULT NULL,
  `ausbildung_ende` date DEFAULT NULL,
  `baugewerbe_seit` date DEFAULT NULL,
  `arbeitszeit_vollzeit` tinyint(1) DEFAULT NULL,
  `arbeitszeit_teilzeit` tinyint(1) DEFAULT NULL,
  `arbeitszeit_verteilung` varchar(255) DEFAULT NULL,
  `urlaubsanspruch` int(11) DEFAULT NULL,
  `kostenstelle` varchar(100) DEFAULT NULL,
  `abteilungsnummer` varchar(100) DEFAULT NULL,
  `personengruppe` varchar(100) DEFAULT NULL,
  `arbeitsverhaeltnis_befristet` tinyint(1) DEFAULT NULL,
  `zweckbefristet` tinyint(1) DEFAULT NULL,
  `befristung_arbeitsvertrag_zum` date DEFAULT NULL,
  `schriftlicher_abschluss` tinyint(1) DEFAULT NULL,
  `abschluss_arbeitsvertrag_am` date DEFAULT NULL,
  `befristete_beschaeftigung_2monate` tinyint(1) DEFAULT NULL,
  `weitere_angaben` text DEFAULT NULL,
  `identifikationsnummer` varchar(100) DEFAULT NULL,
  `finanzamt_nr` varchar(100) DEFAULT NULL,
  `steuerklasse` varchar(20) DEFAULT NULL,
  `kinderfreibetraege` varchar(20) DEFAULT NULL,
  `konfession` varchar(50) DEFAULT NULL,
  `gesetzliche_krankenkasse` varchar(255) DEFAULT NULL,
  `elterneigenschaft` tinyint(1) DEFAULT NULL,
  `kv` varchar(100) DEFAULT NULL,
  `rv` varchar(100) DEFAULT NULL,
  `av` varchar(100) DEFAULT NULL,
  `pv` varchar(100) DEFAULT NULL,
  `uv_gefahrtarif` varchar(100) DEFAULT NULL,
  `entlohnung_bezeichnung1` varchar(100) DEFAULT NULL,
  `entlohnung_betrag1` decimal(10,2) DEFAULT NULL,
  `entlohnung_gueltig_ab1` date DEFAULT NULL,
  `entlohnung_stundenlohn1` decimal(10,2) DEFAULT NULL,
  `entlohnung_gueltig_ab_stunden1` date DEFAULT NULL,
  `entlohnung_bezeichnung2` varchar(100) DEFAULT NULL,
  `entlohnung_betrag2` decimal(10,2) DEFAULT NULL,
  `entlohnung_gueltig_ab2` date DEFAULT NULL,
  `entlohnung_stundenlohn2` decimal(10,2) DEFAULT NULL,
  `entlohnung_gueltig_ab_stunden2` date DEFAULT NULL,
  `entlohnung_bezeichnung3` varchar(100) DEFAULT NULL,
  `entlohnung_betrag3` decimal(10,2) DEFAULT NULL,
  `entlohnung_gueltig_ab3` date DEFAULT NULL,
  `entlohnung_stundenlohn3` decimal(10,2) DEFAULT NULL,
  `entlohnung_gueltig_ab_stunden3` date DEFAULT NULL,
  `vwl_empfaenger` varchar(100) DEFAULT NULL,
  `vwl_betrag` decimal(10,2) DEFAULT NULL,
  `vwl_ag_anteil` decimal(10,2) DEFAULT NULL,
  `vwl_seit_wann` date DEFAULT NULL,
  `vwl_vertragsnr` varchar(100) DEFAULT NULL,
  `vwl_kontonummer` varchar(100) DEFAULT NULL,
  `vwl_bankleitzahl` varchar(100) DEFAULT NULL,
  `ap_arbeitsvertrag` tinyint(1) DEFAULT NULL,
  `ap_bescheinigung_lsta` tinyint(1) DEFAULT NULL,
  `ap_sv_ausweis` tinyint(1) DEFAULT NULL,
  `ap_mitgliedsbescheinigung_kk` tinyint(1) DEFAULT NULL,
  `ap_bescheinigung_private_kk` tinyint(1) DEFAULT NULL,
  `ap_vwl_vertrag` tinyint(1) DEFAULT NULL,
  `ap_nachweis_elterneigenschaft` tinyint(1) DEFAULT NULL,
  `ap_vertrag_bav` tinyint(1) DEFAULT NULL,
  `ap_schwerbehindertenausweis` tinyint(1) DEFAULT NULL,
  `ap_unterlagen_sozialkasse` tinyint(1) DEFAULT NULL,
  `vorbeschaeftigung_zeitraum_von` date DEFAULT NULL,
  `vorbeschaeftigung_zeitraum_bis` date DEFAULT NULL,
  `vorbeschaeftigung_art` varchar(255) DEFAULT NULL,
  `vorbeschaeftigung_tage` int(11) DEFAULT NULL,
  `land` varchar(100) NOT NULL DEFAULT 'Deutschland',
  `contract_type` enum('TEILZEITTÄTIGKEIT','VOLLZEITTÄTIGKEIT','TEILZEITTÄTIGKEIT - "MINIJOB"') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `id_number`, `personal_number`, `vorname`, `geburtsname`, `strasse_hausnummer`, `plz_ort`, `geburtsdatum`, `geschlecht`, `versicherungsnummer`, `familienstand`, `geburtsort_land`, `schwerbehindert`, `staatsangehoerigkeit`, `arbeitnehmernummer`, `iban`, `bic`, `eintrittsdatum`, `ersteintrittsdatum`, `betriebsstaette`, `berufsbezeichnung`, `taetigkeit`, `hauptbeschaeftigung`, `nebenbeschaeftigung`, `weitere_beschaeftigungen`, `schulabschluss`, `berufsausbildung`, `ausbildung_beginn`, `ausbildung_ende`, `baugewerbe_seit`, `arbeitszeit_vollzeit`, `arbeitszeit_teilzeit`, `arbeitszeit_verteilung`, `urlaubsanspruch`, `kostenstelle`, `abteilungsnummer`, `personengruppe`, `arbeitsverhaeltnis_befristet`, `zweckbefristet`, `befristung_arbeitsvertrag_zum`, `schriftlicher_abschluss`, `abschluss_arbeitsvertrag_am`, `befristete_beschaeftigung_2monate`, `weitere_angaben`, `identifikationsnummer`, `finanzamt_nr`, `steuerklasse`, `kinderfreibetraege`, `konfession`, `gesetzliche_krankenkasse`, `elterneigenschaft`, `kv`, `rv`, `av`, `pv`, `uv_gefahrtarif`, `entlohnung_bezeichnung1`, `entlohnung_betrag1`, `entlohnung_gueltig_ab1`, `entlohnung_stundenlohn1`, `entlohnung_gueltig_ab_stunden1`, `entlohnung_bezeichnung2`, `entlohnung_betrag2`, `entlohnung_gueltig_ab2`, `entlohnung_stundenlohn2`, `entlohnung_gueltig_ab_stunden2`, `entlohnung_bezeichnung3`, `entlohnung_betrag3`, `entlohnung_gueltig_ab3`, `entlohnung_stundenlohn3`, `entlohnung_gueltig_ab_stunden3`, `vwl_empfaenger`, `vwl_betrag`, `vwl_ag_anteil`, `vwl_seit_wann`, `vwl_vertragsnr`, `vwl_kontonummer`, `vwl_bankleitzahl`, `ap_arbeitsvertrag`, `ap_bescheinigung_lsta`, `ap_sv_ausweis`, `ap_mitgliedsbescheinigung_kk`, `ap_bescheinigung_private_kk`, `ap_vwl_vertrag`, `ap_nachweis_elterneigenschaft`, `ap_vertrag_bav`, `ap_schwerbehindertenausweis`, `ap_unterlagen_sozialkasse`, `vorbeschaeftigung_zeitraum_von`, `vorbeschaeftigung_zeitraum_bis`, `vorbeschaeftigung_art`, `vorbeschaeftigung_tage`, `land`, `contract_type`) VALUES
(5, 'YZ51L5GCG', '406253', 'test1', 'aloo', 'test2', 'TEST 26', '1986-06-04', 'männlich', 'Assumenda voluptatem', 'Reiciendis illum no', 'Qui aut magni duis v', 1, 'Consequuntur blandit', 'Labore enim aperiam ', 'Proident consequatu', 'Inventore est volup', '2017-06-01', '1986-02-26', 'Id ab nulla et dolor', 'Et nulla voluptatum ', 'Voluptatum quam dolo', 0, 0, 1, 'ohne Schulabschluss', 'Meister/Techniker', '2006-10-08', '2009-01-02', '1980-08-17', 0, 1, 'Mo:76,Di:46,Mi:26,Do:88,Fr:0,Sa:96', 86, 'Eos numquam unde pra', 'Esse ea tempore ve', 'Voluptatibus volupta', 1, 1, '2015-10-05', 0, '1990-08-12', 1, ' Aperiam minus quis s Aperiam minus quis s Aperiam minus quis s Aperiam minus quis s Aperiam minus quis s', 'Aspernatur et dolore', 'Ad natus ipsam ipsam', 'Ea sit nemo quia sus', 'Voluptatum deserunt ', 'In aut elit sed et ', 'Cum eum repudiandae ', 0, 'Autem temporibus ali', 'Lorem quo ut aperiam', 'Eos veniam ex volu', 'Mollit nulla occaeca', 'Ut quia nihil repell', 'Quis voluptates magn', 36.00, '1980-07-06', 52.00, '1998-12-06', 'Debitis impedit in ', 89.00, '2003-08-10', 86.00, '1993-05-27', 'Anim placeat sed no', 44.00, '2024-09-11', 38.00, '1978-07-10', 'Lorem repudiandae do', 38.00, 83.00, '1971-10-17', 'Eius et obcaecati om', 'Accusantium sit vel', 'Officia distinctio ', 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, '2016-08-08', '2012-01-04', 'Rerum sit enim minu', 50, 'FRA', 'TEILZEITTÄTIGKEIT - \"MINIJOB\"');

-- --------------------------------------------------------

--
-- Table structure for table `erklaerung_form`
--

CREATE TABLE `erklaerung_form` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `erklaerung_typ` enum('zur Erteilung eines Aufenthaltstitels zum Zweck der Beschäftigung','zur Zustimmung der Aufnahme einer Beschäftigung von Personen mit Duldung oder Aufenthaltsgestattung (Bitte nur die Fragen 3 bis 22, 24 und 25, 37 bis 51 sowie 57 bis 59 ausfüllen)','zur Zustimmung zu einer Aufenthaltserlaubnis, die die Beschäftigung nicht erlaubt','zur Erteilung einer Vorabzustimmung der Bundesagentur für Arbeit','zur Erteilung einer Arbeitserlaubnis der Bundesagentur für Arbeit') DEFAULT NULL,
  `erklaerung_anlass` enum('Ersterteilung','Verlängerung','Arbeitgeberwechsel') DEFAULT NULL,
  `wohnsitz` varchar(255) DEFAULT NULL,
  `wohnsitz_seit` date DEFAULT NULL,
  `arbeitgeber_firma` varchar(255) DEFAULT NULL,
  `arbeitgeber_strasse` varchar(255) DEFAULT NULL,
  `arbeitgeber_hausnummer` varchar(20) DEFAULT NULL,
  `arbeitgeber_plz` varchar(20) DEFAULT NULL,
  `arbeitgeber_ort` varchar(100) DEFAULT NULL,
  `arbeitgeber_kontakt` varchar(255) DEFAULT NULL,
  `arbeitgeber_telefon` varchar(100) DEFAULT NULL,
  `arbeitgeber_email` varchar(100) DEFAULT NULL,
  `arbeitgeber_telefax` varchar(100) DEFAULT NULL,
  `arbeitgeber_betriebsstaette` varchar(100) DEFAULT NULL,
  `arbeitgeber_gegruendet` enum('Ja','Nein') DEFAULT NULL,
  `beschaeftigung_beginn` date DEFAULT NULL,
  `beschaeftigung_befristung` enum('unbefristet','befristet') DEFAULT NULL,
  `beschaeftigung_befristet_bis` date DEFAULT NULL,
  `beschaeftigung_ueberlassung` enum('Ja','Nein') DEFAULT NULL,
  `beschaeftigung_arbeitsort` enum('arbeitgeber_sitz','wechselnde_arbeitsorte','adresse') DEFAULT NULL,
  `beschaeftigung_arbeitsort_adresse` varchar(255) DEFAULT NULL,
  `beschaeftigung_berufsbezeichnung` text DEFAULT NULL,
  `qualifikation_keine` tinyint(1) DEFAULT NULL,
  `qualifikation_hochschule` tinyint(1) DEFAULT NULL,
  `qualifikation_studiengang` varchar(255) DEFAULT NULL,
  `qualifikation_hochschulort` varchar(255) DEFAULT NULL,
  `qualifikation_hochschul_anerkannt` enum('Ja','Nein') DEFAULT NULL,
  `qualifikation_hochschul_nachweis` varchar(255) DEFAULT NULL,
  `qualifikation_berufsausbildung` tinyint(1) DEFAULT NULL,
  `qualifikation_berufsausbildung_bezeichnung` varchar(255) DEFAULT NULL,
  `qualifikation_berufsausbildung_ort` varchar(255) DEFAULT NULL,
  `qualifikation_berufsausbildung_anerkannt` enum('Ja','Nein','Teilweise') DEFAULT NULL,
  `qualifikation_berufsausbildung_nachweis` varchar(255) DEFAULT NULL,
  `qualifikation_sonstige` tinyint(1) DEFAULT NULL,
  `qualifikation_sonstige_text` text DEFAULT NULL,
  `qualifikation_nicht_erforderlich` tinyint(1) DEFAULT NULL,
  `berufsausuebung_gebunden` enum('Ja','Nein') DEFAULT NULL,
  `berufsausuebung_qualifikation` varchar(255) DEFAULT NULL,
  `arbeitszeit_typ` enum('Vollzeit','Teilzeit','Geringfügige Beschäftigung') DEFAULT NULL,
  `arbeitszeit_stunden` varchar(10) DEFAULT NULL,
  `ueberstunden_verpflichtet` enum('Ja','Nein') DEFAULT NULL,
  `ueberstunden_umfang` varchar(50) DEFAULT NULL,
  `ueberstunden_ausgleich` varchar(255) DEFAULT NULL,
  `urlaubsanspruch_tage` int(11) DEFAULT NULL,
  `arbeitgeber_tarifgebunden` enum('Ja','Nein') DEFAULT NULL,
  `arbeitnehmer_tariflich` enum('Ja','Nein') DEFAULT NULL,
  `tarifvertrag` varchar(255) DEFAULT NULL,
  `entgeltgruppe` varchar(50) DEFAULT NULL,
  `entgelt_pro_typ` enum('pro Stunde','pro Monat') DEFAULT NULL,
  `entgelt_pro_stunde_wert` decimal(10,2) DEFAULT NULL,
  `entgelt_pro_monat_wert` decimal(10,2) DEFAULT NULL,
  `geldwerte_leistungen` tinyint(1) DEFAULT NULL,
  `geldwerte_leistungen_art` varchar(255) DEFAULT NULL,
  `geldwerte_leistungen_hoehe` decimal(10,2) DEFAULT NULL,
  `sonstige_berechnung` tinyint(1) DEFAULT NULL,
  `sonstige_berechnung_art` varchar(255) DEFAULT NULL,
  `sonstige_berechnung_hoehe` decimal(10,2) DEFAULT NULL,
  `versicherungspflicht_de` enum('Ja','Nein') DEFAULT NULL,
  `versicherungspflicht_begruendung` text DEFAULT NULL,
  `dvka_ausnahme` enum('Ja','Nein') DEFAULT NULL,
  `dvka_nachweis_form` varchar(255) DEFAULT NULL,
  `ergaenzende_angaben` text DEFAULT NULL,
  `unterschrift_ort` varchar(100) DEFAULT NULL,
  `unterschrift_datum` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `erklaerung_form`
--

INSERT INTO `erklaerung_form` (`id`, `employee_id`, `erklaerung_typ`, `erklaerung_anlass`, `wohnsitz`, `wohnsitz_seit`, `arbeitgeber_firma`, `arbeitgeber_strasse`, `arbeitgeber_hausnummer`, `arbeitgeber_plz`, `arbeitgeber_ort`, `arbeitgeber_kontakt`, `arbeitgeber_telefon`, `arbeitgeber_email`, `arbeitgeber_telefax`, `arbeitgeber_betriebsstaette`, `arbeitgeber_gegruendet`, `beschaeftigung_beginn`, `beschaeftigung_befristung`, `beschaeftigung_befristet_bis`, `beschaeftigung_ueberlassung`, `beschaeftigung_arbeitsort`, `beschaeftigung_arbeitsort_adresse`, `beschaeftigung_berufsbezeichnung`, `qualifikation_keine`, `qualifikation_hochschule`, `qualifikation_studiengang`, `qualifikation_hochschulort`, `qualifikation_hochschul_anerkannt`, `qualifikation_hochschul_nachweis`, `qualifikation_berufsausbildung`, `qualifikation_berufsausbildung_bezeichnung`, `qualifikation_berufsausbildung_ort`, `qualifikation_berufsausbildung_anerkannt`, `qualifikation_berufsausbildung_nachweis`, `qualifikation_sonstige`, `qualifikation_sonstige_text`, `qualifikation_nicht_erforderlich`, `berufsausuebung_gebunden`, `berufsausuebung_qualifikation`, `arbeitszeit_typ`, `arbeitszeit_stunden`, `ueberstunden_verpflichtet`, `ueberstunden_umfang`, `ueberstunden_ausgleich`, `urlaubsanspruch_tage`, `arbeitgeber_tarifgebunden`, `arbeitnehmer_tariflich`, `tarifvertrag`, `entgeltgruppe`, `entgelt_pro_typ`, `entgelt_pro_stunde_wert`, `entgelt_pro_monat_wert`, `geldwerte_leistungen`, `geldwerte_leistungen_art`, `geldwerte_leistungen_hoehe`, `sonstige_berechnung`, `sonstige_berechnung_art`, `sonstige_berechnung_hoehe`, `versicherungspflicht_de`, `versicherungspflicht_begruendung`, `dvka_ausnahme`, `dvka_nachweis_form`, `ergaenzende_angaben`, `unterschrift_ort`, `unterschrift_datum`) VALUES
(1, 5, 'zur Erteilung einer Vorabzustimmung der Bundesagentur für Arbeit', 'Ersterteilung', 'Iusto veniam error ', '2001-06-23', 'Beatae nesciunt et ', 'Excepturi commodi om', 'Voluptas ipsum aperi', 'Facere sint cupidit', 'Ex in qui odit et do', 'Ducimus ea ex quis ', 'Et aliquip eu harum ', 'hyhu@mailinator.com', '+1 (719) 688-9207', 'Consectetur id impe', 'Ja', '1995-06-01', 'befristet', '2025-06-04', 'Ja', 'adresse', 'test test', 'emp', 1, 1, 'Bitte machen Sie Angaben zum Arbeitsort:', 'Bitte machen Sie Angaben zum Arbeitsort:', 'Ja', 'Bitte machen Sie Angaben zum Arbeitsort:', 1, 'Bitte machen Sie Angaben zum Arbeitsort:', 'Bitte machen Sie Angaben zum Arbeitsort:', 'Teilweise', 'Bitte machen Sie Angaben zum Arbeitsort:', 1, 'Bitte machen Sie Angaben zum Arbeitsort:', 1, 'Ja', 'Et sunt enim aut et ', 'Vollzeit', '501', 'Ja', 'Sed esse sed cumque ', 'Omnis vel aut facere', 200, 'Ja', 'Ja', 'Et sunt voluptates ', 'Aut qui est ea natus', 'pro Monat', NULL, 2000.00, 1, 'fdv', 11.00, 1, 'Bitte machen Sie Angaben zum Arbeitsort:', 111.00, 'Ja', 'Aute Nam sed aperiam', 'Ja', 'Laborum Nam lorem vo', 'Fuga Totam fugiat q', 'Consectetur vel quos', '2020-08-26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `einkommensbescheinigung`
--
ALTER TABLE `einkommensbescheinigung`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_number` (`id_number`);

--
-- Indexes for table `erklaerung_form`
--
ALTER TABLE `erklaerung_form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `einkommensbescheinigung`
--
ALTER TABLE `einkommensbescheinigung`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `erklaerung_form`
--
ALTER TABLE `erklaerung_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `einkommensbescheinigung`
--
ALTER TABLE `einkommensbescheinigung`
  ADD CONSTRAINT `einkommensbescheinigung_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `erklaerung_form`
--
ALTER TABLE `erklaerung_form`
  ADD CONSTRAINT `erklaerung_form_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
