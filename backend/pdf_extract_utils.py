import pdfplumber
import re
from datetime import datetime
import logging

MONTHS_DE = {
    'januar': '01', 'februar': '02', 'märz': '03', 'maerz': '03', 'april': '04', 'mai': '05', 'juni': '06',
    'juli': '07', 'august': '08', 'september': '09', 'oktober': '10', 'november': '11', 'dezember': '12'
}

FIELDS = [
    'Eintritt',
    'StKl',
    'Krankenkasse',
    'Betrag',
    'KV-Brutto',
    'SV-Abzug',
    'Netto',
]

def format_eintritt_date(eintritt):
    if eintritt and re.match(r'^\d{6}$', eintritt):
        return f"{eintritt[:2]}.{eintritt[2:4]}.{eintritt[4:]}"
    return eintritt

def format_kv_brutto(val):
    if val and re.match(r'^\d{3,}$', val) and ',' not in val:
        return f"{val[:-2]},{val[-2:]}"
    return val

def extract_einkommensbescheinigung_fields(pdf_path):
    results = {field: None for field in FIELDS}
    results['monat'] = None
    results['jahr'] = None
    lines = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    lines.extend(text.split('\n'))
    except Exception as e:
        logging.error(f"PDF extraction error: {e}")
        raise RuntimeError(f"PDF extraction error: {str(e)}")

    # Monat/Jahr extraction (look for 'für <Monat> <Jahr>' or 'f[üu]r <Monat> <Jahr>')
    for line in lines:
        match = re.search(r'f[üu]r\s+([A-Za-zäöüÄÖÜ]+)\s+(\d{4})', line, re.IGNORECASE)
        if match:
            month_str = match.group(1).lower().replace('ä', 'ae')
            year_str = match.group(2)
            month_num = MONTHS_DE.get(month_str)
            if month_num:
                results['monat'] = month_num
            else:
                results['monat'] = month_str  # fallback
            results['jahr'] = year_str
            break
    # Fallback to current month/year if not found
    now = datetime.now()
    if not results['monat']:
        results['monat'] = now.strftime("%m")
    if not results['jahr']:
        results['jahr'] = now.strftime("%Y")

    # Eintritt
    try:
        for idx, line in enumerate(lines):
            if 'Eintritt' in line and idx + 1 < len(lines):
                match = re.search(r'\d{6}', lines[idx + 1])
                if match:
                    results['Eintritt'] = format_eintritt_date(match.group(0))
                    break
    except Exception as e:
        logging.warning(f"Eintritt extraction failed: {e}")

    # StKl
    try:
        for idx, line in enumerate(lines):
            if 'StKl' in line and idx + 1 < len(lines):
                columns = lines[idx + 1].strip().split()
                if len(columns) >= 3:
                    results['StKl'] = columns[2]
                    break
    except Exception as e:
        logging.warning(f"StKl extraction failed: {e}")

    # Krankenkasse
    try:
        for idx, line in enumerate(lines):
            if 'Krankenkasse' in line and 'KK %' in line:
                header_cols = line.strip().split()
                try:
                    kk_idx = header_cols.index('Krankenkasse')
                except ValueError:
                    kk_idx = None
                    for i, col in enumerate(header_cols):
                        if 'Krankenkasse' in col:
                            kk_idx = i
                            break
                if kk_idx is not None and idx + 1 < len(lines):
                    next_line = lines[idx + 1].strip().split()
                    krankenkasse_words = []
                    for word in next_line[kk_idx:]:
                        if re.match(r'^\d', word):
                            break
                        krankenkasse_words.append(word)
                    if krankenkasse_words:
                        results['Krankenkasse'] = ' '.join(krankenkasse_words)
                break
    except Exception as e:
        logging.warning(f"Krankenkasse extraction failed: {e}")

    # Betrag
    try:
        for line in lines:
            if 'Ausbildungsvergütung' in line:
                match = re.search(r'(\d{1,4},\d{2})', line)
                if match:
                    results['Betrag'] = match.group(1)
                    break
    except Exception as e:
        logging.warning(f"Betrag extraction failed: {e}")

    # KV-Brutto
    try:
        for idx, line in enumerate(lines):
            if 'KV-Brutto' in line:
                header_cols = line.strip().split()
                try:
                    kv_idx = header_cols.index('KV-Brutto')
                except ValueError:
                    kv_idx = None
                    for i, col in enumerate(header_cols):
                        if 'KV-Brutto' in col:
                            kv_idx = i
                            break
                if kv_idx is not None and idx + 1 < len(lines):
                    value_cols = lines[idx + 1].strip().split()
                    if value_cols and value_cols[0] == 'L':
                        value_cols = value_cols[1:]
                    if len(value_cols) > kv_idx:
                        val = value_cols[kv_idx]
                        if ',' in val:
                            results['KV-Brutto'] = val
                        elif kv_idx + 2 < len(value_cols) and value_cols[kv_idx + 1] == ',' and re.match(r'^\d{2}$', value_cols[kv_idx + 2]):
                            results['KV-Brutto'] = val + ',' + value_cols[kv_idx + 2]
                        elif kv_idx + 1 < len(value_cols) and re.match(r'^\d{2}$', value_cols[kv_idx + 1]):
                            results['KV-Brutto'] = val + ',' + value_cols[kv_idx + 1]
                        else:
                            results['KV-Brutto'] = format_kv_brutto(val)
                break
    except Exception as e:
        logging.warning(f"KV-Brutto extraction failed: {e}")

    # SV-Abzug
    try:
        for idx, line in enumerate(lines):
            if 'SV-rechtliche Abzüge' in line:
                match = re.search(r'(\d{1,4},\d{2})', line)
                if match:
                    results['SV-Abzug'] = match.group(1)
                    break
                elif idx + 1 < len(lines):
                    match2 = re.search(r'(\d{1,4},\d{2})', lines[idx + 1])
                    if match2:
                        results['SV-Abzug'] = match2.group(1)
                        break
    except Exception as e:
        logging.warning(f"SV-Abzug extraction failed: {e}")

    # Netto
    try:
        for idx, line in enumerate(lines):
            if 'Netto-Verdienst' in line or 'Netto-Verdiens' in line:
                match = re.search(r'Netto-?Verdien[st]\s*(\d{1,4},\d{2})', line)
                if match:
                    results['Netto'] = match.group(1)
                    break
                elif idx + 1 < len(lines):
                    match2 = re.search(r'(\d{1,4},\d{2})', lines[idx + 1])
                    if match2:
                        results['Netto'] = match2.group(1)
                        break
    except Exception as e:
        logging.warning(f"Netto extraction failed: {e}")

    return results 