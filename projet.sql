-- Create the database
CREATE DATABASE IF NOT EXISTS employees_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE employees_db;

-- Tabelle für Mitarbeiter (alle Felder für Personalfragebogen)
CREATE TABLE IF NOT EXISTS employees (
  id INT(11) NOT NULL AUTO_INCREMENT,

  -- Standard fields
  id_number VARCHAR(255) DEFAULT NULL,
  personal_number VARCHAR(255) DEFAULT NULL,

  -- Persönliche Angaben
  vorname VARCHAR(255) DEFAULT NULL, /*first name*/
  geburtsname VARCHAR(255) DEFAULT NULL, /*birth name*/
  strasse_hausnummer VARCHAR(255) DEFAULT NULL,
  plz_ort VARCHAR(255) DEFAULT NULL,
  geburtsdatum DATE DEFAULT NULL, /*birth_date*/
  geschlecht ENUM('männlich','weiblich','divers') DEFAULT NULL, /*sex*/
  versicherungsnummer VARCHAR(100) DEFAULT NULL,
  familienstand VARCHAR(100) DEFAULT NULL,
  geburtsort_land VARCHAR(255) DEFAULT NULL,
  schwerbehindert BOOLEAN DEFAULT NULL,
  staatsangehoerigkeit VARCHAR(100) DEFAULT NULL, /*nationality*/
  arbeitnehmernummer VARCHAR(100) DEFAULT NULL,
  iban VARCHAR(100) DEFAULT NULL,
  bic VARCHAR(100) DEFAULT NULL,

  -- Beschäftigung
  eintrittsdatum DATE DEFAULT NULL,
  ersteintrittsdatum DATE DEFAULT NULL,
  betriebsstaette VARCHAR(255) DEFAULT NULL,
  berufsbezeichnung VARCHAR(255) DEFAULT NULL,
  taetigkeit VARCHAR(255) DEFAULT NULL,
  hauptbeschaeftigung BOOLEAN DEFAULT NULL,
  nebenbeschaeftigung BOOLEAN DEFAULT NULL,
  weitere_beschaeftigungen BOOLEAN DEFAULT NULL,
  schulabschluss ENUM('ohne Schulabschluss','Haupt-/Volksschulabschluss','Mittlere Reife','Abitur/Fachabitur') DEFAULT NULL,
  berufsausbildung ENUM('ohne Abschluss','Anerkannte Berufsausbildung','Meister/Techniker','Bachelor','Diplom/Magister/Master/Staatsexamen','Promotion') DEFAULT NULL,
  ausbildung_beginn DATE DEFAULT NULL,
  ausbildung_ende DATE DEFAULT NULL,
  baugewerbe_seit DATE DEFAULT NULL,
  arbeitszeit_vollzeit BOOLEAN DEFAULT NULL,      /* Checkbox: Vollzeit*/
  arbeitszeit_teilzeit BOOLEAN DEFAULT NULL,      /* Checkbox: Teilz.*/
  arbeitszeit_verteilung VARCHAR(255) DEFAULT NULL, /* e.g. "Mo:8,Di:8,Mi:8,Do:8,Fr:8,Sa:0"*/
  urlaubsanspruch INT DEFAULT NULL,               /* Kalenderjahr*/
  kostenstelle VARCHAR(100) DEFAULT NULL,
  abteilungsnummer VARCHAR(100) DEFAULT NULL,
  personengruppe VARCHAR(100) DEFAULT NULL,

  -- Befristung
  arbeitsverhaeltnis_befristet BOOLEAN DEFAULT NULL,
  zweckbefristet BOOLEAN DEFAULT NULL,
  befristung_arbeitsvertrag_zum DATE DEFAULT NULL,
  schriftlicher_abschluss BOOLEAN DEFAULT NULL,
  abschluss_arbeitsvertrag_am DATE DEFAULT NULL,
  befristete_beschaeftigung_2monate BOOLEAN DEFAULT NULL,

  -- Weitere Angaben
  weitere_angaben TEXT DEFAULT NULL,

  -- Steuer
  identifikationsnummer VARCHAR(100) DEFAULT NULL,
  finanzamt_nr VARCHAR(100) DEFAULT NULL,
  steuerklasse VARCHAR(20) DEFAULT NULL,
  kinderfreibetraege VARCHAR(20) DEFAULT NULL,
  konfession VARCHAR(50) DEFAULT NULL,

  -- Sozialversicherung
  gesetzliche_krankenkasse VARCHAR(255) DEFAULT NULL,
  elterneigenschaft BOOLEAN DEFAULT NULL,
  kv VARCHAR(100) DEFAULT NULL,
  rv VARCHAR(100) DEFAULT NULL,
  av VARCHAR(100) DEFAULT NULL,
  pv VARCHAR(100) DEFAULT NULL,
  uv_gefahrtarif VARCHAR(100) DEFAULT NULL,

  -- Entlohnung (3 Zeilen)
  entlohnung_bezeichnung1 VARCHAR(100) DEFAULT NULL,
  entlohnung_betrag1 DECIMAL(10,2) DEFAULT NULL,
  entlohnung_gueltig_ab1 DATE DEFAULT NULL,
  entlohnung_stundenlohn1 DECIMAL(10,2) DEFAULT NULL,
  entlohnung_gueltig_ab_stunden1 DATE DEFAULT NULL,
  entlohnung_bezeichnung2 VARCHAR(100) DEFAULT NULL,
  entlohnung_betrag2 DECIMAL(10,2) DEFAULT NULL,
  entlohnung_gueltig_ab2 DATE DEFAULT NULL,
  entlohnung_stundenlohn2 DECIMAL(10,2) DEFAULT NULL,
  entlohnung_gueltig_ab_stunden2 DATE DEFAULT NULL,
  entlohnung_bezeichnung3 VARCHAR(100) DEFAULT NULL,
  entlohnung_betrag3 DECIMAL(10,2) DEFAULT NULL,
  entlohnung_gueltig_ab3 DATE DEFAULT NULL,
  entlohnung_stundenlohn3 DECIMAL(10,2) DEFAULT NULL,
  entlohnung_gueltig_ab_stunden3 DATE DEFAULT NULL,

  -- VWL
  vwl_empfaenger VARCHAR(100) DEFAULT NULL,
  vwl_betrag DECIMAL(10,2) DEFAULT NULL,
  vwl_ag_anteil DECIMAL(10,2) DEFAULT NULL,
  vwl_seit_wann DATE DEFAULT NULL,
  vwl_vertragsnr VARCHAR(100) DEFAULT NULL,
  vwl_kontonummer VARCHAR(100) DEFAULT NULL,
  vwl_bankleitzahl VARCHAR(100) DEFAULT NULL,

  -- Arbeitspapiere (alle als BOOLEAN)
  ap_arbeitsvertrag BOOLEAN DEFAULT NULL,
  ap_bescheinigung_lsta BOOLEAN DEFAULT NULL,
  ap_sv_ausweis BOOLEAN DEFAULT NULL,
  ap_mitgliedsbescheinigung_kk BOOLEAN DEFAULT NULL,
  ap_bescheinigung_private_kk BOOLEAN DEFAULT NULL,
  ap_vwl_vertrag BOOLEAN DEFAULT NULL,
  ap_nachweis_elterneigenschaft BOOLEAN DEFAULT NULL,
  ap_vertrag_bav BOOLEAN DEFAULT NULL,
  ap_schwerbehindertenausweis BOOLEAN DEFAULT NULL,
  ap_unterlagen_sozialkasse BOOLEAN DEFAULT NULL,

  -- Vorbeschäftigungszeiten
  vorbeschaeftigung_zeitraum_von DATE DEFAULT NULL,
  vorbeschaeftigung_zeitraum_bis DATE DEFAULT NULL,
  vorbeschaeftigung_art VARCHAR(255) DEFAULT NULL,
  vorbeschaeftigung_tage INT DEFAULT NULL,

  PRIMARY KEY (id),
  UNIQUE KEY (id_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE erklaerung_form (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    rbtn_1_Erklaerung VARCHAR(50) DEFAULT NULL,
    rbtn_2_Anlass VARCHAR(50) DEFAULT NULL,
    txtf_8_Wohnsitz VARCHAR(255) DEFAULT NULL,
    txtf_9_seit DATE DEFAULT NULL,
    txtf_10_Firma VARCHAR(255) DEFAULT NULL,
    txtf_12_Hausnummer VARCHAR(20) DEFAULT NULL,
    txtf_14_Ort VARCHAR(100) DEFAULT NULL,
    txtf_15_Kontaktperson VARCHAR(255) DEFAULT NULL,
    txtf_16_Telefon VARCHAR(100) DEFAULT NULL,
    txtf_17_E_Mail VARCHAR(100) DEFAULT NULL,
    txtf_18_Telefax VARCHAR(100) DEFAULT NULL,
    rbtn_20_Unternehmen_gegruendet VARCHAR(20) DEFAULT NULL,
    txtf_21_Beschaeftigungsverhaeltniss VARCHAR(255) DEFAULT NULL,
    rbtn_22_Beschaeftigungsverhaeltniss VARCHAR(20) DEFAULT NULL,
    txtf_22_Beschaeftigungsverhaeltniss VARCHAR(255) DEFAULT NULL,
    rbtn_23_Dritte VARCHAR(20) DEFAULT NULL,
    rbtn_24_Arbeitsort VARCHAR(20) DEFAULT NULL,
    txtf_24_Arbeitsort_Adresse VARCHAR(255) DEFAULT NULL,
    chbx_zuE_1v4 BOOLEAN DEFAULT NULL,
    chbx_zuE_2v4 BOOLEAN DEFAULT NULL,
    txtf_26_Studiengang VARCHAR(255) DEFAULT NULL,
    txtf_27_Hochschulabschluss VARCHAR(255) DEFAULT NULL,
    rbtn_28_Abschluss_Ausland VARCHAR(20) DEFAULT NULL,
    txtf_29_Anerkennungsnachweis VARCHAR(255) DEFAULT NULL,
    chbx_zuE_3v4 BOOLEAN DEFAULT NULL,
    txtf_30_Bezeichnung_Berufsausbildung VARCHAR(255) DEFAULT NULL,
    txtf_31_Berufsausbildung_erworben VARCHAR(255) DEFAULT NULL,
    rbtn_32_Ausbildung_Ausland VARCHAR(20) DEFAULT NULL,
    txtf_33_Anerkennungsnachweis VARCHAR(255) DEFAULT NULL,
    chbx_zuE_4v4 BOOLEAN DEFAULT NULL,
    txtf_34_Qualifikationen VARCHAR(255) DEFAULT NULL,
    chbx_34_keine_Ausbildung BOOLEAN DEFAULT NULL,
    rbtn_35_Berufsausuebungserlaubnis VARCHAR(20) DEFAULT NULL,
    txtf_36_erforderliche_Qualifikation VARCHAR(255) DEFAULT NULL,
    rbtn_37_Arbeitszeit VARCHAR(20) DEFAULT NULL,
    txtf_37_Arbeitsstunden_Woche VARCHAR(20) DEFAULT NULL,
    rbtn_38_Ueberstunden VARCHAR(20) DEFAULT NULL,
    txtf_39_Ueberstundenumpfang VARCHAR(20) DEFAULT NULL,
    txtf_40_Ueberstundenausgleich VARCHAR(255) DEFAULT NULL,
    txtf_41_Urlaubsanpruch VARCHAR(20) DEFAULT NULL,
    rbtn_42_Arbeitgeber_tarifgebunden VARCHAR(20) DEFAULT NULL,
    rbtn_43_tarifliche_Arbeitsbedingungen VARCHAR(20) DEFAULT NULL,
    txtf_44_Tarifvertrag VARCHAR(255) DEFAULT NULL,
    txtf_45_Entgeltgruppe VARCHAR(50) DEFAULT NULL,
    txtf_46_Entgelt_pro_Stunde VARCHAR(50) DEFAULT NULL,
    chbx_46_Arbeitsentgelt BOOLEAN DEFAULT NULL,
    txtf_46_Entgelt_pro_Monat VARCHAR(50) DEFAULT NULL,
    chbx_47_zusaetzlich_geldwerte_Leistungen BOOLEAN DEFAULT NULL,
    txtf_48_Art_geldwerten_Leistung VARCHAR(255) DEFAULT NULL,
    txtf_49_Hoehe_geldwerten_Leistung VARCHAR(255) DEFAULT NULL,
    chbx_47_sonstige_Berechnung BOOLEAN DEFAULT NULL,
    txtf_50_Art_variablen_Verguetung VARCHAR(255) DEFAULT NULL,
    txtf_51_Hoehe_variable_Verguetung VARCHAR(255) DEFAULT NULL,
    rbtn_52_besteht_Versicherungspflicht VARCHAR(20) DEFAULT NULL,
    txtf_53_Begruendung_Versicherungspflicht VARCHAR(255) DEFAULT NULL,
    rbtn_54_Sozialversicherungspflicht_nicht VARCHAR(20) DEFAULT NULL,
    txtf_55_Form_Nachweiss VARCHAR(255) DEFAULT NULL,
    txtf_56_Ergaemzungen VARCHAR(255) DEFAULT NULL,
    txtf_57_Ort VARCHAR(100) DEFAULT NULL,
    txtf_58_Datum DATE DEFAULT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);