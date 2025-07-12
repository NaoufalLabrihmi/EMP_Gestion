from fastapi import APIRouter, File, UploadFile, HTTPException, Query, status, Body, Depends
from db import get_connection
from pdf_extract_utils import extract_einkommensbescheinigung_fields
import tempfile
import shutil
import os
import logging
from auth import get_current_user

router = APIRouter()

@router.post("/employees/{employee_id}/einkommensbescheinigung/upload", status_code=status.HTTP_201_CREATED)
async def upload_einkommensbescheinigung(employee_id: int, file: UploadFile = File(...), user=Depends(get_current_user)):
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
def list_einkommensbescheinigung(employeeId: int = Query(...), user=Depends(get_current_user)):
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

@router.get("/employees/{employee_id}")
def get_employee(employee_id: int, user=Depends(get_current_user)):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
        employee = cursor.fetchone()
        cursor.close()
        conn.close()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return employee
    except Exception as e:
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get('/erklaerung_form/{employee_id}')
def get_erklaerung_form(employee_id: int, user=Depends(get_current_user)):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM erklaerung_form WHERE employee_id = %s ORDER BY id DESC LIMIT 1', (employee_id,))
        row = cursor.fetchone()
        cursor.close()
        conn.close()
        if not row:
            raise HTTPException(status_code=404, detail='Not found')
        return row
    except Exception as e:
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
