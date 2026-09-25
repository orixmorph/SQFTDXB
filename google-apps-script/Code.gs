/**
 * =========================================================================
 * SQFT DXB REAL ESTATE — MULTI-TAB GOOGLE SHEETS LEAD CAPTURE SCRIPT
 * =========================================================================
 * 
 * This Google Apps Script automatically routes inquiries from your website forms:
 *   - Tab 1: "All Inquiries" -> Master log of EVERY inquiry from all forms
 *   - Tab 2: "Property Listings" -> Submissions from Sell & Rent (3rd section & modal)
 *   - Tab 3: "Contact Us" -> Inquiries from the Contact Us page
 *   - Tab 4: "Viewing Inquiries" -> Private tour bookings from Property Detail pages
 * 
 * STEP-BY-STEP DEPLOYMENT INSTRUCTIONS:
 * 1. Open Google Sheets (sheets.new) and create a new sheet (or use existing).
 * 2. In top menu, click Extensions > Apps Script.
 * 3. Delete any code in Code.gs and paste this entire script.
 * 4. At the top dropdown, select "setupSheets" and click "Run" (Grants permissions & sets up all tabs with styling).
 * 5. Click "Deploy" (top right) > "New deployment".
 * 6. Click the gear icon (Select type) > choose "Web app".
 * 7. Set configuration:
 *      - Description: SQFT DXB Webhook
 *      - Execute as: Me (your Google account)
 *      - Who has access: Anyone (CRITICAL so website visitors can submit forms)
 * 8. Click "Deploy", copy the "Web app URL" (ends with /exec).
 * 9. Paste this URL into your website's Google Sheets settings modal or .env (VITE_GOOGLE_SHEETS_WEBHOOK_URL).
 * =========================================================================
 */

// Tab Names
const TAB_ALL_INQUIRIES = "All Inquiries";
const TAB_PROPERTY_LISTINGS = "Property Listings";
const TAB_CONTACT_US = "Contact Us";
const TAB_VIEWING_INQUIRIES = "Viewing Inquiries";

// Headers Configuration
const HEADERS = {
  ALL: [
    "Timestamp",
    "Form Source",
    "Customer Name",
    "Phone / WhatsApp",
    "Email",
    "Property / Subject",
    "Category / Purpose",
    "Price / Budget (AED)",
    "Location / Community",
    "Details & Message",
    "Status"
  ],
  LISTINGS: [
    "Timestamp",
    "Purpose",
    "Property Type",
    "Community / Area",
    "Building / Project",
    "Bedrooms",
    "Expected Price (AED)",
    "Owner Name",
    "Phone / WhatsApp",
    "Email",
    "Occupancy Status",
    "Notes & Requirements",
    "Status"
  ],
  CONTACT: [
    "Timestamp",
    "Full Name",
    "Email",
    "Phone / WhatsApp",
    "Subject",
    "Message",
    "Status"
  ],
  VIEWINGS: [
    "Timestamp",
    "Property ID",
    "Property Title",
    "Price (AED)",
    "Community",
    "Visitor Name",
    "Phone / WhatsApp",
    "Email",
    "Preferred Date",
    "Time Slot",
    "Message / Requests",
    "Status"
  ]
};

/**
 * Run this function once manually from the Apps Script editor to initialize tabs with headers and styling.
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  initSheet(ss, TAB_ALL_INQUIRIES, HEADERS.ALL, "#171717", "#CF9F5D");
  initSheet(ss, TAB_PROPERTY_LISTINGS, HEADERS.LISTINGS, "#1E293B", "#38BDF8");
  initSheet(ss, TAB_CONTACT_US, HEADERS.CONTACT, "#0F172A", "#10B981");
  initSheet(ss, TAB_VIEWING_INQUIRIES, HEADERS.VIEWINGS, "#312E81", "#818CF8");

  // Reorder tabs so All Inquiries is first
  const allSheet = ss.getSheetByName(TAB_ALL_INQUIRIES);
  if (allSheet) {
    ss.setActiveSheet(allSheet);
    ss.moveActiveSheet(1);
  }
  
  Logger.log("SQFT DXB Sheets initialized successfully!");
}

/**
 * Helper to initialize or format a specific sheet tab
 */
