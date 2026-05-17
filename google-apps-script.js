/**
 * Google Apps Script — Rekap Kuisioner Catin
 *
 * Header Sheet (Row 1):
 * A: No | B: Date | C: Time | D: NIK | E: Nama | F: No. WA | G: Pre-Test | H: Post-Test | I: Status
 *
 * Endpoints:
 * - GET ?action=check&nik=xxx  → cek apakah NIK sudah ada
 * - GET ?action=save&...       → simpan data rekap
 * - GET (tanpa params)         → status endpoint
 */

function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action || '';

    // === CHECK NIK ===
    if (action === 'check') {
      const nik = params.nik || '';
      if (!nik) {
        return jsonResponse({ ok: false, error: 'NIK kosong' });
      }

      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data = sheet.getDataRange().getValues();

      // Column D (index 3) = NIK
      const nikExists = data.some((row, idx) => idx > 0 && String(row[3]).trim() === nik.trim());

      return jsonResponse({ ok: true, exists: nikExists });
    }

    // === SAVE DATA ===
    if (action === 'save') {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

      const lastRow = sheet.getLastRow();
      const no = lastRow <= 1 ? 1 : lastRow;

      const now = new Date();
      const jakartaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const pad = (n) => String(n).padStart(2, '0');
      const date = pad(jakartaDate.getDate()) + '-' + pad(jakartaDate.getMonth() + 1) + '-' + jakartaDate.getFullYear();
      const time = pad(jakartaDate.getHours()) + ':' + pad(jakartaDate.getMinutes()) + ':' + pad(jakartaDate.getSeconds());

      sheet.appendRow([
        no,
        "'" + date,
        "'" + time,
        "'" + (params.nik || '-'),
        params.nama || '-',
        "'" + (params.wa || '-'),
        params.preScore || '-',
        params.totalPostTest || '-',
        params.status || '-'
      ]);

      return jsonResponse({ ok: true, row: no });
    }

    // === STATUS ===
    return jsonResponse({ ok: true, message: 'Rekap Kuisioner Catin - endpoint active' });

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message });
  }
}

function doPost(e) {
  return doGet(e);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
