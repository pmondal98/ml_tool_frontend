import React, { useEffect, useState } from "react";
import TranslationService from "../services/TranslationService";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { CSVLink } from "react-csv";
import Papa from "papaparse";

export const GridComponent = () => {
  const [file, setFile] = useState(null);

  const [csvData, setcsvData] = useState([]);

  const [vendormap, setVendormap] = useState([]);

  const [languageMap, setlanguagemap] = useState([]);

  const headersNames = [
    "Language Code",
    "English Message",
    "Translated Message",
  ];

  const arrayToCsv = (data) => {
    const csvRows = data.map((object) => {
      const cell1 = object.lang.languageCode;
      const cell2 = object.englishMessage;
      const cell3 = object.translatedMessage;
      const csvRow = cell1 + "," + cell2 + "," + cell3;
      return csvRow;
    });

    const csvString = csvRows.join("\n");
    return csvString;
  };

  useEffect(() => {
    TranslationService.getAllLanguage()
      .then((response) => {
        setlanguagemap(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDropDownClick = (id) => {
    TranslationService.getAllTranslationByLang(id)
      .then((response) => {
        setVendormap(response.data);
        setcsvData(arrayToCsv(response.data));
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImportSubmit = (flag) => {
    TranslationService.getImportTranslation(flag, file)
      .then((response) => {
        console.log(response.data);
        alert("Import is successfull");
        // console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (file == null)
          alert("Import failed :: " + "Please choose a file to import");
        else alert("Import failed ");
      });
  };

  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      Papa.parse(file, {
        complete: (results) => {
          setFile(results.data);
        },
      });
    }
  };

  return (
    <div className="container">
      <div className="p-4">
        <Dropdown>
          <Dropdown.Toggle variant=" primary" id="dropdown-basic">
            Select language
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {languageMap.map((lang) => (
              <Dropdown.Item
                onClick={() => handleDropDownClick(lang.languageId)}
              >
                {lang.languageCode}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <h2 className="text-center">List of English strings</h2>

      <table className="table table-bordered table-striped">
        <thead>
          <th>Language Id</th>
          <th>English String</th>
          <th>Translated String</th>
        </thead>
        <tbody>
          {vendormap.map((translation) => (
            <tr key={translation.id}>
              <td>{translation.lang.languageCode}</td>
              <td>{translation.englishMessage}</td>
              <td>{translation.translatedMessage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <div className="flexbox-container">
          <div className="Export">
            <Button variant="success">
              <CSVLink
                className="exportCSVData"
                data={csvData}
                headers={headersNames}
                filename="export.csv"
              >
                Export CSV
              </CSVLink>
            </Button>
          </div>

          <div className="Upload">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              onClick={(event) => {
                event.target.value = null;
              }}
            />
          </div>
          <div className="Import">
            <Button
              className="importCSVData"
              variant="success"
              onClick={() => handleImportSubmit(true)}
            >
              Import
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
