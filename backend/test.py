from pypdf import PdfReader

reader = PdfReader("erklaerung-zum-beschaeftigungsverhaeltnis_ba047549.pdf")
fields = reader.get_fields()
for field in fields:
    print(field)