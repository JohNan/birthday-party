# Google Sheets RSVP Integration Script

This document contains the Google Apps Script code and step-by-step instructions to set up the backend database for the RSVP form.

## Step-by-Step Setup Instructions

1. **Create a Spreadsheet**:
   - Go to [sheets.new](https://sheets.new) to create a new Google Sheet.
   - Give it a name (e.g., *Alice's Cat Party RSVP*).
   - Copy the Spreadsheet ID from the URL (the part between `/d/` and `/edit`).

2. **Open Apps Script**:
   - In the menu bar, click on **Extensions** → **Apps Script**.
   - Delete any default code in the editor (e.g., `myFunction`).

3. **Paste the Script**:
   - Copy the Apps Script code below and paste it into the editor.
   - Save the project by clicking the disk icon or pressing `Ctrl+S` (`Cmd+S` on Mac).

4. **Deploy as a Web App**:
   - Click **Deploy** (top right) → **New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Configure the following settings:
     - **Description**: `RSVP Form API`
     - **Execute as**: `Me (your-email@gmail.com)`
     - **Who has access**: `Anyone` (This is critical to allow submissions from the website without login).
   - Click **Deploy**.
   - Authorize access when prompted (click "Review Permissions", select your Google account, click "Advanced", and click "Go to Untitled project (unsafe)", then "Allow").

5. **Copy Web App URL**:
   - Copy the generated **Web app URL** (ends in `/exec`).
   - Open [script.js](file:///workspace/party-site/script.js#L98) and paste the URL as the value for `APPS_SCRIPT_URL` on line 98:
     ```javascript
     const APPS_SCRIPT_URL = 'YOUR_COPIED_URL_HERE';
     ```

---

## Google Apps Script Code

```javascript
function doPost(e) {
  try {
    var jsonString = e.postData.contents;
    var data = JSON.parse(jsonString);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Initialize headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Tidsstämpel", "Namn", "Antal gäster", "Allergier / Övrigt"]);
      sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
    }
    
    // Append RSVP data
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name,
      data.count,
      data.notes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
