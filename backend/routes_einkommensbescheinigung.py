from fastapi import APIRouter, File, UploadFile, HTTPException, Query, status
from db import get_connection
from pdf_extract_utils import extract_einkommensbescheinigung_fields
import tempfile
import shutil
import os
import logging

router = APIRouter()

@router.post("/employees/{employee_id}/einkommensbescheinigung/upload", status_code=status.HTTP_201_CREATED)
async def upload_einkommensbescheinigung(employee_id: int, file: UploadFile = File(...)):
    # Save uploaded file to a temp location
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
    except Exception as e:
        logging.error(f"Failed to save uploaded file: {e}")
        raise HTTPException(status_code=500, detail=f"Fehler beim Speichern der Datei: {str(e)}")
    # Extract fields using the utility
    try:
        extracted = extract_einkommensbescheinigung_fields(tmp_path)
    except Exception as e:
        os.remove(tmp_path)
        logging.error(f"PDF extraction error: {e}")
        raise HTTPException(status_code=500, detail=f"PDF extraction error: {str(e)}")
    # Store in DB using extracted['monat'] and extracted['jahr']
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO einkommensbescheinigung
            (employee_id, eintritt, stkl, krankenkasse, betrag, kv_brutto, sv_abzug, netto, monat, jahr)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            employee_id,
            extracted.get('Eintritt'),
            extracted.get('StKl'),
            extracted.get('Krankenkasse'),
            extracted.get('Betrag'),
            extracted.get('KV-Brutto'),
            extracted.get('SV-Abzug'),
            extracted.get('Netto'),
            extracted.get('monat'),
            extracted.get('jahr')
        ))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        os.remove(tmp_path)
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    os.remove(tmp_path)
    return {"message": "Einkommensbescheinigung gespeichert", "data": extracted, "monat": extracted.get('monat'), "jahr": extracted.get('jahr')}

@router.get("/einkommensbescheinigung/list")
def list_einkommensbescheinigung(employeeId: int = Query(...)):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM einkommensbescheinigung
            WHERE employee_id = %s
            ORDER BY jahr DESC, monat DESC, created_at DESC
        """, (employeeId,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

