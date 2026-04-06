import React from "react";
import "./ShakkthiAstroForm.css";

export default function AstroPDF({ form, showHdr, showFtr }, ref) {
  return (
    <div id="pdf-layer" ref={ref}>

      {showHdr && (
        <div className="p-hdr">
          <div className="p-hdr-name">✦ SHAKKTHI ASTRO CENTRE ✦</div>
          <div className="p-hdr-sub">ஜோசியம் & ஆன்மீக ஆலோசனை மையம்</div>
          <div className="p-hdr-addr">West Mambalam, Chennai</div>
        </div>
      )}

      <table className={showHdr ? "p-main" : "p-main-no-hdr"}>
        <tbody>
          <tr>
            <td className="p-meta-lbl">Date: {form.date}</td>
            <td className="p-meta-val">Location: {form.loc}</td>
          </tr>

          <tr>
            <td className="p-lbl">Name</td>
            <td className="p-val">{form.name}</td>
          </tr>

          {/* Add more fields here cleanly */}

        </tbody>
      </table>

      {showFtr && (
        <div className="p-ftr">
          Shakkthi Astro Centre | Chennai
        </div>
      )}
    </div>
  );
}