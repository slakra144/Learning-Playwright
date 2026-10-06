const ExcelJs = require('exceljs');

let cellIndex = {row:-1,col:-1};
const workbook = new ExcelJs.Workbook();
workbook.xlsx.readFile("excelDownloadTest.xlsx").then(function(){
    const worksheet = workbook.getWorksheet('Sheet1');
    worksheet.eachRow((row, rowNum)=>{
        row.eachCell((col, colNum)=>{
            // console.log(col.value);
            if(col.value === "Apple"){
                cellIndex.row = rowNum;
                cellIndex.col = colNum;
            }
        })
    })

    const cell = worksheet.getCell(cellIndex.row, cellIndex.col);
    cell.value = "Iphone 18";
    workbook.xlsx.writeFile("excelDownloadTestOutput.xlsx")
})
