/* Optional: publish your RSVP Google Sheet as JSON for historical comments/statistics.
   Deploy as Web App: Execute as Me, Who has access: Anyone. Then put the /exec URL in script.js if desired. */
function doGet(e){
  const sh=SpreadsheetApp.getActive().getSheets()[0];
  const values=sh.getDataRange().getDisplayValues();
  if(values.length<2)return out({items:[]});
  const h=values.shift().map(String);
  const items=values.filter(r=>r.join('').trim()).map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]||'');return o});
  return out({items:items});
}
function out(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
