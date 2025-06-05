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
        name = " ".join([n.value for n in getattr(doc, 'given_names', []) if hasattr(n, 'value') and n.value])
        surname = " ".join([s.value for s in getattr(doc, 'surnames', []) if hasattr(s, 'value') and s.value])
        id_number = getattr(doc, 'document_number', None)
        id_number = id_number.value if id_number and hasattr(id_number, 'value') else ""
        dob = getattr(doc, 'birth_date', None)
        dob = dob.value if dob and hasattr(dob, 'value') else ""
        sex = getattr(doc, 'sex', None)
        sex = sex.value if sex and hasattr(sex, 'value') else ""
        nationality = getattr(doc, 'nationality', None)
        nationality = nationality.value if nationality and hasattr(nationality, 'value') else ""
        personal_number = getattr(doc, 'personal_number', None)
        personal_number = personal_number.value if personal_number and hasattr(personal_number, 'value') else ""
        if not any([name, surname, id_number, dob, sex, nationality, personal_number]):
            import re
            doc_str = str(doc)
            def extract(pattern):
                match = re.search(pattern, doc_str)
                return match.group(1).strip() if match else ""
            id_number = extract(r"Document Number:\s*(.*)")
            surname = extract(r"Surnames:\s*(.*)")
            name = extract(r"Given Names:\s*(.*)")
            sex = extract(r"Sex:\s*(.*)")
            dob = extract(r"Birth Date:\s*(.*)")
            nationality = extract(r"Nationality:\s*(.*)")
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
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO employees (name, surname, id_number, birth_date, sex, nationality, personal_number)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (str(name), str(surname), str(id_number), str(dob), str(sex), str(nationality), str(personal_number))
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    return {"message": "Employee added successfully", "employee": {"name": name, "surname": surname, "id_number": id_number, "birth_date": dob, "sex": sex, "nationality": nationality, "personal_number": personal_number}}

@router.get("/employees/list")
def list_employees():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees")
        employees = cursor.fetchall()
        cursor.close()
        conn.close()
        return JSONResponse(content=employees)
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
def edit_employee(employee_id: int, req: Request):
    try:
        data = req.json() if hasattr(req, 'json') else {}
        import asyncio
        if asyncio.iscoroutine(data):
            data = asyncio.run(data)
        else:
            data = req.json()
    except Exception:
        data = {}
    if not data:
        raise HTTPException(status_code=400, detail="No data provided for update.")
    allowed_fields = ["name", "surname", "id_number", "birth_date", "sex", "nationality", "personal_number"]
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
        cursor.execute("SELECT name, surname FROM employees WHERE id = %s", (employee_id,))
        emp = cursor.fetchone()
        cursor.close()
        conn.close()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found.")
        full_name = f"{emp['surname']} {emp['name']}".strip()
        # Generate PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            c = canvas.Canvas(tmp.name, pagesize=A4)
            width, height = A4
            c.setFont("Helvetica-Bold", 20)
            c.drawString(100, height - 100, f"Employee: {full_name}")
            c.save()
            tmp_path = tmp.name
        return FileResponse(tmp_path, filename=f"{full_name}.pdf", media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}") 