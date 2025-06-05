import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface EmployeeData {
  name?: string;
  startDate?: string;
  weeklyHours?: string;
  monthlySalary?: string;
}

interface EmployeePDFProps {
  data: EmployeeData;
  stand: string;
}


const styles = StyleSheet.create({
  page: { padding: 16, fontSize: 7, fontFamily: 'Helvetica' },
  sectionHeader: { fontWeight: 'bold', fontSize: 7, marginTop: 12, marginBottom: 4, backgroundColor: '#eee', padding: 4 },
  row: { flexDirection: 'row', borderBottom: '1px solid #aaa', alignItems: 'center' },
  cell: { flex: 1, padding: 4, borderRight: '1px solid #aaa' },
  cellHeader: { fontWeight: 'bold', backgroundColor: '#eee' },
  checkbox: { width: 10, height: 10, border: '1px solid #000', marginRight: 4 },
  label: { fontWeight: 'bold' },
  small: { fontSize: 8 },
  table: { border: '1px solid #aaa', marginBottom: 8 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  signatureCell: { flex: 1, textAlign: 'center' },
  pageNumber: { position: 'absolute', fontSize: 8, bottom: 16, right: 24, color: 'grey' },
});

const EmployeePDF: React.FC<EmployeePDFProps> = ({ data, stand }) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>Personalfragebogen</Text>
          <Text style={styles.small}>(grau hinterlegte Felder sind vom Arbeitgeber auszufüllen)</Text>
          <Text style={{ marginTop: 8 }}>Firma:</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>DATEV</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <View style={{ flex: 1.3, marginRight: 8 }}>
          <Text style={{ fontSize: 12 }}>Name des Mitarbeiters</Text>
          <View style={{ height: 24, backgroundColor: '#eee', marginTop: 2, alignItems: 'flex-start', flexDirection: 'row' }}>
            <Text style={{ fontSize: 10, marginLeft: 6, marginTop: 4 }}>{data.name}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, textAlign: 'right' }}>Personalnummer</Text>
          <View style={{ height: 24, backgroundColor: '#eee', marginTop: 2 }} />
        </View>
      </View>
      {/* Persönliche Angaben */}
      <View style={{ border: '1.5px solid #222', marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 11, padding: 4 }}>Persönliche Angaben</Text>
        </View>
        {/* Table rows */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Familienname</Text>
            <Text style={styles.small}>ggf. Geburtsname</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Vorname</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Straße und Hausnummer</Text>
            <Text style={styles.small}>inkl. Anschriftenzusatz</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>PLZ, Ort</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Geburtsdatum</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 4 }}>
            <Text>Geschlecht   </Text>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text style={{ marginRight: 8 }}>männlich</Text>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text>weiblich</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Versicherungsnummer</Text>
            <Text style={styles.small}>gem. Sozialvers.Ausweis</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Familienstand</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Geburtsort, -land</Text>
            <Text style={styles.small}>- nur bei fehlender Versicherungs-Nr.</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 4 }}>
            <Text>Schwerbehindert   </Text>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text style={{ marginRight: 8 }}>ja</Text>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text>nein</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Staatsangehörigkeit</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Arbeitnehmernummer</Text>
            <Text style={styles.small}>Sozialkasse - Bau</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Kontonummer</Text>
            <Text style={styles.small}>(IBAN)</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Bankleitzahl/Bankbezeichnung (BIC)</Text>
          </View>
        </View>
      </View>
      {/* Beschäftigung */}
      <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 11, padding: 4 }}>Beschäftigung</Text>
        </View>
        {/* First row: Eintrittsdatum, Ersteintrittsdatum, Betriebsstätte */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Eintrittsdatum : {data.startDate}</Text>
            
          </View>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Ersteintrittsdatum</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Betriebsstätte</Text>
          </View>
        </View>
        {/* Second row: Berufsbezeichnung, Ausgeübte Tätigkeit */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1.5, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Berufsbezeichnung</Text>
          </View>
          <View style={{ flex: 1.5, padding: 4 }}>
            <Text>Ausgeübte Tätigkeit</Text>
          </View>
        </View>
        {/* Third row: Hauptbeschäftigung, Nebenbeschäftigung */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222', alignItems: 'center' }}>
          <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center', borderRight: '1px solid #222', padding: 4 }}>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text style={{ marginRight: 12 }}>Hauptbeschäftigung</Text>
          </View>
          <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center', padding: 4 }}>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text style={{ marginRight: 12 }}>Nebenbeschäftigung</Text>
          </View>
        </View>
        {/* Fourth row: Üben Sie weitere Beschäftigungen aus? ja nein */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222', alignItems: 'center' }}>
          <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center', padding: 4 }}>
            <Text>Üben Sie weitere Beschäftigungen aus?</Text>
            <View style={[styles.checkbox, { marginLeft: 12, marginTop: 1 }]} />
            <Text style={{ marginRight: 8 }}>ja</Text>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text>nein</Text>
          </View>
        </View>
        {/* Fifth row: Schulabschluss & Berufsausbildung (2 columns) */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          {/* Left: Höchster Schulabschluss */}
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Höchster Schulabschluss</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>ohne Schulabschluss</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Haupt-/Volksschulabschluss</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Mittlere Reife/gleichwertiger Abschluss</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text>Abitur/Fachabitur</Text>
            </View>
          </View>
          {/* Right: Höchste Berufsausbildung */}
          <View style={{ flex: 1, padding: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Höchste Berufsausbildung</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>ohne beruflichen Ausbildungsabschluss</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Anerkannte Berufsausbildung</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Meister/Techniker/gleichwertiger Fachschulabschluss</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Bachelor</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Diplom/Magister/ Master/Staatsexamen</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text>Promotion</Text>
            </View>
          </View>
        </View>
        {/* Sixth row: Beginn der Ausbildung, Ende, Im Baugewerbe beschäftigt seit */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Beginn der Ausbildung:</Text>
          </View>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Voraussichtliches Ende der Ausbildung:</Text>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Im Baugewerbe beschäftigt seit</Text>
          </View>
        </View>
        {/* Seventh row: Wöchentliche Arbeitszeit, Verteilung, Urlaubsanspruch */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Wöchentliche Arbeitszeit:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text style={{ marginRight: 8 }}>Vollzeit</Text>
              <View style={[styles.checkbox, { marginTop: 1 }]} />
              <Text>Teilz.</Text>
            </View>
          </View>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Ggf.Verteilung d. wöchentl. Arbeitszeit (Std.)</Text>
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
              <Text style={{ marginRight: 8 }}>Mo</Text>
              <Text style={{ marginRight: 8 }}>Di</Text>
              <Text style={{ marginRight: 8 }}>Mi</Text>
              <Text style={{ marginRight: 8 }}>Do</Text>
              <Text style={{ marginRight: 8 }}>Fr</Text>
              <Text>Sa</Text>
            </View>
          </View>
          <View style={{ flex: 1, padding: 4 }}>
            <Text>Urlaubsanspruch</Text>
            <Text style={styles.small}>(Kalenderjahr)</Text>
          </View>
        </View>
        {/* Eighth row: Kostenstelle, Abt.-Nummer, Personengruppe */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Kostenstelle</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
          </View>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Abt.-Nummer</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
          </View>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 4 }}>
            <Text>Personengruppe</Text> 
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
          </View>
        </View>
      </View>
            {/* Befristung */}
        <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 11, padding: 4 }}>Befristung</Text>
        </View>
        {/* First row */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2.2, padding: 4 }}>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text style={{ marginRight: 4 }}>Das Arbeitsverhältnis ist befristet</Text>
            <Text style={{ marginRight: 4 }}>/</Text>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text style={{ marginRight: 12 }}>zweckbefristet</Text>
          </View>
          <View style={{ width: 2, backgroundColor: '#222', alignSelf: 'stretch', marginRight: -1 }} />
          <View style={{ flex: 1.8, backgroundColor: '#eee', padding: 4 }}>
            <Text>Befristung Arbeitsvertrag zum:</Text>
          </View>
        </View>
        {/* Second row */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2.2, padding: 4 }}>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text>Schriftlicher Abschluss des befristeten Arbeitsvertrages</Text>
          </View>
          <View style={{ width: 2, backgroundColor: '#222', alignSelf: 'stretch', marginRight: -1 }} />
          <View style={{ flex: 1.8, backgroundColor: '#eee', padding: 4 }}>
            <Text>Abschluss Arbeitsvertrag am:</Text>
          </View>
        </View>
        {/* Third row */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 2.2, padding: 4 }}>
            <View style={[styles.checkbox, { marginTop: 1 }]} />
            <Text>befristete Beschäftigung ist für mindestens 2 Monate vorgesehen, mit Aussicht auf Weiterbeschäftigung</Text>
          </View>
        </View>
      </View>
      {/* Weitere Angaben */}
        <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 70 }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 11, padding: 4 }}>Weitere Angaben</Text>
            </View>
        <View style={{ minHeight: 20, padding: 4 }} />
      </View>
      {/* Footer: Stand and page number */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ fontSize: 8, marginLeft: 2 }}>{stand}</Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold', marginRight: 8 }}>1</Text>
      </View>
    </Page>
    {/* Page 2 (compact) */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}>Personalfragebogen</Text>
          <Text style={styles.small}>(grau hinterlegte Felder sind vom Arbeitgeber auszufüllen)</Text>
          <Text style={{ marginTop: 8 }}>Firma:</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>DATEV</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <View style={{ flex: 1.3, marginRight: 8 }}>
          <Text style={{ fontSize: 12 }}>Name des Mitarbeiters</Text>
          <View style={{ height: 24, backgroundColor: '#eee', marginTop: 2 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, textAlign: 'right' }}>Personalnummer</Text>
          <View style={{ height: 24, backgroundColor: '#eee', marginTop: 2 }} />
        </View>
      </View>
      {/* Steuer */}
        <View style={{ border: '1.5px solid #222', marginTop: 0, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8, padding: 4 }}>Steuer</Text>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1.2px solid #222' }}>
          <View style={{ flex: 1, borderRight: '1.2px solid #222', padding: 2 }}>
            <Text>Identifikationsnr.</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
          </View>
          <View style={{ flex: 1, borderRight: '1.2px solid #222', padding: 2 }}>
            <Text>Finanzamt-Nr.</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
            </View>
          <View style={{ flex: 1, borderRight: '1.2px solid #222', padding: 2 }}>
            <Text>Steuerklasse/Faktor</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
            </View>
          <View style={{ flex: 1, borderRight: '1.2px solid #222', padding: 2 }}>
            <Text>Kinderfreibeträge</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
            </View>
          <View style={{ flex: 1, padding: 2 }}>
            <Text>Konfession</Text>
            <View style={{ height: 10, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
          </View>
        </View>
      </View>
      {/* Sozialversicherung */}
        <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8, padding: 4 }}>Sozialversicherung</Text>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1.2px solid #222' }}>
          <View style={{ flex: 2, borderRight: '1.2px solid #222', padding: 2 }}>
            <Text>Gesetzl. Krankenkasse (bei PKV: letzte ges. Krankenkasse)</Text>
            <View style={{ height: 11, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 6 }}>
            <Text>Elterneigenschaft </Text>
            <Text style={{ marginRight: 15 }}>ja</Text>
            <View style={[styles.checkbox, { marginTop: 0 }]} />
            <Text style={{ marginRight: 4 }}>ja</Text>
            <View style={[styles.checkbox, { marginTop: 0 }]} />
            <Text>nein</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#eee', borderRight: '1.2px solid #222', padding: 2 }}><Text>KV</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          <View style={{ flex: 1, backgroundColor: '#eee', borderRight: '1.2px solid #222', padding: 2 }}><Text>RV</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          <View style={{ flex: 1, backgroundColor: '#eee', borderRight: '1.2px solid #222', padding: 2 }}><Text>AV</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          <View style={{ flex: 1, backgroundColor: '#eee', borderRight: '1.2px solid #222', padding: 2 }}><Text>PV</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          <View style={{ flex: 1, backgroundColor: '#eee', padding: 2 }}><Text>UV - Gefahrtarif</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
        </View>
      </View>
      {/* Entlohnung */}
      <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8, padding: 4 }}>Entlohnung</Text>
        </View>
        {[0,1,2].map(i => (
          <View key={i} style={{ flexDirection: 'row', borderBottom: i < 2 ? '1px solid #222' : undefined, backgroundColor: '#eee' }}>
            <View style={{ flex: 1, padding: 2 }}><Text>Bezeichnung</Text></View>
            <View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
            <View style={{ flex: 1, padding: 2 }}><Text>Betrag</Text></View>
            <View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
            <View style={{ flex: 1, padding: 2 }}><Text>Gültig ab</Text></View>
            <View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} />
            <View style={{ flex: 1, borderLeft: '1px solid #222', padding: 2 }}><Text>Stundenlohn</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
            <View style={{ flex: 1, padding: 2 }}><Text>Gültig ab</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          </View>
        ))}
      </View>
      {/* VWL */}
      <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', borderBottom: '1.5px solid #222', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8, padding: 4 }}>VWL</Text>
          <Text style={{ fontWeight: 'normal', fontSize: 6, padding: 4 }}>- nur notwendig wenn Vertrag vorliegt</Text>
        </View>
        {/* First row: Empfänger VWL, Betrag, AG-Anteil */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, borderRight: '1px solid #222', borderBottom: 'none', padding: 1 }}><Text>Empfänger VWL</Text></View>
          <View style={{ flex: 1, borderRight: '1px solid #222', borderBottom: '1px solid #222', padding: 1 }}><Text>Betrag</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          <View style={{ flex: 1, backgroundColor: '#eee', borderBottom: '1px solid #222', padding: 1 }}><Text>AG-Anteil (Höhe mtl.)</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
        </View>
        {/* Second row: empty left, Seit wann, Vertragsnr. */}
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 2, borderRight: '1px solid #222', padding: 1, borderTop: 'none' }}></View>
          <View style={{ flex: 1, borderRight: '1px solid #222', padding: 1, borderTop: 'none' }}><Text>Seit wann</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
          <View style={{ flex: 1, padding: 1, borderTop: 'none' }}><Text>Vertragsnr.</Text><View style={{ height: 8, marginTop: 2, marginRight: 8, marginLeft: 0 }} /></View>
        </View>
        {/* Third row: Kontonummer, Bankleitzahl/Bankbezeichnung */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 2, padding: 1 }}>
            <Text>Kontonummer</Text>
            <Text style={{ fontSize: 10 }}>(IBAN)</Text>
          </View>
          <View style={{ flex: 2, borderLeft: '1px solid #222', padding: 2.5 }}>
            <Text>Bankleitzahl/Bankbezeichnung</Text>
            <Text style={{ fontSize: 10 }}>(BIC)</Text>
          </View>
        </View>
      </View>
      {/* Angaben zu den Arbeitspapieren */}
      <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8, padding: 4 }}>Angaben zu den Arbeitspapieren</Text>
        </View>
        {['Arbeitsvertrag','Bescheinigung über LSt.-Abzug','SV-Ausweis','Mitgliedsbescheinigung Krankenkasse','Bescheinigung zur privaten Krankenversicherung','VWL Vertrag','Nachweis Elterneigenschaft','Vertrag Betriebliche Altersversorgung','Schwerbehindertenausweis','Unterlagen Sozialkasse Bau/Maler'].map((label, idx, arr) => (
          <View key={label} style={{ flexDirection: 'row', borderBottom: idx < arr.length - 1 ? '1px solid #222' : undefined }}>
            <View style={{ flex: 2, borderRight: '1px solid #222', padding: 4 }}><Text>{label}</Text></View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 4 }}>
              <View style={[styles.checkbox, { marginTop: 0 }]} />
              <Text> liegt vor</Text>
            </View>
          </View>
        ))}
      </View>
      {/* Angaben zu steuerpflichtigen Vorbeschäftigungszeiten im laufenden Kalenderjahr */}
      <View style={{ border: '1.5px solid #222', marginTop: 8, marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', backgroundColor: '#eee', borderBottom: '1px solid #222' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 8, padding: 4 }}>Angaben zu steuerpflichtigen Vorbeschäftigungszeiten im laufenden Kalenderjahr</Text>
        </View>
        <View style={{ flexDirection: 'row', borderBottom: '1px solid #222' }}>
          <View style={{ flex: 0.7, borderRight: '1px solid #222', padding: 4 }}><Text>Zeitraum von</Text></View>
          <View style={{ flex: 0.7, borderRight: '1px solid #222', padding: 4 }}><Text>Zeitraum bis</Text></View>
          <View style={{ flex: 1.3, borderRight: '1px solid #222', padding: 4 }}><Text>Art der Beschäftigung</Text></View>
          <View style={{ flex: 1.3, padding: 4 }}><Text>Anzahl der Beschäftigungstage</Text></View>
        </View>
        {/* Empty row for user input */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.7, borderRight: '1px solid #222', padding: 4, height: 28 }} />
          <View style={{ flex: 0.7, borderRight: '1px solid #222', padding: 4, height: 28 }} />
          <View style={{ flex: 1.3, borderRight: '1px solid #222', padding: 4, height: 28 }} />
          <View style={{ flex: 1.3, padding: 4, height: 28 }} />
        </View>
      </View>
      {/* Erklärung des Arbeitnehmers */}
      <View style={{ marginTop: 5, marginBottom: 5, padding: 6 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 8, marginBottom: 4 }}>Erklärung des Arbeitnehmers:</Text>
        <Text style={{ fontSize: 7, marginBottom: 10 }}>
          Ich versichere, dass die vorstehenden Angaben der Wahrheit entsprechen. Ich verpflichte mich, meinem Arbeitgeber alle Änderungen, insbesondere in Bezug auf weitere Beschäftigungen (in Bezug auf Art, Dauer und Entgelt) unverzüglich mitzuteilen.
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ borderBottom: '1px solid #222', width: '80%', height: 1, marginBottom: 2 }} />
            <Text style={{ fontSize: 8 }}>Datum</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ borderBottom: '1px solid #222', width: '80%', height: 1, marginBottom: 2 }} />
            <Text style={{ fontSize: 8 }}>Unterschrift Arbeitnehmer</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ borderBottom: '1px solid #222', width: '80%', height: 1, marginBottom: 2 }} />
            <Text style={{ fontSize: 8 }}>Datum</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ borderBottom: '1px solid #222', width: '80%', height: 1, marginBottom: 2 }} />
            <Text style={{ fontSize: 8 }}>Unterschrift Arbeitgeber</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <Text style={{ fontSize: 8, marginLeft: 2 }}>{stand}</Text>
        <Text style={{ fontSize: 10, fontWeight: 'bold', marginRight: 8 }}>2</Text>
      </View>
    </Page>
  </Document>
);

export default EmployeePDF; 