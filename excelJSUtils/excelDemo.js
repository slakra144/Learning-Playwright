const ExcelJs = require('exceljs');

async function writeExcelTest(searchText, replaceText, offset, filePath){
    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = await readExcel(worksheet, searchText);
    const cell = worksheet.getCell(output.row + offset.row, output.col + offset.col);
    cell.value = replaceText;
    workbook.xlsx.writeFile(filePath)
}

async function readExcel(worksheet, searchText){
    let cellIndex = {row:-1,col:-1};
    worksheet.eachRow((row, rowNum)=>{
        row.eachCell((col, colNum)=>{
            if(col.value === searchText){
                cellIndex.row = rowNum;
                cellIndex.col = colNum;
            }
        })
    })
    return cellIndex;
}

// Exporting the functions
module.exports = {
    writeExcelTest,
    readExcel
};
