from fastapi import APIRouter, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse
import tempfile
from mindee import Client, product, AsyncPredictResponse
import os
from db import get_connection
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

MINDEE_API_KEY = os.getenv("MINDEE_API_KEY", "your_mindee_api_key")
mindee_client = Client(api_key=MINDEE_API_KEY)

router = APIRouter()

@router.post("/employees/add")
async def add_employee(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")
    try:
        input_doc = mindee_client.source_from_path(tmp_path)
        result: AsyncPredictResponse = mindee_client.enqueue_and_parse(
            product.InternationalIdV2,
            input_doc,
        )
        doc = result.document
        vorname = " ".join([n.value for n in getattr(doc, 'given_names', []) if hasattr(n, 'value') and n.value])
        # Try to extract geburtsname (birth name) if available
        geburtsname = None
        if hasattr(doc, 'surnames'):
            geburtsname = " ".join([s.value for s in getattr(doc, 'surnames', []) if hasattr(s, 'value') and s.value]) or None
        id_number = getattr(doc, 'document_number', None)
        id_number = id_number.value if id_number and hasattr(id_number, 'value') else None
        geburtsdatum = getattr(doc, 'birth_date', None)
        geburtsdatum = geburtsdatum.value if geburtsdatum and hasattr(geburtsdatum, 'value') else None
        geschlecht = getattr(doc, 'sex', None)
        geschlecht = geschlecht.value if geschlecht and hasattr(geschlecht, 'value') else None
        # Map M/F/D to German values
        if geschlecht == 'M':
            geschlecht = 'männlich'
        elif geschlecht == 'F':
            geschlecht = 'weiblich'
        elif geschlecht == 'D':
            geschlecht = 'divers'
        staatsangehoerigkeit = getattr(doc, 'nationality', None)
        staatsangehoerigkeit = staatsangehoerigkeit.value if staatsangehoerigkeit and hasattr(staatsangehoerigkeit, 'value') else None
        personal_number = getattr(doc, 'personal_number', None)
        personal_number = personal_number.value if personal_number and hasattr(personal_number, 'value') else None
        # Fallback extraction if Mindee fields are empty
        if not any([vorname, id_number, geburtsdatum, geschlecht, staatsangehoerigkeit, personal_number]):
            import re
            doc_str = str(doc)
            def extract(pattern):
                match = re.search(pattern, doc_str)
                return match.group(1).strip() if match else None
            id_number = extract(r"Document Number:\s*(.*)")
            vorname = extract(r"Given Names:\s*(.*)")
            geburtsname = extract(r"Surnames:\s*(.*)")
            geschlecht = extract(r"Sex:\s*(.*)")
            if geschlecht == 'M':
                geschlecht = 'männlich'
            elif geschlecht == 'F':
                geschlecht = 'weiblich'
            elif geschlecht == 'D':
                geschlecht = 'divers'
            geburtsdatum = extract(r"Birth Date:\s*(.*)")
            staatsangehoerigkeit = extract(r"Nationality:\s*(.*)")
            personal_number = extract(r"Personal Number:\s*(.*)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mindee extraction error: {str(e)}")
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        # Prevent duplicate id_number
        cursor.execute("SELECT id FROM employees WHERE id_number = %s", (id_number,))
        existing = cursor.fetchone()
        if existing:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=400, detail="Employee with this ID Number already exists.")
        cursor.execute(
            """
            INSERT INTO employees (
                vorname, geburtsname, geburtsdatum, geschlecht, staatsangehoerigkeit, id_number, personal_number
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (vorname, geburtsname, geburtsdatum, geschlecht, staatsangehoerigkeit, id_number, personal_number)
        )
        conn.commit()
        cursor.execute("SELECT * FROM employees WHERE id = LAST_INSERT_ID()")
        new_emp = cursor.fetchone()
        cursor.close()
        conn.close()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    return {"message": "Employee added successfully", "employee": new_emp}

@router.get("/employees/list")
def list_employees():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees")
        employees = cursor.fetchall()
        cursor.close()
        conn.close()
        expected_fields = [
            "id", "id_number", "personal_number", "vorname", "geburtsname", "strasse_hausnummer", "plz_ort", "geburtsdatum", "geschlecht", "versicherungsnummer", "familienstand", "geburtsort_land", "schwerbehindert", "staatsangehoerigkeit", "arbeitnehmernummer", "iban", "bic", "eintrittsdatum", "ersteintrittsdatum", "betriebsstaette", "berufsbezeichnung", "taetigkeit", "hauptbeschaeftigung", "nebenbeschaeftigung", "weitere_beschaeftigungen", "schulabschluss", "berufsausbildung", "ausbildung_beginn", "ausbildung_ende", "baugewerbe_seit", "arbeitszeit_vollzeit", "arbeitszeit_teilzeit", "arbeitszeit_verteilung", "urlaubsanspruch", "kostenstelle", "abteilungsnummer", "personengruppe", "arbeitsverhaeltnis_befristet", "zweckbefristet", "befristung_arbeitsvertrag_zum", "schriftlicher_abschluss", "abschluss_arbeitsvertrag_am", "befristete_beschaeftigung_2monate", "weitere_angaben", "identifikationsnummer", "finanzamt_nr", "steuerklasse", "kinderfreibetraege", "konfession", "gesetzliche_krankenkasse", "elterneigenschaft", "kv", "rv", "av", "pv", "uv_gefahrtarif", "entlohnung_bezeichnung1", "entlohnung_betrag1", "entlohnung_gueltig_ab1", "entlohnung_stundenlohn1", "entlohnung_gueltig_ab_stunden1", "entlohnung_bezeichnung2", "entlohnung_betrag2", "entlohnung_gueltig_ab2", "entlohnung_stundenlohn2", "entlohnung_gueltig_ab_stunden2", "entlohnung_bezeichnung3", "entlohnung_betrag3", "entlohnung_gueltig_ab3", "entlohnung_stundenlohn3", "entlohnung_gueltig_ab_stunden3", "vwl_empfaenger", "vwl_betrag", "vwl_ag_anteil", "vwl_seit_wann", "vwl_vertragsnr", "vwl_kontonummer", "vwl_bankleitzahl", "ap_arbeitsvertrag", "ap_bescheinigung_lsta", "ap_sv_ausweis", "ap_mitgliedsbescheinigung_kk", "ap_bescheinigung_private_kk", "ap_vwl_vertrag", "ap_nachweis_elterneigenschaft", "ap_vertrag_bav", "ap_schwerbehindertenausweis", "ap_unterlagen_sozialkasse", "vorbeschaeftigung_zeitraum_von", "vorbeschaeftigung_zeitraum_bis", "vorbeschaeftigung_art", "vorbeschaeftigung_tage"
        ]
        for emp in employees:
            for field in expected_fields:
                v = emp.get(field, '')
                if v is None:
                    emp[field] = ''
                elif not isinstance(v, str):
                    emp[field] = str(v)
        return JSONResponse(content=employees, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/employees/delete/{employee_id}")
def delete_employee(employee_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM employees WHERE id = %s", (employee_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": f"Employee with id {employee_id} deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.patch("/employees/edit/{employee_id}")
async def edit_employee(employee_id: int, req: Request):
    try:
        data = await req.json()
    except Exception:
        data = {}
    if not data:
        raise HTTPException(status_code=400, detail="No data provided for update.")
    # Map M/F/D to German values if present in edit
    if 'geschlecht' in data:
        if data['geschlecht'] == 'M':
            data['geschlecht'] = 'männlich'
        elif data['geschlecht'] == 'F':
            data['geschlecht'] = 'weiblich'
        elif data['geschlecht'] == 'D':
            data['geschlecht'] = 'divers'
    # Only allow updating fields that exist in the new schema
    allowed_fields = [
        "vorname", "geburtsname", "strasse_hausnummer", "plz_ort", "geburtsdatum", "geschlecht", "versicherungsnummer", "familienstand", "geburtsort_land", "schwerbehindert", "staatsangehoerigkeit", "arbeitnehmernummer", "iban", "bic", "eintrittsdatum", "ersteintrittsdatum", "betriebsstaette", "berufsbezeichnung", "taetigkeit", "hauptbeschaeftigung", "nebenbeschaeftigung", "weitere_beschaeftigungen", "schulabschluss", "berufsausbildung", "ausbildung_beginn", "ausbildung_ende", "baugewerbe_seit", "arbeitszeit_vollzeit", "arbeitszeit_teilzeit", "arbeitszeit_verteilung", "urlaubsanspruch", "kostenstelle", "abteilungsnummer", "personengruppe", "arbeitsverhaeltnis_befristet", "zweckbefristet", "befristung_arbeitsvertrag_zum", "schriftlicher_abschluss", "abschluss_arbeitsvertrag_am", "befristete_beschaeftigung_2monate", "weitere_angaben", "identifikationsnummer", "finanzamt_nr", "steuerklasse", "kinderfreibetraege", "konfession", "gesetzliche_krankenkasse", "elterneigenschaft", "kv", "rv", "av", "pv", "uv_gefahrtarif", "entlohnung_bezeichnung1", "entlohnung_betrag1", "entlohnung_gueltig_ab1", "entlohnung_stundenlohn1", "entlohnung_gueltig_ab_stunden1", "entlohnung_bezeichnung2", "entlohnung_betrag2", "entlohnung_gueltig_ab2", "entlohnung_stundenlohn2", "entlohnung_gueltig_ab_stunden2", "entlohnung_bezeichnung3", "entlohnung_betrag3", "entlohnung_gueltig_ab3", "entlohnung_stundenlohn3", "entlohnung_gueltig_ab_stunden3", "vwl_empfaenger", "vwl_betrag", "vwl_ag_anteil", "vwl_seit_wann", "vwl_vertragsnr", "vwl_kontonummer", "vwl_bankleitzahl", "ap_arbeitsvertrag", "ap_bescheinigung_lsta", "ap_sv_ausweis", "ap_mitgliedsbescheinigung_kk", "ap_bescheinigung_private_kk", "ap_vwl_vertrag", "ap_nachweis_elterneigenschaft", "ap_vertrag_bav", "ap_schwerbehindertenausweis", "ap_unterlagen_sozialkasse", "vorbeschaeftigung_zeitraum_von", "vorbeschaeftigung_zeitraum_bis", "vorbeschaeftigung_art", "vorbeschaeftigung_tage", "id_number", "personal_number"
    ]
    fields = []
    values = []
    for field in allowed_fields:
        if field in data:
            fields.append(f"{field} = %s")
            values.append(data[field])
    if not fields:
        raise HTTPException(status_code=400, detail="No valid fields provided for update.")
    values.append(employee_id)
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(f"UPDATE employees SET {', '.join(fields)} WHERE id = %s", tuple(values))
        conn.commit()
        cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
        updated = cursor.fetchone()
        cursor.close()
        conn.close()
        if not updated:
            raise HTTPException(status_code=404, detail="Employee not found.")
        return {"message": "Employee updated successfully", "employee": updated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/employees/pdf/{employee_id}")
def download_employee_pdf(employee_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
        emp = cursor.fetchone()
        cursor.close()
        conn.close()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found.")
        return emp
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}") 