const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelHelper {
    constructor(filePath) {
        this.filePath = filePath;
        this.workbook = new ExcelJS.Workbook();
        this.worksheetName = 'Registrations';
    }

    /**
     * Initialize the Excel file with headers if it doesn't exist
     */
    async initializeFile() {
        try {
            // Check if file exists
            if (fs.existsSync(this.filePath)) {
                await this.workbook.xlsx.readFile(this.filePath);
            } else {
                // Create new workbook and worksheet
                const worksheet = this.workbook.addWorksheet(this.worksheetName);

                // Define headers
                const headers = [
                    'First Name',
                    'Last Name',
                    'Email',
                    'Phone',
                    'Date of Birth',
                    'Gender',
                    'Street',
                    'City',
                    'State',
                    'Zip Code',
                    'Country',
                    'Interests',
                    'Newsletter',
                    'Registration Date',
                    'Last Updated'
                ];

                // Add headers to worksheet
                worksheet.addRow(headers);

                // Style the header row
                const headerRow = worksheet.getRow(1);
                headerRow.font = { bold: true };
                headerRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };

                // Set column widths
                worksheet.columns.forEach(column => {
                    column.width = 15;
                });

                // Save the file
                await this.workbook.xlsx.writeFile(this.filePath);
                console.log('✅ Excel file initialized successfully');
            }
        } catch (error) {
            console.error('❌ Error initializing Excel file:', error);
            throw error;
        }
    }

    /**
     * Append a new registration to the Excel file
     */
    async appendRegistration(userData) {
        try {
            // Read existing file
            await this.workbook.xlsx.readFile(this.filePath);
            const worksheet = this.workbook.getWorksheet(this.worksheetName);

            // Add new row
            const newRow = worksheet.addRow([
                userData['First Name'],
                userData['Last Name'],
                userData['Email'],
                userData['Phone'],
                userData['Date of Birth'],
                userData['Gender'],
                userData['Street'],
                userData['City'],
                userData['State'],
                userData['Zip Code'],
                userData['Country'],
                userData['Interests'],
                userData['Newsletter'],
                userData['Registration Date'],
                userData['Last Updated']
            ]);

            // Style the new row (alternating colors for better readability)
            const rowNumber = worksheet.rowCount;
            if (rowNumber % 2 === 0) {
                newRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF8F8F8' }
                };
            }

            // Save the file
            await this.workbook.xlsx.writeFile(this.filePath);
            console.log('✅ Registration data appended to Excel file');

            return true;
        } catch (error) {
            console.error('❌ Error appending to Excel file:', error);
            throw error;
        }
    }

    /**
     * Get all registrations from Excel file
     */
    async getAllRegistrations() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return [];
            }

            await this.workbook.xlsx.readFile(this.filePath);
            const worksheet = this.workbook.getWorksheet(this.worksheetName);

            const registrations = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) { // Skip header row
                    const rowData = {};
                    row.eachCell((cell, colNumber) => {
                        const header = worksheet.getRow(1).getCell(colNumber).value;
                        rowData[header] = cell.value;
                    });
                    registrations.push(rowData);
                }
            });

            return registrations;
        } catch (error) {
            console.error('❌ Error reading Excel file:', error);
            throw error;
        }
    }

    /**
     * Get Excel file statistics
     */
    async getFileStats() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return { totalRegistrations: 0, fileSize: 0, lastModified: null };
            }

            const stats = fs.statSync(this.filePath);
            const registrations = await this.getAllRegistrations();

            return {
                totalRegistrations: registrations.length,
                fileSize: stats.size,
                lastModified: stats.mtime,
                filePath: this.filePath
            };
        } catch (error) {
            console.error('❌ Error getting file stats:', error);
            throw error;
        }
    }
}

module.exports = ExcelHelper; 