function initSheet(ss, sheetName, headers, headerBg, accentColor) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Ensure header row exists
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    // Check if row 1 matches headers, update if empty
    const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (!currentHeaders[0]) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  // Style Header Row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(headerBg || "#171717");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Arial");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  // Set tab color if supported
  try {
    if (accentColor && sheet.setTabColor) {
      sheet.setTabColor(accentColor);
    }
  } catch (e) {
    // Ignore if tab color not supported
  }

  // Auto-resize columns
  for (let c = 1; c <= headers.length; c++) {
    sheet.autoResizeColumn(c);
  }

  return sheet;
}

/**
 * Handle incoming POST requests from website forms
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for concurrent requests
    lock.waitLock(30000);

    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone() || "Asia/Dubai",
      "yyyy-MM-dd HH:mm:ss"
    );

    const formType = (data.formType || data.source || "").toLowerCase();
    
    // Ensure all tabs exist
    const allSheet = getOrCreateSheet(ss, TAB_ALL_INQUIRIES, HEADERS.ALL);
    const listingsSheet = getOrCreateSheet(ss, TAB_PROPERTY_LISTINGS, HEADERS.LISTINGS);
    const contactSheet = getOrCreateSheet(ss, TAB_CONTACT_US, HEADERS.CONTACT);
    const viewingsSheet = getOrCreateSheet(ss, TAB_VIEWING_INQUIRIES, HEADERS.VIEWINGS);

    // -------------------------------------------------------------
    // 1. ALWAYS RECORD IN TAB 1 ("All Inquiries")
    // -------------------------------------------------------------
    let allInquiriesRow = [];

    if (formType.indexOf("listing") !== -1 || formType.indexOf("sell") !== -1 || formType.indexOf("rent") !== -1) {
      allInquiriesRow = [
        timestamp,
        "Property Listing (" + (data.purpose === "rent" ? "Rent" : "Sale") + ")",
        data.ownerName || data.name || "N/A",
        data.ownerPhone || data.phone || "N/A",
        data.ownerEmail || data.email || "N/A",
        (data.buildingName ? data.buildingName + ", " : "") + (data.area || "Dubai"),
        (data.propertyType || "Property") + " (" + (data.bedrooms ? data.bedrooms + " BR" : "") + ")",
        data.expectedPrice || "Upon Request",
        data.area || "Dubai",
        data.notes || "Status: " + (data.currentStatus || "N/A"),
        "New Lead"
      ];
    } else if (formType.indexOf("contact") !== -1) {
      allInquiriesRow = [
        timestamp,
        "Contact Us Page",
        data.name || "N/A",
        data.phone || "N/A",
        data.email || "N/A",
        data.subject || "General Inquiry",
        "Direct Contact",
        "N/A",
        "Dubai",
        data.message || "",
        "New Lead"
      ];
    } else if (formType.indexOf("viewing") !== -1 || formType.indexOf("tour") !== -1) {
      allInquiriesRow = [
        timestamp,
        "Schedule Private Viewing",
        data.fullName || data.name || "N/A",
        data.phone || "N/A",
        data.email || "N/A",
        data.propertyTitle || ("Property #" + (data.propertyId || "")),
        "Viewing Tour (" + (data.timeSlot || "Anytime") + ")",
        data.propertyPrice ? "AED " + data.propertyPrice : "N/A",
        data.propertyArea || "Dubai",
        "Date: " + (data.date || "ASAP") + " | " + (data.message || "Viewing request"),
        "New Lead"
      ];
    } else {
      // General Fallback
      allInquiriesRow = [
        timestamp,
        data.source || "Website Form",
        data.name || data.ownerName || data.fullName || "N/A",
        data.phone || data.ownerPhone || "N/A",
        data.email || data.ownerEmail || "N/A",
        data.subject || data.propertyTitle || data.buildingName || "Inquiry",
        data.purpose || data.propertyType || "General",
        data.expectedPrice || data.propertyPrice || "N/A",
        data.area || data.propertyArea || "Dubai",
        data.notes || data.message || JSON.stringify(data),
        "New Lead"
      ];
    }

    allSheet.appendRow(allInquiriesRow);
    formatNewRow(allSheet, allSheet.getLastRow());

    // -------------------------------------------------------------
    // 2. ROUTE TO SPECIFIC DESTINATION TAB
    // -------------------------------------------------------------
    if (formType.indexOf("listing") !== -1 || formType.indexOf("sell") !== -1 || formType.indexOf("rent") !== -1) {
      // Tab 2: Property Listings
      const listingRow = [
        timestamp,
        data.purpose === "rent" ? "Rent" : "Sale",
        data.propertyType || "Apartment",
        data.area || "Dubai",
        data.buildingName || "N/A",
        data.bedrooms || "N/A",
        data.expectedPrice || "Upon Request",
        data.ownerName || "N/A",
        data.ownerPhone || "N/A",
        data.ownerEmail || "N/A",
        data.currentStatus || "Vacant",
        data.notes || "",
        "New Lead"
      ];
      listingsSheet.appendRow(listingRow);
      formatNewRow(listingsSheet, listingsSheet.getLastRow());

    } else if (formType.indexOf("contact") !== -1) {
      // Tab 3: Contact Us
      const contactRow = [
        timestamp,
        data.name || "N/A",
        data.email || "N/A",
        data.phone || "N/A",
        data.subject || "General Inquiry",
        data.message || "",
        "New Lead"
      ];
      contactSheet.appendRow(contactRow);
      formatNewRow(contactSheet, contactSheet.getLastRow());

    } else if (formType.indexOf("viewing") !== -1 || formType.indexOf("tour") !== -1) {
      // Tab 4: Viewing Inquiries
      const viewingRow = [
        timestamp,
        data.propertyId || "N/A",
        data.propertyTitle || "N/A",
        data.propertyPrice ? "AED " + data.propertyPrice : "N/A",
        data.propertyArea || "Dubai",
        data.fullName || data.name || "N/A",
        data.phone || "N/A",
        data.email || "N/A",
        data.date || "ASAP",
        data.timeSlot || "Anytime",
        data.message || "",
        "New Lead"
      ];
      viewingsSheet.appendRow(viewingRow);
      formatNewRow(viewingsSheet, viewingsSheet.getLastRow());
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Inquiry successfully recorded in Master and Dedicated Sheets.",
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests for testing the Webhook deployment status
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "SQFT DXB Real Estate Google Sheet Webhook is active and running.",
      version: "2.0.0",
      tabs: [
        TAB_ALL_INQUIRIES + " (Master Log)",
        TAB_PROPERTY_LISTINGS + " (Sell / Rent Form)",
        TAB_CONTACT_US + " (Contact Us Page)",
        TAB_VIEWING_INQUIRIES + " (Viewing Schedule Form)"
      ]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get sheet or create it with headers if not present
 */
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#171717");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    sheet.setRowHeight(1, 36);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Formats a newly appended data row
 */
function formatNewRow(sheet, rowNum) {
  try {
    const range = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn());
    range.setFontFamily("Arial");
    range.setFontSize(10);
    range.setVerticalAlignment("middle");
    range.setWrap(true);
    sheet.setRowHeight(rowNum, 28);
    
    // Subtle alternating row shading
    if (rowNum % 2 === 0) {
      range.setBackground("#F9F9FA");
    } else {
      range.setBackground("#FFFFFF");
    }
  } catch (e) {
    // Ignore minor formatting failure
  }
}
